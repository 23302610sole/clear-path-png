-- Create clearance_records table to track student clearance status
CREATE TABLE public.clearance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cleared', 'blocked')),
  notes TEXT,
  cleared_by TEXT,
  cleared_at TIMESTAMP WITH TIME ZONE,
  updated_by UUID NOT NULL REFERENCES public.department_users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, department)
);

-- Enable Row Level Security
ALTER TABLE public.clearance_records ENABLE ROW LEVEL SECURITY;

-- Students can view their own clearance records
CREATE POLICY "Students can view own clearance records" 
ON public.clearance_records 
FOR SELECT 
USING (student_id IN (SELECT id FROM public.students WHERE id = auth.uid()));

-- Department users can view and update records for their department
CREATE POLICY "Department users can view their department records" 
ON public.clearance_records 
FOR SELECT 
USING (department IN (SELECT department FROM public.department_users WHERE id = auth.uid()));

CREATE POLICY "Department users can update their department records" 
ON public.clearance_records 
FOR UPDATE 
USING (department IN (SELECT department FROM public.department_users WHERE id = auth.uid()));

CREATE POLICY "Department users can insert records for their department" 
ON public.clearance_records 
FOR INSERT 
WITH CHECK (department IN (SELECT department FROM public.department_users WHERE id = auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clearance_records_updated_at
BEFORE UPDATE ON public.clearance_records
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();