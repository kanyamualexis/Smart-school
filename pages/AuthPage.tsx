import React, { useState } from 'react';
import { School, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { db } from '../services/db';

export const AuthPage = ({ setView, setUser }: any) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Pre-validation to help user
    if (!email.trim() || !pass.trim()) {
       setError('Please enter both email and password.');
       setLoading(false);
       return;
    }

    const { user, error } = await db.login(email, pass);
    
    if (user) {
      setUser(user);
      setView('dashboard');
    } else {
      setError(error || 'Invalid credentials. Please check for typos.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center items-center bg-brand-600 text-white p-12 text-center">
        <School size={64} className="mb-6" />
        <h1 className="text-4xl font-bold mb-4">Smart School Flow</h1>
        <p className="text-lg opacity-90">Manage your entire institution from one unified dashboard.</p>
        <p className="mt-4 text-sm text-brand-100">Secure, Cloud-Based School Management</p>
      </div>
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={login} className="space-y-4">
            <Input 
                label="Email" 
                type="email" 
                value={email} 
                onChange={(e:any) => setEmail(e.target.value)} 
                required 
                placeholder="name@school.com"
            />
            <Input 
                label="Password" 
                type="password" 
                value={pass} 
                onChange={(e:any) => setPass(e.target.value)} 
                required 
            />
            <Button className="w-full h-12" isLoading={loading}>Sign In</Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <button onClick={() => setView('register')} className="text-brand-600 font-bold cursor-pointer hover:underline">Register School</button>
          </div>
          <button onClick={() => setView('landing')} className="w-full mt-4 text-gray-400 text-sm hover:text-gray-600">Back to Home</button>
        </div>
      </div>
    </div>
  );
};