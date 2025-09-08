-- Remove the restrictive check constraint on department_users role column
-- This allows any role value instead of just 'department_officer' and 'accounts'
ALTER TABLE public.department_users DROP CONSTRAINT IF EXISTS department_users_role_check;