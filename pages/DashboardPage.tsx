
import React, { useState, useMemo } from 'react';
import { 
  School, LogOut, BarChart3, BookOpen, GraduationCap, 
  Calendar, Settings, Users, CreditCard, LayoutDashboard, 
  Building2, Layers, Bot, Search, Plus, Menu 
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ManageTeachers } from '../components/dashboard/ManageTeachers';
import { ManageStudents } from '../components/dashboard/ManageStudents';
import { ManageClasses } from '../components/dashboard/ManageClasses';
import { MarksEntry } from '../components/dashboard/MarksEntry';
import { SchoolSettings } from '../components/dashboard/SchoolSettings';
import { PlatformOverview } from '../components/dashboard/PlatformOverview';
import { SchoolsManagement } from '../components/dashboard/SchoolsManagement';
import { db } from '../services/db';
import { formatCurrency } from '../utils/formatters';
import { User } from '../types';
import { cn } from '../utils/cn';

export const DashboardPage = ({ user, setUser, setView }: { user: User, setUser: any, setView: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const stats = useMemo(() => {
    const s = db.getStudents(user.school_id).length;
    const t = db.getUsers(user.school_id, 'teacher').length;
    const c = db.getClasses(user.school_id).length;
    return { students: s, teachers: t, classes: c };
  }, [user]);

  const menu = useMemo(() => {
    if(user.role === 'platform_admin') return [
      { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
      { id: 'schools', icon: Building2, label: 'Schools' },
      { id: 'pricing', icon: Layers, label: 'Plans' },
      { id: 'users', icon: Users, label: 'Global Users' }
    ];
    if(user.role === 'school_admin') return [
      { id: 'overview', icon: BarChart3, label: 'Overview' },
      { id: 'teachers', icon: BookOpen, label: 'Teachers' },
      { id: 'students', icon: GraduationCap, label: 'Students' },
      { id: 'classes', icon: Calendar, label: 'Classes' },
      { id: 'settings', icon: Settings, label: 'Settings' }
    ];
    if(user.role === 'teacher') return [
      { id: 'overview', icon: BarChart3, label: 'Overview' },
      { id: 'marks', icon: BookOpen, label: 'Input Marks' },
      { id: 'students', icon: GraduationCap, label: 'My Students' }
    ];
    return [{ id: 'overview', icon: BarChart3, label: 'Overview' }];
  }, [user.role]);

  const renderContent = () => {
    // Platform Admin Logic
    if (user.role === 'platform_admin') {
      if (activeTab === 'overview') return <PlatformOverview />;
      if (activeTab === 'schools') return <SchoolsManagement />;
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400 bg-white rounded-3xl border border-dashed">
          <Bot size={64} className="mb-4 opacity-10" />
          <p className="font-bold uppercase tracking-widest text-xs">Section Initializing...</p>
        </div>
      );
    }

    // School/Teacher Shared Logic
    if (activeTab === 'teachers') return <ManageTeachers user={user} />;
    if (activeTab === 'students') return <ManageStudents user={user} />;
    if (activeTab === 'classes') return <ManageClasses user={user} />;
    if (activeTab === 'marks') return <MarksEntry user={user} />;
    if (activeTab === 'settings') return <SchoolSettings user={user} />;
    
    // Default Overview
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Total Students" value={stats.students} icon={Users} />
          <Card title="Total Teachers" value={stats.teachers} icon={BookOpen} color="bg-purple-50 text-purple-600" />
          <Card title="Est. Revenue" value={formatCurrency(stats.students * 50000)} icon={CreditCard} color="bg-green-50 text-green-600" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-gray-900 leading-none">Recent Notifications</h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl h-fit"><Calendar size={20}/></div>
                <div>
                  <p className="font-bold text-sm text-gray-900 leading-tight">End of Term Approaching</p>
                  <p className="text-xs text-gray-500 mt-1 leading-normal">Please ensure all marks are entered by Friday.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-gray-900 leading-none">System Activity</h3>
            <div className="flex flex-col items-center justify-center h-40 text-gray-300">
               <Bot size={48} className="mb-4 opacity-20" />
               <p className="text-xs font-bold uppercase tracking-widest">Everything is optimized</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className={cn("bg-gray-900 text-gray-300 flex flex-col fixed h-full z-30 transition-all duration-300", isSidebarCollapsed ? "w-20" : "w-72")}>
        <div className="p-8 text-white font-black text-2xl flex items-center gap-4 border-b border-gray-800">
          <div className="bg-brand-600 p-2 rounded-2xl shadow-lg shadow-brand-900/50"><School size={28}/></div>
          {!isSidebarCollapsed && <span className="truncate tracking-tighter uppercase font-black text-lg">SSF FLOW</span>}
        </div>
        
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menu.map(m => (
            <button key={m.id} onClick={() => setActiveTab(m.id)} className={cn(
              "w-full text-left px-4 py-4 rounded-2xl flex items-center gap-4 transition-all group relative", 
              activeTab === m.id ? "bg-brand-600 text-white shadow-xl shadow-brand-900/50" : "hover:bg-gray-800 text-gray-400"
            )}>
              <m.icon size={22} className={cn(activeTab === m.id ? "text-white" : "group-hover:text-white")} />
              {!isSidebarCollapsed && <span className="font-bold text-sm uppercase tracking-widest truncate leading-none">{m.label}</span>}
              {activeTab === m.id && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-gray-800">
           {!isSidebarCollapsed && (
             <div className="flex items-center gap-4 px-2 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center font-black text-lg text-white">{user.full_name[0]}</div>
               <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate uppercase leading-none mb-1">{user.full_name}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none">{user.role.replace('_',' ')}</p>
               </div>
             </div>
           )}
           <button onClick={() => { setUser(null); setView('landing'); }} className={cn(
             "w-full flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl hover:bg-red-600 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest", 
             isSidebarCollapsed ? "justify-center" : "px-5"
           )}>
             <LogOut size={20} />
             {!isSidebarCollapsed && <span>Sign Out</span>}
           </button>
        </div>
      </aside>

      <main className={cn("flex-1 transition-all duration-300", isSidebarCollapsed ? "ml-20" : "ml-72")}>
        <header className="bg-white border-b p-6 flex justify-between items-center sticky top-0 z-20 h-24">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-3 bg-gray-50 border rounded-2xl text-gray-500 hover:bg-white transition-all">
               <Menu size={22} />
            </button>
            <h2 className="text-xl font-black text-gray-900 tracking-tighter capitalize leading-none">{activeTab.replace('_', ' ')}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
               <Search size={20} className="text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-brand-600 transition-colors" />
               <input className="pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm w-64 focus:ring-4 focus:ring-brand-100 transition-all outline-none font-medium" placeholder="Search data..." />
            </div>
            <button className="p-3 bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white rounded-2xl transition-all shadow-sm">
               <Plus size={24}/>
            </button>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
