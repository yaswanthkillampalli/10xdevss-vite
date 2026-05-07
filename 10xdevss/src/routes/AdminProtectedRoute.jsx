import { Navigate, Outlet, useLocation } from 'react-router'
import { useEffect, useState } from 'react'
import { isAuthenticated, getCurrentUser } from '../authentication/api'

export default function AdminProtectedRoute() {
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true
    const ensureAdmin = async () => {
      if (!isAuthenticated()) {
        setLoading(false)
        setIsAdmin(false)
        return
      }

      try {
        const res = await getCurrentUser()
        const role = res?.data?.role
        if (mounted) setIsAdmin(role === 'admin')
      } catch (err) {
        if (mounted) setIsAdmin(false)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    ensureAdmin()
    return () => { mounted = false }
  }, [])

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (loading) return null

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
