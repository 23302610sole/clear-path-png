import { supabase as supabaseClient } from '@/integrations/supabase/client'

export const isSupabaseConfigured = true
export const supabase = supabaseClient

// Database Types
export interface Student {
  id: string
  student_id: string
  full_name: string
  email: string
  department: string
  phone?: string
  course_code?: string
  year_level?: string
  sponsor?: string
  home_address?: string
  forwarding_address?: string
  campus_hall?: string
  room_number?: string
  clearance_reason?: 'discontinue' | 'end_of_year' | 'withdrawal' | 'non_residence' | 'exclusion' | 'industrial'
  clearance_initiated_at?: string
  auth_migrated: boolean
  created_at: string
  updated_at: string
}

export interface DepartmentUser {
  id: string
  full_name: string
  email: string
  department: string
  role: string
  auth_migrated: boolean
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  full_name: string
  auth_migrated: boolean
  created_at: string
  updated_at: string
}

export interface ClearanceRecord {
  id: string
  student_id: string
  department: string
  status: 'pending' | 'cleared' | 'blocked'
  notes?: string
  cleared_by?: string
  cleared_at?: string
  updated_by: string
  amount_owing?: number
  books_outstanding?: number
  equipment_outstanding?: string
  date_of_cancellation?: string
  digital_signature?: string
  approval_timestamp?: string
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: string
  code: string
  description?: string
  is_active: boolean
}

// Department constants
export const DEPARTMENTS = [
  { name: 'Library', code: 'LIB' },
  { name: 'SS&FC', code: 'SSFC' },
  { name: 'Mess', code: 'MESS' },
  { name: 'AV Unit', code: 'AV' },
  { name: 'Bookshop', code: 'BOOK' },
  { name: 'Accounts Office', code: 'ACC' }
] as const