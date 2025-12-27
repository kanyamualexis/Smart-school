
export type Role = 'platform_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';
export type SchoolStatus = 'active' | 'pending' | 'rejected' | 'suspended';

export interface SchoolData {
  id: string;
  name: string;
  logo?: string;
  district: string;
  phone?: string;
  address?: string;
  plan: 'starter' | 'professional' | 'enterprise';
  has_nursery: boolean;
  status?: SchoolStatus;
  created_at?: string;
  academic_year?: string;
  admin_email?: string; // For display in pending table
  theme_color?: string; // Hex code for school branding
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  school_id: string;
  password?: string;
  avatar?: string;
  phone?: string;
  // Specific for Teachers
  assigned_class?: string;
  assigned_subject?: string;
}

export interface Student {
  id: string;
  full_name: string;
  index_number: string;
  class_grade: string;
  school_id: string;
  parent_id?: string;
  gender?: 'Male' | 'Female';
}

export interface Parent {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  school_id: string;
  student_ids: string[];
}

export interface ClassGrade {
  id: string;
  name: string; // e.g., "P1", "S1"
  school_id: string;
  teacher_id?: string;
}

export interface Subject {
  id: string;
  name: string;
  school_id: string;
  teacher_id?: string;
}

export interface Mark {
  id: string;
  student_id: string;
  subject: string;
  score: number;
  term: string;
  school_id: string;
  exam_type?: 'CAT' | 'EXAM';
}

export interface Attendance {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  school_id: string;
}

export interface Material {
  id: string;
  title: string;
  type: 'PDF' | 'DOC' | 'IMG';
  class_id: string; // 'all' or specific class name
  school_id: string;
  url: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  school_id: string;
  target_role: 'all' | 'teachers' | 'parents';
  date: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  date: string;
  user: string;
}

export interface TimetableEntry {
  id: string;
  school_id: string;
  class_name: string;
  subject: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  start_time: string;
  end_time: string;
}

export interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  description: string;
  features: string[];
  is_popular?: boolean;
  color?: string; // CSS class for gradient/color
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  max_uses?: number;
  used_count: number;
  expires_at?: string;
  status: 'active' | 'expired' | 'disabled';
  campaign_name?: string;
  theme?: 'red_dawn' | 'midnight_sale' | 'royal_blue' | 'emerald_green';
}
