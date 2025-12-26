
import React from 'react';
import { Users, GraduationCap, School, TrendingUp, Calendar, AlertCircle, Award } from 'lucide-react';
import { Card } from '../ui/Card';
import { db } from '../../services/db';
import { User } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const Overview = ({ user }: { user: User }) => {
  const students = db.getStudents(user.school_id);
  const teachers = db.getUsers(user.school_id, 'teacher');
  const classes = db.getClasses(user.school_id);
  const parents = db.getParents(user.school_id);

  // Mock calculation
  const revenueEst = students.length * 50000; 

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Students" value={students.length} icon={GraduationCap} color="bg-blue-50 text-blue-600" />
        <Card title="Teachers" value={teachers.length} icon={School} color="bg-indigo-50 text-indigo-600" />
        <Card title="Parents" value={parents.length} icon={Users} color="bg-purple-50 text-purple-600" />
        <Card title="Active Classes" value={classes.length} icon={Award} color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-900">Attendance Trends</h3>
            <select className="bg-gray-50 border-none text-xs font-bold uppercase tracking-widest text-gray-500 rounded-lg p-2 outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between px-4 gap-4">
             {[65, 80, 75, 90, 85, 95, 88].map((h, i) => (
               <div key={i} className="w-full bg-brand-50 rounded-t-xl relative group hover:bg-brand-100 transition-colors">
                 <div 
                    className="absolute bottom-0 left-0 right-0 bg-brand-600 rounded-t-xl transition-all duration-1000" 
                    style={{ height: `${h}%` }}
                 >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded font-bold">
                        {h}%
                    </div>
                 </div>
               </div>
             ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Right Side Stats */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Stats</h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><AlertCircle size={18}/></div>
                       <span className="text-sm font-bold text-gray-600">Absent Today</span>
                    </div>
                    <span className="text-lg font-black text-gray-900">12</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={18}/></div>
                       <span className="text-sm font-bold text-gray-600">Avg. Performance</span>
                    </div>
                    <span className="text-lg font-black text-gray-900">76%</span>
                 </div>
              </div>
           </div>

           <div className="bg-brand-600 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-lg font-bold mb-2">School Balance</h3>
                 <p className="text-3xl font-black tracking-tight">{formatCurrency(revenueEst)}</p>
                 <p className="text-brand-200 text-xs font-medium mt-4">Estimated revenue based on enrollment</p>
              </div>
              <div className="absolute -right-6 -bottom-6 text-brand-500 opacity-50">
                 <Award size={120} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
