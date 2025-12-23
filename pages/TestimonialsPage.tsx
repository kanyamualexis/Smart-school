
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const TestimonialsPage = ({ setView }: any) => (
  <div className="min-h-screen bg-white p-6">
    <div className="max-w-6xl mx-auto">
      <Button variant="secondary" onClick={() => setView('landing')} className="mb-8">← Back Home</Button>
      <h1 className="text-4xl font-bold text-center mb-16">Trusted by Top Schools</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Sarah Johnson", role: "Principal", text: "Smart School Flow transformed our administrative processes." },
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
