import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ShoppingBag, Zap, TrendingUp } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-2xl">
          <Bot className="text-blue-500" />
          <span>AutoSeller</span>
        </div>
        <Link 
          to="/login"
          className="px-6 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition text-sm font-medium"
        >
          Login
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-800 text-blue-300 text-sm mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Meta Verified Partner
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 max-w-4xl">
          Turn Comments into <br/> <span className="text-blue-500">Sales Automatically.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Connect your Facebook Page and WhatsApp. Let our AI handle prices, delivery details, and order taking 24/7 without generic replies.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/login"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold shadow-lg shadow-blue-900/50 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            Start Free Trial
            <Zap size={18} />
          </Link>
          <a href="#demo" className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-2xl font-semibold transition-all backdrop-blur-sm">
            View Demo
          </a>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full text-left">
          <FeatureCard 
            icon={Bot}
            title="Auto Reply Engine"
            desc="Detects products and wilayas automatically. Gives exact pricing including delivery costs."
          />
          <FeatureCard 
            icon={ShoppingBag}
            title="Product Sync"
            desc="Import your catalog. AutoSeller knows your stock levels and product details instantly."
          />
          <FeatureCard 
            icon={TrendingUp}
            title="Order Capture"
            desc="Converts chats into structured orders. Collects name, phone, and address automatically."
          />
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-800/50 py-8 text-center text-slate-500 text-sm">
        © 2024 AutoSeller. Smart Commerce.
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors backdrop-blur-sm">
    <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center mb-4 text-blue-400">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);