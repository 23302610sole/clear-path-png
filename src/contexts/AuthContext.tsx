import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Student, DepartmentUser, isSupabaseConfigured } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  studentProfile: Student | null
  departmentProfile: DepartmentUser | null
  userType: 'student' | 'department' | null
  loading: boolean
  signInAsStudent: (email: string, password: string) => Promise<void>
  signInAsDepartment: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [studentProfile, setStudentProfile] = useState<Student | null>(null)
  const [departmentProfile, setDepartmentProfile] = useState<DepartmentUser | null>(null)
  const [userType, setUserType] = useState<'student' | 'department' | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Supabase not configured: stop loading and skip auth setup
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setStudentProfile(null)
        setDepartmentProfile(null)
        setUserType(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (user: User) => {
    try {
      // Try to load as student first
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .single()

      if (student && !studentError) {
        setStudentProfile(student)
        setUserType('student')
        setDepartmentProfile(null)
        setLoading(false)
        return
      }

      // Try to load as department user
      const { data: department, error: deptError } = await supabase
        .from('department_users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (department && !deptError) {
        setDepartmentProfile(department as DepartmentUser)
        setUserType('department')
        setStudentProfile(null)
      } else {
        // No profile found
        setUserType(null)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signInAsStudent = async (email: string, password: string) => {
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured. Connect the Supabase integration to enable login.')
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: 'Welcome!',
        description: 'Successfully logged in as student',
      })
      
      // Navigation will be handled by the useEffect in the component
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Failed to login',
        variant: 'destructive',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInAsDepartment = async (username: string, password: string) => {
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured. Connect the Supabase integration to enable login.')
      }
      // First get the department user's email from the database
      const { data: deptUser, error: deptError } = await supabase
        .from('department_users')
        .select('email')
        .eq('username', username)
        .single()

      if (deptError || !deptUser) {
        throw new Error('Department user not found')
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: deptUser.email,
        password,
      })

      if (error) throw error

      toast({
        title: 'Welcome!',
        description: 'Successfully logged in as department officer',
      })
      
      // Navigation will be handled by the useEffect in the component
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Failed to login',
        variant: 'destructive',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      toast({
        title: 'Not configured',
        description: 'Supabase is not configured. Connect the integration to enable sign out.',
        variant: 'destructive',
      })
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Goodbye!',
        description: 'Successfully signed out',
      })
    }
  }

  const value: AuthContextType = {
    user,
    session,
    studentProfile,
    departmentProfile,
    userType,
    loading,
    signInAsStudent,
    signInAsDepartment,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}