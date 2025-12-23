
import React, { useState, useEffect } from 'react';
import { 
  School, Menu, X, ChevronLeft, ChevronRight, 
  ChevronUp, ChevronDown, CheckCircle, Play, 
  Star, Mail, Phone, MessageCircle, Clock, 
  BarChart3, Globe, Users, BookOpen
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
      a: "Yes! We provide bulk import tools for students, teachers, and historical marks. Our support team can also assist with custom data migrations."
    },
    {
      q: "Is there a limit on the number of users?",
      a: "User limits are based on your subscription plan. The Starter plan supports up to 100 students, while Enterprise offers unlimited users and students."
    },
    {
      q: "How secure is the student data?",
      a: "We use enterprise-grade security protocols, ensuring data is encrypted at rest and in transit. Each school's data is completely isolated."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h5 className="text-brand-600 font-bold tracking-[0.2em] uppercase text-xs mb-4">FAQ</h5>
          <h2 className="mb-4">Frequently Asked Questions</h2>
          <p className="max-w-xl mx-auto text-base">Everything you need to know about Smart School Flow.</p>
        </div>

        <div className="space-y-2">
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
                  <p className="text-base leading-relaxed text-gray-500">
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
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const goToHome = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white selection:bg-brand-100 selection:text-brand-900">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex justify-between items-center">
          <div className="flex items-center gap-2 text-brand-600 font-black text-2xl tracking-tighter cursor-pointer" onClick={goToHome}>
            <School className="fill-brand-600" size={32} /> Smart School Flow
          </div>
          
          <div className="hidden md:flex gap-8 items-center text-xs font-bold uppercase tracking-widest text-gray-500">
            <button onClick={goToHome} className="hover:text-brand-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-brand-600 transition-colors">Pricing</button>
            <button onClick={() => setView('testimonials')} className="hover:text-brand-600 transition-colors">Testimonials</button>
            <button onClick={() => setView('result_check')} className="hover:text-brand-600 transition-colors">Check Results</button>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <button className="text-gray-600 font-bold uppercase tracking-widest text-xs hover:text-brand-600 transition-colors mr-2" onClick={() => setView('login')}>Login</button>
            <Button onClick={() => setView('register')} size="sm" className="rounded-xl font-bold uppercase tracking-widest text-xs px-8 h-12 bg-brand-600 shadow-lg shadow-brand-200">Get Started</Button>
          </div>

          <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-8 flex flex-col gap-6 shadow-2xl z-50 animate-in slide-in-from-top-2">
            <button onClick={() => { goToHome(); setMobileMenuOpen(false); }} className="text-left font-bold uppercase tracking-widest text-xs py-2 text-gray-600">Home</button>
            <button onClick={() => scrollToSection('pricing')} className="text-left font-bold uppercase tracking-widest text-xs py-2 text-gray-600">Pricing</button>
            <button onClick={() => setView('testimonials')} className="text-left font-bold uppercase tracking-widest text-xs py-2 text-gray-600">Testimonials</button>
            <button onClick={() => setView('result_check')} className="text-left font-bold uppercase tracking-widest text-xs py-2 text-gray-600">Check Results</button>
            <hr className="border-gray-100" />
            <button onClick={() => setView('login')} className="text-left font-bold uppercase tracking-widest text-xs py-2 text-gray-600">Login</button>
            <Button onClick={() => setView('register')} className="w-full h-16 rounded-2xl font-bold uppercase tracking-widest text-xs">Get Started</Button>
          </div>
        )}
      </nav>

      <section className="relative h-[680px] mt-20 overflow-hidden bg-brand-900">
        {slides.map((s, i) => (
          <div 
            key={i} 
            className={cn("absolute inset-0 transition-opacity duration-1000 ease-in-out", i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0')}
          >
            <div className="absolute inset-0 bg-brand-900/60 z-10" />
            <img src={s.image} alt={s.title} className="w-full h-full object-cover scale-105" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4">
              <h1 className="text-white mb-6 max-w-4xl animate-in zoom-in-95 duration-1000">
                {s.title}
              </h1>
              <p className="text-lg md:text-xl text-blue-50 mb-10 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
                {s.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button onClick={() => setView('register')} size="lg" className="rounded-2xl px-10 h-14 bg-brand-600 font-bold uppercase tracking-widest text-xs border-none shadow-2xl">Start Free Trial</Button>
                <Button variant="outline" onClick={() => scrollToSection('features')} size="lg" className="rounded-2xl px-10 h-14 text-white border-2 border-white/50 backdrop-blur-md hover:bg-white hover:text-brand-900 font-bold uppercase tracking-widest text-xs transition-all">Learn More</Button>
              </div>
            </div>
          </div>
        ))}
        
        <button onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)} className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 text-white hover:bg-white/30 transition-all border border-white/10 backdrop-blur-sm">
          <ChevronLeft size={32} />
        </button>
        <button onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)} className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 text-white hover:bg-white/30 transition-all border border-white/10 backdrop-blur-sm">
          <ChevronRight size={32} />
        </button>
      </section>

      <div className="relative z-40 max-w-7xl mx-auto px-4 -mt-24">
        <div className="bg-white rounded-[3rem] shadow-[0_48px_80px_-24px_rgba(0,0,0,0.2)] p-12 flex flex-col lg:flex-row items-center justify-between gap-10 border border-gray-100 animate-in slide-in-from-bottom-10 duration-700">
          <div>
            <h2 className="mb-2">Ready to Transform Your School?</h2>
            <p className="text-lg text-gray-500 font-medium">Join thousands of schools already using Smart School Flow.</p>
          </div>
          <div className="flex gap-6 w-full lg:w-auto">
            <Button onClick={() => setView('register')} className="flex-1 lg:flex-none h-16 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs bg-brand-600">Start Free Trial</Button>
            <Button variant="outline" onClick={() => setView('result_check')} className="flex-1 lg:flex-none h-16 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs border-brand-600 text-brand-600">Check Results</Button>
          </div>
        </div>
      </div>

      <section className="bg-brand-600 py-32 text-white mt-[-80px]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-16 pt-24">
          <div className="text-center group">
            <div className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-none group-hover:scale-105 transition-transform">{statsConfig.schools}</div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80">Schools Registered</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-none group-hover:scale-105 transition-transform">{statsConfig.students}</div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80">Students Managed</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-none group-hover:scale-105 transition-transform">{statsConfig.teachers}</div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80">Teachers Using</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-none group-hover:scale-105 transition-transform">{statsConfig.uptime}</div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80">Uptime</div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h5 className="text-brand-600 font-bold tracking-[0.2em] uppercase text-xs mb-6">Features</h5>
            <h2 className="mb-6">Everything you need to run your school</h2>
            <p className="max-w-3xl mx-auto text-base font-medium">Comprehensive tools designed for modern education management</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: CheckCircle, title: "Role-Based Access", text: "Dedicated dashboards for Admins, Teachers, Students, and Parents with secure access control.", color: "bg-blue-100 text-blue-600" },
              { icon: BookOpen, title: "Academic Management", text: "Manage classes, subjects, marks, and generate automated report cards effortlessly.", color: "bg-purple-100 text-purple-600" },
              { icon: Users, title: "Nursery to Secondary", text: "Complete support for nursery, primary, and secondary school levels with age-appropriate reporting.", color: "bg-pink-100 text-pink-600" },
              { icon: Clock, title: "Attendance Tracking", text: "Monitor daily attendance for staff and students with detailed monthly reports.", color: "bg-green-100 text-green-600" },
              { icon: BarChart3, title: "Performance Analytics", text: "Visual insights into student performance and class progression trends over time.", color: "bg-orange-100 text-orange-600" },
              { icon: Globe, title: "Cloud-Based Access", text: "Access your school data securely from anywhere, anytime, on any device.", color: "bg-indigo-100 text-indigo-600" }
            ].map((f, i) => (
              <div key={i} className="p-12 rounded-[3.5rem] bg-white border border-gray-100 shadow-[0_12px_40px_rgb(0,0,0,0.04)] hover:shadow-[0_24px_64px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-3 group">
                <div className={`w-16 h-16 ${f.color} rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                  <f.icon size={32} />
                </div>
                <h3 className="mb-4 text-xl leading-none">{f.title}</h3>
                <p className="text-base text-gray-500">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50/70">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-brand-100 text-brand-700 rounded-full text-xs font-bold uppercase tracking-widest mb-10">
            <Play size={14} className="fill-current" /> Quick Demo
          </div>
          <h2 className="mb-8">See How Easy Registration Is</h2>
          <p className="text-xl mb-16 max-w-2xl mx-auto font-medium text-gray-500">Watch our quick tutorial showing how schools can register and get started in minutes.</p>
          
          <div className="relative group max-w-5xl mx-auto rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white bg-black">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000" alt="Demo Video" className="w-full aspect-video object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-24 h-24 bg-brand-600 rounded-full flex items-center justify-center pl-1 shadow-2xl scale-95 group-hover:scale-110 transition-all shadow-brand-600/40">
                <Play size={44} className="text-white fill-white" />
              </button>
            </div>
          </div>
          
          <div className="mt-20 bg-white py-8 px-12 rounded-[2.5rem] shadow-sm border border-gray-100 inline-flex flex-col md:flex-row items-center gap-12 text-left">
             <div>
               <div className="font-black text-gray-900 text-3xl tracking-tighter mb-2">Ready to get started?</div>
               <p className="text-lg text-gray-500">Create your school account in less than 5 minutes</p>
             </div>
             <Button onClick={() => setView('register')} className="h-16 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs bg-brand-600 whitespace-nowrap">Register Your School <ChevronRight className="ml-2" size={20} /></Button>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h5 className="text-brand-600 font-bold tracking-[0.2em] uppercase text-xs mb-6">Testimonials</h5>
            <h2>Loved by schools worldwide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { name: "Sarah Johnson", role: "Principal, Springfield High", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150", text: "Smart School Flow transformed our administrative processes. We saved countless hours and improved parent communication." },
              { name: "Michael Chen", role: "IT Director, Riverside Academy", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150", text: "The implementation was smooth and the platform is intuitive. Our teachers adapted quickly and love the new system." },
              { name: "Emily Rodriguez", role: "Teacher, Oakwood School", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150", text: "Managing attendance and grades has never been easier. The mobile app lets me update records instantly." }
            ].map((t, i) => (
              <div key={i} className="p-12 rounded-[3.5rem] bg-white border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-lg transition-all">
                <div className="flex items-center gap-6 mb-10">
                  <img src={t.img} alt={t.name} className="w-20 h-20 rounded-[1.75rem] object-cover shadow-sm" />
                  <div>
                    <div className="font-black text-gray-900 text-xl tracking-tight leading-none">{t.name}</div>
                    <div className="text-brand-600 font-bold uppercase tracking-widest text-[10px] mt-2">{t.role}</div>
                  </div>
                </div>
                <p className="italic mb-10 flex-1 leading-relaxed text-base text-gray-500 font-medium">"{t.text}"</p>
                <div className="flex gap-2 text-yellow-400">
                  {[...Array(5)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing">
        <PricingPage setView={setView} embedded={true} />
      </section>

      <FAQSection />

      <section id="contact" className="bg-brand-600 py-40 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <h2 className="text-white mb-6">Need Help?</h2>
           <p className="text-xl text-blue-50 opacity-90 mb-20 font-medium">Our team is here to support you</p>
           
           <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
             {[
               { icon: Mail, title: "Email Us", val: "support@smartschoolflow.com" },
               { icon: Phone, title: "Call Us", val: "+1 (555) 123-4567" },
               { icon: MessageCircle, title: "WhatsApp", val: "+15551234567" }
             ].map((h, i) => (
               <div key={i} className="bg-white/10 backdrop-blur-md p-12 rounded-[3.5rem] border border-white/20 hover:bg-white/20 transition-all flex flex-col items-center group cursor-pointer">
                 <div className="w-16 h-16 mb-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <h.icon size={32} />
                 </div>
                 <h4 className="text-white mb-4 leading-none">{h.title}</h4>
                 <p className="text-blue-50 font-black text-base uppercase tracking-widest">{h.val}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      <footer className="bg-[#0b1120] text-gray-500 py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-12">
            <div className="flex items-center gap-4 text-white font-black text-3xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <School className="text-brand-500 fill-brand-500" size={44} /> Smart School Flow
            </div>
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-6 text-xs font-bold uppercase tracking-widest">
              <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button>
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
            </div>
          </div>
          <div className="border-t border-white/5 my-12"></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-bold uppercase tracking-widest">
            <div>© 2025 Smart School Flow. All rights reserved.</div>
            <div className="flex items-center gap-2">
              Designed by <span className="text-brand-500 font-black text-base tracking-tighter">Alexis K.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
