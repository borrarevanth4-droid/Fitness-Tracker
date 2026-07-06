"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User, ArrowLeft, Loader2 } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    fetch(`${apiUrl}/chat`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.messages.length > 0) {
          setMessages(data.messages.map((m: any) => ({ role: m.role, text: m.content })));
        } else {
          setMessages([{ role: 'assistant', text: "Hello! I am your RAG-powered AI Coach. Do you want to adjust your diet, report an injury, or ask a fitness question?" }]);
        }
        setInitializing(false);
      })
      .catch(() => {
        setInitializing(false);
        setMessages([{ role: 'assistant', text: "Welcome to your AI Coach offline mode." }]);
      });
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
        if (data.planUpdated) {
           setMessages(prev => [...prev, { role: 'assistant', text: "✅ I have successfully updated your 7-day workout and diet plan! You can view the new plan on your Dashboard." }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I ran into an error processing that." }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Failed to connect to the server." }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 relative overflow-hidden">
      
      <div className="max-w-3xl w-full mx-auto flex flex-col h-[90vh] z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push('/dashboard')} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition border border-white/10 shadow-lg">
            <ArrowLeft size={20} className="text-blue-400" />
          </button>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Interactive AI Coach</h1>
        </div>

        {/* Chat Window */}
        <div className="flex-1 glass rounded-[2rem] p-4 md:p-6 flex flex-col overflow-hidden relative">
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-2 pb-4 custom-scrollbar">
            {initializing ? (
              <div className="h-full flex items-center justify-center text-blue-400/50">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
                  {msg.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20 border border-white/20">
                      <Bot size={20} className="text-white" />
                    </div>
                  )}
                  <div className={`p-4 rounded-3xl max-w-[85%] text-sm md:text-base leading-relaxed ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-sm shadow-lg shadow-blue-500/20' : 'bg-white/10 text-foreground rounded-bl-sm border border-white/5 backdrop-blur-xl'}`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            
            {loading && (
              <div className="flex gap-4 justify-start animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/20">
                  <Bot size={20} className="text-white animate-pulse" />
                </div>
                <div className="p-4 rounded-3xl bg-white/10 text-foreground rounded-bl-sm border border-white/5 backdrop-blur-xl flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={sendMessage} className="mt-4 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="E.g., I want to eat more protein today..."
              className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base transition-all placeholder:text-muted-foreground/50 shadow-inner"
              disabled={loading || initializing}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="p-4 md:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:scale-105 transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/25"
            >
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
