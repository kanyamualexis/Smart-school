import React, { useState, useEffect } from 'react';
import { Plus, Users, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { db } from '../../services/db';
import { User, ClassGrade } from '../../types';

export const ManageClasses = ({ user }: { user: User }) => {
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({ name: '' });

  const fetchClasses = async () => {
    setLoading(true);
    const data = await db.getClasses(user.school_id);
    setClasses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, [user.school_id]);

  const handleAdd = async () => {
    if (!newClass.name) return;
    await db.addClass({
      name: newClass.name,
      school_id: user.school_id
    });
    await fetchClasses();
    setModalOpen(false);
    setNewClass({ name: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Class Management</h2>
        <Button onClick={() => setModalOpen(true)}><Plus size={18} /> Add Class</Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-600"/></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(cl => (
            <div key={cl.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Active
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{cl.name}</h3>
              <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <Users size={16} /> Students
                </div>
              </div>
            </div>
          ))}
          {classes.length === 0 && (
             <div className="col-span-full text-center text-gray-400 py-12 bg-white rounded-xl border border-dashed">
                No classes added yet.
             </div>
          )}
        </div>
      )}

      {modalOpen && (
        <Modal title="Create New Class" onClose={() => setModalOpen(false)}>
          <Input 
            label="Class Name" 
            placeholder="e.g. Primary 4, Senior 1" 
            value={newClass.name}
            onChange={(e:any) => setNewClass({ name: e.target.value })} 
          />
          <Button className="w-full mt-4" onClick={handleAdd}>Create Class</Button>
        </Modal>
      )}
    </div>
  );
};