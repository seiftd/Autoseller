import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { csvService } from '../services/csvService';
import { Order, Language } from '../types';
import { TEXTS } from '../constants';
import { Package, Search, Phone, MapPin, Download } from 'lucide-react';
import { SectionHeader } from '../components/PremiumUI';

interface Props {
  lang: Language;
}

export const Orders: React.FC<Props> = ({ lang }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const t = TEXTS;

  useEffect(() => {
    setOrders(storageService.getOrders());
  }, []);

  const handleExport = () => {
      csvService.exportOrders(orders, `orders-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <SectionHeader 
            title={t.orders[lang]}
            action={
                <button 
                    onClick={handleExport}
                    disabled={orders.length === 0}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-medium transition-all border border-slate-700 disabled:opacity-50"
                >
                    <Download size={18} />
                    {t.export[lang]}
                </button>
            }
        />

        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden">
             {orders.length === 0 ? (
                 <div className="p-12 text-center text-slate-500">
                     <Package className="mx-auto mb-4 opacity-50" size={48} />
                     <p>No orders received yet.</p>
                     <p className="text-xs mt-2">Use the Simulator to create test orders.</p>
                 </div>
             ) : (
                <div className="divide-y divide-slate-700/50">
                    {orders.map(order => (
                        <div key={order.id} className="p-6 hover:bg-slate-700/20 transition-colors flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                                    {order.customerName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{order.customerName}</h3>
                                    <div className="flex flex-col gap-1 mt-1 text-sm text-slate-400">
                                        <span className="flex items-center gap-2"><Phone size={14}/> {order.phone}</span>
                                        <span className="flex items-center gap-2"><MapPin size={14}/> {order.wilaya} - {order.address}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end justify-center min-w-[150px]">
                                <span className="text-2xl font-bold text-white">{order.total} <span className="text-sm font-normal text-slate-400">{order.currency || 'DA'}</span></span>
                                <span className={`
                                    mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                    ${order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : ''}
                                `}>
                                    {order.status}
                                </span>
                                <span className="text-xs text-slate-500 mt-2">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
             )}
        </div>
    </div>
  );
};