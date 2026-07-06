"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Target, Utensils, Ruler, Weight, ArrowRight, Loader2, BrainCircuit } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    goal: 'Fat Loss',
    dietPreference: 'Vegetarian',
    equipment: 'None (Bodyweight)',
    weightKg: '',
    heightCm: '',
    age: '',
    gender: 'Male'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        alert("Error generating plan: " + data.error);
        setLoading(false);
      }
    } catch (e) {
      alert("Failed to reach server");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center relative overflow-hidden flex-col gap-6 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <BrainCircuit className="text-blue-500 animate-pulse drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" size={64} />
        <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">AI is Analyzing Your Biometrics...</h2>
        <p className="text-blue-200/60 max-w-md">Nemotron-120B is running a detailed nutritional and physiological analysis to generate your bespoke 7-Day Indian protocol.</p>
        <Loader2 className="animate-spin text-blue-500 mt-4" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="w-full max-w-2xl glass rounded-[2rem] p-6 md:p-10 relative animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20">
            <BrainCircuit className="text-blue-400" size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-4 tracking-tight">
            AI Calibration
          </h1>
          <p className="text-sm md:text-base text-blue-100/70 font-medium">Provide your exact biometrics. The AI will output a hyper-personalized 7-day protocol with detailed reasoning.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-blue-400"><Weight size={18}/> Weight (kg)</label>
              <input 
                type="number" required step="0.1"
                value={formData.weightKg} onChange={e => setFormData({...formData, weightKg: e.target.value})}
                className="w-full bg-black/40 border border-white/10 shadow-inner rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all"
                placeholder="75"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-blue-400"><Ruler size={18}/> Height (cm)</label>
              <input 
                type="number" required step="0.1"
                value={formData.heightCm} onChange={e => setFormData({...formData, heightCm: e.target.value})}
                className="w-full bg-black/40 border border-white/10 shadow-inner rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all"
                placeholder="178"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-blue-400">Age</label>
              <input 
                type="number" required
                value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
                className="w-full bg-black/40 border border-white/10 shadow-inner rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all"
                placeholder="25"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-blue-400">Gender</label>
              <select 
                value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                className="w-full bg-black/40 border border-white/10 shadow-inner rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all appearance-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-purple-400"><Target size={18}/> Primary Goal</label>
            <select 
              value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})}
              className="w-full bg-black/40 border border-white/10 shadow-inner rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-purple-500 text-lg transition-all appearance-none"
            >
              <option value="Fat Loss">Fat Loss & Leaning Out</option>
              <option value="Muscle Gain">Hypertrophy (Muscle Gain)</option>
              <option value="Maintenance">Maintenance & General Health</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-orange-400"><Dumbbell size={18}/> Available Equipment</label>
            <select 
              value={formData.equipment} onChange={e => setFormData({...formData, equipment: e.target.value})}
              className="w-full bg-black/40 border border-white/10 shadow-inner rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-orange-500 text-lg transition-all appearance-none"
            >
              <option value="None (Bodyweight)">None (Bodyweight Only)</option>
              <option value="Dumbbells Only">Dumbbells Only</option>
              <option value="Full Gym Access">Full Commercial Gym Access</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-green-400"><Utensils size={18}/> Diet Preference (Indian)</label>
            <select 
              value={formData.dietPreference} onChange={e => setFormData({...formData, dietPreference: e.target.value})}
              className="w-full bg-black/40 border border-white/10 shadow-inner rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-500 text-lg transition-all appearance-none"
            >
              <option value="Vegetarian">Pure Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian (Chicken, Fish)</option>
              <option value="Eggetarian">Eggetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg rounded-2xl hover:scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
          >
            Commence AI Analysis <ArrowRight size={24}/>
          </button>
        </form>
      </div>
    </div>
  );
}
