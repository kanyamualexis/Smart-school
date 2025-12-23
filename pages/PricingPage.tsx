
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';

export const PricingPage = ({ setView, embedded }: any) => (
  <div className={`bg-white ${embedded ? 'py-32' : 'min-h-screen p-6'}`}>
    <div className="max-w-7xl mx-auto px-4">
      {!embedded && <Button variant="secondary" onClick={() => setView('landing')} className="mb-12 rounded-xl font-bold">← Back Home</Button>}
      
      <div className="text-center mb-24">
        <h5 className="text-brand-600 font-bold tracking-[0.2em] uppercase text-xs mb-6">Pricing</h5>
        <h2>Simple, transparent pricing</h2>
        <p className="max-w-2xl mx-auto text-base font-medium">Choose the plan that fits your school's needs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 items-stretch">
        {[
          { name: "Starter", price: 60000, desc: "Perfect for small schools", color: "border-gray-100 shadow-sm", feats: ["Nursery & Primary Only", "Up to 100 Students", "Basic Reports", "Email Support", "Mobile App Access"] },
          { name: "Professional", price: 130000, desc: "Best for growing schools", color: "border-brand-600 ring-4 ring-brand-600/5 shadow-2xl", popular: true, feats: ["All Levels (Nursery-Secondary)", "Up to 500 Students", "Advanced Analytics", "Priority Support", "Custom Branding", "API Access"] },
          { name: "Enterprise", price: 260000, desc: "For large institutions", color: "border-gray-100 shadow-sm", feats: ["Unlimited Students", "All Levels", "White-label Solution", "24/7 Phone Support", "Dedicated Account Manager", "Custom Integrations"] }
        ].map((plan, i) => (
          <div key={i} className={`bg-white rounded-[3rem] p-12 border relative flex flex-col transition-all duration-300 ${plan.color} ${plan.popular ? 'z-10 scale-105 shadow-xl' : 'hover:shadow-lg'}`}>
            {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">Popular</div>}
            
            <div className="mb-10">
              <h3 className="mb-2 text-2xl leading-none">{plan.name}</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{plan.desc}</p>
            </div>
            
            <div className="mb-12 leading-none flex items-baseline gap-1">
              <span className="text-4xl font-black text-gray-900">{formatCurrency(plan.price).split('.')[0]}</span>
              <span className="text-gray-400 font-bold text-sm">/mo</span>
            </div>
            
            <ul className="space-y-5 mb-12 flex-1">
              {plan.feats.map((f, j) => (
                <li key={j} className="flex items-start gap-4 text-gray-600 text-sm font-semibold leading-tight">
                  <CheckCircle size={20} className="text-brand-500 shrink-0 mt-0.5" /> 
                  {f}
                </li>
              ))}
            </ul>
            
            <Button variant={plan.popular ? 'primary' : 'outline'} className={`w-full h-16 rounded-2xl text-[11px] font-bold uppercase tracking-widest ${!plan.popular ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : ''}`} onClick={() => setView('register')}>Get Started</Button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
