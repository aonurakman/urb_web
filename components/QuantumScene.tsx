
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, OrbitControls, Instance, Instances, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

// Add type declarations for R3F intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      boxGeometry: any;
      meshStandardMaterial: any;
      instancedMesh: any;
      lineSegments: any;
      bufferGeometry: any;
      bufferAttribute: any;
      lineBasicMaterial: any;
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      cylinderGeometry: any;
      fog: any;
      ambientLight: any;
      directionalLight: any;
      planeGeometry: any;
      pointLight: any;
    }
  }
}

// --- UTILS ---
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// --- CITY DATA GENERATION ---
const useCityData = (count = 60, range = 25) => {
  return useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const connections: THREE.Vector3[] = []; // Pairs of start/end points
    const adjacency: number[][] = Array(count).fill(0).map(() => []);

    // 1. Generate Nodes on a Grid-like structure with noise (XZ plane)
    for (let i = 0; i < count; i++) {
        let x = randomRange(-range, range);
        let z = randomRange(-range, range);
        
        // Snap to grid vaguely
        const gridSize = 6;
        x = Math.round(x / gridSize) * gridSize + randomRange(-0.5, 0.5);
        z = Math.round(z / gridSize) * gridSize + randomRange(-0.5, 0.5);
        
        // Avoid duplicates or too close
        const tooClose = nodes.some(n => n.distanceTo(new THREE.Vector3(x, 0, z)) < 4);
        if (!tooClose) {
            nodes.push(new THREE.Vector3(x, 0, z));
        }
    }
    
    // 2. Connect Nodes (Roads)
    nodes.forEach((node, i) => {
      // Find k nearest neighbors
      const neighbors = nodes
        .map((n, idx) => ({ idx, dist: node.distanceTo(n) }))
        .filter(n => n.idx !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3); // Max 3 roads per intersection

      neighbors.forEach(n => {
        // Connect if close enough
        if (n.dist < 14) { 
             const neighborIdx = n.idx;
             // Check if connection already exists to avoid double drawing
             const alreadyConnected = adjacency[i].includes(neighborIdx);
             
             if (!alreadyConnected) {
                 connections.push(node);
                 connections.push(nodes[neighborIdx]);
                 
                 adjacency[i].push(neighborIdx);
                 adjacency[neighborIdx].push(i);
             }
        }
      });
    });

    return { nodes, connections, adjacency };
  }, [count, range]);
};

// --- COMPONENTS ---

const Buildings = ({ nodes }: { nodes: THREE.Vector3[] }) => {
    return (
        <Instances range={nodes.length}>
            <boxGeometry args={[1.8, 1, 1.8]} />
            <meshStandardMaterial color="#94a3b8" />
            {nodes.map((node, i) => (
                <Instance
                    key={i}
                    position={[node.x, 0.5 + Math.random() * 2, node.z]}
                    scale={[1, 1 + Math.random() * 3, 1]}
                />
            ))}
        </Instances>
    )
}

const RoadNetwork = ({ connections }: { connections: THREE.Vector3[] }) => {
    const roads = useMemo(() => {
        const segments = [];
        for(let i=0; i<connections.length; i+=2) {
            const start = connections[i];
            const end = connections[i+1];
            
            const length = start.distanceTo(end);
            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            
            // Calculate rotation to align with the connection
            const direction = new THREE.Vector3().subVectors(end, start).normalize();
            
            // Box default is along Z axis for length if we use args [w, h, 1]
            // We need to rotate (0,0,1) to `direction`
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
            
            segments.push({ position: mid, quaternion, length });
        }
        return segments;
    }, [connections]);

    return (
        <Instances range={roads.length}>
            {/* Flat road: Width 0.6, Height 0.05, Length 1 (scaled) */}
            <boxGeometry args={[0.6, 0.05, 1]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
            {roads.map((road, i) => (
                <Instance
                    key={i}
                    position={road.position}
                    quaternion={road.quaternion}
                    scale={[1, 1, road.length]} 
                />
            ))}
        </Instances>
    );
};

const Traffic = ({ nodes, adjacency, brainRef }: { nodes: THREE.Vector3[], adjacency: number[][], brainRef: React.RefObject<THREE.Group | null> }) => {
  const particleCount = 150;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Persistent state for active beams: Map<AgentIndex, ExpiryTime>
  // Using a Ref for the map to avoid re-renders, as we modify it in useFrame
  const activeBeamsRef = useRef(new Map<number, number>());
  
  // Initialize particles
  const particles = useMemo(() => {
    if (nodes.length === 0) return [];
    return new Array(particleCount).fill(0).map(() => {
      const startIdx = Math.floor(Math.random() * nodes.length);
      const neighbors = adjacency[startIdx];
      let endIdx = neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : startIdx;
      
      return {
        current: startIdx,
        next: endIdx,
        progress: Math.random(),
        speed: randomRange(0.015, 0.04), // Slower cruising speed
        isCAV: Math.random() > 0.4, // 60% CAVs
        offset: randomRange(-0.15, 0.15)
      };
    });
  }, [nodes, adjacency]);

  // Buffer Geometry for Beams
  const beamGeoRef = useRef<THREE.BufferGeometry>(null);
  const maxBeams = 20; // Max concurrent beams

  useEffect(() => {
    if (beamGeoRef.current) {
        beamGeoRef.current.setDrawRange(0, 0);
    }
  }, []);
  
  useFrame((state, delta) => {
    if (!meshRef.current || particles.length === 0) return;
    
    const time = state.clock.elapsedTime;
    
    // --- 1. UPDATE CARS ---
    particles.forEach((p, i) => {
        if (p.current === p.next) return; 

        p.progress += p.speed * delta * 10;

        if (p.progress >= 1) {
            p.progress = 0;
            p.current = p.next;
            const neighbors = adjacency[p.current];
            if (neighbors.length > 0) {
                p.next = neighbors[Math.floor(Math.random() * neighbors.length)];
            } else {
                p.next = p.current; 
            }
        }

        const startPos = nodes[p.current];
        const endPos = nodes[p.next];

        // Linear interpolation
        dummy.position.lerpVectors(startPos, endPos, p.progress);
        
        // Add lane offset
        const dir = new THREE.Vector3().subVectors(endPos, startPos).normalize();
        const up = new THREE.Vector3(0,1,0);
        const side = new THREE.Vector3().crossVectors(dir, up).normalize();
        
        dummy.position.addScaledVector(side, p.offset);
        dummy.position.y = 0.15; // Slightly above road

        // Orient car
        const targetX = dummy.position.x + dir.x;
        const targetZ = dummy.position.z + dir.z;
        dummy.lookAt(targetX, 0.15, targetZ);
        
        // Scale
        dummy.scale.set(0.25, 0.2, 0.5); 
        dummy.updateMatrix();

        meshRef.current!.setMatrixAt(i, dummy.matrix);

        // Color
        const color = p.isCAV ? new THREE.Color("#3b82f6") : new THREE.Color("#f97316");
        meshRef.current!.setColorAt(i, color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    // --- 2. UPDATE BEAMS (Brain -> CAVs) ---
    if (beamGeoRef.current && brainRef.current) {
        const brainPos = brainRef.current.position;
        const positions = new Float32Array(maxBeams * 2 * 3);
        let lineIndex = 0;
        
        // A. Cleanup expired beams
        for (const [idx, expiry] of activeBeamsRef.current.entries()) {
            if (time > expiry) {
                activeBeamsRef.current.delete(idx);
            }
        }

        // B. Spawn new beams if slots available
        if (activeBeamsRef.current.size < maxBeams) {
            // Try a few times to find a random CAV that isn't already connected
            for (let tryCount = 0; tryCount < 5; tryCount++) {
                const rndIdx = Math.floor(Math.random() * particles.length);
                const p = particles[rndIdx];
                
                // Only target CAVs that don't have an active beam
                if (p.isCAV && !activeBeamsRef.current.has(rndIdx)) {
                    // Beam lasts between 0.2 and 1.0 seconds
                    const duration = randomRange(0.2, 1.0);
                    activeBeamsRef.current.set(rndIdx, time + duration);
                    break; // Spawned one, break loop to spread out creation
                }
            }
        }

        // C. Draw active beams
        for (const [idx, _] of activeBeamsRef.current.entries()) {
             if (lineIndex >= maxBeams) break;

             const mat = new THREE.Matrix4();
             meshRef.current.getMatrixAt(idx, mat);
             const carPos = new THREE.Vector3().setFromMatrixPosition(mat);
             
             // Start Point (Brain)
             positions[lineIndex * 6 + 0] = brainPos.x;
             positions[lineIndex * 6 + 1] = brainPos.y; // Origin from center/bottom of brain
             positions[lineIndex * 6 + 2] = brainPos.z;
             // End Point (Car)
             positions[lineIndex * 6 + 3] = carPos.x;
             positions[lineIndex * 6 + 4] = carPos.y;
             positions[lineIndex * 6 + 5] = carPos.z;
             
             lineIndex++;
        }
        
        beamGeoRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        beamGeoRef.current.setDrawRange(0, lineIndex * 2);
        beamGeoRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
        <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]} frustumCulled={false}>
            {/* Simple Box Geometry for cars */}
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial />
        </instancedMesh>
        
        {/* Control Beams */}
        <lineSegments>
            <bufferGeometry ref={beamGeoRef}>
                <bufferAttribute
                    attach="attributes-position"
                    count={maxBeams * 2}
                    array={new Float32Array(maxBeams * 2 * 3)}
                    itemSize={3}
                />
            </bufferGeometry>
            {/* Electric Cyan color, visible opacity */}
            <lineBasicMaterial color="#22d3ee" opacity={0.6} transparent blending={THREE.AdditiveBlending} />
        </lineSegments>
    </group>
  );
};

const BlinkingNode: React.FC<{ position: THREE.Vector3; phase: number }> = ({ position, phase }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if(meshRef.current) {
            const s = 0.1 + 0.1 * Math.sin(state.clock.elapsedTime * 4 + phase);
            meshRef.current.scale.setScalar(s > 0 ? s : 0.01);
            (meshRef.current.material as THREE.MeshBasicMaterial).opacity = s > 0.15 ? 1 : 0.3;
        }
    });
    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial color="#fbbf24" />
        </mesh>
    );
}

const GlobeController = React.forwardRef<THREE.Group, any>((props, ref) => {
    const globeRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        
        if (globeRef.current) {
            globeRef.current.rotation.y = time * 0.2;
        }

        if (ref && typeof ref !== 'function' && ref.current) {
             ref.current.position.y = 8 + Math.sin(time * 0.5) * 0.5;
        }
    });

    // Generate random blinking points on surface
    const points = useMemo(() => {
        const pts: { pos: THREE.Vector3, phase: number }[] = [];
        for(let i=0; i<8; i++) {
            const phi = Math.acos( -1 + ( 2 * i ) / 8 );
            const theta = Math.sqrt( 8 * Math.PI ) * phi;
            const r = 1.6; // slightly outside globe
            pts.push({
                pos: new THREE.Vector3( r * Math.cos(theta) * Math.sin(phi), r * Math.cos(phi), r * Math.sin(theta) * Math.sin(phi) ),
                phase: Math.random() * Math.PI * 2
            });
        }
        return pts;
    }, []);

    return (
        <group ref={ref} position={[0, 8, 0]}>
            {/* 3D Label */}
            <Center position={[0, 2.8, 0]}>
                <Text3D
                    font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
                    size={0.6}
                    height={0.1}
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={0.02}
                    bevelSize={0.02}
                    bevelOffset={0}
                    bevelSegments={5}
                >
                    CAV ROUTER
                    <meshStandardMaterial color="#0f172a" />
                </Text3D>
            </Center>
        
            <group ref={globeRef}>
                {/* Main Globe Wireframe */}
                <mesh>
                    <sphereGeometry args={[1.5, 16, 16]} />
                    <meshBasicMaterial 
                        color="#2563EB" 
                        wireframe 
                        transparent 
                        opacity={0.3} 
                    />
                </mesh>
                
                {/* Inner Core */}
                <mesh>
                    <sphereGeometry args={[1.2, 32, 32]} />
                    <meshStandardMaterial 
                        color="#3b82f6"
                        emissive="#2563EB"
                        emissiveIntensity={0.2}
                        transparent
                        opacity={0.8}
                    />
                </mesh>

                {/* Blinking Nodes */}
                {points.map((pt, i) => (
                    <BlinkingNode key={i} position={pt.pos} phase={pt.phase} />
                ))}
            </group>

            {/* Connecting Line to City */}
            <mesh position={[0, -4, 0]} scale={[0.05, 8, 0.05]}>
                <cylinderGeometry />
                <meshBasicMaterial color="#94a3b8" transparent opacity={0.2} />
            </mesh>
        </group>
    );
});


// --- MAIN SCENES ---

export const TrafficHeroScene: React.FC = () => {
  const { nodes, connections, adjacency } = useCityData(80, 25);
  const brainRef = useRef<THREE.Group>(null);

  return (
    <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 25, 40]} fov={30} />
        
        <fog attach="fog" args={['#f8fafc', 30, 90]} />
        
        <ambientLight intensity={1.5} />
        <directionalLight position={[20, 40, 20]} intensity={2} castShadow />
        
        {/* Ground Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#f1f5f9" />
        </mesh>

        <Suspense fallback={null}>
            <group position={[0, 0, 0]}>
                 <Buildings nodes={nodes} />
                 <RoadNetwork connections={connections} />
                 <Traffic nodes={nodes} adjacency={adjacency} brainRef={brainRef} />
                 <GlobeController ref={brainRef} />
            </group>

            <Environment preset="city" />
        </Suspense>

        <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5} 
            maxPolarAngle={Math.PI / 2.2} 
            minPolarAngle={Math.PI / 6}
        />
      </Canvas>
    </div>
  );
};

export const SimulationScene: React.FC = () => {
  const { nodes, connections, adjacency } = useCityData(60, 30);
  const dummyRef = useRef(null);

  return (
    <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 50, 0]} fov={40} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Suspense fallback={null}>
            <group position={[0, 0, 0]}>
                 {/* Darker roads for dark background */}
                 <RoadNetwork connections={connections} />
                 <Traffic nodes={nodes} adjacency={adjacency} brainRef={dummyRef} />
            </group>
        </Suspense>

        <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.8}
            maxPolarAngle={0} 
            minPolarAngle={0} 
        />
      </Canvas>
    </div>
  );
};
