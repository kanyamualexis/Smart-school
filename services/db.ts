import { supabase } from './supabase';
import { SchoolData, User, Student, Mark, Role, ClassGrade, Parent, Subject, Material, Announcement, Attendance } from '../types';

class DatabaseService {
  // --- AUTHENTICATION ---

  /**
   * Login with Supabase Auth
   */
  async login(email: string, pass: string): Promise<{ user: User | null, error: string | null }> {
    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (authError) return { user: null, error: authError.message };
      if (!authData.user) return { user: null, error: "No user found" };

      // 2. Fetch User Profile (Role & School ID) from public.users table
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        // Fallback for Super Admin (Initial Setup) if not in public table yet
        if (email === 'admin@smartschoolflow.com') {
           return { 
             user: { 
               id: authData.user.id, 
               email, 
               full_name: 'Platform Admin', 
               role: 'platform_admin', 
               school_id: '' 
             }, 
             error: null 
           };
        }
        return { user: null, error: "Profile not found. Please contact support." };
      }

      return { user: profileData as User, error: null };
    } catch (e: any) {
      return { user: null, error: e.message };
    }
  }

  /**
   * Register a new School and Admin
   */
  async registerSchool(data: { name: string, district: string, plan: any, email: string, pass: string, hasNursery: boolean, adminName?: string }): Promise<{ success: boolean, error?: string }> {
    try {
      // 1. Create School Record
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: data.name,
          district: data.district,
          plan: data.plan,
          has_nursery: data.hasNursery,
          status: 'pending'
        })
        .select()
        .single();

      if (schoolError) throw new Error(`School creation failed: ${schoolError.message}`);

      // 2. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.pass,
        options: {
          data: { full_name: data.adminName || 'School Admin' } // Metadata
        }
      });

      if (authError) throw new Error(`Auth creation failed: ${authError.message}`);
      if (!authData.user) throw new Error("Auth user creation failed");

      // 3. Create Public User Profile linked to School
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id, // Link to Auth ID
          email: data.email,
          full_name: data.adminName || 'School Admin',
          role: 'school_admin',
          school_id: school.id
        });

      if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`);

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
    
    return data as User;
  }

  // --- DATA FETCHING (Mocked Fallbacks -> To be replaced with Supabase Selects) ---
  // Keeping these synchronous for now to prevent breaking UI components that haven't been refactored yet.
  // In a full migration, these would become async calls to supabase.from(...).select().
  
  init() { 
    // No-op for Supabase
    console.log("Supabase Service Initialized");
  }

  getSchools(): SchoolData[] { 
    // MOCK DATA for display purposes until async refactor
    return [
      { id: '1', name: 'Demo High School', district: 'Kigali', plan: 'professional', has_nursery: true, status: 'active' }
    ];
  }
  
  getSchool(id: string): SchoolData | null {
     // MOCK DATA
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