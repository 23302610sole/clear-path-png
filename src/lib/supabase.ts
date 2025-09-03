import { createClient, SupabaseClient } from '@supabase/supabase-js'

const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY

// Support Lovable Supabase integration globals as fallback
const globalUrl = (globalThis as any).__SUPABASE_URL__ || (globalThis as any).SUPABASE_URL
const globalKey = (globalThis as any).__SUPABASE_ANON_KEY__ || (globalThis as any).SUPABASE_ANON_KEY

const supabaseUrl = envUrl || globalUrl
const supabaseAnonKey = envKey || globalKey

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let client: SupabaseClient | null = null
if (isSupabaseConfigured) {
  client = createClient(supabaseUrl as string, supabaseAnonKey as string)
} else {
  // Do not throw at import-time; show a single warning
  if (typeof window !== 'undefined') {
    console.warn('Supabase is not configured. Connect the Supabase integration or provide URL and anon key.')
  }
}

export const supabase = client as unknown as SupabaseClient

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