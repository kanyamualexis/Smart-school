
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { db } from '../services/db';

export const GlobalBanner = () => {
  const [banner, setBanner] = useState({ message: '', active: false });

  const fetchBanner = async () => {
    const data = await db.getGlobalBanner();
    setBanner(data);
  };

  useEffect(() => {
    fetchBanner();
    const handleUpdate = () => fetchBanner();
    window.addEventListener('global-banner-change', handleUpdate);
    return () => window.removeEventListener('global-banner-change', handleUpdate);
  }, []);

  if (!banner.active || !banner.message) return null;

  return (
    <div className="bg-yellow-400 text-yellow-900 px-4 py-3 relative z-[100] shadow-sm border-b border-yellow-500/10">
      <div className="max-w-7xl mx-auto flex items-start md:items-center gap-3">
        <Bell className="shrink-0 mt-0.5 md:mt-0 fill-yellow-900/20" size={18} />
        <p className="text-sm font-bold leading-tight">{banner.message}</p>
      </div>
    </div>
  );
};
