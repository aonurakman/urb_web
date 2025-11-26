
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Map as MapIcon, ChevronRight, Activity } from 'lucide-react';

// --- NETWORK CAROUSEL ---
export const NetworkCarousel: React.FC = () => {
  const networks = [
    { id: 'beynes', name: 'Beynes' },
    { id: 'provins', name: 'Provins' },
    { id: 'saint_arnoult', name: 'Saint-Arnoult' },
    { id: 'nemours', name: 'Nemours' },
    { id: 'rambouillet', name: 'Rambouillet' },
    { id: 'melun', name: 'Melun' },
    { id: 'meaux', name: 'Meaux' },
    { id: 'coulommiers', name: 'Coulommiers' },
    { id: 'etampes', name: 'Étampes' },
    { id: 'nangis', name: 'Nangis' },
  ];

  return (
    <div className="w-full overflow-hidden relative group mt-12 bg-white py-8 rounded-xl shadow-inner border border-slate-100">
        <motion.div 
            className="flex gap-16 w-max items-center px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
                repeat: Infinity, 
                ease: "linear", 
                duration: 50 
            }}
        >
            {/* Duplicated list for seamless looping */}
            {[...networks, ...networks].map((net, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group/item cursor-pointer">
                    <div className="w-64 h-48 relative bg-white rounded-lg border border-slate-200 p-2 transition-all duration-300 shadow-sm group-hover/item:scale-110 group-hover/item:border-urb-blue group-hover/item:shadow-md z-10 overflow-hidden flex items-center justify-center">
                        {/* Filter: mix-blend-multiply effectively makes the white background transparent, overlaying the black lines cleanly */}
                        <img 
                            src={`https://github.com/COeXISTENCE-PROJECT/Ile-de-france/blob/main/${net.id}/${net.id}_network.png?raw=true`}
                            alt={net.name}
                            className="w-full h-full object-contain mix-blend-multiply contrast-125 transition-all duration-300"
                        />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest group-hover/item:text-urb-blue transition-colors">{net.name}</span>
                </div>
            ))}
        </motion.div>
    </div>
  )
}

// --- FRAMEWORK DIAGRAM ---
export const FrameworkDiagram: React.FC = () => {
  // Unified Tag Style
  const tagStyle = "px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-mono rounded border border-slate-200 hover:bg-slate-200 transition-colors";

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start w-full max-w-6xl relative">
        
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-16 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>

        {/* Step 1: Network */}
        <div className="flex flex-col gap-4 h-full">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 relative z-10 h-full">
                <div className="w-12 h-12 bg-blue-50 text-urb-blue rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <MapIcon size={20} />
                </div>
                <h4 className="font-bold text-slate-900">1. Setup</h4>
                <p className="text-xs text-center text-slate-500">29 Real-world networks & Demand patterns</p>
            </div>
            {/* Tags for Step 1 */}
            <div className="flex justify-center">
                 <a href="https://doi.org/10.34740/kaggle/ds/7406751" target="_blank" rel="noopener noreferrer" className={tagStyle}>
                    URB Dataset
                 </a>
            </div>
        </div>

        <div className="hidden md:flex justify-center text-slate-300 pt-16"><ChevronRight /></div>

        {/* Step 2: Training */}
        <div className="flex flex-col gap-4 h-full">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 relative z-10 h-full">
                <div className="w-12 h-12 bg-amber-50 text-urb-accent rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <Brain size={20} />
                </div>
                <h4 className="font-bold text-slate-900">2. Training</h4>
                <p className="text-xs text-center text-slate-500">MARL Algorithms (IQL, QMIX, etc.)</p>
            </div>
            {/* Tags for Step 2 */}
            <div className="flex flex-wrap justify-center gap-2">
                 <a href="https://eclipse.dev/sumo/" target="_blank" rel="noopener noreferrer" className={tagStyle}>
                    SUMO Simulator
                 </a>
                 <a href="https://github.com/COeXISTENCE-PROJECT/RouteRL" target="_blank" rel="noopener noreferrer" className={tagStyle}>
                    RouteRL
                 </a>
            </div>
        </div>

        <div className="hidden md:flex justify-center text-slate-300 pt-16"><ChevronRight /></div>

        {/* Step 3: Assessment */}
        <div className="flex flex-col gap-4 h-full">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 relative z-10 h-full">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <TrendingUp size={20} />
                </div>
                <h4 className="font-bold text-slate-900">3. Assessment</h4>
                <p className="text-xs text-center text-slate-500">Compare Travel Times & Congestion</p>
            </div>
            {/* Tags for Step 3 */}
             <div className="flex justify-center">
                 <span className={tagStyle}>
                    URB Metrics
                 </span>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- BENCHMARK RESULTS ---
export const BenchmarkResultsDiagram: React.FC = () => {
    const [scenario, setScenario] = useState<'st_arnoult' | 'provins' | 'ingolstadt'>('st_arnoult');

    // Data from Table 1 of the paper (t_CAV values)
    const data = {
        st_arnoult: {
            human: 3.15, // t_pre
            aon: 3.01,
            random: 3.58,
            qmix: 3.21,
            ippo: 3.33,
            iql: 3.53,
            mappo: 3.51,
            title: "St. Arnoult (Small)",
            cav_wins: "80%" // QMIX
        },
        provins: {
            human: 2.80, // t_pre
            aon: 2.76,
            random: 3.04,
            qmix: 3.14,
            ippo: 2.98,
            iql: 3.01,
            mappo: 3.05,
            title: "Provins (Medium)",
            cav_wins: "0%"
        },
        ingolstadt: {
            human: 4.21, // t_pre
            aon: 4.37,
            random: 4.81,
            qmix: 4.87,
            ippo: 4.71,
            iql: 4.81,
            mappo: 4.82,
            title: "Ingolstadt (Large)",
            cav_wins: "0%"
        }
    };

    const currentData = data[scenario];
    const allValues = [
        currentData.human, 
        currentData.aon, 
        currentData.random, 
        currentData.qmix, 
        currentData.ippo, 
        currentData.iql, 
        currentData.mappo
    ];
    const maxVal = Math.max(...allValues) * 1.05;

    const Bar = ({ label, value, color, highlight = false }: { label: string, value: number, color: string, highlight?: boolean }) => {
        // Calculate relative width based on max range
        const percentage = ((value) / maxVal) * 100;
        
        return (
            <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>{label}</span>
                    <span className="font-mono">{value.toFixed(2)}m</span>
                </div>
                <div className="w-full h-8 bg-slate-100 rounded-md overflow-hidden relative border border-slate-200">
                    <motion.div 
                        className={`h-full ${color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-4">{currentData.title}</h3>
                <p className="text-sm text-slate-600 mb-4">
                    Mean CAV travel times (t_CAV). Lower is better.
                    {scenario === 'st_arnoult' 
                        ? " In small networks, QMIX occasionally beats humans." 
                        : " In larger networks, MARL algorithms struggle to match human efficiency."}
                </p>

                <div className="flex flex-col gap-2">
                    <button onClick={() => setScenario('st_arnoult')} className={`px-4 py-2 rounded-lg text-left text-sm font-medium transition-colors ${scenario === 'st_arnoult' ? 'bg-urb-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>St. Arnoult</button>
                    <button onClick={() => setScenario('provins')} className={`px-4 py-2 rounded-lg text-left text-sm font-medium transition-colors ${scenario === 'provins' ? 'bg-urb-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Provins</button>
                    <button onClick={() => setScenario('ingolstadt')} className={`px-4 py-2 rounded-lg text-left text-sm font-medium transition-colors ${scenario === 'ingolstadt' ? 'bg-urb-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Ingolstadt</button>
                </div>
            </div>
            
            <div className="md:col-span-8 bg-white p-6 rounded-xl border border-slate-100 flex flex-col gap-3">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Baselines</h4>
                 <div className="grid grid-cols-1 gap-2">
                    <Bar label="Human Drivers" value={currentData.human} color="bg-slate-500" />
                    <Bar label="All-or-Nothing" value={currentData.aon} color="bg-slate-300" />
                    <Bar label="Random" value={currentData.random} color="bg-slate-300" />
                 </div>
                 
                 <div className="w-full h-px bg-slate-100 my-2"></div>
                 
                 <h4 className="text-xs font-bold text-urb-blue uppercase tracking-wider mb-2">MARL Algorithms</h4>
                 <div className="grid grid-cols-1 gap-2">
                    <Bar label="QMIX" value={currentData.qmix} color="bg-urb-blue" />
                    <Bar label="IPPO" value={currentData.ippo} color="bg-indigo-500" />
                    <Bar label="IQL" value={currentData.iql} color="bg-sky-500" />
                    <Bar label="MAPPO" value={currentData.mappo} color="bg-blue-400" />
                 </div>
                 
                 <div className="mt-4 p-4 bg-slate-50 rounded-lg flex items-center gap-3 text-xs text-slate-500">
                    <Activity size={16} />
                    <span>In this scenario, RL agents achieved a win rate of <strong className="text-slate-900">{currentData.cav_wins}</strong> against URB baselines.</span>
                 </div>
            </div>
        </div>
    );
};
