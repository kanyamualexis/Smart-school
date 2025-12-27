
import React from 'react';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

export const Analytics = ({ role }: { role: string }) => {
  // Mock data for visualization
  const attendanceData = [85, 92, 88, 95, 90];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
  const performanceData = [65, 72, 68, 80, 75, 85, 82, 90, 88, 70];
  const subjects = ['Math', 'Eng', 'Sci', 'Hist', 'Geo', 'Phys', 'Chem', 'Bio', 'Art', 'PE'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-500 font-medium">Detailed insights into {role === 'platform_admin' ? 'platform' : 'school'} performance</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border shadow-sm text-sm font-bold text-gray-600">
           Last 30 Days
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-gray-500 font-bold text-xs uppercase tracking-widest">
               <TrendingUp size={16} className="text-brand-600" /> Total Growth
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">+12.5%</div>
            <div className="text-xs text-green-600 font-bold bg-green-50 inline-block px-2 py-1 rounded">Vs last month</div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-gray-500 font-bold text-xs uppercase tracking-widest">
               <Activity size={16} className="text-purple-600" /> Engagement
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">94%</div>
            <div className="text-xs text-gray-400 font-bold">Daily active users</div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-gray-500 font-bold text-xs uppercase tracking-widest">
               <Users size={16} className="text-blue-600" /> Retention
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">98.2%</div>
            <div className="text-xs text-gray-400 font-bold">Student consistency</div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-gray-500 font-bold text-xs uppercase tracking-widest">
               <BarChart3 size={16} className="text-orange-600" /> Performance
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">B+ (78%)</div>
            <div className="text-xs text-gray-400 font-bold">Average grade</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-8">Weekly Attendance Overview</h3>
           <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-gray-100 pb-4">
              {attendanceData.map((val, i) => (
                 <div key={i} className="w-full flex flex-col justify-end group cursor-pointer">
                    <div className="w-full bg-brand-100 rounded-t-xl relative overflow-hidden h-full">
                       <div className="absolute bottom-0 w-full bg-brand-600 transition-all duration-700 group-hover:bg-brand-500" style={{ height: `${val}%` }}></div>
                    </div>
                    <div className="text-center mt-3 text-xs font-bold text-gray-400 uppercase">{days[i]}</div>
                 </div>
              ))}
           </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-8">Subject Performance Analysis</h3>
           <div className="h-64 flex items-end justify-between gap-2 px-2 border-b border-gray-100 pb-4 overflow-x-auto">
              {performanceData.map((val, i) => (
                 <div key={i} className="min-w-[30px] flex flex-col justify-end group cursor-pointer flex-1">
                    <div className="w-full bg-purple-100 rounded-t-lg relative overflow-hidden h-full">
                       <div className="absolute bottom-0 w-full bg-purple-500 transition-all duration-700 group-hover:bg-purple-400" style={{ height: `${val}%` }}></div>
                    </div>
                    <div className="text-center mt-3 text-[10px] font-bold text-gray-400 uppercase truncate">{subjects[i]}</div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
