
import React, { useState } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { db } from '../../services/db';
import { User } from '../../types';

export const ManageTeachers = ({ user }: { user: User }) => {
  const [teachers, setTeachers] = useState(db.getUsers(user.school_id, 'teacher'));
  const [modalOpen, setModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '' });

  const handleAdd = () => {
    db.addUser({ 
      id: `u_${Date.now()}`, 
      school_id: user.school_id, 
      role: 'teacher', 
      full_name: newTeacher.name, 
      email: newTeacher.email, 
      password: '123' 
    });
    setTeachers(db.getUsers(user.school_id, 'teacher'));
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Teacher Directory</h2>
        <Button onClick={() => setModalOpen(true)}><UserPlus size={18} /> Add Teacher</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
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
                  <button onClick={() => { db.deleteUser(t.id); setTeachers(db.getUsers(user.school_id, 'teacher')); }} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <Modal title="Add New Teacher" onClose={() => setModalOpen(false)}>
          <Input label="Full Name" onChange={(e:any) => setNewTeacher({...newTeacher, name: e.target.value})} />
          <Input label="Email" onChange={(e:any) => setNewTeacher({...newTeacher, email: e.target.value})} />
          <Button className="w-full" onClick={handleAdd}>Create Account</Button>
          <p className="text-xs text-center mt-2 text-gray-400">Default password: 123</p>
        </Modal>
      )}
    </div>
  );
};
