-- Fix RLS policies to allow email-based queries during authentication
-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Students can view own profile" ON public.students;
DROP POLICY IF EXISTS "Students can update own profile during auth sync" ON public.students;

-- Create new policies that allow both ID and email-based access
CREATE POLICY "Students can view own profile" 
ON public.students 
FOR SELECT 
USING (
  (id = auth.uid()) OR 
  ((email)::text = auth.email())
);

CREATE POLICY "Students can update own profile during auth sync" 
ON public.students 
FOR UPDATE 
USING (
  (id = auth.uid()) OR 
  ((email)::text = auth.email())
);

-- Do the same for department users
DROP POLICY IF EXISTS "Department users can view own profile" ON public.department_users;
DROP POLICY IF EXISTS "Department users can update own profile during auth sync" ON public.department_users;

CREATE POLICY "Department users can view own profile" 
ON public.department_users 
FOR SELECT 
USING (
  (id = auth.uid()) OR 
  ((email)::text = auth.email())
);

CREATE POLICY "Department users can update own profile during auth sync" 
ON public.department_users 
FOR UPDATE 
USING (
  (id = auth.uid()) OR 
  ((email)::text = auth.email())
);