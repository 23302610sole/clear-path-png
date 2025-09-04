-- Create Students table for authentication
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(20) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  department TEXT NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create Department Users table for authentication
CREATE TABLE IF NOT EXISTS public.department_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  department TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('department_officer', 'accounts')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create Departments reference table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
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

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER handle_students_updated_at 
  BEFORE UPDATE ON public.students
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_department_users_updated_at 
  BEFORE UPDATE ON public.department_users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students (students can only access their own data)
CREATE POLICY "Students can view own profile" 
  ON public.students FOR SELECT 
  USING (id = auth.uid()::UUID);

CREATE POLICY "Students can update own profile" 
  ON public.students FOR UPDATE 
  USING (id = auth.uid()::UUID);

-- RLS Policies for department users (department users can only access their own data)
CREATE POLICY "Department users can view own profile" 
  ON public.department_users FOR SELECT 
  USING (id = auth.uid()::UUID);

CREATE POLICY "Department users can update own profile" 
  ON public.department_users FOR UPDATE 
  USING (id = auth.uid()::UUID);

-- RLS Policies for departments (everyone can read departments)
CREATE POLICY "Everyone can view departments" 
  ON public.departments FOR SELECT 
  USING (TRUE);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_department_users_username ON public.department_users(username);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_department_users_email ON public.department_users(email);