"use client";

import { useState } from 'react';
import { User, Bell, Palette, Key, Upload, Eye, EyeOff, Plus } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'api'>('profile');

  // Profile State
  const [name, setName] = useState('Explorer');
  const [email, setEmail] = useState('user@antigravity.dev');

  // API State
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'profile' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-card'
              }`}
            >
              <User size={20} /> Profile
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'notifications' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-card'
              }`}
            >
              <Bell size={20} /> Notifications
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'appearance' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-card'
              }`}
            >
              <Palette size={20} /> Appearance
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'api' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-card'
              }`}
            >
              <Key size={20} /> API Keys
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 glass rounded-2xl p-8">
            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl text-white font-bold overflow-hidden group">
                    {name.charAt(0)}
                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition">
                      <Upload size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Avatar</h3>
                    <p className="text-sm text-muted-foreground mb-2">JPG, GIF or PNG. Max size of 800K</p>
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-white/5 transition text-sm">Upload Picture</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Display Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-input/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-input/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <button className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition mt-4">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  {[
                    { title: 'Experiment Completed', desc: 'Get notified when a long-running simulation finishes.' },
                    { title: 'New Challenges', desc: 'Weekly updates on new physics puzzles.' },
                    { title: 'Leaderboard Updates', desc: 'When someone beats your high score.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl">
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-6">Appearance</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border-2 border-primary rounded-xl p-2 cursor-pointer bg-black text-white relative">
                    <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full"></div>
                    <div className="h-32 rounded-lg border border-white/10 bg-black p-4 flex flex-col gap-2">
                      <div className="h-4 w-1/2 bg-white/20 rounded"></div>
                      <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                      <div className="h-10 w-full mt-auto bg-primary rounded"></div>
                    </div>
                    <p className="text-center mt-3 font-semibold">Deep Space (Dark)</p>
                  </div>

                  <div className="border border-border rounded-xl p-2 cursor-pointer bg-white text-black opacity-50 hover:opacity-100 transition">
                    <div className="h-32 rounded-lg border border-black/10 bg-gray-50 p-4 flex flex-col gap-2">
                      <div className="h-4 w-1/2 bg-black/20 rounded"></div>
                      <div className="h-4 w-3/4 bg-black/10 rounded"></div>
                      <div className="h-10 w-full mt-auto bg-primary rounded"></div>
                    </div>
                    <p className="text-center mt-3 font-semibold text-gray-700">Nebula (Light)</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-6">Developer API Keys</h2>
                <p className="text-muted-foreground mb-6">Use these keys to authenticate your own scripts with the AntiGravity engine.</p>
                
                <div className="bg-card border border-border rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">Personal Access Token</span>
                    <span className="text-xs text-muted-foreground">Created: 2 days ago</span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type={showKey ? "text" : "password"} 
                      readOnly 
                      value="ag_prod_8f92j3nfa9s8dfj23rn298hf" 
                      className="flex-1 bg-input/50 border border-border rounded-lg px-4 py-2 font-mono text-sm outline-none"
                    />
                    <button onClick={() => setShowKey(!showKey)} className="p-2 border border-border rounded-lg hover:bg-white/5 transition">
                      {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition text-sm">Copy</button>
                  </div>
                </div>

                <button className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition">
                  <Plus size={20} /> Generate New Key
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
