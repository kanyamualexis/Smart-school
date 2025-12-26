
import React, { useState, useEffect } from 'react';
import { 
  School, Menu, X, ChevronLeft, ChevronRight, 
  ChevronUp, ChevronDown, CheckCircle, Play, 
  Star, Mail, Phone, MessageCircle, Clock, 
  BarChart3, Globe, Users, BookOpen, GraduationCap,
  Award, Medal, ShieldCheck, Search
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PricingPage } from './PricingPage';
import { cn } from '../utils/cn';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the multi-tenant system work?",
      a: "Each school gets a unique school_id when they register. All data is filtered by this ID, ensuring complete isolation between schools. Your data is never visible to other schools."
    },
    {
      q: "Can I migrate from another school management system?",
      a: "Yes! We provide bulk import tools for students, teachers, and historical marks. Our support team can also assist with custom data migrations to ensure a smooth transition to Smart School Flow."
    },
    {
      q: "Is there a limit on the number of users?",
      a: "User limits are based on your subscription plan. The Starter plan supports up to 100 students, while Enterprise offers unlimited users and students."
    },
    {
      q: "How secure is the student data?",
      a: "We use Supabase with Row Level Security (RLS) policies, ensuring data is encrypted at rest and in transit. Each school's data is completely isolated, providing enterprise-grade security for sensitive student information."
    },
    {
      q: "Can parents access the system?",
      a: "Yes! Parents have a dedicated view where they can securely check their children's results, attendance records, and school announcements using the student's unique Index ID."
    },
    {
      q: "Do you offer training for school staff?",
      a: "Premium plans include dedicated training sessions for your administrative team. Additionally, all plans have access to our comprehensive video tutorials and documentation."
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h5 className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-2">FAQ</h5>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-500">Everything you need to know about Smart School Flow.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 last:border-0">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
              >
                <span className={cn("text-lg font-bold transition-colors", openIndex === i ? "text-brand-600" : "text-gray-900 group-hover:text-brand-600")}>
                  {faq.q}
                </span>
                {openIndex === i ? (
                  <ChevronUp className="text-brand-600 shrink-0" size={20} />
                ) : (
                  <ChevronDown className="text-gray-400 shrink-0 group-hover:text-brand-600" size={20} />
                )}
              </button>
              {openIndex === i && (
                <div className="pb-6 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const LandingPage = ({ setView }: any) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const statsConfig = {
    schools: "10,000+",
    students: "2M+",
    teachers: "150K+",
    uptime: "99.9%"
  };

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
    },
    {
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2000",
      title: "Data-Driven Decisions",
      subtitle: "Gain actionable insights into student performance and institutional growth."
    },
    {
      image: "https://images.unsplash.com/photo-1427504746696-ea5abd73a3bd?auto=format&fit=crop&q=80&w=2000",
      title: "Connect & Collaborate",
      subtitle: "Bridge the gap between classrooms and homes with seamless communication."
    }
  ];

  // Logos for Marquee
  const partners = [
    { name: "Greenwood High", icon: School },
    { name: "Riverside Academy", icon: GraduationCap },
    { name: "Oakridge Intl", icon: BookOpen },
    { name: "St. Mary's School", icon: Award },
    { name: "Tech High", icon: Globe },
    { name: "Future Leaders", icon: Medal },
    { name: "Global Knowledge", icon: Users },
    { name: "Bright Minds", icon: Star },
    { name: "Elite College", icon: ShieldCheck }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const scrollToSection = (id: string) => {
    setView('landing');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const goToHome = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur z-50 border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto">
          <div className="font-bold text-2xl text-brand-600 flex items-center gap-2 cursor-pointer" onClick={goToHome}>
            <School className="fill-brand-600 text-white" /> Smart School Flow
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-600">
            <button onClick={goToHome} className="hover:text-brand-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-brand-600 transition-colors">Pricing</button>
            <button onClick={() => setView('testimonials')} className="hover:text-brand-600 transition-colors">Testimonials</button>
            <button onClick={() => setView('result_check')} className="hover:text-brand-600 transition-colors flex items-center gap-2">
              <Search size={18} /> Check Results
            </button>
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
             <button onClick={() => { goToHome(); setMobileMenuOpen(false); }} className="text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-medium text-gray-600">Home</button>
             <button onClick={() => { scrollToSection('pricing'); setMobileMenuOpen(false); }} className="text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-medium text-gray-600">Pricing</button>
             <button onClick={() => { setView('testimonials'); setMobileMenuOpen(false); }} className="text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-medium text-gray-600">Testimonials</button>
             <button onClick={() => { setView('result_check'); setMobileMenuOpen(false); }} className="text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-medium text-gray-600 flex items-center gap-2">
               <Search size={18} /> Check Results
             </button>
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
                  <Button variant="outline" onClick={() => scrollToSection('pricing')} size="lg" className="rounded-full px-8 text-white border-white hover:bg-white/10 hover:text-white">Learn More</Button>
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
      <div className="relative z-20 -mt-16 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Ready to Transform Your School?</h3>
            <p className="text-gray-500">Join thousands of schools already using Smart School Flow.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button onClick={() => setView('register')} className="flex-1 md:flex-none">Start Free Trial</Button>
            <Button variant="outline" onClick={() => setView('result_check')} className="flex-1 md:flex-none">
              <Search size={18} className="mr-2" /> Check Results
            </Button>
          </div>
        </div>
      </div>

      {/* NEW: Moving Logos Marquee */}
      <section className="py-12 bg-white overflow-hidden mt-8">
        <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by leading educational institutions</p>
        <div className="flex w-full overflow-hidden relative">
           {/* Gradient Masks */}
           <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
           <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
           
           <div className="flex animate-scroll whitespace-nowrap gap-16 px-8">
             {/* Double the list to ensure smooth infinite scroll */}
             {[...partners, ...partners].map((p, i) => (
               <div key={i} className="flex items-center gap-3 text-gray-400 grayscale hover:grayscale-0 hover:text-brand-600 transition-all duration-300">
                 <p.icon size={32} strokeWidth={1.5} />
                 <span className="text-xl font-bold tracking-tight">{p.name}</span>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Impact Stats Bar */}
      <section className="bg-brand-600 py-16 text-white mb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">{statsConfig.schools}</div>
            <div className="text-xs md:text-sm font-medium opacity-90 uppercase tracking-widest">Schools Registered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">{statsConfig.students}</div>
            <div className="text-xs md:text-sm font-medium opacity-90 uppercase tracking-widest">Students Managed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">{statsConfig.teachers}</div>
            <div className="text-xs md:text-sm font-medium opacity-90 uppercase tracking-widest">Teachers Using</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">{statsConfig.uptime}</div>
            <div className="text-xs md:text-sm font-medium opacity-90 uppercase tracking-widest">Uptime</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-12 max-w-7xl mx-auto px-4">
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
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Watch our quick tutorial showing how schools can register and get started with Smart School Flow in minutes.</p>
          
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
            { name: "Sarah Johnson", role: "Principal, Springfield High", text: "Smart School Flow transformed our administrative processes. We saved countless hours and improved parent communication.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
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
      <section id="pricing">
        <PricingPage setView={setView} embedded={true} />
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Help Section */}
      <section id="contact" className="bg-brand-600 py-20 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold mb-2">Need Help?</h2>
           <p className="text-blue-100 mb-12">Our team is here to support you</p>
           
           <div className="grid md:grid-cols-3 gap-6">
             {[
               { icon: Mail, title: "Email Us", val: "support@smartschoolflow.com" },
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

      {/* Footer */}
      <footer className="bg-[#0b1120] text-gray-400 py-12 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            <div className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight cursor-pointer" onClick={goToHome}>
              <School className="text-brand-500 fill-brand-500" /> Smart School Flow
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
              <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button>
              <button onClick={goToHome} className="hover:text-white transition-colors">Privacy</button>
              <button onClick={goToHome} className="hover:text-white transition-colors">Terms</button>
            </div>
          </div>
          <div className="border-t border-gray-800 my-8"></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div>© 2025 Smart School Flow. All rights reserved.</div>
            <div className="flex items-center gap-1">
              Designed by <span className="text-brand-500 font-bold">Alexis K.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
    