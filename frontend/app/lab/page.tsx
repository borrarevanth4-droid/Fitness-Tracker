"use client";

import dynamic from 'next/dynamic';
import { Box, Circle, Trash2, Settings, Plus, Magnet } from 'lucide-react';
import ChatDrawer from '../../components/ai/ChatDrawer';
import { useLabStore, PhysicsObject } from '../../store';

const LabScene = dynamic(() => import('../../components/lab/LabScene'), { ssr: false });

export default function LabPage() {
  const { gravity, setGravity, objects, addObject, updateObject, removeObject, selectedObjectId, setSelectedObjectId } = useLabStore();

  const selectedObject = objects.find(o => o.id === selectedObjectId);

  const spawnObject = (type: 'cube' | 'sphere') => {
    const newObj: PhysicsObject = {
      id: `obj-${Date.now()}`,
      type,
      position: [(Math.random() - 0.5) * 4, 10, (Math.random() - 0.5) * 4],
      mass: 1,
      color: type === 'cube' ? '#534AB7' : '#9F97F0',
      charge: 0
    };
    addObject(newObj);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      {/* Top Navbar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card z-10 shadow-sm">
        <div className="font-bold text-xl tracking-tight flex items-center gap-2">
          <span className="text-primary">AntiGravity</span> <span className="text-muted-foreground font-medium">Lab Workspace</span>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-3 text-sm font-medium">
            <span className="text-muted-foreground">Global Gravity:</span>
            <input 
              type="range" 
              min="-30" 
              max="30" 
              step="0.5" 
              value={gravity} 
              onChange={(e: any) => setGravity(parseFloat(e.target.value))}
              className="w-48 accent-primary cursor-pointer"
            />
            <span className="w-16 text-right font-mono text-primary bg-primary/10 px-2 py-1 rounded">{gravity.toFixed(1)}</span>
          </label>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Left Toolbar - Spawn Palette */}
        <div className="w-16 border-r border-border bg-card/80 backdrop-blur-md flex flex-col items-center py-6 gap-4 z-10">
          <button 
            onClick={() => spawnObject('cube')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition group"
            title="Spawn Cube"
          >
            <Box className="text-primary group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => spawnObject('sphere')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition group"
            title="Spawn Sphere"
          >
            <Circle className="text-secondary group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="w-8 h-px bg-border my-2"></div>
          
          <button 
            onClick={() => setGravity(0)}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition group"
            title="Zero Gravity Mode"
          >
            <Magnet className="text-yellow-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative cursor-crosshair">
          <LabScene />
        </div>

        {/* Right Panel - Inspector */}
        <div className={`w-80 border-l border-border bg-card/90 backdrop-blur-md flex flex-col transition-all duration-300 z-10 ${selectedObject ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
          <div className="p-4 border-b border-border flex justify-between items-center bg-black/20">
            <h3 className="font-bold flex items-center gap-2"><Settings size={18}/> Object Inspector</h3>
            <button onClick={() => setSelectedObjectId(null)} className="text-muted-foreground hover:text-white transition">×</button>
          </div>
          
          {selectedObject && (
            <div className="p-6 flex flex-col gap-6 overflow-y-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                  {selectedObject.type === 'cube' ? <Box /> : <Circle />}
                </div>
                <div>
                  <div className="font-mono text-sm text-muted-foreground">ID: {selectedObject.id}</div>
                  <div className="font-bold uppercase text-sm tracking-wider">{selectedObject.type}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex justify-between text-sm font-medium mb-2">
                    <span>Mass (kg)</span>
                    <span className="font-mono text-primary">{selectedObject.mass}</span>
                  </label>
                  <input 
                    type="range" min="0.1" max="100" step="0.1" value={selectedObject.mass}
                    onChange={(e: any) => updateObject(selectedObject.id, { mass: parseFloat(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium mb-2">
                    <span className="flex items-center gap-1"><Magnet size={14}/> Anti-Gravity Charge</span>
                    <span className="font-mono text-yellow-400">{selectedObject.charge}</span>
                  </label>
                  <input 
                    type="range" min="0" max="50" step="1" value={selectedObject.charge}
                    onChange={(e: any) => updateObject(selectedObject.id, { charge: parseFloat(e.target.value) })}
                    className="w-full accent-yellow-400"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Increases upward force defying gravity.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Material Color</label>
                  <div className="flex gap-2">
                    {['#534AB7', '#9F97F0', '#ef4444', '#10b981', '#f59e0b', '#ffffff'].map(c => (
                      <button 
                        key={c}
                        onClick={() => updateObject(selectedObject.id, { color: c })}
                        className={`w-8 h-8 rounded-full border-2 transition ${selectedObject.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-border">
                <button 
                  onClick={() => removeObject(selectedObject.id)}
                  className="w-full py-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-destructive hover:text-white transition"
                >
                  <Trash2 size={18} /> Delete Object
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChatDrawer />
    </div>
  );
}
