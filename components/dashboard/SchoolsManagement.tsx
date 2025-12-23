
import React, { useState } from 'react';
import { Download, Plus, Check, X, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { db } from '../../services/db';
import { cn } from '../../utils/cn';

export const SchoolsManagement = () => {
  const [schools, setSchools] = useState(db.getSchools());

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-5">
      <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
         <h3 className="font-bold text-gray-800 text-lg leading-none">Institution Inventory</h3>
         <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="text-[10px] font-black uppercase tracking-widest"><Download size={14}/> Export</Button>
            <Button size="sm" className="text-[10px] font-black uppercase tracking-widest"><Plus size={14}/> Add School</Button>
         </div>
      </div>
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-500 border-b">
          <tr className="text-xs font-black uppercase tracking-widest">
            <th className="p-4">Institution Name</th>
            <th className="p-4">District</th>
            <th className="p-4">Plan</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y text-sm">
          {schools.map(s => (
            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 font-bold text-gray-900">{s.name}</td>
              <td className="p-4 text-gray-500 font-medium">{s.district}</td>
              <td className="p-4"><span className="bg-brand-50 text-brand-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter">{s.plan}</span></td>
              <td className="p-4">
                <span className={cn(
                  "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700"
                )}>active</span>
              </td>
              <td className="p-4 text-right">
                <div className="flex gap-2 justify-end items-center">
                  <button className="p-2 text-gray-400 hover:text-brand-600 rounded-lg transition-all"><Settings size={18}/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
