"use client";

import { useState } from 'react';
import { Search, Trophy, Medal, Filter, Star } from 'lucide-react';

const CHALLENGES = [
  { id: 1, title: 'Levitation Basics', desc: 'Suspend a 1kg mass for 10s.', difficulty: 'EASY', pts: 100 },
  { id: 2, title: 'Orbital Mechanics', desc: 'Create a stable orbit around a heavy mass.', difficulty: 'MEDIUM', pts: 300 },
  { id: 3, title: 'Black Hole Escape', desc: 'Escape extreme gravitational pull.', difficulty: 'HARD', pts: 500 },
  { id: 4, title: 'Zero-G Ping Pong', desc: 'Maintain a rally in zero gravity.', difficulty: 'MEDIUM', pts: 250 },
];

const LEADERBOARD = [
  { rank: 1, name: 'Alice_Space', score: 14500, avatar: 'A' },
  { rank: 2, name: 'Bob_Gravity', score: 13200, avatar: 'B' },
  { rank: 3, name: 'Charlie_ZeroG', score: 12800, avatar: 'C' },
  { rank: 4, name: 'Dave_Orbit', score: 11500, avatar: 'D' },
  { rank: 5, name: 'Eve_Quantum', score: 10900, avatar: 'E' },
];

export default function ChallengesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filteredChallenges = CHALLENGES.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) && 
    (filter === 'ALL' || c.difficulty === filter)
  );

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10 flex gap-8 flex-col lg:flex-row">
      
      {/* Left Column: Challenges Grid */}
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
            <Star className="text-yellow-500" /> Physics Challenges
          </h1>
          <p className="text-muted-foreground">Complete puzzles to earn points and climb the leaderboard.</p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search challenges..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input/50 border border-border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-input/50 border border-border rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredChallenges.map(c => (
            <div key={c.id} className="glass p-6 rounded-2xl flex flex-col group cursor-pointer hover:border-primary/50 transition">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  c.difficulty === 'EASY' ? 'bg-green-500/20 text-green-400' : 
                  c.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 
                  'bg-red-500/20 text-red-400'
                }`}>
                  {c.difficulty}
                </span>
                <span className="font-bold text-primary">{c.pts} pts</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">{c.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-1">{c.desc}</p>
              <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg group-hover:bg-primary group-hover:text-white transition font-semibold">
                Start Challenge
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Leaderboard */}
      <div className="w-full lg:w-96">
        <div className="glass rounded-2xl p-6 sticky top-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <Trophy className="text-yellow-500" /> Leaderboard
          </h2>
          
          <div className="flex flex-col gap-3">
            {LEADERBOARD.map((user) => (
              <div 
                key={user.rank} 
                className={`flex items-center gap-4 p-3 rounded-xl border ${
                  user.rank === 1 ? 'bg-yellow-500/10 border-yellow-500/30' :
                  user.rank === 2 ? 'bg-gray-300/10 border-gray-300/30' :
                  user.rank === 3 ? 'bg-orange-700/10 border-orange-700/30' :
                  'bg-card border-border'
                }`}
              >
                <div className="font-bold text-lg w-6 text-center">
                  {user.rank === 1 ? <Medal className="text-yellow-500" size={24} /> : 
                   user.rank === 2 ? <Medal className="text-gray-300" size={24} /> : 
                   user.rank === 3 ? <Medal className="text-orange-700" size={24} /> : 
                   <span className="text-muted-foreground">{user.rank}</span>}
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{user.name}</h4>
                  <p className="text-xs text-muted-foreground">{user.score.toLocaleString()} pts</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2 text-sm font-semibold text-primary hover:text-primary/80 transition">
            View Full Rankings
          </button>
        </div>
      </div>

    </div>
  );
}
