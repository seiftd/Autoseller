import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { Language, Message } from '../types';
import { TEXTS } from '../constants';
import { Send, Bot, User, RefreshCw, MessageSquare, MessageCircle } from 'lucide-react';

interface Props {
  lang: Language;
}

export const Inbox: React.FC<Props> = ({ lang }) => {
  const [messages, setMessages] = useState<Message[]>([
      { id: '1', role: 'assistant', content: 'AutoSeller Bot is active. Simulate a customer comment or DM below.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'comment' | 'message'>('comment');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = TEXTS;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: input,
        timestamp: Date.now(),
        type: mode
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
        const replyText = await geminiService.processMessage(userMsg.content, mode);
        
        const botMsg: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: replyText,
            timestamp: Date.now(),
            type: mode
        };
        setMessages(prev => [...prev, botMsg]);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)] animate-fade-in">
        
        {/* Simulator Info */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-full flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Bot className="text-accent" />
                    {t.simulatorTitle[lang]}
                </h2>
                <p className="text-slate-400 text-sm mb-6">{t.simulatorDesc[lang]}</p>
                
                <div className="space-y-4 flex-1">
                    <h3 className="text-sm font-semibold text-white">Select Input Context:</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setMode('comment')}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${mode === 'comment' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                        >
                            <MessageSquare size={20} />
                            <span className="text-sm font-medium">Public Comment</span>
                        </button>
                        <button 
                            onClick={() => setMode('message')}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${mode === 'message' ? 'bg-purple-600 border-purple-500 text-white shadow-lg' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                        >
                            <MessageCircle size={20} />
                            <span className="text-sm font-medium">Private Message</span>
                        </button>
                    </div>

                    <div className="p-4 mt-6 bg-slate-900/50 rounded-xl border border-slate-700/50 text-sm text-slate-300">
                        <p className="mb-2"><strong>AI Behavior:</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
                            <li>Public comments get short replies + redirection to DM.</li>
                            <li>DMs get detailed pricing and order collection.</li>
                            <li>Replies are based strictly on your <strong>Products</strong> data.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
                        <Bot className="text-white" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">AutoSeller AI</h3>
                        <p className="text-xs text-slate-400">
                            Simulating: <span className="text-white font-medium capitalize">{mode}</span> from Customer
                        </p>
                    </div>
                </div>
                <button onClick={() => setMessages([])} className="p-2 hover:bg-slate-800 rounded-full text-slate-500" title="Reset">
                    <RefreshCw size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
                            max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-md relative
                            ${msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'}
                        `}>
                            {msg.type && (
                                <span className="absolute -top-5 text-[10px] text-slate-500 uppercase tracking-wide opacity-70">
                                    {msg.role === 'user' ? msg.type : 'Auto-Reply'}
                                </span>
                            )}
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex gap-1">
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={mode === 'comment' ? "Write a comment as a customer..." : "Write a message as a customer..."}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-accent outline-none"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-accent hover:bg-accentHover disabled:bg-slate-800 disabled:text-slate-600 text-white p-3 rounded-xl transition-all"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};