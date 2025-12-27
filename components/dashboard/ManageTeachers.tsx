
import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Loader2, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { db } from '../../services/db';
import { User, ClassGrade, Subject } from '../../types';

export const ManageTeachers = ({ user }: { user: User }) => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  
  const [newTeacher, setNewTeacher] = useState({ 
    name: '', 
    email: '', 
    assigned_class: '', 
    assigned_subject: '' 
  });

  const fetchData = async () => {
    setLoading(true);
    const [tData, cData, sData] = await Promise.all([
      db.getUsers(user.school_id, 'teacher'),
      db.getClasses(user.school_id),
      db.getSubjects(user.school_id)
    ]);
    setTeachers(tData);
    setClasses(cData);
    setSubjects(sData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user.school_id]);

  const handleAdd = async () => {
    if (!newTeacher.name || !newTeacher.email) return;
    setAdding(true);
    try {
      await db.addUser({ 
        school_id: user.school_id, 
        role: 'teacher', 
        full_name: newTeacher.name, 
        email: newTeacher.email,
        password: '123', // Default password
        assigned_class: newTeacher.assigned_class,
        assigned_subject: newTeacher.assigned_subject
      });
      await fetchData();
      setModalOpen(false);
      setNewTeacher({ name: '', email: '', assigned_class: '', assigned_subject: '' });
    } catch (e) {
      alert('Failed to add teacher');
      console.error(e);
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this teacher?')) {
       await db.deleteUser(id);
       fetchData();
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
            <tr className="text-xs font-black uppercase tracking-widest">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Class Teacher</th>
              <th className="p-4">Primary Subject</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {teachers.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-900">{t.full_name}</td>
                <td className="p-4 text-gray-500">{t.email}</td>
                <td className="p-4">
                  {t.assigned_class ? (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                      <GraduationCap size={12}/> {t.assigned_class}
                    </span>
                  ) : <span className="text-gray-400 text-xs italic">None</span>}
                </td>
                <td className="p-4">
                  {t.assigned_subject ? (
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                      <BookOpen size={12}/> {t.assigned_subject}
                    </span>
                  ) : <span className="text-gray-400 text-xs italic">None</span>}
                </td>
                <td className="p-4">
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors" title="Remove"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No teachers found. Add one to get started.</td></tr>
            )}
          </tbody>
        </table>
        )}
      </div>
      {modalOpen && (
        <Modal title="Add New Teacher" onClose={() => setModalOpen(false)}>
          <div className="space-y-4">
            <Input label="Full Name" value={newTeacher.name} onChange={(e:any) => setNewTeacher({...newTeacher, name: e.target.value})} placeholder="e.g. Tr. John Doe" />
            <Input label="Email" type="email" value={newTeacher.email} onChange={(e:any) => setNewTeacher({...newTeacher, email: e.target.value})} placeholder="teacher@school.com" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Class (Optional)</label>
                <select 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                  value={newTeacher.assigned_class}
                  onChange={(e) => setNewTeacher({...newTeacher, assigned_class: e.target.value})}
                >
                  <option value="">No Class Assigned</option>
                  {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Subject (Optional)</label>
                <select 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                  value={newTeacher.assigned_subject}
                  onChange={(e) => setNewTeacher({...newTeacher, assigned_subject: e.target.value})}
                >
                  <option value="">No Subject Assigned</option>
                  {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <Button className="w-full h-12 mt-4" onClick={handleAdd} isLoading={adding}>Create Teacher Account</Button>
            <p className="text-xs text-center text-gray-400">Default password is '123'. Teacher can change it later.</p>
          </div>
        </Modal>
      )}
    </div>
  );
};
