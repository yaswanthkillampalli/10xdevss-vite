import { Navigate, Outlet, useLocation } from 'react-router'
import { isAuthenticated } from '../authentication/api'
import { useAuth } from '../context/AuthContext.jsx'

const ALLOWED_ROLES = ['faculty', 'admin']

export default function FacultyAdminProtectedRoute() {
  const location = useLocation()
  const { isHydrating, session } = useAuth()

  if (isHydrating) {
    return null
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!ALLOWED_ROLES.includes(session?.role || 'student')) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
