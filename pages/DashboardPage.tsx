
import React, { useState, useMemo, useEffect } from 'react';
import { 
  School, LogOut, BarChart3, BookOpen, GraduationCap, 
  Calendar, Settings, Users, CreditCard, LayoutDashboard, 
  Building2, Layers, Bot, Search, Plus, Menu, 
  ChevronDown, Bell, ShieldCheck, ClipboardCheck, 
  FileText, Megaphone, UserCircle, Activity, Lock, Clock, X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Overview } from '../components/dashboard/Overview';
import { AdminModule } from '../components/dashboard/AdminModule';
import { AcademicModule } from '../components/dashboard/AcademicModule';
import { CommunicationModule } from '../components/dashboard/CommunicationModule';
import { PlatformOverview } from '../components/dashboard/PlatformOverview';
import { SchoolsManagement } from '../components/dashboard/SchoolsManagement';
import { Analytics } from '../components/dashboard/Analytics';
import { 
  PlatformUsers, PlatformBilling, PlatformAuditLogs, 
  PlatformSecurity, PlatformAnnouncements 
} from '../components/dashboard/PlatformModules';
import { db } from '../services/db';
import { User, SchoolData } from '../types';
import { cn } from '../utils/cn';

// Helper component for live clock
const ProfessionalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-gray-700 shadow-sm hidden md:flex">
      <Clock size={16} className="text-gray-400" />
      <div className="flex flex-col items-end leading-none">
        <span className="text-sm font-black tracking-widest tabular-nums">
           {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <span className="text-[10px] font-bold uppercase text-gray-400">
           {time.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

export const DashboardPage = ({ user, setUser, setView }: { user: User, setUser: any, setView: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [school, setSchool] = useState<SchoolData | null>(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    if (user.school_id) {
        db.getSchool(user.school_id).then(setSchool);
    }
  }, [user.school_id]);

  // Determine Brand Color
  const brandColor = school?.theme_color || '#2563eb'; // Default to blue-600

  const handleLogoutClick = () => {
    setLogoutConfirmOpen(true);
    setProfileOpen(false); // Close profile dropdown if open
  };

  const handleLogoutConfirm = async () => {
    await db.logout();
    setUser(null);
    setView('landing');
    setLogoutConfirmOpen(false);
  };

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
    // Analytics for both roles
    if (activeTab === 'analytics') return <Analytics role={user.role} />;
    
    // Platform Admin Content Routing
    if (user.role === 'platform_admin') {
      if (activeTab === 'overview') return <PlatformOverview />;
      if (activeTab === 'schools') return <SchoolsManagement />;
      if (activeTab === 'users') return <PlatformUsers />;
      if (activeTab === 'plans') return <PlatformBilling />;
      if (activeTab === 'audit') return <PlatformAuditLogs />;
      if (activeTab === 'announcements') return <PlatformAnnouncements user={user} />;
      if (activeTab === 'security') return <PlatformSecurity />;
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

  const MobileSidebarOverlay = () => {
    if (isSidebarCollapsed) return null; // In this logic, collapsed means closed on mobile
    return (
      <div className="fixed inset-0 z-50 md:hidden flex">
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarCollapsed(true)} />
         <div className="relative w-64 h-full bg-[#0f172a] shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            {/* Mobile Sidebar Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-800">
               <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: brandColor }}>
                     <School size={20} className="text-white"/>
                  </div>
                  <span className="font-bold text-white tracking-tight">Menu</span>
               </div>
               <button onClick={() => setIsSidebarCollapsed(true)} className="text-slate-400 p-1"><X size={20}/></button>
            </div>
            {/* Mobile Menu Items */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
               {menu.map((m, idx) => {
                  if (m.section) return <div key={idx} className="px-4 mt-6 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-600">{m.section}</div>;
                  return (
                     <button 
                        key={m.id} 
                        onClick={() => { setActiveTab(m.id!); setIsSidebarCollapsed(true); }}
                        className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all", activeTab === m.id ? "text-white" : "text-slate-400")}
                        style={activeTab === m.id ? { backgroundColor: brandColor } : {}}
                     >
                        <m.icon size={18} />
                        <span className="font-bold text-sm">{m.label}</span>
                     </button>
                  );
               })}
            </div>
             <div className="p-4 border-t border-slate-800 bg-slate-900/50 shrink-0 mt-auto">
               <button 
                 onClick={handleLogoutClick} 
                 className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-xs font-bold uppercase tracking-widest text-slate-400 justify-center"
               >
                 <LogOut size={18} />
                 <span>Logout</span>
               </button>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f3f4f6]">
      {/* MOBILE OVERLAY SIDEBAR */}
      <MobileSidebarOverlay />

      {/* DESKTOP SIDEBAR (Hidden on mobile by default) */}
      <aside 
        className={cn(
          "hidden md:flex flex-col transition-all duration-300 shadow-2xl shrink-0 overflow-hidden text-slate-300 sticky top-0 h-screen",
          isSidebarCollapsed ? "w-20" : "w-72" 
        )}
        style={{ backgroundColor: '#0f172a' }}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 h-24 shrink-0">
          <div 
             className="p-2.5 rounded-xl shadow-lg shrink-0 transition-colors"
             style={{ backgroundColor: brandColor }}
          >
             {school?.logo ? (
                <img src={school.logo} alt="Logo" className="w-6 h-6 object-contain" />
             ) : (
                <School size={24} className="text-white"/>
             )}
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
               <h1 className="font-black text-white text-lg tracking-tight leading-none truncate" title={school?.name || 'SMART FLOW'}>
                 {school?.name || 'SMART FLOW'}
               </h1>
               <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">
                 {school?.plan || 'Enterprise'}
               </p>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {menu.map((m, idx) => {
            if (m.section) {
               return !isSidebarCollapsed ? (
                 <div key={idx} className="px-4 mt-6 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                    {m.section}
                 </div>
               ) : <div key={idx} className="h-4"></div>;
            }
            return (
              <button 
                key={m.id} 
                onClick={() => setActiveTab(m.id!)} 
                className={cn("w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative")}
                style={activeTab === m.id ? { backgroundColor: brandColor, color: 'white' } : {}}
                title={isSidebarCollapsed ? m.label : ''}
              >
                <m.icon 
                   size={20} 
                   className={cn("shrink-0 transition-colors", activeTab === m.id ? "text-white" : "text-slate-500 group-hover:text-white")} 
                />
                <span className={cn("font-bold text-xs tracking-wide truncate", isSidebarCollapsed ? "hidden" : "block", activeTab === m.id ? "text-white" : "text-slate-400 group-hover:text-white")}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 shrink-0">
           <button 
             onClick={handleLogoutClick} 
             className={cn("w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-xs font-bold uppercase tracking-widest text-slate-400", isSidebarCollapsed ? "justify-center" : "px-4")}
           >
             <LogOut size={18} />
             <span className={cn(isSidebarCollapsed ? "hidden" : "block")}>Logout</span>
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-gray-200 h-20 px-4 md:px-8 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-4">
              <button 
                // On mobile this opens the overlay (sets collapsed to false). On desktop it toggles width.
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
              <div className="md:hidden font-bold text-gray-900 text-lg truncate max-w-[200px]">
                {school?.name || 'Smart Flow'}
              </div>
           </div>

           <div className="flex items-center gap-6">
              <ProfessionalClock />
              <button className="relative p-2.5 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
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
                    <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black shadow-md border-2 border-white overflow-hidden"
                        style={{ backgroundColor: brandColor }}
                    >
                       {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.full_name[0]}
                    </div>
                    <ChevronDown size={14} className="text-gray-400 mr-1" />
                 </button>

                 {profileOpen && (
                   <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Signed in as</p>
                         <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      </div>
                      <button onClick={() => { setActiveTab('settings'); setProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2"><UserCircle size={16}/> Profile</button>
                      <button onClick={() => { setActiveTab('settings'); setProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2"><Settings size={16}/> Settings</button>
                      <div className="h-px bg-gray-50 my-1"></div>
                      <button onClick={handleLogoutClick} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"><LogOut size={16}/> Sign Out</button>
                   </div>
                 )}
              </div>
           </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6 md:p-10 w-full overflow-y-auto flex-1 bg-[#f3f4f6]">
           {renderContent()}
        </main>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 border-2 border-gray-100 relative">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="text-red-500" size={32} />
                </div>
                <h3 className="text-xl font-black text-center text-gray-900 mb-2">Sign Out</h3>
                <p className="text-center text-gray-500 text-sm mb-8">
                  Are you sure you want to log out? You will need to sign in again to access your account.
                </p>
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1 border-gray-300" onClick={() => setLogoutConfirmOpen(false)}>Cancel</Button>
                  <Button variant="danger" className="flex-1 shadow-red-200 shadow-lg" onClick={handleLogoutConfirm}>Log Out</Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
