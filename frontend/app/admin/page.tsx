"use client";

import { useState } from 'react';
import { Users, ShieldAlert, CheckSquare, Square, Trash2, Edit, Plus, FileText } from 'lucide-react';

const USERS_MOCK = [
  { id: '1', name: 'Alice_Space', email: 'alice@test.dev', role: 'USER', joined: '2024-01-15' },
  { id: '2', name: 'Bob_Gravity', email: 'bob@test.dev', role: 'USER', joined: '2024-02-10' },
  { id: '3', name: 'Admin_Sys', email: 'admin@antigravity.dev', role: 'ADMIN', joined: '2023-11-01' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'challenges'>('users');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [mdContent, setMdContent] = useState('# New Challenge\n\nDescribe the physics puzzle here...\n\n- Objective 1\n- Objective 2');

  const toggleUser = (id: string) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedUsers(newSet);
  };

  const toggleAll = () => {
    if (selectedUsers.size === USERS_MOCK.length) setSelectedUsers(new Set());
    else setSelectedUsers(new Set(USERS_MOCK.map(u => u.id)));
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <ShieldAlert className="text-destructive" /> Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Platform management and configuration.</p>
          </div>
          <div className="flex gap-2 p-1 bg-card border border-border rounded-lg">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md font-semibold text-sm transition ${activeTab === 'users' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-white/5'}`}
            >
              Users
            </button>
            <button 
              onClick={() => setActiveTab('challenges')}
              className={`px-4 py-2 rounded-md font-semibold text-sm transition ${activeTab === 'challenges' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-white/5'}`}
            >
              Challenge Editor
            </button>
          </div>
        </div>

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="glass rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><Users /> User Management</h2>
              {selectedUsers.size > 0 && (
                <div className="flex items-center gap-4 bg-destructive/10 text-destructive px-4 py-2 rounded-lg border border-destructive/20">
                  <span className="text-sm font-semibold">{selectedUsers.size} selected</span>
                  <button className="flex items-center gap-1 text-sm font-bold hover:underline">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="p-4 w-12 text-center cursor-pointer" onClick={toggleAll}>
                      {selectedUsers.size === USERS_MOCK.length ? <CheckSquare className="text-primary" /> : <Square />}
                    </th>
                    <th className="p-4 font-semibold text-sm">Name</th>
                    <th className="p-4 font-semibold text-sm">Email</th>
                    <th className="p-4 font-semibold text-sm">Role</th>
                    <th className="p-4 font-semibold text-sm">Joined</th>
                    <th className="p-4 font-semibold text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {USERS_MOCK.map(u => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-white/5 transition">
                      <td className="p-4 text-center cursor-pointer" onClick={() => toggleUser(u.id)}>
                        {selectedUsers.has(u.id) ? <CheckSquare className="text-primary" /> : <Square className="text-muted-foreground" />}
                      </td>
                      <td className="p-4 font-semibold">{u.name}</td>
                      <td className="p-4 text-muted-foreground text-sm">{u.email}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${u.role === 'ADMIN' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">{u.joined}</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button className="p-2 text-muted-foreground hover:text-primary transition" title="Edit Role"><Edit size={18} /></button>
                        <button className="p-2 text-muted-foreground hover:text-destructive transition" title="Delete User"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Challenge Editor Tab */}
        {activeTab === 'challenges' && (
          <div className="glass rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><FileText /> Challenge Editor</h2>
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition">
                <Plus size={18} /> Publish
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
              {/* Editor */}
              <div className="flex flex-col gap-4 h-full">
                <input 
                  type="text" 
                  placeholder="Challenge Title" 
                  className="bg-input/50 border border-border rounded-lg px-4 py-3 font-bold text-lg focus:ring-2 focus:ring-primary outline-none"
                  defaultValue="Magnetic Orbit Puzzle"
                />
                <div className="flex gap-4">
                  <select className="flex-1 bg-input/50 border border-border rounded-lg px-4 py-2 outline-none">
                    <option>Difficulty: MEDIUM</option>
                  </select>
                  <input type="number" placeholder="Target Score (e.g. 500)" className="flex-1 bg-input/50 border border-border rounded-lg px-4 py-2 outline-none" />
                </div>
                <textarea 
                  className="flex-1 bg-input/50 border border-border rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                  value={mdContent}
                  onChange={(e: any) => setMdContent(e.target.value)}
                />
              </div>

              {/* Markdown Preview */}
              <div className="h-full bg-card border border-border rounded-lg p-6 overflow-y-auto prose prose-invert max-w-none">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Live Preview</h3>
                <div className="whitespace-pre-wrap">{mdContent}</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
