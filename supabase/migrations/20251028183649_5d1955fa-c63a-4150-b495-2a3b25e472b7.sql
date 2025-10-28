-- Phase 1: Add enhanced student profile fields and clearance reasons

-- Add new columns to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS course_code TEXT,
ADD COLUMN IF NOT EXISTS year_level TEXT,
ADD COLUMN IF NOT EXISTS sponsor TEXT,
ADD COLUMN IF NOT EXISTS home_address TEXT,
ADD COLUMN IF NOT EXISTS forwarding_address TEXT,
ADD COLUMN IF NOT EXISTS campus_hall TEXT,
ADD COLUMN IF NOT EXISTS room_number TEXT;

-- Create clearance_reasons enum
CREATE TYPE public.clearance_reason AS ENUM (
  'discontinue',
  'end_of_year',
  'withdrawal',
  'non_residence',
  'exclusion',
  'industrial'
);

-- Add clearance reason to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS clearance_reason public.clearance_reason;

-- Add clearance_initiated_at timestamp
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS clearance_initiated_at TIMESTAMP WITH TIME ZONE;

-- Add department-specific clearance details to clearance_records
ALTER TABLE public.clearance_records
ADD COLUMN IF NOT EXISTS amount_owing DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS books_outstanding INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS equipment_outstanding TEXT,
ADD COLUMN IF NOT EXISTS date_of_cancellation DATE,
ADD COLUMN IF NOT EXISTS digital_signature TEXT,
ADD COLUMN IF NOT EXISTS approval_timestamp TIMESTAMP WITH TIME ZONE;