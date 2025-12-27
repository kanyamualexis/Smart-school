
import React, { useState, useEffect } from 'react';
import { School, Check, CheckCircle, ArrowLeft, Building2, UserCircle, Layers, AlertTriangle, CreditCard, Smartphone, UploadCloud, Image, Info, ShieldCheck, FileText, ArrowRight, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { db } from '../services/db';
import { formatCurrency } from '../utils/formatters';
import { Plan } from '../types';

export const RegisterPage = ({ setView }: any) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  
  const [form, setForm] = useState({ 
    name: '', 
    district: '', 
    phone: '',
    address: '',
    hasNursery: false, 
    adminName: '', 
    email: '', 
    pass: '', 
    confirmPass: '', 
    plan: 'starter' 
  });
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('');

  // Fetch plans on mount
  useEffect(() => {
    db.getPlans().then(setPlans);
  }, []);

  // Payment methods data
  const paymentMethods = [
    { id: 'mtn', name: 'MTN Mobile Money', icon: Smartphone, detail: '+250 786 014 910 (Alexis)', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { id: 'airtel', name: 'Airtel Money', icon: Smartphone, detail: '+250 728 930 507 (ALEXIS)', color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'momo', name: 'MoMo Code', icon: CreditCard, detail: '118845 (Alexis)', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { id: 'equity', name: 'Equity Bank', icon: Building2, detail: '11111112222225555 (ALEXIS)', color: 'text-amber-800', bg: 'bg-amber-50' },
    { id: 'visa', name: 'Visa Card', icon: CreditCard, detail: 'Contact us for payment link', color: 'text-blue-600', bg: 'bg-blue-50' }
  ];

  // Validation functions per step
  const validateStep1 = () => {
    if (!form.name || !form.district || !form.phone || !form.address) {
      setError("Please fill in all school details.");
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!form.adminName || !form.email || !form.pass) {
      setError("Please complete all admin fields.");
      return false;
    }
    if (form.pass !== form.confirmPass) {
      setError("Passwords do not match.");
      return false;
    }
    if (form.pass.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    setError('');
    return true;
  };

  const validateStep4 = () => {
    if (!selectedMethod) {
       setError("Please select a payment method.");
       return false;
    }
    if (!paymentFile) {
       setError("Please upload the payment screenshot to proceed.");
       return false;
    }
    setError('');
    return true;
  };

  const submitRegistration = async () => {
    setError('');
    setIsLoading(true);
    
    // In a real app, we would upload the file here. 
    // const fileUrl = await uploadFile(paymentFile);
    
    const result = await db.registerSchool(form);
    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const steps = [
    { num: 1, label: 'School Info', icon: Building2 },
    { num: 2, label: 'Admin Account', icon: UserCircle },
    { num: 3, label: 'Plan', icon: Layers },
    { num: 4, label: 'Payment', icon: CreditCard },
    { num: 5, label: 'Confirm', icon: CheckCircle }
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="relative bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center border border-gray-100 animate-in zoom-in duration-300">
           <button 
             onClick={() => setView('landing')}
             className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-all"
             title="Close"
           >
             <X size={24} />
           </button>

           <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                 <Check size={48} className="text-white stroke-[3]" />
              </div>
           </div>
           
           <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Registration Successful!</h2>
           <p className="text-gray-500 text-lg mb-8 leading-relaxed">
             Thank you for registering <strong>{form.name}</strong>. Your application is now pending approval. We have sent a confirmation email to <strong>{form.email}</strong>.
           </p>

           <div className="p-6 bg-brand-50 rounded-2xl border border-brand-100 mb-8">
              <p className="text-brand-800 font-medium text-sm">
                 Our team will verify your payment details shortly. You will be able to log in once your account is active.
              </p>
           </div>

           <Button onClick={() => setView('login')} className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-brand-200">
             Go to Login <ArrowRight className="ml-2" />
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Progress Steps */}
      <div className="w-full max-w-4xl mb-12 hidden md:block">
        <div className="flex justify-between items-center relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 -translate-y-1/2 rounded-full" />
          
          {steps.map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center bg-gray-50 px-2">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-4
                  ${step >= s.num 
                    ? 'bg-brand-600 text-white border-brand-100 shadow-lg scale-110' 
                    : 'bg-white text-gray-400 border-gray-200'
                  }
                `}
              >
                {step > s.num ? <Check size={20} /> : <s.icon size={20} />}
              </div>
              <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-brand-600' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`bg-white rounded-3xl shadow-xl w-full transition-all duration-300 border border-gray-100 ${step === 3 ? 'max-w-6xl' : 'max-w-2xl'}`}>
        
        {/* Header Section */}
        <div className="text-center pt-10 px-8 pb-6 border-b border-gray-50">
           <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-200">
              <School size={32} className="text-white" />
           </div>
           <h2 className="text-2xl font-black text-gray-900 tracking-tight">Register Your School</h2>
           <p className="text-gray-500 font-medium mt-1">
             {step === 1 && "Enter your school information"}
             {step === 2 && "Create your administrator account"}
             {step === 3 && "Select a plan that fits your school's needs"}
             {step === 4 && "Complete payment to activate your school"}
             {step === 5 && "Review and confirm your registration"}
           </p>
        </div>

        <div className="p-8 md:p-12">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <AlertTriangle size={20} className="shrink-0" />
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="School Name *" placeholder="Example High School" value={form.name} onChange={(e:any) => setForm({...form, name: e.target.value})} className="md:col-span-2"/>
                 <Input label="District *" placeholder="Central District" value={form.district} onChange={(e:any) => setForm({...form, district: e.target.value})} className="md:col-span-2"/>
                 <Input label="School Phone Number *" placeholder="+250 xxx xxx xxx" value={form.phone} onChange={(e:any) => setForm({...form, phone: e.target.value})} className="md:col-span-2"/>
                 <Input label="School Address *" placeholder="123 Education Street, City" value={form.address} onChange={(e:any) => setForm({...form, address: e.target.value})} className="md:col-span-2"/>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-brand-300 flex items-start gap-4 shadow-sm hover:border-brand-500 hover:shadow-md transition-all">
                <input type="checkbox" id="nursery" checked={form.hasNursery} onChange={e => setForm({...form, hasNursery: e.target.checked})} className="mt-1 w-5 h-5 text-brand-600 rounded border-gray-300 focus:ring-brand-500 cursor-pointer" />
                <div className="cursor-pointer" onClick={() => setForm({...form, hasNursery: !form.hasNursery})}>
                  <label htmlFor="nursery" className="block text-sm font-bold text-brand-900 cursor-pointer">Include Nursery Section</label>
                  <p className="text-xs text-brand-700 mt-1 font-medium">Enable features for early childhood education reporting.</p>
                </div>
              </div>

              <div className="pt-4 text-right">
                 <Button className="w-full md:w-auto px-10 h-12 rounded-xl font-bold uppercase tracking-widest text-xs" onClick={() => validateStep1() && setStep(2)}>Next <CheckCircle size={16} className="ml-2"/></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
              <Input label="Administrator Full Name *" placeholder="John Smith" value={form.adminName} onChange={(e:any) => setForm({...form, adminName: e.target.value})} />
              <Input label="Email Address *" type="email" placeholder="admin@school.com" value={form.email} onChange={(e:any) => setForm({...form, email: e.target.value})} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Password *" type="password" placeholder="••••••••" value={form.pass} onChange={(e:any) => setForm({...form, pass: e.target.value})} />
                <Input label="Confirm Password *" type="password" placeholder="••••••••" value={form.confirmPass} onChange={(e:any) => setForm({...form, confirmPass: e.target.value})} />
              </div>
              <p className="text-xs text-gray-400">Minimum 6 characters required for password.</p>

              <div className="flex gap-4 pt-6">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl font-bold">Previous</Button>
                <Button onClick={() => validateStep2() && setStep(3)} className="flex-1 h-12 rounded-xl font-bold">Next <CheckCircle size={16} className="ml-2"/></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in slide-in-from-right fade-in duration-300">
              <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                {plans.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => setForm({...form, plan: p.id})} 
                    className={`p-8 rounded-[2rem] cursor-pointer transition-all duration-300 flex flex-col border-2 relative
                      ${form.plan === p.id 
                        ? 'border-brand-600 ring-4 ring-brand-50 bg-white z-10' 
                        : 'border-gray-100 hover:border-brand-200 bg-white hover:shadow-lg'
                      }
                    `}
                  >
                    {p.is_popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Most Popular</div>}
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                    <div className="mb-6 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-brand-600">{formatCurrency(p.price_monthly).split('.')[0]}</span>
                      <span className="text-gray-500 font-bold text-xs">FRw/month</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{p.description}</p>
                    
                    <ul className="space-y-4 mb-8 flex-1">
                      {p.features.map((f, idx) => (
                         <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                            <Check size={18} className="text-green-500 shrink-0 mt-0.5" /> <span>{f}</span>
                         </li>
                      ))}
                    </ul>

                    <div className={`w-full py-3 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${form.plan === p.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                       {form.plan === p.id ? 'Selected' : 'Select Plan'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="max-w-xl mx-auto flex gap-6">
                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1 h-14 rounded-2xl font-bold">Previous</Button>
                <Button onClick={() => setStep(4)} className="flex-1 h-14 rounded-2xl font-bold shadow-xl shadow-brand-200">Continue to Payment</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in slide-in-from-right fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Column: Methods */}
                <div className="space-y-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-4">Select Payment Method *</h3>
                  <div className="space-y-3">
                    {paymentMethods.map((pm) => (
                      <div 
                        key={pm.id}
                        onClick={() => setSelectedMethod(pm.id)}
                        className={`relative p-4 border rounded-xl transition-all cursor-pointer flex items-center gap-4 group
                          ${selectedMethod === pm.id 
                            ? 'border-brand-600 ring-1 ring-brand-600 bg-brand-50' 
                            : 'border-gray-200 hover:border-brand-300 bg-white hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${pm.bg} ${pm.color}`}>
                          <pm.icon size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{pm.name}</div>
                          <div className="text-xs text-gray-500 font-medium font-mono mt-1 tracking-tight">{pm.detail}</div>
                        </div>
                        {selectedMethod === pm.id && (
                          <div className="absolute right-4 text-brand-600">
                             <CheckCircle size={22} className="fill-brand-100" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Upload & Guide */}
                <div className="flex flex-col h-full">
                  <h3 className="font-bold text-gray-900 text-lg mb-4">Upload Payment Screenshot *</h3>
                  
                  <div className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center p-8 hover:bg-gray-100 transition-colors relative min-h-[200px] mb-6">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {paymentFile ? (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                              <CheckCircle size={32} />
                          </div>
                          <p className="font-bold text-gray-900 break-all px-4">{paymentFile.name}</p>
                          <p className="text-xs text-green-600 font-bold uppercase mt-2">Ready to upload</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-brand-500">
                              <UploadCloud size={32} />
                          </div>
                          <p className="font-bold text-gray-900">Click to upload your payment screenshot</p>
                          <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                  </div>

                  <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4 text-sm text-blue-800">
                      <div className="shrink-0 mt-1"><Info size={20} className="text-blue-600" /></div>
                      <div className="leading-relaxed text-xs font-medium space-y-2 opacity-90">
                          <p><strong>Verification Process:</strong> Make sure the platform admin approves your request. They must verify your payment to allow the school login and enable you to add teachers.</p>
                      </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-10 border-t border-gray-100 mt-8">
                <Button variant="secondary" onClick={() => setStep(3)} className="flex-1 h-14 rounded-2xl font-bold">Previous</Button>
                <Button onClick={() => validateStep4() && setStep(5)} className="flex-1 h-14 rounded-2xl font-bold shadow-xl shadow-brand-200">Review & Confirm</Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in slide-in-from-right fade-in duration-300 space-y-8">
               {/* School Info Summary */}
               <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg"><School size={22}/> School Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">School Name</span> 
                        <span className="font-bold text-gray-900 text-base">{form.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">District</span> 
                        <span className="font-bold text-gray-900 text-base">{form.district}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Phone</span> 
                        <span className="font-bold text-gray-900 text-base">{form.phone}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Address</span> 
                        <span className="font-bold text-gray-900 text-base">{form.address}</span>
                      </div>
                  </div>
               </div>

               {/* Admin Summary */}
               <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg"><UserCircle size={22}/> Administrator Account</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Name</span> 
                        <span className="font-bold text-gray-900 text-base">{form.adminName}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Email</span> 
                        <span className="font-bold text-gray-900 text-base">{form.email}</span>
                      </div>
                  </div>
               </div>

               {/* Payment Summary */}
               <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg"><CreditCard size={22}/> Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="flex flex-col">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Payment Method</span> 
                          <span className="font-bold text-gray-900 text-base">{paymentMethods.find(p => p.id === selectedMethod)?.name}</span>
                      </div>
                      <div className="flex flex-col">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Screenshot</span> 
                          <span className="font-bold text-emerald-600 flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-100">
                            <CheckCircle size={16}/> Uploaded
                          </span>
                      </div>
                      {previewUrl && (
                          <div className="col-span-full mt-2">
                              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm inline-block bg-white p-2">
                                <img src={previewUrl} alt="Payment Proof" className="max-h-64 rounded-lg object-contain" />
                              </div>
                          </div>
                      )}
                  </div>
               </div>

               {/* Warning Box */}
               <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex gap-4 shadow-sm">
                  <AlertTriangle className="text-yellow-600 shrink-0 mt-1" size={24} />
                  <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                      After submitting, your registration will be reviewed by our admin team. You will be notified once your school is approved and you can start using the platform.
                  </p>
               </div>

               {/* Actions */}
               <div className="flex gap-6 pt-4">
                  <Button variant="secondary" onClick={() => setStep(4)} className="flex-1 h-14 rounded-2xl font-bold">Previous</Button>
                  <Button onClick={submitRegistration} isLoading={isLoading} className="flex-1 h-14 rounded-2xl font-bold shadow-xl shadow-brand-200">Submit Registration</Button>
               </div>
            </div>
          )}
        </div>
      </div>
      
      <button 
        onClick={() => setView('landing')} 
        className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-brand-600 flex items-center gap-2 transition-all"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>
    </div>
  );
};
