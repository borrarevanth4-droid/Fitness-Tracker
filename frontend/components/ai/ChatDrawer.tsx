"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Lightbulb } from 'lucide-react';
import { useAuthStore } from '../../store';

export default function ChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { token } = useAuthStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchSuggestions = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/ai/suggestions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSuggestions(data);
    } catch (e) {
      console.error('Failed to fetch suggestions', e);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !token) return;

    const newMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ messages: updatedMessages.slice(-10) }),
        signal: abortControllerRef.current.signal
      });

      if (!response.body) throw new Error('No readable stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
      setIsTyping(false);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                assistantMsg += data.text;
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content = assistantMsg;
                  return newMsgs;
                });
              }
            } catch (e) {
              // ignore parse errors
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Stream aborted');
      } else {
        console.error('Chat error:', error);
      }
      setIsTyping(false);
    }
  };

  const cancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-xl hover:bg-primary/90 transition-transform hover:scale-110 z-40"
      >
        <MessageCircle size={28} />
      </button>

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 glass transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-black/20">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary text-2xl">🤖</span> AI Tutor
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button 
            className={`flex-1 py-3 font-semibold ${activeTab === 'chat' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button 
            className={`flex-1 py-3 font-semibold ${activeTab === 'suggestions' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
            onClick={() => {
              setActiveTab('suggestions');
              if (suggestions.length === 0) fetchSuggestions();
            }}
          >
            Suggestions
          </button>
        </div>

        {/* Chat Area */}
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                  <p>Ask me anything about anti-gravity!</p>
                </div>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'self-end' : 'self-start'}`}>
                  <div className={`p-3 rounded-2xl ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-card text-card-foreground border border-border rounded-tl-none'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="self-start bg-card border border-border p-3 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-border bg-black/20">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-input/50 border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isTyping && !abortControllerRef.current}
                />
                {isTyping ? (
                  <button type="button" onClick={cancelStream} className="p-3 bg-destructive text-white rounded-full hover:bg-destructive/90 transition">
                    <X size={20} />
                  </button>
                ) : (
                  <button type="submit" className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition">
                    <Send size={20} />
                  </button>
                )}
              </form>
            </div>
          </>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {suggestions.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">Loading suggestions...</p>
            ) : (
              suggestions.map((s, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="text-yellow-400" size={20} />
                    <h3 className="font-bold text-lg">{s.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{s.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${s.difficulty === 'EASY' ? 'bg-green-500/20 text-green-400' : s.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    {s.difficulty}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
