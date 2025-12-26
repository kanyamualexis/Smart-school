import React, { useEffect, useState } from 'react';
import { Building2, AlertCircle, CreditCard, Activity, PieChart } from 'lucide-react';
import { Card } from '../ui/Card';
import { db } from '../../services/db';
import { formatCurrency } from '../../utils/formatters';

export const PlatformOverview = () => {
  const [stats, setStats] = useState({ activeCount: 0, pending: 0 });

  useEffect(() => {
    const load = async () => {
      const schools = await db.getSchools();
      setStats({
        activeCount: schools.filter(s => s.status === 'active').length,
        pending: schools.filter(s => s.status === 'pending').length
      });
    };
    load();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Active Schools" value={stats.activeCount} icon={Building2} color="bg-blue-50 text-blue-600" />
        <Card title="Pending Review" value={stats.pending} icon={AlertCircle} color="bg-amber-50 text-amber-600" />
        <Card title="Revenue (Mo)" value={formatCurrency(stats.activeCount * 130000)} icon={CreditCard} color="bg-emerald-50 text-emerald-600" />
        <Card title="Systems Online" value={stats.activeCount} icon={Activity} color="bg-indigo-50 text-indigo-600" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center h-80">
           <PieChart size={64} className="text-gray-100 mb-6" />
           <h3 className="text-lg font-bold text-gray-800">Enrollment Growth</h3>
           <p className="text-sm text-gray-400 max-w-xs">Visualization module for cross-school enrollment trends is initializing.</p>
        </div>
      </div>
    </div>
  );
};