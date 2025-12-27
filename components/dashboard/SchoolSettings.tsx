
import React, { useState, useEffect } from 'react';
import { Settings, Edit, Palette } from 'lucide-react';
import { Button } from '../ui/Button';
import { db } from '../../services/db';
import { User, SchoolData } from '../../types';

export const SchoolSettings = ({ user }: { user: User }) => {
  const [school, setSchool] = useState<SchoolData | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', theme_color: '#2563eb' });

  useEffect(() => {
    const fetchSchool = async () => {
      const data = await db.getSchool(user.school_id);
      setSchool(data);
      if (data) setForm({ name: data.name, theme_color: data.theme_color || '#2563eb' });
    };
    fetchSchool();
  }, [user.school_id]);

  const handleSave = async () => {
    await db.updateSchool(user.school_id, form);
    const updated = await db.getSchool(user.school_id);
    setSchool(updated);
    setEdit(false);
    // Reload to apply theme globally immediately without complex state lifting for this demo
    window.location.reload(); 
  };

  if (!school) return <div>Loading settings...</div>;

  return (
    <div className="max-w-2xl bg-white rounded-xl shadow-sm border p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings /> School Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
          <div className="flex gap-2">
            <input 
              disabled={!edit} 
              value={edit ? form.name : school.name} 
              onChange={e => setForm({...form, name: e.target.value})}
              className="flex-1 border p-2 rounded bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
           <div className="flex items-center gap-4">
              <input 
                type="color" 
                disabled={!edit}
                value={edit ? form.theme_color : (school.theme_color || '#2563eb')}
                onChange={e => setForm({...form, theme_color: e.target.value})}
                className="h-10 w-20 rounded cursor-pointer disabled:opacity-50"
              />
              <span className="text-xs text-gray-500">Pick a brand color for your dashboard sidebar and accents.</span>
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-gray-50 rounded border">
            <div className="text-xs text-gray-500 uppercase font-bold">Current Plan</div>
            <div className="text-lg font-bold capitalize text-brand-600">{school.plan}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded border">
            <div className="text-xs text-gray-500 uppercase font-bold">Nursery Support</div>
            <div className="text-lg font-bold">{school.has_nursery ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
            {edit ? (
              <div className="flex gap-2">
                 <Button variant="secondary" onClick={() => setEdit(false)} size="sm">Cancel</Button>
                 <Button onClick={handleSave} size="sm">Save Changes</Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setEdit(true)} size="sm"><Edit size={16} /> Edit Settings</Button>
            )}
        </div>
      </div>
    </div>
  );
};
