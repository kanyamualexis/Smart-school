
import React, { useState, useEffect } from 'react';
import { Download, Plus, Check, X, Settings, Loader2, Ban, RefreshCw, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { db } from '../../services/db';
import { cn } from '../../utils/cn';
import { SchoolData } from '../../types';

export const SchoolsManagement = () => {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'active' | 'suspended' | 'rejected'>('pending');

  const fetchSchools = async () => {
    setLoading(true);
    const data = await db.getSchools();
    setSchools(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const updateStatus = async (id: string, status: 'active' | 'suspended' | 'rejected') => {
    let confirmMsg = '';
    if (status === 'active') confirmMsg = 'Approve this school? An email notification will be sent.';
    if (status === 'suspended') confirmMsg = 'Suspend this school? Access will be revoked immediately.';
    if (status === 'rejected') confirmMsg = 'Reject this application? This action cannot be easily undone.';

    if (confirm(confirmMsg)) {
      await db.updateSchool(id, { status });
      await fetchSchools();
    }
  };

  const filteredSchools = schools.filter(s => {
    const status = s.status || 'pending';
    return status === filter;
  });

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900">Schools Management</h2>
          <Button size="sm"><Plus size={16}/> Manual Registration</Button>
       </div>

       {/* Tabs */}
       <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-1">
          {[
            { id: 'pending', label: 'Pending Approval', color: 'text-amber-600 border-amber-600', count: schools.filter(s => (s.status||'pending') === 'pending').length },
            { id: 'active', label: 'Active Schools', color: 'text-emerald-600 border-emerald-600', count: schools.filter(s => s.status === 'active').length },
            { id: 'suspended', label: 'Suspended', color: 'text-red-600 border-red-600', count: schools.filter(s => s.status === 'suspended').length },
            { id: 'rejected', label: 'Rejected', color: 'text-gray-600 border-gray-600', count: schools.filter(s => s.status === 'rejected').length }
          ].map(tab => (
             <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={cn(
                  "px-6 py-3 text-sm font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                  filter === tab.id ? tab.color : "border-transparent text-gray-400 hover:text-gray-600"
                )}
             >
                {tab.label}
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">{tab.count}</span>
             </button>
          ))}
       </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2">
        {loading ? (
          <div className="p-12 flex justify-center text-brand-600"><Loader2 className="animate-spin" /></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 border-b">
              <tr className="text-xs font-black uppercase tracking-widest">
                <th className="p-4">School Name</th>
                <th className="p-4">Location / Contact</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Reg. Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredSchools.length === 0 && (
                 <tr><td colSpan={5} className="p-8 text-center text-gray-400">No schools found in this category.</td></tr>
              )}
              {filteredSchools.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                     <div className="font-bold text-gray-900">{s.name}</div>
                     <div className="text-xs text-gray-400 font-mono mt-0.5">{s.id}</div>
                  </td>
                  <td className="p-4">
                     <div className="font-medium text-gray-700">{s.district.split('|')[0]}</div>
                     <div className="text-xs text-gray-500">{s.district.split('|')[1]}</div>
                  </td>
                  <td className="p-4"><span className="bg-brand-50 text-brand-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter">{s.plan}</span></td>
                  <td className="p-4 text-gray-500 font-medium">{new Date(s.created_at || Date.now()).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      {filter === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(s.id, 'active')} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all" title="Approve">
                             <Check size={16}/>
                          </button>
                          <button onClick={() => updateStatus(s.id, 'rejected')} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all" title="Reject">
                             <X size={16}/>
                          </button>
                        </>
                      )}

                      {filter === 'active' && (
                        <button onClick={() => updateStatus(s.id, 'suspended')} className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-all" title="Suspend">
                           <Ban size={16}/>
                        </button>
                      )}

                      {filter === 'suspended' && (
                        <button onClick={() => updateStatus(s.id, 'active')} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all" title="Reactivate">
                           <RefreshCw size={16}/>
                        </button>
                      )}

                      <button className="p-2 bg-gray-50 text-gray-600 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-all" title="View Details">
                         <Eye size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
