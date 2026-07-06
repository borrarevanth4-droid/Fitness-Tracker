"use client";

import Link from 'next/link';
import { Dumbbell, ArrowRight, BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center p-6">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center max-w-3xl glass p-10 md:p-16 rounded-[3rem] shadow-2xl animate-in fade-in zoom-in-95 duration-700">
        <div className="flex gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <BrainCircuit className="text-blue-400" size={32} />
          </div>
          <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center border border-green-500/30">
            <Dumbbell className="text-green-400" size={32} />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-green-400 mb-6">
          AI Fitness Planner
        </h1>
        
        <p className="text-lg md:text-xl text-blue-100/70 max-w-2xl mb-12 font-medium leading-relaxed">
          Powered by Nvidia Nemotron 120B. Get a hyper-personalized 7-day Indian diet and workout protocol tailored exactly to your body, goals, and equipment.
        </p>
        
        <Link 
          href="/onboarding" 
          className="group px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-105 transition-all flex items-center gap-3"
        >
          Start AI Calibration <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
