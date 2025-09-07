import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export const AutoRedirect = () => {
  const { user, userType, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If user is logged in but has no userType (profile not found), sign them out
    if (!loading && user && !userType) {
      console.log('User logged in but no profile found, signing out...')
      // Force redirect to home page to show login
      navigate('/', { replace: true })
      return
    }

    // Redirect as soon as we have a session.
    // Prefer explicit userType; fall back to lastLoginType set during sign-in.
    if (!loading && user) {
      const lastLoginType = (() => {
        try { return localStorage.getItem('lastLoginType') } catch { return null }
      })()

      const type = userType || (lastLoginType as 'student' | 'department' | null)

      if (type === 'student') {
        navigate('/student', { replace: true })
      } else if (type === 'department') {
        navigate('/department', { replace: true })
      }
    }
  }, [user, userType, loading, navigate])

  return null
}