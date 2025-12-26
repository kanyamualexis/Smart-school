
import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { db } from '../../services/db';
import { User, Student, Mark, ClassGrade } from '../../types';

export const MarksEntry = ({ user }: { user: User }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [success, setSuccess] = useState(false);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    db.getClasses(user.school_id).then(setClasses);
  }, [user.school_id]);

  useEffect(() => {
    if (selectedClass) {
        db.getStudents(user.school_id, selectedClass).then(setStudents);
    } else {
        setStudents([]);
    }
  }, [user.school_id, selectedClass]);

  const handleSave = async () => {
    if (!selectedStudent || !subject || !score) {
      alert("Please fill all fields");
      return;
    }
    const mark: Mark = {
      id: `m_${Date.now()}`,
      student_id: selectedStudent,
      subject,
      score: parseInt(score),
      term,
      school_id: user.school_id
    };
    await db.addMark(mark);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    // Reset form
    setScore('');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-10 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-900 leading-none mb-2">Academic Assessment Entry</h2>
        <p className="text-base font-medium text-gray-400">Record marks for students in your assigned classes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Class / Grade</label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all bg-gray-50 text-sm font-bold"
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value); setSelectedStudent(''); }}
            >
              <option value="">Select a class...</option>
              {classes.map(cl => <option key={cl.id} value={cl.name}>{cl.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Student</label>
            <select 
              disabled={!selectedClass}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:bg-gray-50 text-sm font-bold"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Select a student...</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <Input 
            label="Subject" 
            placeholder="e.g. Mathematics" 
            value={subject} 
            onChange={(e:any) => setSubject(e.target.value)} 
            className="text-sm font-bold"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Score (%)" 
              type="number" 
              placeholder="0-100" 
              value={score} 
              onChange={(e:any) => setScore(e.target.value)} 
              className="text-sm font-bold"
            />
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Term</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {success && (
        <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center gap-3 rounded-xl animate-in fade-in">
          <CheckCircle size={20} />
          <p className="text-sm font-bold">Mark recorded successfully for the central database.</p>
        </div>
      )}

      <div className="mt-12 flex justify-end">
        <Button size="lg" onClick={handleSave} className="w-full md:w-auto px-12 font-black uppercase tracking-widest text-[11px] h-14 rounded-2xl shadow-xl shadow-brand-100">
          <Save size={18} /> Record Result
        </Button>
      </div>
    </div>
  );
};