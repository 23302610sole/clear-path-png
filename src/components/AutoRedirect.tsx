import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export const AutoRedirect = () => {
  const { user, userType, loading } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!loading && user) {
      const lastLoginType = (() => {
        try { return localStorage.getItem('lastLoginType') } catch { return null }
      })()

      const type = userType || (lastLoginType as 'student' | 'department' | 'admin' | null)

      if (type === 'student') {
        if (!pathname.startsWith('/student')) {
          navigate('/student', { replace: true })
        }
      } else if (type === 'department') {
        if (!pathname.startsWith('/department')) {
          navigate('/department', { replace: true })
        }
      } else if (type === 'admin') {
        if (!pathname.startsWith('/admin')) {
          navigate('/admin', { replace: true })
        }
      }
    }
  }, [user, userType, loading, navigate, pathname])

  return null
}