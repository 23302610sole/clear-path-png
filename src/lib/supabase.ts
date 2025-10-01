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
  created_at: string
  updated_at: string
}

export interface DepartmentUser {
  id: string
  full_name: string
  email: string
  department: string
  role: string
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  full_name: string
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