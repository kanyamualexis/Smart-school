
import { supabase } from './supabase';
import { SchoolData, User, Student, Mark, Role, ClassGrade, Parent, Subject, Material, Announcement, Attendance, AuditLog } from '../types';

class DatabaseService {
  // --- AUTHENTICATION ---

  async login(email: string, pass: string): Promise<{ user: User | null, error: string | null }> {
    // 1. Hardcoded Platform Admin
    if (email === 'admin@smartschoolflow.com' && pass === 'admin123') {
       const adminUser: User = {
           id: 'mock_platform_admin_id',
           email: email,
           full_name: 'Platform Admin',
           role: 'platform_admin',
           school_id: 'platform_001'
       };
       localStorage.setItem('ss_mock_session', JSON.stringify(adminUser));
       return { user: adminUser, error: null };
    }

    // 2. Hardcoded School Admin (Head Teacher)
    if (email === 'headteacher@demo.com' && pass === 'school123') {
       const schoolUser: User = {
           id: 'mock_school_admin_id',
           email: email,
           full_name: 'Principal Sarah',
           role: 'school_admin',
           school_id: 'demo_school_001'
       };
       localStorage.setItem('ss_mock_session', JSON.stringify(schoolUser));
       return { user: schoolUser, error: null };
    }

    // 3. Hardcoded Teacher
    if (email === 'teacher@demo.com' && pass === 'teacher123') {
       const teacherUser: User = {
           id: 'mock_teacher_id',
           email: email,
           full_name: 'Tr. John Doe',
           role: 'teacher',
           school_id: 'demo_school_001'
       };
       localStorage.setItem('ss_mock_session', JSON.stringify(teacherUser));
       return { user: teacherUser, error: null };
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass.trim(),
      });

      if (authError) return { user: null, error: authError.message };
      if (!authData.user) return { user: null, error: "Authentication failed" };

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
         return { user: null, error: "User profile not found. Please contact support." };
      }

      return { user: profileData as User, error: null };
    } catch (e: any) {
      return { user: null, error: e.message || "An unexpected error occurred" };
    }
  }

  async registerSchool(data: { name: string, district: string, phone: string, address: string, plan: any, email: string, pass: string, hasNursery: boolean, adminName?: string }): Promise<{ success: boolean, error?: string }> {
    try {
      const compositeDistrict = `${data.district} | ${data.phone} | ${data.address}`;

      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: data.name,
          district: compositeDistrict,
          plan: data.plan,
          has_nursery: data.hasNursery,
          status: 'pending' // Default to pending until approved
        })
        .select()
        .single();

      if (schoolError) throw new Error(`School creation failed: ${schoolError.message}`);

      // Create the Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.pass,
        options: {
          data: { 
            full_name: data.adminName || 'School Admin',
            role: 'school_admin',
            school_id: school.id 
          }
        }
      });

      if (authError) {
        await supabase.from('schools').delete().eq('id', school.id);
        throw new Error(`User account creation failed: ${authError.message}`);
      }

      await supabase.from('users').insert({
          id: authData.user?.id,
          email: data.email,
          full_name: data.adminName || 'School Admin',
          role: 'school_admin',
          school_id: school.id
      });

      return { success: true };

    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message };
    }
  }

  async logout() {
    localStorage.removeItem('ss_mock_session');
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    // 1. Check Mock Session first
    const mock = localStorage.getItem('ss_mock_session');
    if (mock) {
        return JSON.parse(mock) as User;
    }

    // 2. Check Real Supabase Session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    return data as User;
  }

  init() { 
    console.log("Supabase Service Initialized");
  }

  // --- DATA FETCHING (ASYNC) ---

  async getSchools(): Promise<SchoolData[]> { 
    const { data, error } = await supabase.from('schools').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    return data || [];
  }
  
  async getSchool(id: string): Promise<SchoolData | null> {
     // Mock for Platform Admin
     if (id === 'platform_001') return { id: 'platform', name: 'Platform Administration', district: 'Headquarters', plan: 'enterprise', has_nursery: false, status: 'active', theme_color: '#1e3a8a' };
     
     // Mock for Demo School
     if (id === 'demo_school_001') return { id: 'demo_school_001', name: 'Demo High School', district: 'Kigali | 0780000000 | Downtown', plan: 'professional', has_nursery: true, status: 'active', theme_color: '#0ea5e9' };

     const { data, error } = await supabase.from('schools').select('*').eq('id', id).single();
     if (error) console.error(error);
     return data;
  }

  async updateSchool(id: string, data: Partial<SchoolData>) {
    // Mock update for demo
    if (id === 'demo_school_001') {
        console.log("Mock update school settings:", data);
        return;
    }
    const { error } = await supabase.from('schools').update(data).eq('id', id);
    if (error) throw error;
  }

  async getUsers(schoolId: string, role?: Role): Promise<User[]> { 
    if (schoolId === 'demo_school_001') {
        // Mock data for demo
        if (role === 'teacher') return [
            { id: 't1', full_name: 'Tr. Alice', email: 'alice@demo.com', role: 'teacher', school_id: schoolId },
            { id: 't2', full_name: 'Tr. Bob', email: 'bob@demo.com', role: 'teacher', school_id: schoolId }
        ];
        return [];
    }
    let query = supabase.from('users').select('*');
    if (schoolId) query = query.eq('school_id', schoolId);
    if (role) query = query.eq('role', role);
    const { data, error } = await query;
    if (error) console.error(error);
    return data || [];
  }

  async getAllUsers(): Promise<User[]> {
      const { data } = await supabase.from('users').select('*');
      return data || [];
  }

  async addUser(u: Partial<User>) {
    if (u.school_id === 'demo_school_001') return; // Mock add
    const { error } = await supabase.from('users').insert(u);
    if (error) throw error;
  }

  async deleteUser(id: string) { 
    if (id.startsWith('t')) return; // Mock delete
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) console.error(error);
  }

  async getStudents(schoolId: string, classGrade?: string): Promise<Student[]> {
    if (schoolId === 'demo_school_001') {
         // Mock students
         let students = [
             { id: 's1', full_name: 'Student One', index_number: '2024/001', class_grade: 'P1', school_id: schoolId },
             { id: 's2', full_name: 'Student Two', index_number: '2024/002', class_grade: 'P2', school_id: schoolId }
         ];
         if (classGrade) return students.filter(s => s.class_grade === classGrade);
         return students;
    }
    let query = supabase.from('students').select('*').eq('school_id', schoolId);
    if (classGrade) query = query.eq('class_grade', classGrade);
    const { data, error } = await query;
    if (error) console.error(error);
    return data || [];
  }

  async addStudent(s: Partial<Student>) { 
    if (s.school_id === 'demo_school_001') return;
    const { error } = await supabase.from('students').insert(s);
    if (error) throw error;
  }

  async getParents(schoolId: string): Promise<Parent[]> { 
    if (schoolId === 'demo_school_001') return [{ id: 'p1', full_name: 'Parent One', email: 'p1@demo.com', phone: '0788888888', school_id: schoolId, student_ids: [] }];
    const { data } = await supabase.from('parents').select('*').eq('school_id', schoolId);
    return data || [];
  }

  async getClasses(schoolId: string): Promise<ClassGrade[]> { 
    if (schoolId === 'demo_school_001') return [
        { id: 'c1', name: 'P1', school_id: schoolId },
        { id: 'c2', name: 'P2', school_id: schoolId },
        { id: 'c3', name: 'S1', school_id: schoolId }
    ];
    const { data, error } = await supabase.from('classes').select('*').eq('school_id', schoolId);
    if (error) console.error(error);
    return data || [];
  }

  async addClass(c: Partial<ClassGrade>) { 
    if (c.school_id === 'demo_school_001') return;
    const { error } = await supabase.from('classes').insert(c);
    if (error) throw error;
  }
  
  async getSubjects(schoolId: string): Promise<Subject[]> { 
    if (schoolId === 'demo_school_001') return [
        { id: 'sub1', name: 'Mathematics', school_id: schoolId },
        { id: 'sub2', name: 'English', school_id: schoolId },
        { id: 'sub3', name: 'Science', school_id: schoolId }
    ];
    const { data } = await supabase.from('subjects').select('*').eq('school_id', schoolId);
    return data || [];
  }

  async addSubject(s: Partial<Subject>) { 
    if (s.school_id === 'demo_school_001') return;
    const { error } = await supabase.from('subjects').insert(s);
    if (error) throw error;
  }

  async getMarks(schoolId: string, studentId?: string): Promise<Mark[]> { 
    if (schoolId === 'demo_school_001') return [];
    let query = supabase.from('marks').select('*').eq('school_id', schoolId);
    if (studentId) query = query.eq('student_id', studentId);
    const { data } = await query;
    return data || [];
  }

  async addMark(m: Partial<Mark>) { 
    if (m.school_id === 'demo_school_001') return;
    const { error } = await supabase.from('marks').insert(m);
    if (error) throw error;
  }

  async checkResult(schoolId: string, indexNumber: string) {
    const { data: student } = await supabase.from('students')
      .select('*')
      .eq('school_id', schoolId)
      .eq('index_number', indexNumber)
      .single();
    
    if (!student) return null;

    const { data: school } = await supabase.from('schools').select('*').eq('id', schoolId).single();

    const { data: marks } = await supabase.from('marks')
      .select('*')
      .eq('student_id', student.id);

    return { student, school, marks: marks || [] };
  }

  async getMaterials(schoolId: string): Promise<Material[]> { 
    if (schoolId === 'demo_school_001') return [];
    const { data } = await supabase.from('materials').select('*').eq('school_id', schoolId);
    return data || [];
  }

  async getAnnouncements(schoolId: string): Promise<Announcement[]> { 
    if (schoolId === 'demo_school_001') return [
        { id: 'a1', title: 'Welcome to Smart School Flow', content: 'We are excited to launch our new system.', school_id: schoolId, target_role: 'all', date: new Date().toISOString().split('T')[0] }
    ];
    const { data } = await supabase.from('announcements').select('*').eq('school_id', schoolId);
    return data || [];
  }

  async getAuditLogs(): Promise<AuditLog[]> {
      return [
          { id: '1', action: 'SCHOOL_APPROVAL', details: 'Approved Green Valley High', date: new Date().toISOString(), user: 'Platform Admin' },
          { id: '2', action: 'LOGIN', details: 'Admin login detected', date: new Date(Date.now() - 86400000).toISOString(), user: 'Platform Admin' },
          { id: '3', action: 'PLAN_UPDATE', details: 'Updated pricing for Enterprise', date: new Date(Date.now() - 172800000).toISOString(), user: 'Platform Admin' },
      ];
  }
}

export const db = new DatabaseService();
