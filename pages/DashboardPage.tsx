
import React, { useState, useMemo, useEffect } from 'react';
import { 
  School, LogOut, BarChart3, BookOpen, GraduationCap, 
  Calendar, Settings, Users, CreditCard, LayoutDashboard, 
  Building2, Layers, Bot, Search, Plus, Menu, 
  ChevronDown, Bell, ShieldCheck, ClipboardCheck, 
  FileText, Megaphone, UserCircle, Activity, Lock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Overview } from '../components/dashboard/Overview';
import { AdminModule } from '../components/dashboard/AdminModule';
import { AcademicModule } from '../components/dashboard/AcademicModule';
import { CommunicationModule } from '../components/dashboard/CommunicationModule';
import { PlatformOverview } from '../components/dashboard/PlatformOverview';
import { SchoolsManagement } from '../components/dashboard/SchoolsManagement';
import { db } from '../services/db';
import { User, SchoolData } from '../types';
import { cn } from '../utils/cn';

export const DashboardPage = ({ user, setUser, setView }: { user: User, setUser: any, setView: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [school, setSchool] = useState<SchoolData | null>(null);

  useEffect(() => {
    if (user.school_id) {
        db.getSchool(user.school_id).then(setSchool);
    }
  }, [user.school_id]);

  const menu = useMemo(() => {
    // Professional Platform Admin Menu
    if(user.role === 'platform_admin') return [
      { section: 'Platform' },
      { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'schools', icon: Building2, label: 'Schools Management' },
      { id: 'users', icon: Users, label: 'Platform Users' },
      { id: 'plans', icon: CreditCard, label: 'Plans & Billing' },
      
      { section: 'Insights' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics & Reports' },
      { id: 'audit', icon: Activity, label: 'Audit Logs' },
      
      { section: 'System' },
      { id: 'announcements', icon: Megaphone, label: 'Announcements' },
      { id: 'security', icon: Lock, label: 'Security & Settings' },
    ];

    // Enterprise School Admin Menu
    if(user.role === 'school_admin') return [
      { section: 'Main' },
      { id: 'overview', icon: LayoutDashboard, label: 'Dashboard Overview' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics & Reports' },
      { section: 'Management' },
      { id: 'school_mgmt', icon: School, label: 'School Management' }, // Alias for Settings in this implementation
      { id: 'users', icon: Users, label: 'User Management' },
      { section: 'Academic' },
      { id: 'academics', icon: BookOpen, label: 'Academics' },
      { id: 'assessments', icon: ClipboardCheck, label: 'Assessments & Results' },
      { id: 'attendance', icon: Calendar, label: 'Attendance' },
      { id: 'materials', icon: FileText, label: 'Learning Materials' },
      { section: 'General' },
      { id: 'communication', icon: Megaphone, label: 'Communication' },
      { id: 'billing', icon: CreditCard, label: 'Billing & Sub' },
      { id: 'settings', icon: Settings, label: 'Settings' },
      { id: 'security', icon: ShieldCheck, label: 'Security' },
    ];

    // Teacher Limited Menu
    return [
      { id: 'overview', icon: BarChart3, label: 'Overview' },
      { id: 'assessments', icon: BookOpen, label: 'Marks Entry' },
      { id: 'attendance', icon: Calendar, label: 'Attendance' },
      { id: 'materials', icon: FileText, label: 'Materials' },
    ];
  }, [user.role]);

  const renderContent = () => {
    // Platform Admin Content Routing
    if (user.role === 'platform_admin') {
      if (activeTab === 'overview') return <PlatformOverview />;
      if (activeTab === 'schools') return <SchoolsManagement />;
      
      // Placeholders for other platform modules to demonstrate sidebar connectivity
      if (activeTab === 'analytics') return (
         <div className="p-12 text-center">
            <BarChart3 size={64} className="mx-auto text-brand-200 mb-6" />
            <h3 className="text-xl font-bold text-gray-900">Advanced Analytics</h3>
            <p className="text-gray-500">System-wide performance metrics and growth charts.</p>
         </div>
      );
      if (activeTab === 'audit') return (
         <div className="p-12 text-center">
            <Activity size={64} className="mx-auto text-brand-200 mb-6" />
            <h3 className="text-xl font-bold text-gray-900">System Audit Logs</h3>
            <p className="text-gray-500">Track all admin actions for security and compliance.</p>
         </div>
      );

      return <div className="p-20 text-center text-gray-400">Module {activeTab} is under development.</div>;
    }

    // School Admin & Teacher Content Routing
    switch (activeTab) {
      case 'overview': return <Overview user={user} />;
      
      // Admin Module Routes
      case 'users': return <AdminModule user={user} section="users" />;
      case 'school_mgmt':
      case 'settings': return <AdminModule user={user} section="settings" />;
      case 'billing': return <AdminModule user={user} section="billing" />;
      case 'security': return <AdminModule user={user} section="security" />;

      // Academic Module Routes
      case 'academics': return <AcademicModule user={user} section="academics" />;
      case 'assessments': return <AcademicModule user={user} section="assessments" />;
      case 'attendance': return <AcademicModule user={user} section="attendance" />;

      // Communication Module Routes
      case 'materials': return <CommunicationModule user={user} section="materials" />;
      case 'communication': return <CommunicationModule user={user} section="communication" />;

      default: return <Overview user={user} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f3f4f6]">
      {/* LEFT SIDEBAR */}
      <aside className={cn(
        "bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 shadow-2xl shrink-0 overflow-hidden",
        "md:sticky md:top-0 md:h-screen", // Sticky only on desktop
        isSidebarCollapsed ? "w-0 md:w-20" : "w-full md:w-72" // Full width on mobile when open, controlled by layout
      )}>
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 h-24 shrink-0">
          <div className="bg-brand-600 p-2.5 rounded-xl shadow-lg shadow-brand-900/50 shrink-0">
             <School size={24} className="text-white"/>
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0 hidden md:block">
               <h1 className="font-black text-white text-lg tracking-tight leading-none truncate">SMART FLOW</h1>
               <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">Enterprise</p>
            </div>
          )}
          {/* Mobile Text */}
          <div className="min-w-0 md:hidden">
             <h1 className="font-black text-white text-lg tracking-tight leading-none truncate">SMART FLOW</h1>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {menu.map((m, idx) => {
            if (m.section) {
               return !isSidebarCollapsed ? (
                 <div key={idx} className="px-4 mt-6 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hidden md:block">
                    {m.section}
                 </div>
               ) : <div key={idx} className="h-4"></div>;
            }
            return (
              <button 
                key={m.id} 
                onClick={() => { setActiveTab(m.id!); if(window.innerWidth < 768) setIsSidebarCollapsed(true); }} 
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative", 
                  activeTab === m.id 
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-900/20" 
                    : "hover:bg-slate-800 text-slate-400 hover:text-white"
                )}
                title={isSidebarCollapsed ? m.label : ''}
              >
                <m.icon size={20} className={cn("shrink-0 transition-colors", activeTab === m.id ? "text-white" : "group-hover:text-white")} />
                <span className={cn("font-bold text-xs tracking-wide truncate", isSidebarCollapsed ? "hidden" : "block")}>
                  {m.label}
                </span>
                {activeTab === m.id && !isSidebarCollapsed && (
                   <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] md:block hidden" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 shrink-0">
           <button 
             onClick={() => { setUser(null); setView('landing'); }} 
             className={cn(
               "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-xs font-bold uppercase tracking-widest text-slate-400", 
               isSidebarCollapsed ? "justify-center" : "px-4"
             )}
           >
             <LogOut size={18} />
             <span className={cn(isSidebarCollapsed ? "hidden" : "block")}>Logout</span>
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-gray-200 h-20 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-sm/50 backdrop-blur-sm bg-white/90">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                className="p-2.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                 <Menu size={22} />
              </button>
              <div className="hidden md:flex flex-col">
                 <h2 className="text-xl font-black text-gray-900 leading-none tracking-tight">
                    {activeTab === 'overview' ? `Welcome back, ${user.full_name.split(' ')[0]}` : menu.find(m => m.id === activeTab)?.label}
                 </h2>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {school ? school.name : 'Platform Administration'}
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2.5 border border-gray-100 focus-within:ring-2 focus-within:ring-brand-100 focus-within:border-brand-300 transition-all w-64">
                 <Search size={16} className="text-gray-400 mr-3" />
                 <input className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-gray-400" placeholder="Search..." />
              </div>

              <button className="relative p-2.5 rounded-full hover:bg-gray-50 text-gray-400 hover:text-brand-600 transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="relative">
                 <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                 >
                    <div className="text-right hidden md:block">
                       <div className="text-sm font-bold text-gray-900 leading-none">{user.full_name}</div>
                       <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">{user.role.replace('_', ' ')}</div>
                    </div>
                    <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center text-white font-black shadow-md border-2 border-white">
                       {user.full_name[0]}
                    </div>
                    <ChevronDown size={14} className="text-gray-400 mr-1" />
                 </button>

                 {/* Dropdown */}
                 {profileOpen && (
                   <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Signed in as</p>
                         <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      </div>
                      <button onClick={() => { setActiveTab('settings'); setProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-brand-600 flex items-center gap-2"><UserCircle size={16}/> Profile</button>
                      <button onClick={() => { setActiveTab('settings'); setProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-brand-600 flex items-center gap-2"><Settings size={16}/> Settings</button>
                      <div className="h-px bg-gray-50 my-1"></div>
                      <button onClick={() => { setUser(null); setView('landing'); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"><LogOut size={16}/> Sign Out</button>
                   </div>
                 )}
              </div>
           </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6 md:p-10 w-full overflow-auto flex-1 h-[calc(100vh-5rem)]">
           {renderContent()}
        </main>
      </div>
    </div>
  );
};
