import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { db } from '../../services/db';
import { User, Student, ClassGrade } from '../../types';

export const ManageStudents = ({ user }: { user: User }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', index: '', grade: '' });

  const fetchData = async () => {
    setLoading(true);
    const [stData, clData] = await Promise.all([
        db.getStudents(user.school_id),
        db.getClasses(user.school_id)
    ]);
    setStudents(stData);
    setClasses(clData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user.school_id]);

  const handleAdd = async () => {
    if(!formData.name || !formData.index || !formData.grade) return;
    setAdding(true);
    try {
        await db.addStudent({
          school_id: user.school_id,
          full_name: formData.name,
          index_number: formData.index,
          class_grade: formData.grade
        });
        await fetchData();
        setModalOpen(false);
        setFormData({ name: '', index: '', grade: '' });
    } catch (e) {
        console.error(e);
        alert("Error adding student");
    }
    setAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Student Roster</h2>
        <Button onClick={() => setModalOpen(true)}><Plus size={18} /> Enroll Student</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
             <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-600"/></div>
        ) : (
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
            {students.length === 0 && (
                <tr><td colSpan={3} className="p-8 text-center text-gray-400">No students enrolled yet.</td></tr>
            )}
          </tbody>
        </table>
        )}
      </div>
      {modalOpen && (
        <Modal title="Enroll Student" onClose={() => setModalOpen(false)}>
          <Input label="Full Name" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} />
          <Input label="Index Number (e.g. 2024/001)" value={formData.index} onChange={(e:any) => setFormData({...formData, index: e.target.value})} />
          
          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
             <select 
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
             >
                <option value="">Select a Class...</option>
                {classes.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                ))}
             </select>
             {classes.length === 0 && <p className="text-xs text-red-500 mt-1">Please add Classes in 'Academics' tab first.</p>}
          </div>

          <Button className="w-full" onClick={handleAdd} isLoading={adding} disabled={classes.length === 0}>Enroll</Button>
        </Modal>
      )}
    </div>
  );
};