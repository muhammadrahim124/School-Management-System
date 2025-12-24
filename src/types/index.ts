export type UserRole = 'admin' | 'teacher' | 'student'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface Homework {
  id: string
  subject: string
  title: string
  description: string | null
  due_date: string
  attachment_url: string | null
}

export interface ExamResult {
  id: string
  marks_obtained: number
  exam: {
    name: string
    subject: string
    total_marks: number
    exam_date: string
  }
}

export interface Attendance {
  date: string
  status: string
}

export interface Fee {
  amount: number
  fee_type: string
  due_date: string
  status: string
  paid_date?: string | null
}

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  priority: string
  created_at: string
}

export interface Holiday {
  id: string
  title: string
  start_date: string
  end_date: string
  color: string
  description: string | null
}

export interface Exam {
  id: string
  name: string
  subject: string
  exam_date: string
  start_time: string
}

export interface Class {
  id: string
  name: string
  grade_level: number
  section: string
}

export interface Student {
  id: string
  roll_number: string
  profiles: {
    full_name: string
  }
}

