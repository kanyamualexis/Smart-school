
import React, { useState, useEffect } from 'react';
import { ManageTeachers } from './ManageTeachers';
import { ManageStudents } from './ManageStudents';
import { SchoolSettings } from './SchoolSettings';
import { User, SchoolData, Parent } from '../../types';
import { db } from '../../services/db';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { ShieldCheck, UserPlus, CreditCard, Lock, Users, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const AdminModule = ({ user, section }: { user: User, section: string }) => {
  // Map sections to internal tabs or render directly
  if (section === 'settings') return <SchoolSettings user={user} />;
  if (section === 'billing') return <BillingSection user={user} />;
  if (section === 'security') return <SecuritySection />;
  
  return <UserManagement user={user} />;
};

// --- SUB COMPONENTS ---

const UserManagement = ({ user }: { user: User }) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'students' | 'parents' | 'admins'>('teachers');
  
  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['teachers', 'students', 'parents', 'admins'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap
              ${activeTab === tab ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
         {activeTab === 'teachers' && <ManageTeachers user={user} />}
         {activeTab === 'students' && <ManageStudents user={user} />}
         {activeTab === 'parents' && <ManageParents user={user} />}
         {activeTab === 'admins' && (
           <div className="p-10 text-center text-gray-400">
             <ShieldCheck size={48} className="mx-auto mb-4 opacity-20"/>
             <h3 className="text-lg font-bold text-gray-900">Admin Privileges</h3>
             <p className="text-sm">Configure access levels for other administrative staff.</p>
           </div>
         )}
      </div>
    </div>
  );
};

const ManageParents = ({ user }: { user: User }) => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newParent, setNewParent] = useState({ full_name: '', email: '', phone: '' });

  useEffect(() => {
    fetchParents();
  }, [user.school_id]);

  const fetchParents = async () => {
    const data = await db.getParents(user.school_id);
    setParents(data);
  };

  const handleAddParent = async () => {
    if (!newParent.full_name || !newParent.email) return;
    await db.addParent({ ...newParent, school_id: user.school_id, student_ids: [] });
    await fetchParents();
    setModalOpen(false);
    setNewParent({ full_name: '', email: '', phone: '' });
  };

  return (
    <div className="p-6">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Parent Directory</h3>
          <Button onClick={() => setModalOpen(true)}><UserPlus size={16}/> Add Parent</Button>
       </div>
       
       <div className="overflow-x-auto">
         <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
               <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Phone</th><th className="p-4">Actions</th></tr>
            </thead>
            <tbody className="divide-y">
               {parents.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                     <td className="p-4 font-bold text-gray-900">{p.full_name}</td>
                     <td className="p-4 text-gray-500">{p.email}</td>
                     <td className="p-4 text-gray-500">{p.phone}</td>
                     <td className="p-4"><button className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button></td>
                  </tr>
               ))}
               {parents.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400">No parents registered yet.</td></tr>}
            </tbody>
         </table>
       </div>

       {modalOpen && (
          <Modal title="Add New Parent" onClose={() => setModalOpen(false)}>
             <div className="space-y-4">
                <Input label="Full Name" value={newParent.full_name} onChange={(e:any) => setNewParent({...newParent, full_name: e.target.value})} />
                <Input label="Email Address" type="email" value={newParent.email} onChange={(e:any) => setNewParent({...newParent, email: e.target.value})} />
                <Input label="Phone Number" value={newParent.phone} onChange={(e:any) => setNewParent({...newParent, phone: e.target.value})} />
                <Button className="w-full mt-4" onClick={handleAddParent}>Register Parent</Button>
             </div>
          </Modal>
       )}
    </div>
  );
};

const BillingSection = ({ user }: { user: User }) => {
  const [school, setSchool] = useState<SchoolData | null>(null);

  useEffect(() => {
    db.getSchool(user.school_id).then(setSchool);
  }, [user.school_id]);

  if (!school) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
       <div className="bg-brand-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden">
          <div className="relative z-10">
             <div className="text-sm font-bold uppercase tracking-widest text-brand-300 mb-2">Current Subscription</div>
             <h2 className="text-4xl font-black mb-6 capitalize">{school.plan} Plan</h2>
             <div className="flex gap-4">
                <Button className="bg-white text-brand-900 hover:bg-brand-50 border-none">Upgrade Plan</Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/10">Download Invoices</Button>
             </div>
          </div>
          <CreditCard className="absolute -right-10 -bottom-10 text-brand-800 opacity-50" size={200} />
       </div>

       <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Method</h3>
          <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
             <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-600">VISA</div>
                <div className="font-mono text-sm text-gray-600">•••• •••• •••• 4242</div>
             </div>
             <span className="text-xs font-bold uppercase text-green-600 bg-green-100 px-2 py-1 rounded">Primary</span>
          </div>
       </div>
    </div>
  );
};

const SecuritySection = () => (
  <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
     <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Lock size={20}/> Access Control</h3>
        <div className="space-y-4">
           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                 <div className="font-bold text-gray-900 text-sm">Two-Factor Authentication</div>
                 <div className="text-xs text-gray-500">Add an extra layer of security to your account</div>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer"><div className="w-6 h-6 bg-white rounded-full shadow-sm absolute left-0 top-0 border border-gray-200"></div></div>
           </div>
           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                 <div className="font-bold text-gray-900 text-sm">Session Timeout</div>
                 <div className="text-xs text-gray-500">Auto-logout after 15 minutes of inactivity</div>
              </div>
              <div className="w-12 h-6 bg-brand-600 rounded-full relative cursor-pointer"><div className="w-6 h-6 bg-white rounded-full shadow-sm absolute right-0 top-0 border border-gray-200"></div></div>
           </div>
        </div>
     </div>
  </div>
);
