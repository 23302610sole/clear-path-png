import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export const AutoRedirect = () => {
  const { user, userType, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Only redirect once loading is complete and we know the user type
    if (!loading && user) {
      if (userType === 'student') {
        navigate('/student', { replace: true })
      } else if (userType === 'department') {
        navigate('/department', { replace: true })
      }
    }
  }, [user, userType, loading, navigate])

  return null
}