-- Phase 1: Create Role-Based Access Control System

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('student', 'department_officer', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Phase 2: Update RLS Policies for Admin Access

-- Admin can view all students
CREATE POLICY "Admins can view all students"
ON public.students
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all department users
CREATE POLICY "Admins can view all department users"
ON public.department_users
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all admin users
CREATE POLICY "Admins can view all admin users"
ON public.admin_users
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all clearance records
CREATE POLICY "Admins can view all clearance records"
ON public.clearance_records
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can update clearance records
CREATE POLICY "Admins can update clearance records"
ON public.clearance_records
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Phase 3: Fix Department User Access

-- Department users can view all students (needed for clearance management)
CREATE POLICY "Department users can view all students"
ON public.students
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.department_users
    WHERE id = auth.uid()
  )
);

-- Phase 4: Security Hardening - Remove plain text passwords
-- IMPORTANT: This will break existing logins. Users must be migrated to Supabase Auth first.

ALTER TABLE public.students DROP COLUMN IF EXISTS password;
ALTER TABLE public.department_users DROP COLUMN IF EXISTS password;
ALTER TABLE public.admin_users DROP COLUMN IF EXISTS password;

-- Add metadata columns for tracking
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS auth_migrated BOOLEAN DEFAULT false;
ALTER TABLE public.department_users ADD COLUMN IF NOT EXISTS auth_migrated BOOLEAN DEFAULT false;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS auth_migrated BOOLEAN DEFAULT false;