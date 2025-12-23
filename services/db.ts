
import { SchoolData, User, Student, Mark, Role, SchoolStatus, ClassGrade } from '../types';

class MockDB {
  private get<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private set<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  init() {
    if (!localStorage.getItem('schools')) {
      const sch1 = 'school-1';
      const sch2 = 'school-2';

      this.set<SchoolData>('schools', [
        { id: sch1, name: 'Springfield High School', district: 'Kigali', plan: 'professional', has_nursery: true, status: 'active', created_at: '2024-01-10' },
        { id: sch2, name: 'Riverside Academy', district: 'Musanze', plan: 'starter', has_nursery: false, status: 'active', created_at: '2024-02-15' }
      ]);
      
      this.set<User>('users', [
        { id: 'u_p_admin', email: 'admin@smartschoolflow.com', full_name: 'Super Admin', role: 'platform_admin', school_id: '', password: 'admin123' },
        { id: 'u_head', email: 'headteacher@springfield.edu', full_name: 'Principal Skinner', role: 'school_admin', school_id: sch1, password: 'head123' },
        { id: 'u_teach', email: 'teacher@springfield.edu', full_name: 'Edna Krabappel', role: 'teacher', school_id: sch1, password: 'teacher123' },
        { id: 'u_stud', email: 'student@springfield.edu', full_name: 'Bart Simpson', role: 'student', school_id: sch1, password: 'student123' },
      ]);

      this.set<ClassGrade>('classes', [
        { id: 'cl_1', name: 'P4', school_id: sch1, teacher_id: 'u_teach' },
        { id: 'cl_2', name: 'Nursery 1', school_id: sch1, teacher_id: 'u_teach' },
        { id: 'cl_3', name: 'S1', school_id: sch2 }
      ]);

      this.set<Student>('students', [
        { id: 'st_1', full_name: 'Bart Simpson', index_number: '2024/001', class_grade: 'P4', school_id: sch1 },
        { id: 'st_2', full_name: 'Maggie Simpson', index_number: 'NURSERY/001', class_grade: 'Nursery 1', school_id: sch1 },
        { id: 'st_3', full_name: 'Harry Potter', index_number: '2024/001', class_grade: 'S1', school_id: sch2 },
      ]);

      this.set<Mark>('marks', [
        { id: 'm_1', student_id: 'st_1', subject: 'Mathematics', score: 45, term: 'Term 1', school_id: sch1 },
        { id: 'm_2', student_id: 'st_1', subject: 'English', score: 55, term: 'Term 1', school_id: sch1 },
        { id: 'm_3', student_id: 'st_2', subject: 'Social Skills', score: 95, term: 'Term 1', school_id: sch1 },
        { id: 'm_4', student_id: 'st_2', subject: 'Creative Arts', score: 88, term: 'Term 1', school_id: sch1 },
      ]);
    }
  }

  login(email: string, pass: string): User | null {
    const users = this.get<User>('users');
    return users.find(u => u.email === email && u.password === pass) || null;
  }

  registerSchool(data: { name: string, district: string, plan: any, email: string, pass: string, hasNursery: boolean, adminName?: string }): User {
    const schools = this.get<SchoolData>('schools');
    const users = this.get<User>('users');
    
    const sid = `sch_${Date.now()}`;
    const newSchool: SchoolData = { 
      id: sid, 
      name: data.name, 
      district: data.district, 
      plan: data.plan, 
      has_nursery: data.hasNursery,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    const newAdmin: User = {
      id: `u_${Date.now()}`,
      email: data.email,
      full_name: data.adminName || 'School Admin',
      role: 'school_admin',
      school_id: sid,
      password: data.pass
    };

    this.set('schools', [...schools, newSchool]);
    this.set('users', [...users, newAdmin]);
    return newAdmin;
  }

  getSchools() { return this.get<SchoolData>('schools'); }
  getSchool(id: string) { return this.get<SchoolData>('schools').find(s => s.id === id); }
  
  updateSchool(id: string, updates: Partial<SchoolData>) {
    const schools = this.get<SchoolData>('schools');
    const idx = schools.findIndex(s => s.id === id);
    if (idx !== -1) {
      schools[idx] = { ...schools[idx], ...updates };
      this.set('schools', schools);
    }
  }

  updateSchoolStatus(id: string, status: SchoolStatus) {
    const schools = this.get<SchoolData>('schools');
    const idx = schools.findIndex(s => s.id === id);
    if (idx !== -1) {
      schools[idx].status = status;
      this.set('schools', schools);
    }
  }

  getUsers(schoolId: string, role?: Role) {
    let u = this.get<User>('users');
    if (schoolId) u = u.filter(user => user.school_id === schoolId);
    if (role) u = u.filter(user => user.role === role);
    return u;
  }
  
  addUser(u: User) { this.set('users', [...this.get('users'), u]); }
  deleteUser(id: string) { this.set('users', this.get<User>('users').filter(u => u.id !== id)); }

  getStudents(schoolId: string, classGrade?: string) { 
    let s = this.get<Student>('students').filter(s => s.school_id === schoolId); 
    if (classGrade) s = s.filter(stud => stud.class_grade === classGrade);
    return s;
  }
  
  addStudent(s: Student) { this.set('students', [...this.get('students'), s]); }

  getClasses(schoolId: string) { return this.get<ClassGrade>('classes').filter(c => c.school_id === schoolId); }
  addClass(c: ClassGrade) { this.set('classes', [...this.get('classes'), c]); }

  getMarks(schoolId: string, studentId?: string) {
    let marks = this.get<Mark>('marks').filter(m => m.school_id === schoolId);
    if (studentId) marks = marks.filter(m => m.student_id === studentId);
    return marks;
  }

  addMark(m: Mark) {
    const marks = this.get<Mark>('marks');
    this.set('marks', [...marks, m]);
  }

  checkResult(schoolId: string, indexNumber: string) {
    const student = this.get<Student>('students').find(s => s.school_id === schoolId && s.index_number === indexNumber);
    if (!student) return null;
    const school = this.get<SchoolData>('schools').find(s => s.id === schoolId);
    const marks = this.get<Mark>('marks').filter(m => m.student_id === student.id);
    return { student, school, marks };
  }
}

export const db = new MockDB();
