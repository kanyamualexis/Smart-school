
import React, { useState } from 'react';
import { School } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { db } from '../services/db';

export const AuthPage = ({ setView, setUser }: any) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const login = (e:any) => {
    e.preventDefault();
    const u = db.login(email, pass);
    if(u) { setUser(u); setView('dashboard'); }
    else alert('Invalid Login. Use admin@smartschoolflow.com / admin123');
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center items-center bg-brand-600 text-white p-12 text-center">
        <School size={64} className="mb-6" />
        <h1 className="text-4xl font-bold mb-4">Smart School Flow</h1>
        <p className="text-lg opacity-90">Manage your entire institution from one unified dashboard.</p>
      </div>
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
          <form onSubmit={login} className="space-y-4">
            <Input label="Email" value={email} onChange={(e:any) => setEmail(e.target.value)} />
            <Input label="Password" type="password" value={pass} onChange={(e:any) => setPass(e.target.value)} />
            <Button className="w-full h-12">Sign In</Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <span onClick={() => setView('register')} className="text-brand-600 font-bold cursor-pointer hover:underline">Register School</span>
          </div>
          <button onClick={() => setView('landing')} className="w-full mt-4 text-gray-400 text-sm hover:text-gray-600">Back to Home</button>
        </div>
      </div>
    </div>
  );
};
