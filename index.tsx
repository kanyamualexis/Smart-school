
import React, { useState } from 'react';
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

db.init();

const App = () => {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState<User | null>(null);

  switch(view) {
    case 'dashboard': return user ? <DashboardPage user={user} setUser={setUser} setView={setView} /> : <AuthPage setView={setView} setUser={setUser} />;
    case 'login': return <AuthPage setView={setView} setUser={setUser} />;
    case 'register': return <RegisterPage setView={setView} />;
    case 'result_check': return <ResultCheckPage setView={setView} />;
    case 'pricing': return <PricingPage setView={setView} />;
    case 'testimonials': return <TestimonialsPage setView={setView} />;
    default: return <LandingPage setView={setView} />;
  }
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
