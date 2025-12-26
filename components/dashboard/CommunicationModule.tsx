
import React, { useState } from 'react';
import { User } from '../../types';
import { db } from '../../services/db';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Megaphone, FileText, Download, Plus, UploadCloud } from 'lucide-react';

export const CommunicationModule = ({ user, section }: { user: User, section: string }) => {
  const [activeTab, setActiveTab] = useState('announcements');
  const announcements = db.getAnnouncements(user.school_id);
  const materials = db.getMaterials(user.school_id);

  if (section === 'materials') {
     return (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Learning Materials Library</h2>
              <Button><UploadCloud size={16}/> Upload New</Button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map(m => (
                 <div key={m.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
                       <FileText size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{m.title}</h3>
                    <p className="text-xs text-gray-500 mb-4">{m.class_id} • {m.date}</p>
                    <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-600 flex items-center justify-center gap-2">
                       <Download size={14}/> Download {m.type}
                    </button>
                 </div>
              ))}
              {materials.length === 0 && (
                 <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No materials uploaded yet.</p>
                 </div>
              )}
           </div>
        </div>
     );
  }

  return (
    <div className="space-y-6">
       <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-bold">School Announcements</h2>
             <Button><Plus size={16}/> New Announcement</Button>
          </div>
          <div className="space-y-4">
             {announcements.map(a => (
                <div key={a.id} className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                   <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                         <Megaphone size={16} className="text-brand-600" />
                         <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-100 px-2 py-1 rounded">
                            {a.target_role}
                         </span>
                      </div>
                      <span className="text-xs font-bold text-gray-400">{a.date}</span>
                   </div>
                   <h3 className="font-bold text-gray-900 mb-2">{a.title}</h3>
                   <p className="text-sm text-gray-600 leading-relaxed">{a.content}</p>
                </div>
             ))}
             {announcements.length === 0 && (
                <p className="text-gray-400 text-center py-8">No announcements posted.</p>
             )}
          </div>
       </div>
    </div>
  );
};
