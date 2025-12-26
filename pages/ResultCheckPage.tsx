
import React, { useState } from 'react';
import { ArrowLeft, School, GraduationCap, Download, Loader2, Search, XCircle, FileText, CheckCircle, BarChart3, Star } from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Button } from '../components/ui/Button';
import { db } from '../services/db';
import { Student, Mark, SchoolData } from '../types';

export const ResultCheckPage = ({ setView }: any) => {
  const [indexNumber, setIndexNumber] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [school, setSchool] = useState<SchoolData | null>(null);
  const [selectedTerm, setSelectedTerm] = useState('Term 1');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setStudent(null);
    await new Promise(resolve => setTimeout(resolve, 800));
    const allSchools = await db.getSchools();
    let found = null;
    for (const s of allSchools) {
      const res = await db.checkResult(s.id, indexNumber);
      if (res) { found = res; break; }
    }
    if (!found) { setError('Student not found. Please check the index number.'); setLoading(false); return; }
    const { student: s, school: sch, marks: m } = found;
    if (className && s.class_grade.toLowerCase() !== className.toLowerCase()) {
      setError('Index number and class do not match.');
      setLoading(false);
      return;
    }
    setStudent(s); setSchool(sch); setMarks(m); setLoading(false);
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const handleDownloadReport = () => {
    if (!student || !school) return;
    const doc = new jsPDF();
    doc.setFillColor(37, 99, 235); doc.rect(0,0,210,40,'F');
    doc.setTextColor(255,255,255); doc.setFontSize(22); doc.text(school.name, 105, 20, {align:'center'});
    doc.setFontSize(12); doc.text('OFFICIAL REPORT CARD', 105, 30, {align:'center'});
    doc.setTextColor(0,0,0); doc.setFontSize(12);
    doc.text(`Student Name: ${student.full_name}`, 14, 55);
    doc.text(`Index Number: ${student.index_number}`, 14, 63);
    doc.text(`Class: ${student.class_grade}`, 14, 71);
    doc.text(`Term: ${selectedTerm}`, 150, 55); doc.text(`Year: 2024-2025`, 150, 63);
    const termMarks = marks.filter(m => m.term === selectedTerm);
    autoTable(doc, {
      startY: 85,
      head: [['Subject', 'Score', 'Grade', 'Remarks']],
      body: termMarks.map((m:any) => [m.subject, m.score + '%', getGrade(m.score), m.score >= 50 ? 'Pass' : 'Fail']),
      theme: 'grid', headStyles: { fillColor: [37, 99, 235] }
    });
    doc.save(`${student.full_name}_Report_Card.pdf`);
  };

  const termMarks = marks.filter(m => m.term === selectedTerm);
  const totalScore = termMarks.reduce((sum, m) => sum + (m.score || 0), 0);
  const average = termMarks.length > 0 ? (totalScore / termMarks.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between h-20">
          <button onClick={() => setView('landing')} className="flex items-center gap-2 text-gray-600 hover:text-brand-600 font-bold text-sm">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-md"><School className="w-6 h-6 text-white" /></div>
            <span className="text-xl font-bold text-gray-900 hidden md:block tracking-tight leading-none">Smart School Flow</span>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!student ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h1 className="text-3xl font-bold text-center mb-8 leading-tight">Check Your Results</h1>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-bold text-gray-700 mb-2">Index Number *</label>
                <input type="text" value={indexNumber} onChange={(e) => setIndexNumber(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-brand-100 outline-none text-base" required /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-2">Class (Optional)</label>
                <input type="text" value={className} onChange={(e) => setClassName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-brand-100 outline-none text-base" /></div>
              </div>
              {error && <div className="p-4 bg-red-50 text-red-600 flex items-center gap-2 rounded-lg text-sm font-medium"><XCircle size={18}/> {error}</div>}
              <button type="submit" disabled={loading} className="w-full py-4 bg-brand-600 text-white font-bold uppercase tracking-widest text-[11px] rounded-xl flex items-center justify-center gap-2 hover:bg-brand-700 disabled:opacity-50 shadow-lg shadow-brand-200">
                {loading ? <Loader2 className="animate-spin" size={18}/> : <Search size={18}/>} View Results
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="bg-brand-600 rounded-2xl p-8 text-white flex items-center gap-6 shadow-xl">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-black">{student.full_name[0]}</div>
              <div>
                <h2 className="text-3xl font-black text-white leading-none mb-1">{student.full_name}</h2>
                <p className="opacity-80 text-sm font-bold uppercase tracking-widest">{student.class_grade} • {student.index_number}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border flex justify-between items-center">
              <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)} className="p-2 border rounded-lg text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50">
                <option>Term 1</option><option>Term 2</option><option>Term 3</option>
              </select>
              <Button onClick={handleDownloadReport} size="sm" className="font-bold text-[10px] uppercase tracking-widest"><Download size={14}/> Download PDF</Button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
               <table className="w-full text-sm">
                 <thead className="bg-gray-50 border-b">
                   <tr className="text-xs font-bold uppercase tracking-widest text-gray-500">
                     <th className="p-4 text-left">Subject</th>
                     <th className="p-4">Score</th>
                     <th className="p-4">Grade</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {termMarks.map(m => (
                     <tr key={m.id} className="text-center hover:bg-gray-50 transition-colors">
                       <td className="p-4 text-left font-bold text-gray-900">{m.subject}</td>
                       <td className="p-4 text-gray-600 font-medium">{m.score}%</td>
                       <td className="p-4 font-black text-brand-600 text-lg tracking-tight">{getGrade(m.score)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
            <div className="text-center pt-4">
              <button onClick={() => setStudent(null)} className="text-gray-400 hover:text-gray-600 underline text-xs font-bold uppercase tracking-widest">New Search</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};