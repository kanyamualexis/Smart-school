import { supabase } from './supabase';
import { SchoolData, User, Student, Mark, Role, ClassGrade, Parent, Subject, Material, Announcement, Attendance } from '../types';

class DatabaseService {
  // --- AUTHENTICATION ---

  /**
   * Login with REAL Supabase Auth
   */
  async login(email: string, pass: string): Promise<{ user: User | null, error: string | null }> {
    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass.trim(),
      });

      if (authError) return { user: null, error: authError.message };
      if (!authData.user) return { user: null, error: "Authentication failed" };

      // 2. Fetch User Profile from public.users table
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
         // Fallback if public.users record is missing but Auth exists (shouldn't happen with Triggers)
         // We allow login if it's the admin, just in case
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

  /**
   * Register a new School and Admin (Atomic Transaction-like)
   */
  async registerSchool(data: { name: string, district: string, plan: any, email: string, pass: string, hasNursery: boolean, adminName?: string }): Promise<{ success: boolean, error?: string }> {
    try {
      // 1. Create School Record
      // We insert the school first. RLS 'Open registration' allows this.
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: data.name,
          district: data.district,
          plan: data.plan,
          has_nursery: data.hasNursery,
          status: 'active'
        })
        .select()
        .single();

      if (schoolError) throw new Error(`School creation failed: ${schoolError.message}`);

      // 2. Create Auth User
      // We pass the school_id in metadata so the SQL Trigger can create the public.users record correctly
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
        // Rollback: Attempt to delete the school if auth fails to prevent orphan records
        await supabase.from('schools').delete().eq('id', school.id);
        throw new Error(`User account creation failed: ${authError.message}`);
      }

      return { success: true };

    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message };
    }
  }

  async logout() {
    await supabase.auth.signOut();
  }

  /**
   * Get current session user if page reloads
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    // Fallback if profile missing for admin
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

  // --- DATA FETCHING ---
  // Note: For a full production migration, all components calling these synchronous methods
  // should be refactored to use async/await or React Query.
  // Currently, these serve as a mock fallback or placeholder. 
  
  init() { 
    console.log("Supabase Service Initialized");
  }

  getSchools(): SchoolData[] { 
    return [
      { id: '1', name: 'Demo High School', district: 'Kigali', plan: 'professional', has_nursery: true, status: 'active' }
    ];
  }
  
  getSchool(id: string): SchoolData | null {
     return { id, name: 'Demo School', district: 'Kigali', plan: 'professional', has_nursery: true, status: 'active' };
  }

  updateSchool(id: string, data: Partial<SchoolData>) {
    console.log('Update school', id, data);
  }

  getUsers(schoolId: string, role?: Role): User[] { return []; }
  addUser(u: User) { console.log('Add user', u); }
  deleteUser(id: string) { console.log('Delete user', id); }

  getStudents(schoolId: string, classGrade?: string): Student[] { return []; }
  addStudent(s: Student) { console.log('Add student', s); }

  getParents(schoolId: string): Parent[] { return []; }

  getClasses(schoolId: string): ClassGrade[] { return []; }
  addClass(c: ClassGrade) { console.log('Add class', c); }
  
  getSubjects(schoolId: string): Subject[] { return []; }
  addSubject(s: Subject) { console.log('Add subject', s); }

  getMarks(schoolId: string, studentId?: string): Mark[] { return []; }
  addMark(m: Mark) { console.log('Add mark', m); }

  checkResult(schoolId: string, indexNumber: string) { return null; }

  getMaterials(schoolId: string): Material[] { return []; }
  addMaterial(m: Material) { console.log('Add mat', m); }

  getAnnouncements(schoolId: string): Announcement[] { return []; }
  addAnnouncement(a: Announcement) { console.log('Add ann', a); }

  getAttendance(schoolId: string, date?: string): Attendance[] { return []; }
  markAttendance(att: Attendance) { console.log('Mark att', att); }
}

export const db = new DatabaseService();