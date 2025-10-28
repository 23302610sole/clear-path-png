-- Phase 2 & 3: Hall of Residence Property Tracking and Room Inspection

-- Create property_returns table for tracking returned items
CREATE TABLE IF NOT EXISTS public.property_returns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  mattress_returned BOOLEAN DEFAULT false,
  chair_returned BOOLEAN DEFAULT false,
  proxy_card_returned BOOLEAN DEFAULT false,
  key_returned BOOLEAN DEFAULT false,
  verified_by TEXT,
  verification_date TIMESTAMP WITH TIME ZONE,
  verification_signature TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(student_id)
);

-- Create room_inspections table
CREATE TABLE IF NOT EXISTS public.room_inspections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  lodge_name TEXT,
  lodge_number TEXT,
  flywire_status TEXT CHECK (flywire_status IN ('no_repair', 'repair_needed')),
  flywire_notes TEXT,
  door_status TEXT CHECK (door_status IN ('no_repair', 'repair_needed')),
  door_notes TEXT,
  lock_status TEXT CHECK (lock_status IN ('no_repair', 'repair_needed')),
  lock_notes TEXT,
  lights_status TEXT CHECK (lights_status IN ('no_repair', 'repair_needed')),
  lights_notes TEXT,
  ceiling_status TEXT CHECK (ceiling_status IN ('no_repair', 'repair_needed')),
  ceiling_notes TEXT,
  walls_status TEXT CHECK (walls_status IN ('no_repair', 'repair_needed')),
  walls_notes TEXT,
  light_switches_status TEXT CHECK (light_switches_status IN ('no_repair', 'repair_needed')),
  light_switches_notes TEXT,
  study_table_status TEXT CHECK (study_table_status IN ('no_repair', 'repair_needed')),
  study_table_notes TEXT,
  power_points_status TEXT CHECK (power_points_status IN ('no_repair', 'repair_needed')),
  power_points_notes TEXT,
  sub_warden_approved BOOLEAN DEFAULT false,
  sub_warden_name TEXT,
  sub_warden_signature TEXT,
  approval_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(student_id)
);

-- Enable RLS
ALTER TABLE public.property_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_inspections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_returns
CREATE POLICY "Students can view own property returns" 
ON public.property_returns 
FOR SELECT 
USING (student_id = auth.uid() OR student_id IN (
  SELECT id FROM public.students WHERE id = auth.uid()
));

CREATE POLICY "Hall staff can view all property returns" 
ON public.property_returns 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.department_users
    WHERE id = auth.uid() AND department IN ('SS&FC', 'Student Services')
  )
);

CREATE POLICY "Hall staff can insert property returns" 
ON public.property_returns 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.department_users
    WHERE id = auth.uid() AND department IN ('SS&FC', 'Student Services')
  )
);

CREATE POLICY "Hall staff can update property returns" 
ON public.property_returns 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.department_users
    WHERE id = auth.uid() AND department IN ('SS&FC', 'Student Services')
  )
);

CREATE POLICY "Admins can manage all property returns" 
ON public.property_returns 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for room_inspections
CREATE POLICY "Students can view own room inspections" 
ON public.room_inspections 
FOR SELECT 
USING (student_id = auth.uid() OR student_id IN (
  SELECT id FROM public.students WHERE id = auth.uid()
));

CREATE POLICY "Hall staff can view all room inspections" 
ON public.room_inspections 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.department_users
    WHERE id = auth.uid() AND department IN ('SS&FC', 'Student Services')
  )
);

CREATE POLICY "Hall staff can insert room inspections" 
ON public.room_inspections 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.department_users
    WHERE id = auth.uid() AND department IN ('SS&FC', 'Student Services')
  )
);

CREATE POLICY "Hall staff can update room inspections" 
ON public.room_inspections 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.department_users
    WHERE id = auth.uid() AND department IN ('SS&FC', 'Student Services')
  )
);

CREATE POLICY "Admins can manage all room inspections" 
ON public.room_inspections 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER handle_property_returns_updated_at 
BEFORE UPDATE ON public.property_returns
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_room_inspections_updated_at 
BEFORE UPDATE ON public.room_inspections
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_returns_student_id ON public.property_returns(student_id);
CREATE INDEX IF NOT EXISTS idx_room_inspections_student_id ON public.room_inspections(student_id);