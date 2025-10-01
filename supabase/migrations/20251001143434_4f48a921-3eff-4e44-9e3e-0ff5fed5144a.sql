-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can view own profile
CREATE POLICY "Admin users can view own profile"
ON public.admin_users
FOR SELECT
TO authenticated
USING (id = auth.uid() OR email = auth.email());

-- Admin users can update own profile during auth sync
CREATE POLICY "Admin users can update own profile during auth sync"
ON public.admin_users
FOR UPDATE
TO authenticated
USING (id = auth.uid() OR email = auth.email());

-- Create trigger for admin_users updated_at
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Remove username column from department_users if exists and make sure email is used for login
-- The username column is no longer needed since we're using email
ALTER TABLE public.department_users DROP COLUMN IF EXISTS username;