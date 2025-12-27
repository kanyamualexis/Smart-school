
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Import global styles
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResultCheckPage } from './pages/ResultCheckPage';
import { DashboardPage } from './pages/DashboardPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { PricingPage } from './pages/PricingPage';
import { db } from './services/db';
import { User } from './types';
import { GlobalBanner } from './components/GlobalBanner';

db.init();

const App = () => {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for active session on load
  useEffect(() => {
    const checkSession = async () => {
      const u = await db.getCurrentUser();
      if (u) {
        setUser(u);
        setView('dashboard');
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  let content;
  switch(view) {
    case 'dashboard': content = user ? <DashboardPage user={user} setUser={setUser} setView={setView} /> : <AuthPage setView={setView} setUser={setUser} />; break;
    case 'login': content = <AuthPage setView={setView} setUser={setUser} />; break;
    case 'register': content = <RegisterPage setView={setView} />; break;
    case 'result_check': content = <ResultCheckPage setView={setView} />; break;
    case 'pricing': content = <PricingPage setView={setView} />; break;
    case 'testimonials': content = <TestimonialsPage setView={setView} />; break;
    default: content = <LandingPage setView={setView} />;
  }

  return (
    <>
      <GlobalBanner />
      {content}
    </>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
