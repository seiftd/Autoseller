import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Order, Language } from '../types';
import { TEXTS } from '../constants';
import { Package, Search, Phone, MapPin } from 'lucide-react';

interface Props {
  lang: Language;
}

export const Orders: React.FC<Props> = ({ lang }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const t = TEXTS;

  useEffect(() => {
    setOrders(storageService.getOrders());
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Package className="text-accent" />
                {t.orders[lang]}
            </h1>
        </div>

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
                                <span className="text-2xl font-bold text-white">{order.total} DA</span>
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