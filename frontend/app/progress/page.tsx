"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, TrendingUp, MessageSquare, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function ProgressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    weightKg: '',
    feedback: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Progress Logged! The AI has completely recalculated your 7-Day Diet and Workout Plan based on your feedback.");
        router.push('/dashboard');
      } else {
        alert("Error logging progress: " + data.error);
        setLoading(false);
      }
    } catch (e) {
      alert("Failed to reach server");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="w-full max-w-xl glass rounded-[2rem] p-6 md:p-10 relative animate-in fade-in zoom-in-95 duration-500">
        
        <button onClick={() => router.push('/dashboard')} className="absolute top-6 left-6 p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition shadow-lg">
          <ArrowLeft size={20} className="text-blue-400" />
        </button>

        <div className="text-center mb-10 mt-12 md:mt-6">
          <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 mb-4 flex items-center justify-center gap-3">
            <TrendingUp className="text-green-400" size={36} /> Weekly Check-In
          </h1>
          <p className="text-sm md:text-base text-blue-100/70 font-medium">It's been 7 days! Log your new weight and let the AI know how you felt. The AI will automatically analyze this and formulate next week's protocol.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-blue-400"><Target size={18}/> New Weight (kg)</label>
            <input 
              type="number" required step="0.1"
              value={formData.weightKg} onChange={e => setFormData({...formData, weightKg: e.target.value})}
              className="w-full bg-black/40 border border-white/10 shadow-inner rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-500 text-lg transition-all"
              placeholder="e.g. 74.5"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-purple-400"><MessageSquare size={18}/> Feedback on Protocol</label>
            <textarea 
              required rows={4}
              value={formData.feedback} onChange={e => setFormData({...formData, feedback: e.target.value})}
              className="w-full bg-black/40 border border-white/10 shadow-inner rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-purple-500 text-base transition-all resize-none"
              placeholder="e.g. Workouts were too easy, but the Indian diet was delicious! I want more protein this week."
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 mt-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-black text-lg rounded-2xl hover:scale-[1.02] shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? <><Loader2 className="animate-spin" size={24} /> Analyzing & Recalculating...</> : <>Update AI Protocol <ArrowRight size={24}/></>}
          </button>
        </form>
      </div>
    </div>
  );
}
