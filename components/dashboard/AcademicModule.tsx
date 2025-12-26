
import React, { useState, useEffect } from 'react';
import { ManageClasses } from './ManageClasses';
import { MarksEntry } from './MarksEntry';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { db } from '../../services/db';
import { User, Subject } from '../../types';
import { BookOpen, Calendar, FileText, CheckCircle } from 'lucide-react';

export const AcademicModule = ({ user, section }: { user: User, section: string }) => {
  if (section === 'assessments') return <AssessmentSection user={user} />;
  if (section === 'attendance') return <AttendanceSection user={user} />;
  return <AcademicsSection user={user} />;
};

// --- SUB COMPONENTS ---

const AcademicsSection = ({ user }: { user: User }) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects' | 'timetable'>('classes');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    db.getSubjects(user.school_id).then(setSubjects);
  }, [user.school_id]);

  const handleAddSubject = async () => {
    if(!newSubject) return;
    await db.addSubject({ id: `sub_${Date.now()}`, name: newSubject, school_id: user.school_id });
    const s = await db.getSubjects(user.school_id);
    setSubjects(s);
    setModalOpen(false);
    setNewSubject('');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 pb-1">
        {[
          { id: 'classes', label: 'Classes & Streams' },
          { id: 'subjects', label: 'Subjects Curriculum' },
          { id: 'timetable', label: 'Timetable' }
        ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-4 py-3 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === tab.id ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
           >
             {tab.label}
           </button>
        ))}
      </div>

      {activeTab === 'classes' && <ManageClasses user={user} />}
      
      {activeTab === 'subjects' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Subject List</h3>
              <Button onClick={() => setModalOpen(true)} size="sm"><BookOpen size={16}/> Add Subject</Button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subjects.map(s => (
                <div key={s.id} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-black text-xs">{s.name.substring(0,2)}</div>
                   <span className="font-bold text-gray-800">{s.name}</span>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
           <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
           <p className="text-gray-500 font-medium">Timetable management module is initializing.</p>
        </div>
      )}

      {modalOpen && (
        <Modal title="Add New Subject" onClose={() => setModalOpen(false)}>
           <Input label="Subject Name" value={newSubject} onChange={(e:any) => setNewSubject(e.target.value)} />
           <Button className="w-full mt-4" onClick={handleAddSubject}>Save Subject</Button>
        </Modal>
      )}
    </div>
  );
};

const AssessmentSection = ({ user }: { user: User }) => {
  const [mode, setMode] = useState<'entry' | 'reports'>('entry');

  return (
    <div className="space-y-6">
       <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-xl inline-flex">
             <button onClick={() => setMode('entry')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${mode === 'entry' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>Marks Entry</button>
             <button onClick={() => setMode('reports')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${mode === 'reports' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>Report Cards</button>
          </div>
       </div>

       {mode === 'entry' ? (
         <MarksEntry user={user} />
       ) : (
         <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm text-center">
            <FileText size={64} className="mx-auto mb-6 text-brand-200" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Generate Report Cards</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">Select a class and term to batch generate official PDF report cards for all students.</p>
            <div className="flex justify-center gap-4 max-w-lg mx-auto">
               <select className="flex-1 p-3 border rounded-xl bg-gray-50 text-sm font-bold text-gray-700 outline-none"><option>Select Class...</option></select>
               <select className="flex-1 p-3 border rounded-xl bg-gray-50 text-sm font-bold text-gray-700 outline-none"><option>Term 1</option></select>
            </div>
            <Button className="mt-6 px-8" size="lg">Generate Batch PDF</Button>
         </div>
       )}
    </div>
  );
};

const AttendanceSection = ({ user }: { user: User }) => {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
       <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">Daily Attendance</h3>
          <div className="flex gap-2">
             <input type="date" className="p-2 border rounded-lg text-sm bg-gray-50" />
             <Button size="sm">Load</Button>
          </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center">
             <div className="text-2xl font-black">850</div>
             <div className="text-[10px] font-bold uppercase tracking-widest">Present</div>
          </div>
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center">
             <div className="text-2xl font-black">12</div>
             <div className="text-[10px] font-bold uppercase tracking-widest">Absent</div>
          </div>
          <div className="p-4 bg-orange-50 text-orange-700 rounded-xl text-center">
             <div className="text-2xl font-black">5</div>
             <div className="text-[10px] font-bold uppercase tracking-widest">Late</div>
          </div>
       </div>
       <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
             <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                <tr><th className="p-4">Student</th><th className="p-4">Class</th><th className="p-4">Status</th><th className="p-4">Time In</th></tr>
             </thead>
             <tbody className="divide-y">
                <tr>
                   <td className="p-4 font-bold text-gray-900">Bart Simpson</td>
                   <td className="p-4 text-gray-500">P4</td>
                   <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Present</span></td>
                   <td className="p-4 text-gray-500">07:45 AM</td>
                </tr>
                <tr>
                   <td className="p-4 font-bold text-gray-900">Lisa Simpson</td>
                   <td className="p-4 text-gray-500">P4</td>
                   <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Present</span></td>
                   <td className="p-4 text-gray-500">07:40 AM</td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  );
};