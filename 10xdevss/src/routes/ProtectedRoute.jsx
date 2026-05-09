import { Navigate, Outlet, useLocation } from 'react-router'
import { isAuthenticated } from '../authentication/api'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute() {
  const location = useLocation()
  const { isHydrating } = useAuth()

  if (isHydrating) {
    return null
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}