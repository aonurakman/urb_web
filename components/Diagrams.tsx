
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Map as MapIcon, ChevronRight, Activity } from 'lucide-react';

// --- FRAMEWORK DIAGRAM ---
export const FrameworkDiagram: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center w-full max-w-4xl relative">
        
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 transform -translate-y-1/2"></div>

        {/* Step 1: Network */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 relative z-10 h-full">
            <div className="w-12 h-12 bg-blue-50 text-urb-blue rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <MapIcon size={20} />
            </div>
            <h4 className="font-bold text-slate-900">1. Setup</h4>
            <p className="text-xs text-center text-slate-500">29 Real-world networks & Demand patterns</p>
        </div>

        <div className="hidden md:flex justify-center text-slate-300"><ChevronRight /></div>

        {/* Step 2: Training */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 relative z-10 h-full">
            <div className="w-12 h-12 bg-amber-50 text-urb-accent rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Brain size={20} />
            </div>
            <h4 className="font-bold text-slate-900">2. Training</h4>
            <p className="text-xs text-center text-slate-500">MARL Algorithms (IQL, QMIX, etc.)</p>
        </div>

        <div className="hidden md:flex justify-center text-slate-300"><ChevronRight /></div>

        {/* Step 3: Assessment */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 relative z-10 h-full">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <TrendingUp size={20} />
            </div>
            <h4 className="font-bold text-slate-900">3. Assessment</h4>
            <p className="text-xs text-center text-slate-500">Compare Travel Times & Emissions</p>
        </div>
      </div>
      
      <div className="mt-8 flex gap-4">
         <div className="px-4 py-2 bg-slate-800 text-white text-xs font-mono rounded-md">SUMO Simulator</div>
         <div className="px-4 py-2 bg-slate-800 text-white text-xs font-mono rounded-md">RouteRL</div>
      </div>
    </div>
  );
};

// --- BENCHMARK RESULTS ---
export const BenchmarkResultsDiagram: React.FC = () => {
    const [scenario, setScenario] = useState<'st_arnoult' | 'provins' | 'ingolstadt'>('st_arnoult');

    // Data from Table 1 of the paper
    const data = {
        st_arnoult: {
            human: 3.15,
            aon: 3.15,
            random: 3.38,
            qmix: 3.24,
            ippo: 3.28,
            iql: 3.36,
            mappo: 3.35,
            title: "St. Arnoult (Small)",
            cav_wins: "80%" // QMIX
        },
        provins: {
            human: 2.80,
            aon: 2.81,
            random: 2.93,
            qmix: 2.96,
            ippo: 2.90,
            iql: 2.91,
            mappo: 2.93,
            title: "Provins (Medium)",
            cav_wins: "0%"
        },
        ingolstadt: {
            human: 4.21,
            aon: 4.29,
            random: 4.45,
            qmix: 4.50,
            ippo: 4.41,
            iql: 4.46,
            mappo: 4.45,
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
    const minVal = Math.min(...allValues) * 0.9;

    const Bar = ({ label, value, color, highlight = false }: { label: string, value: number, color: string, highlight?: boolean }) => {
        // Calculate relative width based on min-max range for better visualization of differences
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
                <p className="text-sm text-slate-600 mb-6">
                    Mean travel times (lower is better).
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
                    <span>In this scenario, RL agents achieved a win rate of <strong className="text-slate-900">{currentData.cav_wins}</strong> against human performance.</span>
                 </div>
            </div>
        </div>
    );
};
