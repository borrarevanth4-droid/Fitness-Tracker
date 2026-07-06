"use client";

import { Flame, Activity, CheckCircle, Apple, BrainCircuit, Loader2, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DashboardPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  
  // Default to today's string
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState(DAYS_OF_WEEK.includes(todayStr) ? todayStr : "Monday");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    fetch(`${apiUrl}/plan`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.plan) {
          setPlan(data.plan);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="animate-pulse text-lg text-blue-200">Analyzing your biometrics and planning...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white flex-col gap-6">
        <div className="glass-panel p-10 rounded-[2rem] flex flex-col items-center text-center max-w-md">
          <BrainCircuit size={48} className="text-blue-500 mb-6" />
          <h2 className="text-2xl font-bold mb-2">No Active Plan</h2>
          <p className="text-muted-foreground mb-8">Take the initial survey so our AI can generate your fully personalized 7-day routine.</p>
          <button onClick={() => router.push('/onboarding')} className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold hover:scale-105 transition-all shadow-lg shadow-blue-500/25">
            Take Questionnaire
          </button>
        </div>
      </div>
    );
  }

  // Extract currently selected day's plan
  const dayDiet = Array.isArray(plan.dietPlan) 
    ? plan.dietPlan.find((d: any) => d.day === selectedDay) 
    : null;

  const dayWorkout = Array.isArray(plan.workoutPlan)
    ? plan.workoutPlan.find((w: any) => w.day === selectedDay)
    : null;

  return (
    <div className="min-h-screen p-4 lg:p-10 flex flex-col items-center relative overflow-hidden">
      <div className="w-full max-w-7xl z-10 animate-in fade-in slide-in-from-bottom-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">Your Fitness Hub</h1>
            <p className="text-sm md:text-lg text-blue-200/60 mt-2 font-medium flex items-center gap-2">
              <Calendar size={18} /> AI-Generated 7-Day Protocol
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button onClick={() => router.push('/chat')} className="flex-1 md:flex-none px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              💬 Chat with AI
            </button>
            <button onClick={() => router.push('/progress')} className="flex-1 md:flex-none px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              📈 Log Progress
            </button>
            <button onClick={() => router.push('/onboarding')} className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:scale-105 transition-all text-sm shadow-lg shadow-blue-500/20">
              ↻ Retake Survey
            </button>
          </div>
        </div>

        {/* AI Rationale Panel */}
        {plan.detailedAnalysis && (
          <div className="w-full glass rounded-[2rem] p-6 md:p-8 mb-8 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-blue-500/5 blur-[100px] -z-10"></div>
            <h2 className="text-xl font-bold flex items-center gap-3 mb-4 text-blue-400">
              <BrainCircuit className="text-blue-500" /> Deep AI Analysis
            </h2>
            <p className="text-blue-100/80 leading-relaxed text-sm md:text-base">
              {plan.detailedAnalysis}
            </p>
          </div>
        )}

        {/* Day Selector Carousel */}
        <div className="flex overflow-x-auto gap-2 md:gap-4 pb-4 mb-8 custom-scrollbar scroll-smooth">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = day === todayStr;
            return (
              <button 
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 border ${
                  isSelected 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105' 
                    : 'glass border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {day} 
                {isToday && <span className="ml-1 text-[10px] uppercase tracking-wider text-blue-400 font-black">(Today)</span>}
                {completedDays.includes(day) && <span className="ml-2 text-green-400">✓</span>}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Diet Plan Panel */}
          <div className="glass rounded-[2rem] p-6 md:p-8 flex flex-col border-t-4 border-t-green-500 relative overflow-hidden transition-all duration-500">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 blur-[60px] rounded-full -z-10"></div>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
              <Apple className="text-green-400" size={28} /> {selectedDay}'s Nutrition
            </h2>
            
            {dayDiet ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="glass-panel rounded-2xl p-4 text-center">
                    <p className="text-[10px] text-muted-foreground font-bold tracking-wider mb-1">CALORIES</p>
                    <p className="text-2xl font-black text-white">{dayDiet.calories}</p>
                  </div>
                  <div className="glass-panel rounded-2xl p-4 text-center border-blue-500/30">
                    <p className="text-[10px] text-blue-400/80 font-bold tracking-wider mb-1">PROTEIN</p>
                    <p className="text-2xl font-black text-blue-400">{dayDiet.protein}</p>
                  </div>
                  <div className="glass-panel rounded-2xl p-4 text-center border-yellow-500/30">
                    <p className="text-[10px] text-yellow-400/80 font-bold tracking-wider mb-1">CARBS</p>
                    <p className="text-2xl font-black text-yellow-400">{dayDiet.carbs}</p>
                  </div>
                  <div className="glass-panel rounded-2xl p-4 text-center border-red-500/30">
                    <p className="text-[10px] text-red-400/80 font-bold tracking-wider mb-1">FATS</p>
                    <p className="text-2xl font-black text-red-400">{dayDiet.fats}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  {Object.entries(dayDiet)
                    .filter(([k]) => !['day','calories','protein','carbs','fats'].includes(k))
                    .map(([key, desc], idx) => (
                    <div key={idx} className="flex gap-4 p-5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-2xl border border-white/5">
                      <div className="w-24 text-xs font-bold text-green-400/80 pt-1 uppercase tracking-wider">{key}</div>
                      <div className="flex-1 text-sm text-blue-50/90 leading-relaxed">{desc as string}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center my-auto py-10 opacity-50">
                <Apple size={48} className="mb-4 text-white/20" />
                <p className="text-white/60 text-center font-medium">Rest Day / No diet specifically generated for {selectedDay}.</p>
              </div>
            )}
          </div>

          {/* Workout Plan Panel */}
          <div className="glass rounded-[2rem] p-6 md:p-8 flex flex-col border-t-4 border-t-orange-500 relative overflow-hidden transition-all duration-500">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 blur-[60px] rounded-full -z-10"></div>
            <h2 className="text-2xl font-bold flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Activity className="text-orange-400" size={28} /> {selectedDay}'s Workout
              </div>
              {dayWorkout?.focus && (
                <span className="text-[10px] font-black tracking-widest uppercase px-4 py-2 bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20 shadow-lg shadow-orange-500/10">
                  {dayWorkout.focus}
                </span>
              )}
            </h2>

            {dayWorkout ? (
              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ul className="space-y-4">
                  {dayWorkout.exercises?.map((ex: string, i: number) => (
                    <li key={i} className="glass-panel border-white/5 hover:border-orange-500/30 rounded-2xl p-5 text-sm md:text-base text-blue-100/80 flex items-center gap-4 leading-relaxed transition-all">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 flex-shrink-0">
                        <Flame size={16} className="text-orange-400" />
                      </div>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center my-auto py-10 opacity-50">
                <Activity size={48} className="mb-4 text-white/20" />
                <p className="text-white/60 text-center font-medium">Rest Day. No workout scheduled for {selectedDay}.</p>
              </div>
            )}

            <button 
              onClick={() => {
                if (completedDays.includes(selectedDay)) {
                  setCompletedDays(completedDays.filter(d => d !== selectedDay));
                } else {
                  setCompletedDays([...completedDays, selectedDay]);
                }
              }}
              className={`w-full mt-8 py-5 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 hover:scale-[1.02] ${
                completedDays.includes(selectedDay) 
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)] group hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 hover:shadow-none' 
                  : 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.3)]'
              }`}
            >
              <CheckCircle size={20} className={completedDays.includes(selectedDay) ? "group-hover:hidden" : ""} /> 
              <span className="hidden group-hover:block mx-1">⟲</span>
              {completedDays.includes(selectedDay) ? 'Completed (Click to Undo)' : 'Complete Workout'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
