
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Line, Plane, Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Add type augmentation for R3F intrinsic elements if they are missing
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      planeGeometry: any;
      circleGeometry: any;
      boxGeometry: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      planeGeometry: any;
      circleGeometry: any;
      boxGeometry: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

// --- Components ---

interface RoutingVehicleProps {
  type: 'human' | 'cav';
  delay: number;
  pathChoice: 'left' | 'right';
}

const RoutingVehicle: React.FC<RoutingVehicleProps> = ({ type, delay, pathChoice }) => {
  const ref = useRef<THREE.Group>(null);
  const color = type === 'human' ? '#ef4444' : '#3B82F6';
  
  // Create path points
  const path = useMemo(() => {
    // Start point
    const start = new THREE.Vector3(0, 0, 10);
    // Decision point
    const junction = new THREE.Vector3(0, 0, 2);
    
    // End points depending on choice
    const end = pathChoice === 'left' 
      ? new THREE.Vector3(-4, 0, -10) // Left path (congested usually)
      : new THREE.Vector3(4, 0, -10); // Right path (optimized)

    // Control points for bezier-like curve
    const control = pathChoice === 'left'
      ? new THREE.Vector3(-3, 0, -2)
      : new THREE.Vector3(3, 0, -2);

    const curve = new THREE.CatmullRomCurve3([
        start,
        new THREE.Vector3(0, 0, 6),
        junction,
        control,
        end
    ]);
    return curve;
  }, [pathChoice]);

  useFrame((state) => {
    if (ref.current) {
      // Loop time
      const totalTime = 8;
      let t = (state.clock.getElapsedTime() + delay) % totalTime;
      const progress = t / totalTime;

      // Ensure valid range [0, 1]
      if (progress >= 0 && progress <= 1) {
          const point = path.getPointAt(progress);
          const tangent = path.getTangentAt(progress);
          
          ref.current.position.copy(point);
          ref.current.lookAt(point.clone().add(tangent));
          
          // Add some bobbing
          ref.current.position.y = -0.4;
      }
    }
  });

  return (
    <group ref={ref}>
        {/* Car Body - Swapped Width (X) and Depth (Z) so car faces forward along Z axis */}
        {/* Narrower width (0.14) relative to length (0.4) to look like a car, not sideways box */}
        <Box args={[0.14, 0.12, 0.4]} position={[0, 0.1, 0]}>
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
        </Box>
        
        {/* Headlights */}
        <Box args={[0.04, 0.04, 0.02]} position={[0.05, 0.1, 0.2]}>
             <meshBasicMaterial color="#FFFAA0" />
        </Box>
         <Box args={[0.04, 0.04, 0.02]} position={[-0.05, 0.1, 0.2]}>
             <meshBasicMaterial color="#FFFAA0" />
        </Box>
        
        {/* Taillights */}
         <Box args={[0.04, 0.04, 0.02]} position={[0.05, 0.1, -0.2]}>
             <meshBasicMaterial color="#FF0000" />
        </Box>
         <Box args={[0.04, 0.04, 0.02]} position={[-0.05, 0.1, -0.2]}>
             <meshBasicMaterial color="#FF0000" />
        </Box>
    </group>
  );
};

const CityGrid = () => {
    // Simple grid lines
    const lines = useMemo(() => {
        const l = [];
        const size = 15;
        for(let i = -size; i <= size; i++) {
            // Horizontal
            l.push(
                <Line 
                    key={`h-${i}`} 
                    points={[[-size, 0, i], [size, 0, i]]} 
                    color="#cbd5e1" 
                    lineWidth={1} 
                    opacity={0.2} 
                    transparent 
                />
            );
            // Vertical
            l.push(
                <Line 
                    key={`v-${i}`} 
                    points={[[i, 0, -size], [i, 0, size]]} 
                    color="#cbd5e1" 
                    lineWidth={1} 
                    opacity={0.2} 
                    transparent 
                />
            );
        }
        return l;
    }, []);

    return <group position={[0, -0.5, 0]}>{lines}</group>;
}

const JunctionRoad = () => {
    return (
        <group position={[0, -0.49, 0]}>
             {/* Main Stem */}
            <Plane args={[2, 12]} position={[0, 0, 8]} rotation={[-Math.PI/2, 0, 0]}>
                <meshBasicMaterial color="#e2e8f0" />
            </Plane>
            
            {/* Left Branch */}
            <mesh position={[-3, 0, -5]} rotation={[-Math.PI/2, 0, 0.3]}>
                <planeGeometry args={[2, 10]} />
                <meshBasicMaterial color="#e2e8f0" />
            </mesh>

            {/* Right Branch */}
             <mesh position={[3, 0, -5]} rotation={[-Math.PI/2, 0, -0.3]}>
                <planeGeometry args={[2, 10]} />
                <meshBasicMaterial color="#e2e8f0" />
            </mesh>

             {/* Connection */}
             <mesh position={[0, 0, 2]} rotation={[-Math.PI/2, 0, 0]}>
                 <circleGeometry args={[2.5, 32]} />
                 <meshBasicMaterial color="#e2e8f0" />
             </mesh>
        </group>
    )
}

// --- Scenes ---

export const TrafficHeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
      <Canvas camera={{ position: [0, 8, 12], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
        
        <group rotation={[0, 0, 0]}>
            <CityGrid />
            <JunctionRoad />
            
            {/* Human Drivers - mostly taking left/crowded path */}
            {Array.from({ length: 8 }).map((_, i) => (
                <RoutingVehicle 
                    key={`human-${i}`} 
                    type="human"
                    delay={i * 1.2} 
                    pathChoice="left"
                />
            ))}

            {/* CAV Drivers - taking right/optimized path */}
            {Array.from({ length: 6 }).map((_, i) => (
                <RoutingVehicle 
                    key={`cav-${i}`} 
                    type="cav"
                    delay={i * 1.5 + 0.5} 
                    pathChoice="right"
                />
            ))}
        </group>
        
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
           {/* Decor */}
           <Box args={[1, 4, 1]} position={[-6, 1.5, 0]}><meshStandardMaterial color="#cbd5e1" /></Box>
           <Box args={[1, 3, 1]} position={[6, 1, 2]}><meshStandardMaterial color="#cbd5e1" /></Box>
        </Float>
      </Canvas>
    </div>
  );
};

export const SimulationScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 8, 0], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={2} />
        
        {/* Top down view of a complex intersection */}
        <group>
            {/* Roads */}
            <Box args={[20, 0.1, 2]} position={[0, 0, 0]}><meshStandardMaterial color="#334155" /></Box>
            <Box args={[2, 0.1, 10]} position={[0, 0, 0]}><meshStandardMaterial color="#334155" /></Box>
            
            {/* Road Markings */}
            <Box args={[1, 0.11, 0.1]} position={[0, 0, 0]}><meshBasicMaterial color="#ffffff" /></Box>
            
            {/* Cars */}
            <Float speed={5} rotationIntensity={0} floatIntensity={0} floatingRange={[0, 0]}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <mesh key={i} position={[
                        (Math.random() - 0.5) * 10, 
                        0.2, 
                        (Math.random() - 0.5) * 4
                    ]}>
                        <boxGeometry args={[0.5, 0.2, 0.3]} />
                        <meshStandardMaterial color={Math.random() > 0.5 ? "#F59E0B" : "#ef4444"} />
                    </mesh>
                ))}
            </Float>
        </group>
      </Canvas>
    </div>
  );
}
