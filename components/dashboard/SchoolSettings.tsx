
import React, { useState, useEffect } from 'react';
import { Settings, Edit, Palette, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { db } from '../../services/db';
import { User, SchoolData } from '../../types';

export const SchoolSettings = ({ user }: { user: User }) => {
  const [school, setSchool] = useState<SchoolData | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', theme_color: '#2563eb', logo: '' });

  useEffect(() => {
    const fetchSchool = async () => {
      const data = await db.getSchool(user.school_id);
      setSchool(data);
      if (data) {
        setForm({ 
          name: data.name, 
          theme_color: data.theme_color || '#2563eb',
          logo: data.logo || ''
        });
      }
    };
    fetchSchool();
  }, [user.school_id]);

  const handleSave = async () => {
    await db.updateSchool(user.school_id, form);
    const updated = await db.getSchool(user.school_id);
    setSchool(updated);
    setEdit(false);
    // Reload to apply theme globally immediately
    window.location.reload(); 
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!school) return <div>Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-gray-900"><Settings className="text-brand-600" /> School Configuration</h2>
        
        <div className="space-y-8">
          
          {/* Logo Section */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-6">
             <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                   {form.logo ? (
                      <img src={form.logo} alt="School Logo" className="w-full h-full object-cover" />
                   ) : (
                      <ImageIcon className="text-gray-300" size={32} />
                   )}
                </div>
                {edit && (
                  <label className="absolute bottom-0 right-0 p-2 bg-brand-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-brand-700 transition-colors">
                    <UploadCloud size={14} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </label>
                )}
             </div>
             <div className="text-center md:text-left">
                <h3 className="font-bold text-gray-900">School Logo</h3>
                <p className="text-sm text-gray-500 max-w-sm mt-1">Upload your official school crest or logo. This will appear on reports and the dashboard sidebar.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">School Name</label>
               <input 
                 disabled={!edit} 
                 value={edit ? form.name : school.name} 
                 onChange={e => setForm({...form, name: e.target.value})}
                 className="w-full border border-gray-300 p-3 rounded-xl bg-white disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
               />
             </div>

             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Theme Branding</label>
                <div className="flex items-center gap-4 h-[46px]">
                   <input 
                     type="color" 
                     disabled={!edit}
                     value={edit ? form.theme_color : (school.theme_color || '#2563eb')}
                     onChange={e => setForm({...form, theme_color: e.target.value})}
                     className="h-10 w-20 rounded cursor-pointer disabled:opacity-50 border border-gray-300 p-1 bg-white"
                   />
                   <span className="text-xs text-gray-500 font-medium">Select a primary color for your dashboard.</span>
                </div>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="text-[10px] text-blue-600 uppercase font-black tracking-widest mb-1">Current Plan</div>
              <div className="text-lg font-bold capitalize text-gray-900">{school.plan}</div>
            </div>
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
              <div className="text-[10px] text-purple-600 uppercase font-black tracking-widest mb-1">Nursery Support</div>
              <div className="text-lg font-bold text-gray-900">{school.has_nursery ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
              {edit ? (
                <div className="flex gap-3">
                   <Button variant="secondary" onClick={() => setEdit(false)} className="rounded-xl font-bold">Cancel</Button>
                   <Button onClick={handleSave} className="rounded-xl font-bold shadow-lg shadow-brand-200">Save Changes</Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setEdit(true)} className="rounded-xl font-bold border-gray-200 text-gray-600 hover:bg-gray-50"><Edit size={16} /> Edit Settings</Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
