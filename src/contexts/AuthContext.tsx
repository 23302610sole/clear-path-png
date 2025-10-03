import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Student, DepartmentUser, AdminUser, isSupabaseConfigured } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  studentProfile: Student | null
  departmentProfile: DepartmentUser | null
  adminProfile: AdminUser | null
  userType: 'student' | 'department' | 'admin' | null
  loading: boolean
  signInAsStudent: (email: string, password: string) => Promise<void>
  signInAsDepartment: (email: string, password: string, departmentCode?: string) => Promise<void>
  signInAsAdmin: (email: string, password: string) => Promise<void>
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
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null)
  const [userType, setUserType] = useState<'student' | 'department' | 'admin' | null>(null)
  const [loading, setLoading] = useState(true)
  const [retryAttempted, setRetryAttempted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setLoading(false)
      }
    })

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
        setAdminProfile(null)
        setUserType(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!retryAttempted && !loading && user && !userType) {
      setRetryAttempted(true)
      console.log('Retrying profile load as fallback...')
      loadUserProfile(user)
    }
  }, [user, userType, loading, retryAttempted])

  const loadUserProfile = async (user: User) => {
    try {
      console.log('Loading user profile for:', user.email, 'User ID:', user.id)
      
      // Try admin first
      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .maybeSingle()

      if (admin && !adminError) {
        await supabase
          .from('admin_users')
          .update({ id: user.id })
          .eq('email', user.email)
        
        setAdminProfile({ ...admin, id: user.id })
        setUserType('admin')
        setStudentProfile(null)
        setDepartmentProfile(null)
        setLoading(false)
        console.log('Loaded as admin:', admin.full_name)
        return
      }
      
      // Try student
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('email', user.email)
        .maybeSingle()
      
      if (student && !studentError) {
        await supabase
          .from('students')
          .update({ id: user.id })
          .eq('email', user.email)
        
        setStudentProfile({ ...student, id: user.id })
        setUserType('student')
        setDepartmentProfile(null)
        setAdminProfile(null)
        setLoading(false)
        console.log('Loaded as student:', student.full_name)
        return
      }

      // Try department
      const { data: department, error: deptError } = await supabase
        .from('department_users')
        .select('*')
        .eq('email', user.email)
        .maybeSingle()

      if (department && !deptError) {
        await supabase
          .from('department_users')
          .update({ id: user.id })
          .eq('email', user.email)
          
        setDepartmentProfile({ ...department, id: user.id })
        setUserType('department')
        setStudentProfile(null)
        setAdminProfile(null)
        setLoading(false)
        console.log('Loaded as department user:', department.full_name)
        return
      }

      console.log('No profile found for user:', user.email)
      setUserType(null)
      setStudentProfile(null)
      setDepartmentProfile(null)
      setAdminProfile(null)
    } catch (error) {
      console.error('Error loading user profile:', error)
      setUserType(null)
      setStudentProfile(null)
      setDepartmentProfile(null)
      setAdminProfile(null)
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
      
      try { localStorage.setItem('lastLoginType', 'student') } catch {}
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

  const signInAsDepartment = async (email: string, password: string, departmentCode?: string) => {
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured. Connect the Supabase integration to enable login.')
      }

      // Sign in with Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Verify the user exists in department_users table and has correct department access
      let query = supabase
        .from('department_users')
        .select('email, department')
        .eq('email', email)
      
      // If departmentCode is provided, verify they belong to that department
      if (departmentCode) {
        const { data: dept } = await supabase
          .from('departments')
          .select('name')
          .eq('code', departmentCode)
          .maybeSingle()
        
        if (dept) {
          query = query.eq('department', dept.name)
        }
      }
      
      const { data: deptUser, error: deptError } = await query.maybeSingle()

      if (deptError || !deptUser) {
        await supabase.auth.signOut()
        throw new Error(departmentCode 
          ? "You don't have access to this department"
          : "No department profile found for this account")
      }

      if (error) throw error

      toast({
        title: 'Welcome!',
        description: 'Successfully logged in as department officer',
      })
      
      try { localStorage.setItem('lastLoginType', 'department') } catch {}
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

  const signInAsAdmin = async (email: string, password: string) => {
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured. Connect the Supabase integration to enable login.')
      }

      // Sign in with Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Verify the user exists in admin_users table
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', email)
        .maybeSingle()

      if (adminError || !adminUser) {
        await supabase.auth.signOut()
        throw new Error("No admin profile found for this account")
      }

      if (error) throw error

      toast({
        title: 'Welcome Admin!',
        description: 'Successfully logged in',
      })
      
      try { localStorage.setItem('lastLoginType', 'admin') } catch {}
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
      try { localStorage.removeItem('lastLoginType') } catch {}
    }
  }

  const value: AuthContextType = {
    user,
    session,
    studentProfile,
    departmentProfile,
    adminProfile,
    userType,
    loading,
    signInAsStudent,
    signInAsDepartment,
    signInAsAdmin,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
