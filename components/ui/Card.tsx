
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  subtext?: string;
  color?: string;
}

export const Card = ({ title, value, icon: Icon, subtext, color = "bg-brand-50 text-brand-600" }: CardProps) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
    <div className="flex items-center justify-between mb-6">
      <h5 className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">{title}</h5>
      {Icon && <div className={`p-3 rounded-2xl ${color} group-hover:scale-110 transition-transform`}><Icon size={20} /></div>}
    </div>
    <div className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{value}</div>
    {subtext && <p className="text-xs text-gray-400 font-medium mt-3 leading-tight">{subtext}</p>}
  </div>
);
