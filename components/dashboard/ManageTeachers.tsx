import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { db } from '../../services/db';
import { User } from '../../types';

export const ManageTeachers = ({ user }: { user: User }) => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '' });

  const fetchTeachers = async () => {
    setLoading(true);
    const data = await db.getUsers(user.school_id, 'teacher');
    setTeachers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, [user.school_id]);

  const handleAdd = async () => {
    if (!newTeacher.name || !newTeacher.email) return;
    setAdding(true);
    try {
      // In a real production app, this should call an Edge Function to create an Auth user.
      // Here we insert the profile so the Admin sees them. 
      await db.addUser({ 
        school_id: user.school_id, 
        role: 'teacher', 
        full_name: newTeacher.name, 
        email: newTeacher.email,
        password: '123' // Placeholder
      });
      await fetchTeachers();
      setModalOpen(false);
      setNewTeacher({ name: '', email: '' });
    } catch (e) {
      alert('Failed to add teacher');
      console.error(e);
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this teacher?')) {
       await db.deleteUser(id);
       fetchTeachers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Teacher Directory</h2>
        <Button onClick={() => setModalOpen(true)}><UserPlus size={18} /> Add Teacher</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-600"/></div>
        ) : (
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 border-b">
            <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y">
            {teachers.map(t => (
              <tr key={t.id}>
                <td className="p-4 font-medium">{t.full_name}</td>
                <td className="p-4 text-gray-500">{t.email}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
                <tr><td colSpan={3} className="p-8 text-center text-gray-400">No teachers found. Add one to get started.</td></tr>
            )}
          </tbody>
        </table>
        )}
      </div>
      {modalOpen && (
        <Modal title="Add New Teacher" onClose={() => setModalOpen(false)}>
          <Input label="Full Name" value={newTeacher.name} onChange={(e:any) => setNewTeacher({...newTeacher, name: e.target.value})} />
          <Input label="Email" value={newTeacher.email} onChange={(e:any) => setNewTeacher({...newTeacher, email: e.target.value})} />
          <Button className="w-full" onClick={handleAdd} isLoading={adding}>Create Account</Button>
          <p className="text-xs text-center mt-2 text-gray-400">User will appear in the list immediately.</p>
        </Modal>
      )}
    </div>
  );
};