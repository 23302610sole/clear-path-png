-- Create Students table for student profile data
CREATE TABLE public.students (
  id uuid references auth.users on delete cascade primary key,
  student_id varchar(20) unique not null,
  full_name text not null,
  email varchar(255) unique not null,
  department text not null,
  phone varchar(20),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Department Users table for department staff profile data
CREATE TABLE public.department_users (
  id uuid references auth.users on delete cascade primary key,
  username varchar(50) unique not null,
  full_name text not null,
  email varchar(255) unique not null,
  department text not null,
  role text not null check (role in ('department_officer', 'accounts')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now') not null
);

-- Create Departments table for department information
CREATE TABLE public.departments (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  code varchar(10) not null unique,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default departments
INSERT INTO public.departments (name, code, description) VALUES
  ('Library', 'LIB', 'University Library Services'),
  ('Computer Science', 'CS', 'Computer Science Department'),
  ('Engineering', 'ENG', 'Engineering Department'),
  ('Business', 'BUS', 'Business Studies Department'),
  ('Science', 'SCI', 'Science Department'),
  ('SS&FC', 'SSFC', 'Student Services & Finance Committee'),
  ('Mess', 'MESS', 'Mess Hall Services'),
  ('AV Unit', 'AV', 'Audio Visual Unit'),
  ('Bookshop', 'BOOK', 'University Bookshop'),
  ('Accounts Office', 'ACC', 'Accounts & Finance Office')
ON CONFLICT (name) DO NOTHING;

-- Create function for updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER handle_students_updated_at 
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_department_users_updated_at 
  BEFORE UPDATE ON public.department_users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Students
CREATE POLICY "Students can view own profile" ON public.students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own profile" ON public.students
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Department Users
CREATE POLICY "Department users can view own profile" ON public.department_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Department users can update own profile" ON public.department_users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Departments (everyone can read)
CREATE POLICY "Everyone can view departments" ON public.departments
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_department_users_username ON public.department_users(username);
CREATE INDEX IF NOT EXISTS idx_department_users_email ON public.department_users(email);
CREATE INDEX IF NOT EXISTS idx_departments_code ON public.departments(code);