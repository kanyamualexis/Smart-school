
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { 
  School, Users, BookOpen, GraduationCap, 
  BarChart3, Settings, LogOut, Search, 
  Plus, Download, CheckCircle, XCircle,
  Menu, X, ChevronRight, ChevronLeft, Bot, FileText,
  CreditCard, Star, Phone, Mail, MessageCircle,
  Calendar, Trash2, Edit, Save, UserPlus,
  Loader2, Check, Play, Clock, Globe, ArrowLeft
} from "lucide-react";

/**
 * ============================================================================
 * 1. UTILITIES & CONFIG
 * ============================================================================
 */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(amount).replace('RWF', 'FRw');
};

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

/**
 * ============================================================================
 * 2. TYPES & MOCK DATABASE
 * ============================================================================
 */

type Role = 'platform_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';

interface SchoolData {
  id: string;
  name: string;
  district: string;
  plan: 'starter' | 'professional' | 'enterprise';
  has_nursery: boolean;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  school_id: string;
  password?: string;
}

interface Student {
  id: string;
  full_name: string;
  index_number: string;
  class_grade: string; // e.g., "Nursery 1", "P1", "S3"
  school_id: string;
}

interface Mark {
  id: string;
  student_id: string;
  subject: string;
  score: number;
  term: string;
  school_id: string;
}

// --- MOCK DATA STORE ---
class MockDB {
  private get<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private set<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- SEED DATA (Runs once) ---
  init() {
    if (!localStorage.getItem('schools')) {
      const sch1 = 'school-1'; // Springfield
      const sch2 = 'school-2'; // Riverside

      this.set<SchoolData>('schools', [
        { id: sch1, name: 'Springfield High School', district: 'Kigali', plan: 'professional', has_nursery: true },
        { id: sch2, name: 'Riverside Academy', district: 'Musanze', plan: 'starter', has_nursery: false }
      ]);
      
      this.set<User>('users', [
        // Platform Admin
        { id: 'u_p_admin', email: 'admin@schoolflow.com', full_name: 'Super Admin', role: 'platform_admin', school_id: '', password: 'admin123' },
        // Springfield Staff
        { id: 'u_head', email: 'headteacher@springfield.edu', full_name: 'Principal Skinner', role: 'school_admin', school_id: sch1, password: 'head123' },
        { id: 'u_teach', email: 'teacher@springfield.edu', full_name: 'Edna Krabappel', role: 'teacher', school_id: sch1, password: 'teacher123' },
        { id: 'u_stud', email: 'student@springfield.edu', full_name: 'Bart Simpson', role: 'student', school_id: sch1, password: 'student123' },
      ]);

      this.set<Student>('students', [
        // Springfield (Has Nursery)
        { id: 'st_1', full_name: 'Bart Simpson', index_number: '2024/001', class_grade: 'P4', school_id: sch1 },
        { id: 'st_2', full_name: 'Maggie Simpson', index_number: 'NURSERY/001', class_grade: 'Nursery 1', school_id: sch1 },
        // Riverside
        { id: 'st_3', full_name: 'Harry Potter', index_number: '2024/001', class_grade: 'S1', school_id: sch2 },
      ]);

      this.set<Mark>('marks', [
        // Bart (Primary)
        { id: 'm_1', student_id: 'st_1', subject: 'Mathematics', score: 45, term: 'Term 1', school_id: sch1 },
        { id: 'm_2', student_id: 'st_1', subject: 'English', score: 55, term: 'Term 1', school_id: sch1 },
        // Maggie (Nursery)
        { id: 'm_3', student_id: 'st_2', subject: 'Social Skills', score: 95, term: 'Term 1', school_id: sch1 },
        { id: 'm_4', student_id: 'st_2', subject: 'Creative Arts', score: 88, term: 'Term 1', school_id: sch1 },
      ]);
    }
  }

  // --- AUTH ---
  login(email: string, pass: string): User | null {
    const users = this.get<User>('users');
    return users.find(u => u.email === email && u.password === pass) || null;
  }

  registerSchool(data: { name: string, district: string, plan: any, email: string, pass: string, hasNursery: boolean, adminName?: string }): User {
    const schools = this.get<SchoolData>('schools');
    const users = this.get<User>('users');
    
    const sid = `sch_${Date.now()}`;
    const newSchool: SchoolData = { 
      id: sid, 
      name: data.name, 
      district: data.district, 
      plan: data.plan, 
      has_nursery: data.hasNursery 
    };
    
    const newAdmin: User = {
      id: `u_${Date.now()}`,
      email: data.email,
      full_name: data.adminName || 'School Admin',
      role: 'school_admin',
      school_id: sid,
      password: data.pass
    };

    this.set('schools', [...schools, newSchool]);
    this.set('users', [...users, newAdmin]);
    return newAdmin;
  }

  // --- DATA ACCESS ---
  getSchools() { return this.get<SchoolData>('schools'); }
  
  getSchool(id: string) { return this.get<SchoolData>('schools').find(s => s.id === id); }
  
  updateSchool(id: string, updates: Partial<SchoolData>) {
    const schools = this.get<SchoolData>('schools');
    const idx = schools.findIndex(s => s.id === id);
    if (idx !== -1) {
      schools[idx] = { ...schools[idx], ...updates };
      this.set('schools', schools);
    }
  }

  getUsers(schoolId: string, role?: Role) {
    let u = this.get<User>('users').filter(u => u.school_id === schoolId);
    if (role) u = u.filter(user => user.role === role);
    return u;
  }
  
  addUser(u: User) { this.set('users', [...this.get('users'), u]); }
  
  deleteUser(id: string) { 
    this.set('users', this.get<User>('users').filter(u => u.id !== id)); 
  }

  getStudents(schoolId: string) { return this.get<Student>('students').filter(s => s.school_id === schoolId); }
  
  addStudent(s: Student) { this.set('students', [...this.get('students'), s]); }

  getMarks(schoolId: string, studentId?: string) {
    let marks = this.get<Mark>('marks').filter(m => m.school_id === schoolId);
    if (studentId) marks = marks.filter(m => m.student_id === studentId);
    return marks;
  }

  checkResult(schoolId: string, indexNumber: string) {
    const student = this.get<Student>('students').find(s => s.school_id === schoolId && s.index_number === indexNumber);
    if (!student) return null;
    const school = this.get<SchoolData>('schools').find(s => s.id === schoolId);
    const marks = this.get<Mark>('marks').filter(m => m.student_id === student.id);
    return { student, school, marks };
  }
}

const db = new MockDB();
db.init();

/**
 * ============================================================================
 * 3. UI COMPONENTS
 * ============================================================================
 */

// Improved Button Component
const Button = React.forwardRef<HTMLButtonElement, any>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants: any = {
      primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-md',
      secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-gray-500',
      outline: 'border-2 border-brand-600 bg-transparent hover:bg-brand-50 focus:ring-brand-500 text-brand-700',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizes: any = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none gap-2',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

const Input = ({ label, ...props }: any) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 placeholder:text-gray-400 transition-all" {...props} />
  </div>
);

const Card = ({ title, value, icon: Icon, subtext, color = "bg-brand-50 text-brand-600" }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
      {Icon && <div className={`p-2 rounded-lg ${color}`}><Icon size={20} /></div>}
    </div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
    {subtext && <p className="text-sm text-gray-400 mt-2">{subtext}</p>}
  </div>
);

const Modal = ({ title, children, onClose }: any) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-lg">{title}</h3>
        <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
      </div>
      <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
    </div>
  </div>
);

/**
 * ============================================================================
 * 4. PUBLIC PAGES (Landing, Pricing, Testimonials)
 * ============================================================================
 */

const LandingPage = ({ setView }: any) => {
  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1577896336495-97e3355f65f3?auto=format&fit=crop&q=80&w=2000",
      title: "Digital Innovation",
      subtitle: "Embrace modern educational technology to streamline your school's potential."
    },
    {
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000",
      title: "Streamlined Management",
      subtitle: "Effortless administration for head teachers, staff, and parents."
    },
    {
      image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=2000",
      title: "Empower Learning",
      subtitle: "Tools that help teachers focus on what matters most: the students."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur z-50 border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto">
          <div className="font-bold text-2xl text-brand-600 flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <School className="fill-brand-600 text-white" /> SchoolFlow
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-600">
            <button onClick={() => setView('landing')} className="hover:text-brand-600 transition-colors">Home</button>
            <button onClick={() => setView('pricing')} className="hover:text-brand-600 transition-colors">Pricing</button>
            <button onClick={() => setView('testimonials')} className="hover:text-brand-600 transition-colors">Testimonials</button>
            <button onClick={() => setView('result_check')} className="hover:text-brand-600 transition-colors">Check Results</button>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <button className="text-gray-600 font-medium hover:text-brand-600 transition-colors" onClick={() => setView('login')}>Login</button>
            <Button onClick={() => setView('register')} className="shadow-lg shadow-brand-200">Get Started</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-600 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 flex flex-col gap-2 shadow-xl absolute w-full left-0 animate-in slide-in-from-top-5 z-50">
             <button onClick={() => { setView('landing'); setMobileMenuOpen(false); }} className="text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-medium text-gray-600">Home</button>
             <button onClick={() => { setView('pricing'); setMobileMenuOpen(false); }} className="text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-medium text-gray-600">Pricing</button>
             <button onClick={() => { setView('testimonials'); setMobileMenuOpen(false); }} className="text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-medium text-gray-600">Testimonials</button>
             <button onClick={() => { setView('result_check'); setMobileMenuOpen(false); }} className="text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-medium text-gray-600">Check Results</button>
             <div className="h-px bg-gray-100 my-2" />
             <button onClick={() => { setView('login'); setMobileMenuOpen(false); }} className="text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-medium text-gray-600">Login</button>
             <Button onClick={() => { setView('register'); setMobileMenuOpen(false); }} className="w-full mt-2">Get Started</Button>
          </div>
        )}
      </nav>

      {/* Hero Carousel */}
      <header className="relative h-[600px] overflow-hidden bg-gray-900 group">
        {slides.map((s, i) => (
          <div 
            key={i} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-brand-900/60 mix-blend-multiply z-10" />
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center z-20 text-center px-4">
              <div className="max-w-4xl animate-in fade-in zoom-in duration-700 slide-in-from-bottom-10">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">{s.title}</h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">{s.subtitle}</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setView('register')} size="lg" className="rounded-full px-8 bg-brand-600 hover:bg-brand-500 border-none">Start Free Trial</Button>
                  <Button variant="outline" onClick={() => setView('pricing')} size="lg" className="rounded-full px-8 text-white border-white hover:bg-white/10 hover:text-white">Learn More</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100">
          <ChevronLeft size={32} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100">
          <ChevronRight size={32} />
        </button>
        
        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)} 
              className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`} 
            />
          ))}
        </div>
      </header>

      {/* Floating CTA Strip */}
      <div className="relative z-20 -mt-16 px-4 mb-20">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Ready to Transform Your School?</h3>
            <p className="text-gray-500">Join thousands of schools already using SchoolFlow.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button onClick={() => setView('register')} className="flex-1 md:flex-none">Start Free Trial</Button>
            <Button variant="outline" onClick={() => setView('result_check')} className="flex-1 md:flex-none">Check Results</Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h5 className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-2">Features</h5>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to run your school</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Comprehensive tools designed for modern education management</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: CheckCircle, title: "Role-Based Access", text: "Dedicated dashboards for Admins, Teachers, Students, and Parents with secure access control.", color: "bg-blue-100 text-blue-600" },
            { icon: BookOpen, title: "Academic Management", text: "Manage classes, subjects, marks, and generate automated report cards effortlessly.", color: "bg-purple-100 text-purple-600" },
            { icon: Users, title: "Nursery to Secondary", text: "Complete support for nursery, primary, and secondary school levels with age-appropriate reporting.", color: "bg-pink-100 text-pink-600" },
            { icon: Clock, title: "Attendance Tracking", text: "Monitor daily attendance for staff and students with detailed monthly reports.", color: "bg-green-100 text-green-600" },
            { icon: BarChart3, title: "Performance Analytics", text: "Visual insights into student performance and class progression trends over time.", color: "bg-orange-100 text-orange-600" },
            { icon: Globe, title: "Cloud-Based Access", text: "Access your school data securely from anywhere, anytime, on any device.", color: "bg-indigo-100 text-indigo-600" }
          ].map((f, i) => (
            <div key={i} className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1 bg-white group">
              <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video / Tutorial Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-brand-700 rounded-full text-sm font-bold mb-6">
            <Play size={14} className="fill-current" /> Quick Demo
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">See How Easy Registration Is</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Watch our quick tutorial showing how schools can register and get started with SchoolFlow in minutes.</p>
          
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black group border-4 border-white">
            {!isPlaying ? (
              <button 
                onClick={() => setIsPlaying(true)} 
                className="w-full h-full relative block group cursor-pointer focus:outline-none"
                aria-label="Play video"
              >
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors z-10">
                  <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={40} className="text-white fill-white" />
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000" alt="Video Thumbnail" className="w-full h-full object-cover" />
              </button>
            ) : (
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&rel=0" 
                title="Registration Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            )}
          </div>
          
          <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border inline-flex items-center gap-6">
             <div className="text-left">
               <div className="font-bold text-gray-900">Ready to get started?</div>
               <div className="text-sm text-gray-500">Create your school account in less than 5 minutes</div>
             </div>
             <Button onClick={() => setView('register')}>Register Your School <ChevronRight size={16} /></Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h5 className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-2">Testimonials</h5>
          <h2 className="text-4xl font-bold text-gray-900">Loved by schools worldwide</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Sarah Johnson", role: "Principal, Springfield High", text: "SchoolFlow transformed our administrative processes. We saved countless hours and improved parent communication.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
            { name: "Michael Chen", role: "IT Director, Riverside Academy", text: "The implementation was smooth and the platform is intuitive. Our teachers adapted quickly and love the new system.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
            { name: "Emily Rodriguez", role: "Teacher, Oakwood School", text: "Managing attendance and grades has never been easier. The mobile app lets me update records instantly.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" }
          ].map((t, i) => (
            <div key={i} className="p-8 bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100">
               <div className="flex items-center gap-4 mb-6">
                 <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-100" />
                 <div>
                   <div className="font-bold text-gray-900">{t.name}</div>
                   <div className="text-xs text-brand-600 font-medium">{t.role}</div>
                 </div>
               </div>
              <p className="text-gray-600 italic leading-relaxed">"{t.text}"</p>
              <div className="flex text-yellow-400 mt-4 gap-1"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Teaser */}
      <PricingPage setView={setView} embedded={true} />

      {/* Help Section */}
      <section className="bg-brand-600 py-20 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold mb-2">Need Help?</h2>
           <p className="text-blue-100 mb-12">Our team is here to support you</p>
           
           <div className="grid md:grid-cols-3 gap-6">
             {[
               { icon: Mail, title: "Email Us", val: "support@schoolflow.com" },
               { icon: Phone, title: "Call Us", val: "+1 (555) 123-4567" },
               { icon: MessageCircle, title: "WhatsApp", val: "+15551234567" }
             ].map((h, i) => (
               <div key={i} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                 <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-white/20 flex items-center justify-center">
                   <h.icon size={24} />
                 </div>
                 <h3 className="font-bold mb-2">{h.title}</h3>
                 <p className="text-blue-100">{h.val}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl"><School className="text-brand-500" /> SchoolFlow</div>
          <div className="text-sm">© 2024 SchoolFlow. All rights reserved.</div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PricingPage = ({ setView, embedded }: any) => (
  <div className={`bg-white ${embedded ? 'py-20' : 'min-h-screen p-6'}`}>
    <div className="max-w-6xl mx-auto px-4">
      {!embedded && <Button variant="secondary" onClick={() => setView('landing')} className="mb-8">← Back Home</Button>}
      
      <div className="text-center mb-16">
        {!embedded && <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>}
        {embedded && (
          <>
            <h5 className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-2">Pricing</h5>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          </>
        )}
        <p className="text-xl text-gray-500">Choose the plan that fits your school's needs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Starter", price: 60000, color: "border-gray-200", feats: ["Nursery & Primary Only", "Up to 100 Students", "Basic Reports", "Email Support", "Mobile App Access"] },
          { name: "Professional", price: 130000, color: "border-brand-500 ring-2 ring-brand-500", popular: true, feats: ["All Levels (Nursery-Secondary)", "Up to 500 Students", "Advanced Analytics", "Priority Support", "Custom Branding", "API Access"] },
          { name: "Enterprise", price: 260000, color: "border-gray-200", feats: ["Unlimited Students", "All Levels", "White-label Solution", "24/7 Phone Support", "Dedicated Account Manager", "Custom Integrations"] }
        ].map((plan, i) => (
          <div key={i} className={`bg-white rounded-3xl p-8 border relative flex flex-col ${plan.color} ${plan.popular ? 'shadow-2xl scale-105 z-10' : 'shadow-sm hover:shadow-lg transition-shadow'}`}>
            {plan.popular && <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Popular</div>}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <div className="text-sm text-gray-500 mb-6">{plan.name === 'Starter' ? 'Perfect for small schools' : plan.name === 'Professional' ? 'Best for growing schools' : 'For large institutions'}</div>
            <div className="text-5xl font-extrabold mb-8 text-gray-900">{typeof plan.price === 'number' ? (plan.price / 1000).toLocaleString() + ',000' : 'Contact'} <span className="text-xl font-bold text-gray-500">FRw</span><span className="text-base font-normal text-gray-400">/month</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {plan.feats.map((f, j) => (
                <li key={j} className="flex items-start gap-3 text-gray-600 text-sm font-medium">
                  <CheckCircle size={18} className="text-brand-500 shrink-0 mt-0.5" /> 
                  {f}
                </li>
              ))}
            </ul>
            <Button variant={plan.popular ? 'primary' : 'outline'} className={`w-full h-12 rounded-xl text-base ${!plan.popular ? 'border-gray-300 text-gray-700' : ''}`} onClick={() => setView('register')}>Get Started</Button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TestimonialsPage = ({ setView }: any) => (
  <div className="min-h-screen bg-white p-6">
    <div className="max-w-6xl mx-auto">
      <Button variant="secondary" onClick={() => setView('landing')} className="mb-8">← Back Home</Button>
      <h1 className="text-4xl font-bold text-center mb-16">Trusted by Top Schools</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Sarah Johnson", role: "Principal", text: "SchoolFlow transformed our administrative processes." },
          { name: "Michael Chen", role: "IT Director", text: "The implementation was smooth and the platform is intuitive." },
          { name: "Emily Rodriguez", role: "Teacher", text: "Managing attendance and grades has never been easier." }
        ].map((t, i) => (
          <div key={i} className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex text-yellow-400 mb-4 gap-1"><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /></div>
            <p className="text-gray-700 italic mb-6">"{t.text}"</p>
            <div>
              <div className="font-bold text-lg">{t.name}</div>
              <div className="text-sm text-brand-600">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * ============================================================================
 * 5. DASHBOARD SUB-PAGES
 * ============================================================================
 */

const ManageTeachers = ({ user }: { user: User }) => {
  const [teachers, setTeachers] = useState(db.getUsers(user.school_id, 'teacher'));
  const [modalOpen, setModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '' });

  const handleAdd = () => {
    db.addUser({ 
      id: `u_${Date.now()}`, 
      school_id: user.school_id, 
      role: 'teacher', 
      full_name: newTeacher.name, 
      email: newTeacher.email, 
      password: '123' 
    });
    setTeachers(db.getUsers(user.school_id, 'teacher'));
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Teacher Directory</h2>
        <Button onClick={() => setModalOpen(true)}><UserPlus size={18} /> Add Teacher</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 border-b">
            <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y">
            {teachers.map(t => (
              <tr key={t.id}>
                <td className="p-4 font-medium">{t.full_name}</td>
                <td className="p-4 text-gray-500">{t.email}</td>
                <td className="p-4">
                  <button onClick={() => { db.deleteUser(t.id); setTeachers(db.getUsers(user.school_id, 'teacher')); }} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <Modal title="Add New Teacher" onClose={() => setModalOpen(false)}>
          <Input label="Full Name" onChange={(e:any) => setNewTeacher({...newTeacher, name: e.target.value})} />
          <Input label="Email" onChange={(e:any) => setNewTeacher({...newTeacher, email: e.target.value})} />
          <Button className="w-full" onClick={handleAdd}>Create Account</Button>
          <p className="text-xs text-center mt-2 text-gray-400">Default password: 123</p>
        </Modal>
      )}
    </div>
  );
};

const ManageStudents = ({ user }: { user: User }) => {
  const [students, setStudents] = useState(db.getStudents(user.school_id));
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', index: '', grade: '' });

  const handleAdd = () => {
    db.addStudent({
      id: `st_${Date.now()}`,
      school_id: user.school_id,
      full_name: formData.name,
      index_number: formData.index,
      class_grade: formData.grade
    });
    setStudents(db.getStudents(user.school_id));
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Student Roster</h2>
        <Button onClick={() => setModalOpen(true)}><Plus size={18} /> Enroll Student</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 border-b">
            <tr><th className="p-4">Name</th><th className="p-4">Index No.</th><th className="p-4">Grade</th></tr>
          </thead>
          <tbody className="divide-y">
            {students.map(s => (
              <tr key={s.id}>
                <td className="p-4 font-medium">{s.full_name}</td>
                <td className="p-4 font-mono text-sm">{s.index_number}</td>
                <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{s.class_grade}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <Modal title="Enroll Student" onClose={() => setModalOpen(false)}>
          <Input label="Full Name" onChange={(e:any) => setFormData({...formData, name: e.target.value})} />
          <Input label="Index Number (e.g. 2024/001 or NURSERY/001)" onChange={(e:any) => setFormData({...formData, index: e.target.value})} />
          <Input label="Class/Grade" onChange={(e:any) => setFormData({...formData, grade: e.target.value})} />
          <Button className="w-full" onClick={handleAdd}>Enroll</Button>
        </Modal>
      )}
    </div>
  );
};

const SchoolSettings = ({ user }: { user: User }) => {
  const [school, setSchool] = useState(db.getSchool(user.school_id));
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(school?.name || '');

  const handleSave = () => {
    db.updateSchool(user.school_id, { name });
    setSchool(db.getSchool(user.school_id));
    setEdit(false);
  };

  if (!school) return null;

  return (
    <div className="max-w-2xl bg-white rounded-xl shadow-sm border p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings /> School Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
          <div className="flex gap-2">
            <input 
              disabled={!edit} 
              value={edit ? name : school.name} 
              onChange={e => setName(e.target.value)}
              className="flex-1 border p-2 rounded bg-gray-50 disabled:text-gray-500"
            />
            {edit ? (
              <Button onClick={handleSave} size="sm">Save</Button>
            ) : (
              <Button variant="outline" onClick={() => setEdit(true)} size="sm"><Edit size={16} /></Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded border">
            <div className="text-xs text-gray-500 uppercase font-bold">Current Plan</div>
            <div className="text-lg font-bold capitalize text-brand-600">{school.plan}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded border">
            <div className="text-xs text-gray-500 uppercase font-bold">Nursery Support</div>
            <div className="text-lg font-bold">{school.has_nursery ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * 6. MAIN AUTH & LOGIC VIEWS
 * ============================================================================
 */

const ResultCheckPage = ({ setView }: any) => {
  const [indexNumber, setIndexNumber] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [school, setSchool] = useState<SchoolData | null>(null);
  const [selectedTerm, setSelectedTerm] = useState('Term 1');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setStudent(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Find student globally (iterate through all schools in MockDB)
      let found = null;
      const allSchools = db.getSchools();
      
      for (const s of allSchools) {
        const res = db.checkResult(s.id, indexNumber);
        if (res) {
          found = res;
          break;
        }
      }

      if (!found) {
        setError('Student not found. Please check the index number.');
        setLoading(false);
        return;
      }

      const { student: s, school: sch, marks: m } = found;

      // Verify class name if provided
      if (className && s.class_grade.toLowerCase() !== className.toLowerCase()) {
        setError('Index number and class do not match.');
        setLoading(false);
        return;
      }

      setStudent(s);
      setSchool(sch);
      setMarks(m);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!student || !school) return;
    
    const doc = new jsPDF();
    doc.setFillColor(37, 99, 235); // brand-600
    doc.rect(0,0,210,40,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(22);
    doc.text(school.name, 105, 20, {align:'center'});
    doc.setFontSize(12);
    doc.text('OFFICIAL REPORT CARD', 105, 30, {align:'center'});
    
    doc.setTextColor(0,0,0);
    doc.setFontSize(12);
    doc.text(`Student Name: ${student.full_name}`, 14, 55);
    doc.text(`Index Number: ${student.index_number}`, 14, 63);
    doc.text(`Class: ${student.class_grade}`, 14, 71);
    doc.text(`Term: ${selectedTerm}`, 150, 55);
    doc.text(`Year: 2024-2025`, 150, 63);

    const termMarks = marks.filter(m => m.term === selectedTerm);
    
    autoTable(doc, {
      startY: 85,
      head: [['Subject', 'Score', 'Grade', 'Remarks']],
      body: termMarks.map((m:any) => {
        const grade = getGrade(m.score);
        const remark = grade.startsWith('A') ? 'Excellent' : grade === 'B' ? 'Good' : grade === 'C' ? 'Average' : 'Needs Improvement';
        return [m.subject, m.score + '%', grade, remark];
      }),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Principal Signature:', 14, finalY + 20);
    doc.line(14, finalY + 35, 80, finalY + 35);

    doc.save(`${student.full_name}_Report_Card.pdf`);
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const termMarks = marks.filter(m => m.term === selectedTerm);
  const totalScore = termMarks.reduce((sum, m) => sum + (m.score || 0), 0);
  const average = termMarks.length > 0 ? (totalScore / termMarks.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-2 text-gray-600 hover:text-brand-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-md">
                <School className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden md:block">SchoolFlow</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {!student ? (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Check Your Results</h1>
                  <p className="text-xl text-gray-600">
                    Enter your index number to view your academic results and download your report card.
                  </p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-100 border border-gray-100 mb-8">
                  <form onSubmit={handleSearch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Index Number *
                        </label>
                        <input
                          type="text"
                          value={indexNumber}
                          onChange={(e) => setIndexNumber(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all"
                          placeholder="e.g. 2024/001"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Class Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={className}
                          onChange={(e) => setClassName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all"
                          placeholder="e.g. P4 or S1"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
                        <XCircle size={18} /> {error}
                      </div>
                    )}
                    
                    <div className="p-4 bg-brand-50 rounded-lg border border-brand-100 text-sm text-brand-800">
                        <strong>Demo IDs:</strong> Try <code>2024/001</code> for Primary or <code>NURSERY/001</code> for Nursery.
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-600 text-white font-bold text-lg rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Searching Database...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          View Results
                        </>
                      )}
                    </button>
                  </form>
                </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
              {/* Student Info */}
              <div className="bg-brand-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                    <span className="text-3xl font-bold">{student.full_name.charAt(0)}</span>
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-1">{student.full_name}</h2>
                    <p className="text-brand-100 text-lg flex items-center justify-center md:justify-start gap-2">
                      <GraduationCap size={18} /> {student.class_grade} • Index: {student.index_number}
                    </p>
                    <p className="text-brand-200 font-medium mt-2 bg-brand-700/50 px-3 py-1 rounded-full inline-block">{school?.name}</p>
                  </div>
                </div>
              </div>

              {/* Term Selection & Download */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Academic Results</h3>
                    <p className="text-gray-500 text-sm">Select a term to view specific results</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50"
                    >
                      <option value="Term 1">Term 1</option>
                      <option value="Term 2">Term 2</option>
                      <option value="Term 3">Term 3</option>
                    </select>
                    <Button onClick={handleDownloadReport}>
                      <Download className="w-4 h-4" /> Download PDF
                    </Button>
                  </div>
                </div>
              </div>

              {/* Marks Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="text-center py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="text-center py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {termMarks.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No results available for {selectedTerm}</p>
                        </td>
                      </tr>
                    ) : (
                      termMarks.map((mark) => (
                        <tr key={mark.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 font-medium text-gray-900">{mark.subject}</td>
                          <td className="py-4 px-6 text-center text-gray-600 font-mono">{mark.score}%</td>
                          <td className="py-4 px-6 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              getGrade(mark.score).startsWith('A') ? 'bg-green-100 text-green-700' :
                              getGrade(mark.score) === 'B' ? 'bg-blue-100 text-blue-700' :
                              getGrade(mark.score) === 'C' ? 'bg-yellow-100 text-yellow-700' :
                              getGrade(mark.score) === 'D' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {getGrade(mark.score)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-500 text-sm">
                            {getGrade(mark.score).startsWith('A') ? 'Excellent' : 
                             getGrade(mark.score) === 'B' ? 'Good' : 
                             getGrade(mark.score) === 'C' ? 'Average' : 'Needs Improvement'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {termMarks.length > 0 && (
                    <tfoot className="bg-gray-50 border-t border-gray-100">
                      <tr>
                        <td className="py-4 px-6 font-bold text-gray-900">Average Score</td>
                        <td className="py-4 px-6 text-center font-bold text-brand-600 text-lg">{average}%</td>
                        <td className="py-4 px-6 text-center">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-700">
                            {getGrade(parseFloat(average))}
                          </span>
                        </td>
                        <td className="py-4 px-6"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {/* Summary Cards */}
              {termMarks.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle size={24} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{totalScore}</p>
                    <p className="text-gray-500 text-sm uppercase tracking-wide font-medium">Total Score</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BarChart3 size={24} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{average}%</p>
                    <p className="text-gray-500 text-sm uppercase tracking-wide font-medium">Average</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Star size={24} />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{getGrade(parseFloat(average))}</p>
                    <p className="text-gray-500 text-sm uppercase tracking-wide font-medium">Overall Grade</p>
                  </div>
                </div>
              )}
              
              <div className="text-center pt-8">
                  <button onClick={() => setStudent(null)} className="text-gray-400 hover:text-gray-600 text-sm underline">Search for another student</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const RegisterSchool = ({ setView }: any) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ 
    name: '', 
    district: '', 
    hasNursery: false, 
    adminName: '',
    email: '', 
    pass: '', 
    confirmPass: '',
    plan: 'starter' 
  });

  const finish = () => {
    if (!form.name || !form.district) {
      alert("Please fill in school details.");
      setStep(1);
      return;
    }
    if (!form.email || !form.pass || !form.adminName) {
      alert("Please fill in admin details.");
      setStep(2);
      return;
    }
    if (form.pass !== form.confirmPass) {
      alert("Passwords do not match.");
      return;
    }

    const u = db.registerSchool(form);
    alert('Registration Successful! Please login.');
    setView('login');
  };

  const steps = [
    { num: 1, label: 'School Info' },
    { num: 2, label: 'Admin Account' },
    { num: 3, label: 'Choose Plan' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="font-bold text-2xl text-brand-600 flex items-center justify-center gap-2 mb-4 cursor-pointer" onClick={() => setView('landing')}>
          <School size={32} /> SchoolFlow
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Your School's Digital Journey</h2>
        <p className="text-gray-500">Join hundreds of schools transforming their management with SchoolFlow</p>
      </div>

      {/* Stepper */}
      <div className="w-full max-w-4xl mb-12 flex justify-center items-center">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                  ${step > s.num ? 'bg-brand-600 text-white' : step === s.num ? 'bg-brand-600 text-white shadow-lg ring-4 ring-brand-100' : 'bg-gray-200 text-gray-500'}
                `}
              >
                {step > s.num ? <Check size={20} /> : s.num}
              </div>
              <span className={`absolute top-12 whitespace-nowrap text-sm font-medium ${step >= s.num ? 'text-brand-900' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-24 md:w-40 h-1 mx-2 transition-colors duration-300 ${step > s.num ? 'bg-brand-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className={`bg-white rounded-2xl shadow-xl w-full transition-all duration-300 ${step === 3 ? 'max-w-6xl bg-transparent shadow-none' : 'max-w-2xl p-8 border border-gray-100'}`}>
        
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
            <div>
              <h3 className="text-xl font-bold text-gray-900">School Information</h3>
              <p className="text-gray-500 text-sm">Let's start with your school details</p>
            </div>
            
            <Input 
              label="School Name" 
              placeholder="e.g. Springfield High School" 
              value={form.name} 
              onChange={(e:any) => setForm({...form, name: e.target.value})} 
            />
            
            <Input 
              label="District / Location" 
              placeholder="e.g. Kigali, Rwanda" 
              value={form.district} 
              onChange={(e:any) => setForm({...form, district: e.target.value})} 
            />
            
            <div className="p-4 bg-brand-50 rounded-lg border border-brand-100 flex items-start gap-3">
              <input 
                type="checkbox" 
                id="nursery"
                checked={form.hasNursery} 
                onChange={e => setForm({...form, hasNursery: e.target.checked})} 
                className="mt-1 w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300" 
              />
              <div>
                <label htmlFor="nursery" className="block text-sm font-medium text-gray-900 cursor-pointer">Include Nursery Support?</label>
                <p className="text-xs text-gray-500 mt-1">Check this if your school has a nursery section. This enables specific report cards and grading systems for early childhood education.</p>
              </div>
            </div>

            <Button className="w-full h-12 text-lg" onClick={() => setStep(2)}>Next: Admin Account</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Administrator Account</h3>
              <p className="text-gray-500 text-sm">Create your admin login credentials</p>
            </div>
            
            <Input 
              label="Administrator Name" 
              placeholder="Full Name" 
              value={form.adminName} 
              onChange={(e:any) => setForm({...form, adminName: e.target.value})} 
            />

            <Input 
              label="Email Address" 
              type="email" 
              placeholder="admin@school.edu" 
              value={form.email} 
              onChange={(e:any) => setForm({...form, email: e.target.value})} 
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="Minimum 6 characters" 
              value={form.pass} 
              onChange={(e:any) => setForm({...form, pass: e.target.value})} 
            />
            
            <Input 
              label="Confirm Password" 
              type="password" 
              placeholder="Re-enter password" 
              value={form.confirmPass} 
              onChange={(e:any) => setForm({...form, confirmPass: e.target.value})} 
            />

            <div className="flex gap-4 pt-4">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1 h-12">Back</Button>
              <Button onClick={() => setStep(3)} className="flex-1 h-12">Next: Choose Plan</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in slide-in-from-right fade-in duration-300">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-gray-900">Choose Your Plan</h3>
              <p className="text-gray-500">Select a plan that fits your school's needs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  id: 'starter', 
                  label: 'Starter Plan', 
                  price: 60000,
                  desc: 'Perfect for small schools getting started',
                  features: ['Up to 100 students', 'Nursery & Primary support', 'Basic reporting', 'Email support', 'Mobile app access'] 
                },
                { 
                  id: 'professional', 
                  label: 'Professional Plan', 
                  price: 130000, 
                  popular: true,
                  desc: 'Ideal for growing institutions',
                  features: ['Up to 500 students', 'All levels (Nursery to Secondary)', 'Advanced analytics', 'Priority support', 'Custom branding', 'API access']
                },
                { 
                  id: 'enterprise', 
                  label: 'Enterprise Plan', 
                  price: 260000,
                  desc: 'Comprehensive solution for large schools',
                  features: ['Unlimited students', 'All levels (Nursery to Secondary)', 'White-label solution', '24/7 phone support', 'Dedicated account manager', 'Custom integrations']
                },
              ].map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setForm({...form, plan: p.id})}
                  className={`bg-white rounded-2xl p-8 border-2 cursor-pointer transition-all duration-200 relative flex flex-col
                    ${form.plan === p.id 
                      ? 'border-brand-600 ring-4 ring-brand-50 shadow-xl scale-105 z-10' 
                      : 'border-transparent hover:border-gray-200 shadow-lg hover:shadow-xl'
                    }
                  `}
                >
                  {p.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-6 py-1 rounded-full text-sm font-bold uppercase tracking-wide shadow-md">
                      Most Popular
                    </div>
                  )}
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{p.label}</h4>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-brand-600">{formatCurrency(p.price)}</span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">{p.desc}</p>
                  
                  <ul className="space-y-3 mb-8 flex-1">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <div className={`w-full py-3 rounded-lg text-center font-bold transition-colors
                      ${form.plan === p.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}
                    `}>
                      {form.plan === p.id ? 'Selected' : 'Select Plan'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-2xl mx-auto flex gap-4 mt-12">
              <Button variant="secondary" onClick={() => setStep(2)} className="flex-1 h-12 bg-white shadow-sm border">Back</Button>
              <Button onClick={finish} className="flex-1 h-12 shadow-lg shadow-brand-200">Complete Registration</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- AUTH PAGE ---
const AuthPage = ({ setView, setUser }: any) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const login = (e:any) => {
    e.preventDefault();
    const u = db.login(email, pass);
    if(u) { setUser(u); setView('dashboard'); }
    else alert('Invalid Login. Try admin@schoolflow.com / admin123');
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center items-center bg-brand-600 text-white p-12">
        <School size={64} className="mb-6" />
        <h1 className="text-4xl font-bold mb-4">SchoolFlow</h1>
        <p className="text-lg text-center opacity-90">Manage your entire institution from one unified dashboard.</p>
      </div>
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
          <form onSubmit={login} className="space-y-4">
            <Input label="Email" value={email} onChange={(e:any) => setEmail(e.target.value)} />
            <Input label="Password" type="password" value={pass} onChange={(e:any) => setPass(e.target.value)} />
            <Button className="w-full">Sign In</Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <span onClick={() => setView('register')} className="text-brand-600 font-bold cursor-pointer hover:underline">Register School</span>
          </div>
          <div className="mt-4 text-center">
            <span onClick={() => setView('landing')} className="text-gray-400 text-sm cursor-pointer hover:text-gray-600">Back to Home</span>
          </div>
          
          {/* Test Creds Hint */}
          <div className="mt-8 p-4 bg-yellow-50 text-xs text-yellow-800 rounded border border-yellow-100">
            <p className="font-bold mb-1">Demo Credentials:</p>
            <p>School Admin: headteacher@springfield.edu / head123</p>
            <p>Teacher: teacher@springfield.edu / teacher123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * 7. DASHBOARD CONTAINER
 * ============================================================================
 */

const Dashboard = ({ user, setUser, setView }: any) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Stats
  const stats = useMemo(() => {
    const s = db.getStudents(user.school_id).length;
    const t = db.getUsers(user.school_id, 'teacher').length;
    return { students: s, teachers: t };
  }, [user]);

  const menu = useMemo(() => {
    if(user.role === 'school_admin') return [
      { id: 'overview', icon: BarChart3, label: 'Overview' },
      { id: 'teachers', icon: BookOpen, label: 'Teachers' },
      { id: 'students', icon: GraduationCap, label: 'Students' },
      { id: 'classes', icon: Calendar, label: 'Classes' },
      { id: 'settings', icon: Settings, label: 'Settings' }
    ];
    if(user.role === 'teacher') return [
      { id: 'overview', icon: BarChart3, label: 'Overview' },
      { id: 'classes', icon: BookOpen, label: 'My Classes' }
    ];
    return [{ id: 'overview', icon: BarChart3, label: 'Overview' }];
  }, [user.role]);

  // Render Sub-Views
  const renderContent = () => {
    if (activeTab === 'teachers') return <ManageTeachers user={user} />;
    if (activeTab === 'students') return <ManageStudents user={user} />;
    if (activeTab === 'settings') return <SchoolSettings user={user} />;
    
    // Default Overview
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
        <Card title="Total Students" value={stats.students} icon={Users} />
        <Card title="Total Teachers" value={stats.teachers} icon={BookOpen} color="bg-purple-50 text-purple-600" />
        <Card title="Revenue (Est)" value={formatCurrency(stats.students * 50000)} icon={CreditCard} color="bg-green-50 text-green-600" subtext="Based on avg tuition" />
        
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="flex gap-4">
            <Button variant="outline"><Calendar size={18} /> View Calendar</Button>
            <Button variant="outline"><BookOpen size={18} /> Manage Reports</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col fixed h-full z-10">
        <div className="p-6 text-white font-bold text-xl flex items-center gap-2 border-b border-gray-800">
          <School className="text-brand-500" /> SchoolFlow
        </div>
        <div className="flex-1 p-4 space-y-2">
          {menu.map(m => (
            <button key={m.id} onClick={() => setActiveTab(m.id)} 
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === m.id ? 'bg-brand-600 text-white' : 'hover:bg-gray-800'}`}>
              <m.icon size={20} /> {m.label}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs">{user.full_name[0]}</div>
            <div className="overflow-hidden">
              <div className="text-sm text-white truncate">{user.full_name}</div>
              <div className="text-xs text-gray-500 truncate capitalize">{user.role.replace('_', ' ')}</div>
            </div>
          </div>
          <button onClick={() => { setUser(null); setView('landing'); }} className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800 rounded hover:bg-gray-700 text-sm"><LogOut size={16} /> Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <header className="bg-white border-b p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab.replace('_', ' ')}</h2>
        </header>
        <div className="p-6 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState<User | null>(null);

  switch(view) {
    case 'dashboard': return user ? <Dashboard user={user} setUser={setUser} setView={setView} /> : <AuthPage setView={setView} setUser={setUser} />;
    case 'login': return <AuthPage setView={setView} setUser={setUser} />;
    case 'register': return <RegisterSchool setView={setView} />;
    case 'result_check': return <ResultCheckPage setView={setView} />;
    case 'pricing': return <PricingPage setView={setView} />;
    case 'testimonials': return <TestimonialsPage setView={setView} />;
    default: return <LandingPage setView={setView} />;
  }
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
