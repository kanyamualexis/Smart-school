
import { supabase } from './supabase';
import { SchoolData, User, Student, Mark, Role, ClassGrade, Parent, Subject, Material, Announcement, Attendance, AuditLog } from '../types';

class DatabaseService {
  // --- AUTHENTICATION ---

  async login(email: string, pass: string): Promise<{ user: User | null, error: string | null }> {
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
         if (email === 'admin@smartschoolflow.com') {
             return {
                 user: {
                     id: authData.user.id,
                     email: email,
                     full_name: 'Platform Admin',
                     role: 'platform_admin',
                     school_id: ''
                 },
                 error: null
             };
         }
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

      // Also insert into public.users for easier querying in this demo
      // In production, use a Trigger on auth.users
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
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (!data && session.user.email === 'admin@smartschoolflow.com') {
         return {
             id: session.user.id,
             email: session.user.email,
             full_name: 'Platform Admin',
             role: 'platform_admin',
             school_id: ''
         };
    }

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
     const { data, error } = await supabase.from('schools').select('*').eq('id', id).single();
     if (error) console.error(error);
     return data;
  }

  async updateSchool(id: string, data: Partial<SchoolData>) {
    const { error } = await supabase.from('schools').update(data).eq('id', id);
    if (error) throw error;
    // Mock email notification
    if (data.status) {
        console.log(`[EMAIL SERVICE] Sending ${data.status} notification to school ID ${id}`);
    }
  }

  async getUsers(schoolId: string, role?: Role): Promise<User[]> { 
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
    const { error } = await supabase.from('users').insert(u);
    if (error) throw error;
  }

  async deleteUser(id: string) { 
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) console.error(error);
  }

  async getStudents(schoolId: string, classGrade?: string): Promise<Student[]> {
    let query = supabase.from('students').select('*').eq('school_id', schoolId);
    if (classGrade) query = query.eq('class_grade', classGrade);
    const { data, error } = await query;
    if (error) console.error(error);
    return data || [];
  }

  async addStudent(s: Partial<Student>) { 
    const { error } = await supabase.from('students').insert(s);
    if (error) throw error;
  }

  async getParents(schoolId: string): Promise<Parent[]> { 
    const { data } = await supabase.from('parents').select('*').eq('school_id', schoolId);
    return data || [];
  }

  async getClasses(schoolId: string): Promise<ClassGrade[]> { 
    const { data, error } = await supabase.from('classes').select('*').eq('school_id', schoolId);
    if (error) console.error(error);
    return data || [];
  }

  async addClass(c: Partial<ClassGrade>) { 
    const { error } = await supabase.from('classes').insert(c);
    if (error) throw error;
  }
  
  async getSubjects(schoolId: string): Promise<Subject[]> { 
    const { data } = await supabase.from('subjects').select('*').eq('school_id', schoolId);
    return data || [];
  }

  async addSubject(s: Partial<Subject>) { 
    const { error } = await supabase.from('subjects').insert(s);
    if (error) throw error;
  }

  async getMarks(schoolId: string, studentId?: string): Promise<Mark[]> { 
    let query = supabase.from('marks').select('*').eq('school_id', schoolId);
    if (studentId) query = query.eq('student_id', studentId);
    const { data } = await query;
    return data || [];
  }

  async addMark(m: Partial<Mark>) { 
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
    const { data } = await supabase.from('materials').select('*').eq('school_id', schoolId);
    return data || [];
  }

  async getAnnouncements(schoolId: string): Promise<Announcement[]> { 
    const { data } = await supabase.from('announcements').select('*').eq('school_id', schoolId);
    return data || [];
  }

  // --- PLATFORM ADMIN SPECIFIC ---
  async getAuditLogs(): Promise<AuditLog[]> {
      // Mock data for audit logs as table might not exist in Supabase yet
      return [
          { id: '1', action: 'SCHOOL_APPROVAL', details: 'Approved Green Valley High', date: new Date().toISOString(), user: 'Platform Admin' },
          { id: '2', action: 'LOGIN', details: 'Admin login detected', date: new Date(Date.now() - 86400000).toISOString(), user: 'Platform Admin' },
          { id: '3', action: 'PLAN_UPDATE', details: 'Updated pricing for Enterprise', date: new Date(Date.now() - 172800000).toISOString(), user: 'Platform Admin' },
      ];
  }
}

export const db = new DatabaseService();
