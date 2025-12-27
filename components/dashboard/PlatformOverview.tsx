
import React, { useEffect, useState } from 'react';
import { Building2, AlertCircle, CreditCard, Activity, Users, Ban, XCircle, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { db } from '../../services/db';
import { formatCurrency } from '../../utils/formatters';

export const PlatformOverview = () => {
  const [stats, setStats] = useState({ 
    active: 0, 
    pending: 0, 
    suspended: 0, 
    rejected: 0,
    totalUsers: 0 
  });

  useEffect(() => {
    const load = async () => {
      const schools = await db.getSchools();
      const users = await db.getAllUsers();
      setStats({
        active: schools.filter(s => s.status === 'active').length,
        pending: schools.filter(s => s.status === 'pending').length,
        suspended: schools.filter(s => s.status === 'suspended').length,
        rejected: schools.filter(s => s.status === 'rejected').length,
        totalUsers: users.length
      });
    };
    load();
  }, []);

  const totalSchools = stats.active + stats.pending + stats.suspended + stats.rejected;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-black text-gray-900">Dashboard Overview</h2>
           <p className="text-gray-500 font-medium">Platform performance and key metrics</p>
        </div>
        <div className="text-right">
           <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Revenue</div>
           <div className="text-3xl font-black text-emerald-600">{formatCurrency(stats.active * 130000)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Building2 size={20}/></div>
           </div>
           <div className="text-2xl font-black text-gray-900">{totalSchools}</div>
           <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Schools</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -mr-8 -mt-8"></div>
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg relative z-10"><AlertCircle size={20}/></div>
           </div>
           <div className="text-2xl font-black text-amber-600">{stats.pending}</div>
           <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Pending Approval</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Activity size={20}/></div>
           </div>
           <div className="text-2xl font-black text-emerald-600">{stats.active}</div>
           <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Active Schools</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Ban size={20}/></div>
           </div>
           <div className="text-2xl font-black text-red-600">{stats.suspended}</div>
           <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Suspended</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users size={20}/></div>
           </div>
           <div className="text-2xl font-black text-purple-600">{stats.totalUsers}</div>
           <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Users</div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp size={18}/> Registration Trends</h3>
           <div className="h-64 flex items-end justify-around gap-2 px-4 border-b border-gray-100 pb-4">
              {[30, 45, 35, 60, 55, 80, 70, 90, 85, 100, 95, 110].map((h, i) => (
                 <div key={i} className="w-full bg-blue-50 hover:bg-blue-600 transition-colors rounded-t-md relative group" style={{height: `${h/1.5}%`}}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded">{h}</div>
                 </div>
              ))}
           </div>
           <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-6">System Health</h3>
           <div className="space-y-6">
              <div>
                 <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-600">Active Schools vs Inactive</span>
                    <span className="text-emerald-600">85%</span>
                 </div>
                 <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[85%] rounded-full"></div>
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-600">Server Capacity</span>
                    <span className="text-blue-600">42%</span>
                 </div>
                 <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[42%] rounded-full"></div>
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-600">Database Load</span>
                    <span className="text-amber-600">28%</span>
                 </div>
                 <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[28%] rounded-full"></div>
                 </div>
              </div>
           </div>
           
           <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Latest System Alert</h4>
              <p className="text-xs text-gray-500">Scheduled maintenance for database optimization on Sunday at 2:00 AM UTC.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
