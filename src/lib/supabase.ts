import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  username: string
  full_name: string
  email: string
  department: string
  role: 'department_officer' | 'accounts'
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
  { name: 'Computer Science', code: 'CS' },
  { name: 'Engineering', code: 'ENG' },
  { name: 'Business', code: 'BUS' },
  { name: 'Science', code: 'SCI' },
  { name: 'SS&FC', code: 'SSFC' },
  { name: 'Mess', code: 'MESS' },
  { name: 'AV Unit', code: 'AV' },
  { name: 'Bookshop', code: 'BOOK' },
  { name: 'Accounts Office', code: 'ACC' }
] as const