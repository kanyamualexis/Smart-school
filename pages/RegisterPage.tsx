
import React, { useState } from 'react';
import { School, Check, CheckCircle, ArrowLeft, Building2, UserCircle, Layers, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { db } from '../services/db';
import { formatCurrency } from '../utils/formatters';

export const RegisterPage = ({ setView }: any) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

  const finish = async () => {
    setError('');
    
    if (!form.name || !form.district || !form.email || !form.pass) { 
      setError("Please ensure all fields are filled."); 
      return; 
    }
    if (form.pass !== form.confirmPass) { 
      setError("Passwords do not match."); 
      return; 
    }
    
    setIsLoading(true);
    const result = await db.registerSchool(form);
    setIsLoading(false);

    if (result.success) {
      alert('Registration Successful! Please check your email to confirm, then login.');
      setView('login');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  const steps = [
    { num: 1, label: 'Institution', icon: Building2 },
    { num: 2, label: 'Admin Access', icon: UserCircle },
    { num: 3, label: 'Plan Selection', icon: Layers }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-24 px-4">
      <div className="text-center mb-16">
        <div 
          className="font-black text-2xl text-brand-600 flex items-center justify-center gap-3 mb-6 cursor-pointer tracking-tighter" 
          onClick={() => setView('landing')}
        >
          <School size={40} /> Smart School Flow
        </div>
        <h1 className="mb-3 text-3xl md:text-4xl">Onboard Your Institution</h1>
        <p className="text-lg max-w-2xl mx-auto font-medium text-gray-500">Deploy your digital infrastructure in minutes.</p>
      </div>

      <div className="w-full max-w-4xl mb-20 flex justify-center items-center">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center relative z-10">
              <div 
                className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center font-black transition-all duration-300
                  ${step > s.num ? 'bg-brand-600 text-white shadow-xl' : step === s.num ? 'bg-brand-600 text-white shadow-2xl scale-110' : 'bg-gray-200 text-gray-500'}
                `}
              >
                {step > s.num ? <Check size={28} /> : <s.icon size={28} />}
              </div>
              <span className={`absolute top-18 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] ${step >= s.num ? 'text-brand-900' : 'text-gray-300'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-24 md:w-48 h-1 mx-4 transition-colors duration-300 ${step > s.num ? 'bg-brand-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className={`bg-white rounded-[3.5rem] shadow-[0_48px_80px_-24px_rgba(0,0,0,0.1)] w-full transition-all duration-300 ${step === 3 ? 'max-w-7xl p-8 bg-transparent shadow-none' : 'max-w-3xl p-16 border border-gray-100'}`}>
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right fade-in duration-500">
            <div className="mb-10">
              <h2 className="mb-2">School Credentials</h2>
              <p className="text-base font-medium text-gray-400">General information about your institution.</p>
            </div>
            <div className="space-y-6">
               <Input label="Registered School Name" placeholder="e.g. Kigali International Academy" value={form.name} onChange={(e:any) => setForm({...form, name: e.target.value})} />
               <Input label="Administrative District" placeholder="e.g. Gasabo District" value={form.district} onChange={(e:any) => setForm({...form, district: e.target.value})} />
            </div>
            <div className="p-8 bg-brand-50 rounded-[2rem] border border-brand-100 flex items-start gap-6">
              <input type="checkbox" id="nursery" checked={form.hasNursery} onChange={e => setForm({...form, hasNursery: e.target.checked})} className="mt-1 w-7 h-7 text-brand-600 rounded-lg border-brand-200 focus:ring-brand-500" />
              <div>
                <label htmlFor="nursery" className="block text-sm font-bold text-gray-900 uppercase tracking-widest leading-none">Enable Nursery Support</label>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">Required for early childhood education reporting and specialized grading cycles.</p>
              </div>
            </div>
            <Button className="w-full h-18 text-[11px] font-bold uppercase tracking-[0.2em] mt-10 rounded-2xl shadow-xl" onClick={() => setStep(2)}>Next Step</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right fade-in">
            <div className="mb-10">
              <h2 className="mb-2">System Administrator</h2>
              <p className="text-base font-medium text-gray-400">Create authorized login credentials.</p>
            </div>
            <div className="space-y-6">
              <Input label="Authorized Name" value={form.adminName} onChange={(e:any) => setForm({...form, adminName: e.target.value})} />
              <Input label="Identity Email" type="email" value={form.email} onChange={(e:any) => setForm({...form, email: e.target.value})} />
              <div className="grid grid-cols-2 gap-8">
                <Input label="Secret Password" type="password" value={form.pass} onChange={(e:any) => setForm({...form, pass: e.target.value})} />
                <Input label="Confirm Secret" type="password" value={form.confirmPass} onChange={(e:any) => setForm({...form, confirmPass: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-8 pt-10">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1 h-18 text-[11px] uppercase font-bold tracking-[0.3em] rounded-2xl">Back</Button>
              <Button onClick={() => setStep(3)} className="flex-1 h-18 text-[11px] uppercase font-bold tracking-[0.3em] rounded-2xl shadow-xl">Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-16 animate-in slide-in-from-right fade-in">
            <div className="grid lg:grid-cols-3 gap-10 items-stretch">
              {[
                { id: 'starter', p: 60000, name: "Starter", desc: 'Small Institutions', feats: ["Nursery & Primary Only", "Up to 100 Students", "Basic Reports", "Mobile App Access"] }, 
                { id: 'professional', p: 130000, name: "Professional", desc: 'Best Value Choice', feats: ["All Levels support", "Up to 500 Students", "Advanced Analytics", "Priority Support"] }, 
                { id: 'enterprise', p: 260000, name: "Enterprise", desc: 'Large Operations', feats: ["Unlimited Students", "White-label Solution", "Dedicated Manager", "API Access"] }
              ].map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setForm({...form, plan: p.id})} 
                  className={`p-14 bg-white rounded-[4rem] cursor-pointer transition-all duration-500 flex flex-col items-center text-center border-4 relative
                    ${form.plan === p.id 
                      ? 'border-brand-600 scale-105 shadow-[0_48px_80px_-16px_rgba(37,99,235,0.2)]' 
                      : 'border-transparent opacity-50 grayscale hover:grayscale-0 hover:opacity-100 shadow-2xl'
                    }
                  `}
                >
                  <h5 className="font-bold uppercase text-[10px] tracking-[0.4em] text-gray-400 mb-6 leading-none">{p.desc}</h5>
                  <h3 className="mb-3 text-2xl tracking-tighter">{p.name}</h3>
                  <div className="mb-12 flex items-baseline gap-1 leading-none">
                    <span className="text-4xl font-black text-brand-600">{formatCurrency(p.p).split('.')[0]}</span>
                    <span className="text-gray-400 font-bold text-xs">/mo</span>
                  </div>
                  
                  <ul className="space-y-6 mb-14 w-full text-left">
                    {p.feats.map((f, idx) => (
                       <li key={idx} className="flex items-start gap-4 text-sm font-bold text-gray-500">
                          <CheckCircle size={20} className="text-brand-500 shrink-0 mt-0.5" /> <span>{f}</span>
                       </li>
                    ))}
                  </ul>

                  <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all ${form.plan === p.id ? 'bg-brand-600 text-white scale-110 rotate-[360deg] shadow-xl' : 'bg-gray-100 text-gray-300'}`}>
                    <CheckCircle size={32} />
                  </div>
                </div>
              ))}
            </div>
            <div className="max-w-xl mx-auto flex gap-8">
              <Button variant="secondary" onClick={() => setStep(2)} className="flex-1 h-20 text-[11px] font-bold uppercase tracking-[0.4em] rounded-2xl">Back</Button>
              <Button onClick={finish} isLoading={isLoading} className="flex-1 h-20 text-[11px] font-bold uppercase tracking-[0.4em] rounded-2xl shadow-2xl">Finalize Deployment</Button>
            </div>
          </div>
        )}
      </div>
      
      <button 
        onClick={() => setView('landing')} 
        className="mt-16 text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 hover:text-brand-600 flex items-center gap-4 transition-all"
      >
        <ArrowLeft size={18} /> Abort Registration
      </button>
    </div>
  );
};
