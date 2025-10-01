import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export const AutoRedirect = () => {
  const { user, userType, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      const lastLoginType = (() => {
        try { return localStorage.getItem('lastLoginType') } catch { return null }
      })()

      const type = userType || (lastLoginType as 'student' | 'department' | 'admin' | null)

      if (type === 'student') {
        navigate('/student', { replace: true })
      } else if (type === 'department') {
        navigate('/department', { replace: true })
      } else if (type === 'admin') {
        navigate('/admin', { replace: true })
      }
    }
  }, [user, userType, loading, navigate])

  return null
}