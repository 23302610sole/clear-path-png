-- Allow students to update their own profile (needed for ID sync)
CREATE POLICY "Students can update own profile during auth sync" 
ON public.students 
FOR UPDATE 
USING (id = auth.uid() OR email = auth.email());

-- Allow department users to update their own profile (needed for ID sync)  
CREATE POLICY "Department users can update own profile during auth sync"
ON public.department_users
FOR UPDATE 
USING (id = auth.uid() OR email = auth.email());