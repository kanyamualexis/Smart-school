
import { supabase } from './supabase';
import { SchoolData, User, Student, Mark, Role, ClassGrade, Parent, Subject, Material, Announcement, AuditLog, TimetableEntry, Plan, Coupon, Attendance } from '../types';

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
    const mock = localStorage.getItem('ss_mock_session');
    if (mock) {
        return JSON.parse(mock) as User;
    }
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
     let schoolData: SchoolData | null = null;
     if (id === 'platform_001') {
        schoolData = { id: 'platform', name: 'Platform Administration', district: 'Headquarters', plan: 'enterprise', has_nursery: false, status: 'active', theme_color: '#1e3a8a' };
     } else if (id === 'demo_school_001') {
        schoolData = { id: 'demo_school_001', name: 'Demo High School', district: 'Kigali | 0780000000 | Downtown', plan: 'professional', has_nursery: true, status: 'active', theme_color: '#0ea5e9' };
     } else {
        const { data, error } = await supabase.from('schools').select('*').eq('id', id).single();
        if (error) console.error(error);
        schoolData = data;
     }

     if (schoolData) {
         const localUpdates = localStorage.getItem(`ss_school_updates_${id}`);
         if (localUpdates) {
             schoolData = { ...schoolData, ...JSON.parse(localUpdates) };
         }
     }
     return schoolData;
  }

  async updateSchool(id: string, data: Partial<SchoolData>) {
    if (id === 'demo_school_001' || id === 'platform_001') {
        const existingUpdates = JSON.parse(localStorage.getItem(`ss_school_updates_${id}`) || '{}');
        const newUpdates = { ...existingUpdates, ...data };
        localStorage.setItem(`ss_school_updates_${id}`, JSON.stringify(newUpdates));
        return;
    }
    const { error } = await supabase.from('schools').update(data).eq('id', id);
    if (error) throw error;
  }

  async getUsers(schoolId: string, role?: Role): Promise<User[]> { 
    if (schoolId === 'demo_school_001') {
        const stored = localStorage.getItem('ss_mock_users');
        let users: User[] = stored ? JSON.parse(stored) : [];
        if (users.filter(u => u.role === 'teacher').length === 0) {
            users.push(
                { id: 't1', full_name: 'Tr. Alice', email: 'alice@demo.com', role: 'teacher', school_id: schoolId, assigned_class: 'P1', assigned_subject: 'Mathematics' },
                { id: 't2', full_name: 'Tr. Bob', email: 'bob@demo.com', role: 'teacher', school_id: schoolId, assigned_class: 'P2', assigned_subject: 'English' }
            );
            localStorage.setItem('ss_mock_users', JSON.stringify(users));
        }
        if (role) return users.filter(u => u.role === role);
        return users;
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
    if (u.school_id === 'demo_school_001') {
        const stored = localStorage.getItem('ss_mock_users');
        let users: User[] = stored ? JSON.parse(stored) : [];
        users.push({ ...u, id: `u_${Date.now()}` } as User);
        localStorage.setItem('ss_mock_users', JSON.stringify(users));
        return;
    }
    const { error } = await supabase.from('users').insert(u);
    if (error) throw error;
  }

  async deleteUser(id: string) { 
    if (id.startsWith('t') || id.startsWith('u_')) {
        const stored = localStorage.getItem('ss_mock_users');
        if (stored) {
            let users: User[] = JSON.parse(stored);
            users = users.filter(u => u.id !== id);
            localStorage.setItem('ss_mock_users', JSON.stringify(users));
        }
        return; 
    }
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) console.error(error);
  }

  async getStudents(schoolId: string, classGrade?: string): Promise<Student[]> {
    if (schoolId === 'demo_school_001') {
         const stored = localStorage.getItem('ss_mock_students');
         let students: Student[] = stored ? JSON.parse(stored) : [
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
    if (s.school_id === 'demo_school_001') {
        const stored = localStorage.getItem('ss_mock_students');
        let students: Student[] = stored ? JSON.parse(stored) : [
             { id: 's1', full_name: 'Student One', index_number: '2024/001', class_grade: 'P1', school_id: s.school_id! },
             { id: 's2', full_name: 'Student Two', index_number: '2024/002', class_grade: 'P2', school_id: s.school_id! }
        ];
        students.push({ ...s, id: `s_${Date.now()}` } as Student);
        localStorage.setItem('ss_mock_students', JSON.stringify(students));
        return;
    }
    const { error } = await supabase.from('students').insert(s);
    if (error) throw error;
  }

  async getParents(schoolId: string): Promise<Parent[]> { 
    if (schoolId === 'demo_school_001') {
        const stored = localStorage.getItem('ss_mock_parents');
        return stored ? JSON.parse(stored) : [{ id: 'p1', full_name: 'Parent One', email: 'p1@demo.com', phone: '0788888888', school_id: schoolId, student_ids: [] }];
    }
    const { data } = await supabase.from('parents').select('*').eq('school_id', schoolId);
    return data || [];
  }

  async addParent(p: Partial<Parent>) {
    if (p.school_id === 'demo_school_001') {
        const stored = localStorage.getItem('ss_mock_parents');
        let parents: Parent[] = stored ? JSON.parse(stored) : [{ id: 'p1', full_name: 'Parent One', email: 'p1@demo.com', phone: '0788888888', school_id: p.school_id!, student_ids: [] }];
        parents.push({ ...p, id: `p_${Date.now()}` } as Parent);
        localStorage.setItem('ss_mock_parents', JSON.stringify(parents));
        return;
    }
    const { error } = await supabase.from('parents').insert(p);
    if (error) throw error;
  }

  async getClasses(schoolId: string): Promise<ClassGrade[]> { 
    if (schoolId === 'demo_school_001') {
        const stored = localStorage.getItem('ss_mock_classes');
        let classes: ClassGrade[] = stored ? JSON.parse(stored) : [
            { id: 'c1', name: 'P1', school_id: schoolId },
            { id: 'c2', name: 'P2', school_id: schoolId },
            { id: 'c3', name: 'S1', school_id: schoolId }
        ];
        return classes;
    }
    const { data, error } = await supabase.from('classes').select('*').eq('school_id', schoolId);
    if (error) console.error(error);
    return data || [];
  }

  async addClass(c: Partial<ClassGrade>) { 
    if (c.school_id === 'demo_school_001') {
        const stored = localStorage.getItem('ss_mock_classes');
        let classes: ClassGrade[] = stored ? JSON.parse(stored) : [
            { id: 'c1', name: 'P1', school_id: c.school_id! },
            { id: 'c2', name: 'P2', school_id: c.school_id! },
            { id: 'c3', name: 'S1', school_id: c.school_id! }
        ];
        classes.push({ ...c, id: `c_${Date.now()}` } as ClassGrade);
        localStorage.setItem('ss_mock_classes', JSON.stringify(classes));
        return;
    }
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
    const { data: marks } = await supabase.from('marks').select('*').eq('student_id', student.id);
    return { student, school, marks: marks || [] };
  }

  async getMaterials(schoolId: string): Promise<Material[]> { 
    if (schoolId === 'demo_school_001') return [];
    const { data } = await supabase.from('materials').select('*').eq('school_id', schoolId);
    return data || [];
  }

  async getAnnouncements(schoolId: string): Promise<Announcement[]> { 
    if (schoolId === 'demo_school_001') {
        const stored = localStorage.getItem('ss_mock_announcements');
        return stored ? JSON.parse(stored) : [
            { id: 'a1', title: 'Welcome to Smart School Flow', content: 'We are excited to launch our new system.', school_id: schoolId, target_role: 'all', date: new Date().toISOString().split('T')[0] }
        ];
    }
    // Platform announcements usually have school_id = 'platform' or null, but for this structure we filter by school_id
    const { data } = await supabase.from('announcements').select('*').eq('school_id', schoolId);
    return data || [];
  }

  async addAnnouncement(a: Partial<Announcement>) {
    if (a.school_id === 'demo_school_001' || a.school_id === 'platform_001') {
        const stored = localStorage.getItem('ss_mock_announcements');
        let anns: Announcement[] = stored ? JSON.parse(stored) : [{ id: 'a1', title: 'Welcome to Smart School Flow', content: 'We are excited to launch our new system.', school_id: a.school_id!, target_role: 'all', date: new Date().toISOString().split('T')[0] }];
        anns.unshift({ ...a, id: `a_${Date.now()}`, date: new Date().toISOString().split('T')[0] } as Announcement);
        localStorage.setItem('ss_mock_announcements', JSON.stringify(anns));
        return;
    }
    const { error } = await supabase.from('announcements').insert(a);
    if (error) throw error;
  }

  async getTimetable(schoolId: string): Promise<TimetableEntry[]> {
    if (schoolId === 'demo_school_001') {
        const stored = localStorage.getItem('ss_mock_timetable');
        return stored ? JSON.parse(stored) : [];
    }
    const { data } = await supabase.from('timetable').select('*').eq('school_id', schoolId);
    return data || [];
  }

  async addTimetableEntry(t: Partial<TimetableEntry>) {
    if (t.school_id === 'demo_school_001') {
        const stored = localStorage.getItem('ss_mock_timetable');
        let entries: TimetableEntry[] = stored ? JSON.parse(stored) : [];
        entries.push({ ...t, id: `tt_${Date.now()}` } as TimetableEntry);
        localStorage.setItem('ss_mock_timetable', JSON.stringify(entries));
        return;
    }
    const { error } = await supabase.from('timetable').insert(t);
    if (error) throw error;
  }

  // --- ATTENDANCE ---

  async getAttendance(schoolId: string, date: string): Promise<Attendance[]> {
    if (schoolId === 'demo_school_001') {
        const stored = localStorage.getItem('ss_mock_attendance');
        if (!stored) return [];
        const all: Attendance[] = JSON.parse(stored);
        return all.filter(a => a.school_id === schoolId && a.date === date);
    }
    const { data } = await supabase.from('attendance').select('*').eq('school_id', schoolId).eq('date', date);
    return data || [];
  }

  async saveAttendance(records: Attendance[]) {
    if (records.length === 0) return;
    const schoolId = records[0].school_id;
    if (schoolId === 'demo_school_001') {
        const stored = localStorage.getItem('ss_mock_attendance');
        let all: Attendance[] = stored ? JSON.parse(stored) : [];
        
        records.forEach(r => {
            const idx = all.findIndex(a => a.student_id === r.student_id && a.date === r.date);
            if (idx >= 0) all[idx] = r;
            else all.push(r);
        });
        
        localStorage.setItem('ss_mock_attendance', JSON.stringify(all));
        return;
    }
    const { error } = await supabase.from('attendance').upsert(records);
    if (error) throw error;
  }

  // --- BILLING: PLANS & COUPONS (Admin Mock) ---
  
  async getPlans(): Promise<Plan[]> {
    const stored = localStorage.getItem('ss_mock_plans');
    if (stored) return JSON.parse(stored);
    
    // Default Initial Plans
    const defaults: Plan[] = [
      { id: 'starter', name: 'Starter Plan', price_monthly: 60000, price_yearly: 600000, description: 'Perfect for small schools getting started', features: ["Up to 100 students", "Nursery & primary support", "Basic reporting", "Email support", "Mobile app access"], is_popular: false, color: 'from-blue-500 to-blue-700' },
      { id: 'professional', name: 'Professional Plan', price_monthly: 130000, price_yearly: 1300000, description: 'Ideal for growing institutions', features: ["Up to 500 students", "All levels (Nursery to Secondary)", "Advanced analytics", "Priority support", "Custom branding", "API access"], is_popular: true, color: 'from-purple-500 to-pink-600' },
      { id: 'enterprise', name: 'Enterprise Plan', price_monthly: 260000, price_yearly: 2600000, description: 'Comprehensive solution for large schools', features: ["Unlimited students", "All levels (Nursery to Secondary)", "White-label solution", "24/7 phone support", "Dedicated account manager", "Custom integrations"], is_popular: false, color: 'from-gray-800 to-black' }
    ];
    localStorage.setItem('ss_mock_plans', JSON.stringify(defaults));
    return defaults;
  }

  async savePlan(plan: Plan) {
    const plans = await this.getPlans();
    const existingIndex = plans.findIndex(p => p.id === plan.id);
    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.push(plan);
    }
    localStorage.setItem('ss_mock_plans', JSON.stringify(plans));
  }

  async deletePlan(id: string) {
    const plans = await this.getPlans();
    const filtered = plans.filter(p => p.id !== id);
    localStorage.setItem('ss_mock_plans', JSON.stringify(filtered));
  }

  async getCoupons(): Promise<Coupon[]> {
    const stored = localStorage.getItem('ss_mock_coupons');
    if (stored) return JSON.parse(stored);
    
    // Default Coupons
    const defaults: Coupon[] = [
      { id: 'c1', code: 'WELCOME20', discount_type: 'percent', discount_value: 20, max_uses: 100, used_count: 45, status: 'active', campaign_name: 'New School Promo', theme: 'royal_blue' },
      { id: 'c2', code: 'BLACKFRIDAY', discount_type: 'percent', discount_value: 50, max_uses: 500, used_count: 12, status: 'active', expires_at: '2025-11-30', campaign_name: 'Black Friday Super Sale', theme: 'midnight_sale' },
      { id: 'c3', code: 'XMAS50', discount_type: 'fixed', discount_value: 50000, max_uses: 50, used_count: 5, status: 'active', expires_at: '2025-12-25', campaign_name: 'Christmas Gift', theme: 'red_dawn' },
    ];
    localStorage.setItem('ss_mock_coupons', JSON.stringify(defaults));
    return defaults;
  }

  async saveCoupon(coupon: Coupon) {
    const coupons = await this.getCoupons();
    const existingIndex = coupons.findIndex(c => c.id === coupon.id);
    if (existingIndex >= 0) {
      coupons[existingIndex] = coupon;
    } else {
      coupons.push(coupon);
    }
    localStorage.setItem('ss_mock_coupons', JSON.stringify(coupons));
  }

  async deleteCoupon(id: string) {
    const coupons = await this.getCoupons();
    const filtered = coupons.filter(c => c.id !== id);
    localStorage.setItem('ss_mock_coupons', JSON.stringify(filtered));
  }

  // --- PLATFORM ADMIN HELPERS ---

  async getAuditLogs(): Promise<AuditLog[]> {
      return [
          { id: '1', action: 'SCHOOL_APPROVAL', details: 'Approved Green Valley High', date: new Date().toISOString(), user: 'Platform Admin' },
          { id: '2', action: 'LOGIN', details: 'Admin login detected', date: new Date(Date.now() - 86400000).toISOString(), user: 'Platform Admin' },
          { id: '3', action: 'PLAN_UPDATE', details: 'Updated pricing for Enterprise', date: new Date(Date.now() - 172800000).toISOString(), user: 'Platform Admin' },
          { id: '4', action: 'USER_SUSPEND', details: 'Suspended user user_123', date: new Date(Date.now() - 200000000).toISOString(), user: 'Platform Admin' },
          { id: '5', action: 'SYSTEM_BACKUP', details: 'Automated backup completed', date: new Date(Date.now() - 300000000).toISOString(), user: 'System' },
      ];
  }

  async getRecentTransactions() {
      return [
          { id: 'tx_1', school: 'Greenwood High', plan: 'Professional', amount: 130000, date: '2024-03-15', status: 'completed' },
          { id: 'tx_2', school: 'Riverside Academy', plan: 'Starter', amount: 60000, date: '2024-03-14', status: 'completed' },
          { id: 'tx_3', school: 'Oakridge Intl', plan: 'Enterprise', amount: 260000, date: '2024-03-12', status: 'pending' },
          { id: 'tx_4', school: 'St. Mary\'s School', plan: 'Professional', amount: 130000, date: '2024-03-10', status: 'completed' },
      ];
  }

  // --- GLOBAL BANNER ---

  async getGlobalBanner(): Promise<{ message: string, active: boolean }> {
    const stored = localStorage.getItem('ss_global_banner');
    return stored ? JSON.parse(stored) : { message: '', active: false };
  }

  async updateGlobalBanner(data: { message: string, active: boolean }) {
    localStorage.setItem('ss_global_banner', JSON.stringify(data));
    window.dispatchEvent(new Event('global-banner-change'));
  }
}

export const db = new DatabaseService();
