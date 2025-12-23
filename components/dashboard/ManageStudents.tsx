
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { db } from '../../services/db';
import { User } from '../../types';

export const ManageStudents = ({ user }: { user: User }) => {
  const [students, setStudents] = useState(db.getStudents(user.school_id));
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', index: '', grade: '' });

  const handleAdd = () => {
    db.addStudent({
      id: `st_${Date.now()}`,
      school_id: user.school_id,
      full_name: formData.name,
      index_number: formData.index,
      class_grade: formData.grade
    });
    setStudents(db.getStudents(user.school_id));
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Student Roster</h2>
        <Button onClick={() => setModalOpen(true)}><Plus size={18} /> Enroll Student</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 border-b">
            <tr><th className="p-4">Name</th><th className="p-4">Index No.</th><th className="p-4">Grade</th></tr>
          </thead>
          <tbody className="divide-y">
            {students.map(s => (
              <tr key={s.id}>
                <td className="p-4 font-medium">{s.full_name}</td>
                <td className="p-4 font-mono text-sm">{s.index_number}</td>
                <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{s.class_grade}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <Modal title="Enroll Student" onClose={() => setModalOpen(false)}>
          <Input label="Full Name" onChange={(e:any) => setFormData({...formData, name: e.target.value})} />
          <Input label="Index Number (e.g. 2024/001 or NURSERY/001)" onChange={(e:any) => setFormData({...formData, index: e.target.value})} />
          <Input label="Class/Grade" onChange={(e:any) => setFormData({...formData, grade: e.target.value})} />
          <Button className="w-full" onClick={handleAdd}>Enroll</Button>
        </Modal>
      )}
    </div>
  );
};
