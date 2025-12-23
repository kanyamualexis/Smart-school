
export type Role = 'platform_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';
export type SchoolStatus = 'active' | 'pending' | 'rejected';

export interface SchoolData {
  id: string;
  name: string;
  district: string;
  plan: 'starter' | 'professional' | 'enterprise';
  has_nursery: boolean;
  status?: SchoolStatus;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  school_id: string;
  password?: string;
}

export interface Student {
  id: string;
  full_name: string;
  index_number: string;
  class_grade: string;
  school_id: string;
}

export interface ClassGrade {
  id: string;
  name: string; // e.g., "P1", "S1"
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
}

export interface Attendance {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  school_id: string;
}
