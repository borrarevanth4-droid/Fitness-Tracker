"use client";

import { useState } from 'react';
import { Play, Share2, Download, Video } from 'lucide-react';

const RECORDINGS = [
  { id: 1, title: 'Stable Orbit Achieved', duration: '1m 24s', date: '2 days ago', thumbnail: 'bg-indigo-900' },
  { id: 2, title: 'Magnetic Repulsion Test', duration: '0m 45s', date: '3 days ago', thumbnail: 'bg-blue-900' },
  { id: 3, title: 'Zero-G Collisions', duration: '2m 10s', date: '1 week ago', thumbnail: 'bg-purple-900' },
  { id: 4, title: 'Black Hole Event Horizon', duration: '3m 05s', date: '2 weeks ago', thumbnail: 'bg-slate-900' },
];

export default function RecordingsPage() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
          <Video className="text-primary" /> Recordings Gallery
        </h1>
        <p className="text-muted-foreground">Review, download, and share your past simulation sessions.</p>
      </div>

      {activeVideo && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4">
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-border shadow-2xl relative flex items-center justify-center group">
            {/* Custom Video Player Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <div className="text-white text-opacity-50 font-bold text-2xl z-0">
              [ Video Player Simulation: {RECORDINGS.find(r => r.id === activeVideo)?.title} ]
            </div>
            
            {/* Player Controls Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex items-center gap-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition">
                <Play fill="currentColor" size={20} />
              </button>
              <div className="flex-1 h-2 bg-white/20 rounded-full cursor-pointer relative">
                <div className="absolute left-0 top-0 h-full w-1/3 bg-primary rounded-full"></div>
              </div>
              <span className="text-white text-sm font-mono">00:24 / 01:24</span>
              <button className="p-2 text-white hover:text-primary transition" title="Share">
                <Share2 size={20} />
              </button>
              <button className="p-2 text-white hover:text-primary transition" title="Download">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {RECORDINGS.map((rec) => (
          <div 
            key={rec.id} 
            className="glass rounded-2xl overflow-hidden cursor-pointer group hover:border-primary/50 transition"
            onClick={() => setActiveVideo(rec.id)}
          >
            <div className={`w-full aspect-video ${rec.thumbnail} relative flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />
              <Play className="text-white opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all z-10" size={48} />
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-mono z-10">
                {rec.duration}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-1 truncate">{rec.title}</h3>
              <p className="text-xs text-muted-foreground">{rec.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
