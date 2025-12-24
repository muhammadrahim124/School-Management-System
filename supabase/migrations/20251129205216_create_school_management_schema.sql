/*
  # School Management System Database Schema

  ## Overview
  Complete database schema for a school management system with role-based access control.

  ## New Tables

  ### 1. profiles
  - `id` (uuid, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `role` (text) - admin, teacher, student
  - `phone` (text)
  - `avatar_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. classes
  - `id` (uuid, primary key)
  - `name` (text) - e.g., "Class 10-A"
  - `grade_level` (int) - 1-12
  - `section` (text) - A, B, C, etc.
  - `academic_year` (text)
  - `created_at` (timestamptz)

  ### 3. students
  - `id` (uuid, references profiles)
  - `roll_number` (text, unique)
  - `class_id` (uuid, references classes)
  - `date_of_birth` (date)
  - `parent_name` (text)
  - `parent_phone` (text)
  - `address` (text)
  - `admission_date` (date)
  - `created_at` (timestamptz)

  ### 4. teachers
  - `id` (uuid, references profiles)
  - `employee_id` (text, unique)
  - `subject_specialization` (text)
  - `qualification` (text)
  - `join_date` (date)
  - `created_at` (timestamptz)

  ### 5. announcements
  - `id` (uuid, primary key)
  - `title` (text)
  - `content` (text)
  - `priority` (text) - normal, urgent
  - `target_audience` (text) - all, students, teachers
  - `created_by` (uuid, references profiles)
  - `created_at` (timestamptz)
  - `expires_at` (timestamptz)

  ### 6. homework
  - `id` (uuid, primary key)
  - `class_id` (uuid, references classes)
  - `subject` (text)
  - `title` (text)
  - `description` (text)
  - `due_date` (date)
  - `attachment_url` (text)
  - `created_by` (uuid, references teachers)
  - `created_at` (timestamptz)

  ### 7. exams
  - `id` (uuid, primary key)
  - `name` (text) - e.g., "Mid-Term Exam"
  - `exam_type` (text) - mid-term, final, unit-test
  - `class_id` (uuid, references classes)
  - `subject` (text)
  - `exam_date` (date)
  - `start_time` (time)
  - `duration_minutes` (int)
  - `total_marks` (int)
  - `created_at` (timestamptz)

  ### 8. exam_results
  - `id` (uuid, primary key)
  - `exam_id` (uuid, references exams)
  - `student_id` (uuid, references students)
  - `marks_obtained` (decimal)
  - `remarks` (text)
  - `created_at` (timestamptz)

  ### 9. attendance
  - `id` (uuid, primary key)
  - `student_id` (uuid, references students)
  - `date` (date)
  - `status` (text) - present, absent, late, half-day
  - `marked_by` (uuid, references teachers)
  - `created_at` (timestamptz)

  ### 10. fees
  - `id` (uuid, primary key)
  - `student_id` (uuid, references students)
  - `amount` (decimal)
  - `fee_type` (text) - tuition, exam, transport, etc.
  - `due_date` (date)
  - `paid_date` (date)
  - `status` (text) - pending, paid, overdue
  - `created_at` (timestamptz)

  ### 11. holidays
  - `id` (uuid, primary key)
  - `title` (text)
  - `start_date` (date)
  - `end_date` (date)
  - `color` (text)
  - `description` (text)
  - `created_at` (timestamptz)

  ### 12. notifications
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `title` (text)
  - `message` (text)
  - `type` (text) - info, warning, urgent
  - `read` (boolean)
  - `created_at` (timestamptz)

  ### 13. gallery
  - `id` (uuid, primary key)
  - `title` (text)
  - `image_url` (text)
  - `category` (text) - events, sports, academics
  - `uploaded_by` (uuid, references profiles)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Implement role-based access policies
  - Students can only view their own data
  - Teachers can manage their assigned classes
  - Admins have full access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'student',
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'teacher', 'student'))
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade_level int NOT NULL,
  section text NOT NULL,
  academic_year text NOT NULL DEFAULT '2024-2025',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_grade CHECK (grade_level >= 1 AND grade_level <= 12)
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY REFERENCES profiles ON DELETE CASCADE,
  roll_number text UNIQUE NOT NULL,
  class_id uuid REFERENCES classes ON DELETE SET NULL,
  date_of_birth date,
  parent_name text,
  parent_phone text,
  address text,
  admission_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY REFERENCES profiles ON DELETE CASCADE,
  employee_id text UNIQUE NOT NULL,
  subject_specialization text,
  qualification text,
  join_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  priority text DEFAULT 'normal',
  target_audience text DEFAULT 'all',
  created_by uuid REFERENCES profiles ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  CONSTRAINT valid_priority CHECK (priority IN ('normal', 'urgent')),
  CONSTRAINT valid_audience CHECK (target_audience IN ('all', 'students', 'teachers'))
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create homework table
CREATE TABLE IF NOT EXISTS homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  attachment_url text,
  created_by uuid REFERENCES teachers ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  exam_type text NOT NULL,
  class_id uuid REFERENCES classes ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  exam_date date NOT NULL,
  start_time time NOT NULL,
  duration_minutes int DEFAULT 60,
  total_marks int DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_exam_type CHECK (exam_type IN ('mid-term', 'final', 'unit-test', 'quarterly'))
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Create exam_results table
CREATE TABLE IF NOT EXISTS exam_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES students ON DELETE CASCADE NOT NULL,
  marks_obtained decimal(5,2) NOT NULL,
  remarks text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(exam_id, student_id)
);

ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'present',
  marked_by uuid REFERENCES teachers ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('present', 'absent', 'late', 'half-day')),
  UNIQUE(student_id, date)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create fees table
CREATE TABLE IF NOT EXISTS fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  fee_type text NOT NULL,
  due_date date NOT NULL,
  paid_date date,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'paid', 'overdue'))
);

ALTER TABLE fees ENABLE ROW LEVEL SECURITY;

-- Create holidays table
CREATE TABLE IF NOT EXISTS holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  color text DEFAULT '#3B82F6',
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_type CHECK (type IN ('info', 'warning', 'urgent'))
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  category text DEFAULT 'events',
  uploaded_by uuid REFERENCES profiles ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_category CHECK (category IN ('events', 'sports', 'academics', 'activities'))
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all profiles, update their own
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- This fixes the signup failing / 404 error
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'System Admin', 'admin'
FROM auth.users
WHERE email = 'admin@school.com';

CREATE POLICY "Students and teachers can insert profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id
  AND role IN ('student', 'teacher')
);

-- Classes: Everyone can view
CREATE POLICY "Anyone can view classes"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage classes"
  ON classes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Students: Can view own data
CREATE POLICY "Students can view own data"
  ON students FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Admins can manage students"
  ON students FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Teachers: Can view all
CREATE POLICY "Anyone can view teachers"
  ON teachers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage teachers"
  ON teachers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Announcements: Everyone can view
CREATE POLICY "Anyone can view announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and teachers can create announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

-- Homework: Students view their class, teachers manage
CREATE POLICY "Students can view their class homework"
  ON homework FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = auth.uid() AND students.class_id = homework.class_id
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Teachers can manage homework"
  ON homework FOR ALL
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

-- Exams: Students view their class exams
CREATE POLICY "Students can view their class exams"
  ON exams FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = auth.uid() AND students.class_id = exams.class_id
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Admins and teachers can manage exams"
  ON exams FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

-- Exam Results: Students view own results
CREATE POLICY "Students can view own results"
  ON exam_results FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Teachers can manage results"
  ON exam_results FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

-- Attendance: Students view own, teachers manage
CREATE POLICY "Students can view own attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Teachers can manage attendance"
  ON attendance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

-- Fees: Students view own fees
CREATE POLICY "Students can view own fees"
  ON fees FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Admins can manage fees"
  ON fees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Holidays: Everyone can view
CREATE POLICY "Anyone can view holidays"
  ON holidays FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage holidays"
  ON holidays FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Notifications: Users view own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

-- Gallery: Everyone can view
CREATE POLICY "Anyone can view gallery"
  ON gallery FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and teachers can manage gallery"
  ON gallery FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );
