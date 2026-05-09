import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  getCurrentUser,
  getMyProfile,
  isAuthenticated,
  logoutUser,
} from '../authentication/api'

const AuthContext = createContext(null)

const extractApiData = (response) => response?.data?.data || response?.data || null

const buildSession = (userResponse, profileResponse, fallbackSession = {}) => {
  const user = extractApiData(userResponse) || {}
  const profile = extractApiData(profileResponse) || {}

  return {
    user,
    profile,
    role: user.role || fallbackSession.role || 'student',
    displayProfile: {
      fullName: user.fullName || fallbackSession.displayProfile?.fullName || '',
      avatar: profile.avatar || fallbackSession.displayProfile?.avatar || '',
      headline: profile.headline || fallbackSession.displayProfile?.headline || '',
      location: profile.location || fallbackSession.displayProfile?.location || '',
      username: profile.username || user.username || fallbackSession.displayProfile?.username || '',
    },
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isHydrating, setIsHydrating] = useState(true)

  const refreshSession = async () => {
    if (!isAuthenticated()) {
      setSession(null)
      setIsHydrating(false)
      return null
    }

    setIsHydrating(true)

    try {
      const [userResult, profileResult] = await Promise.allSettled([getCurrentUser(), getMyProfile()])
      const nextSession = buildSession(
        userResult.status === 'fulfilled' ? userResult.value : null,
        profileResult.status === 'fulfilled' ? profileResult.value : null,
        session,
      )

      setSession(nextSession)
      return nextSession
    } catch {
      setSession(null)
      return null
    } finally {
      setIsHydrating(false)
    }
  }

  const setSessionFromLoginResponse = (userData, profileData) => {
    const nextSession = {
      user: userData || {},
      profile: profileData || {},
      role: userData?.role || 'student',
      displayProfile: {
        fullName: userData?.fullName || '',
        avatar: profileData?.avatar || '',
        headline: profileData?.headline || '',
        location: profileData?.location || '',
        username: profileData?.username || userData?.username || '',
      },
    }
    setSession(nextSession)
  }

  const clearSession = () => {
    setSession(null)
  }

  const signOut = async () => {
    try {
      await logoutUser()
    } finally {
      clearSession()
    }
  }

  useEffect(() => {
    refreshSession()
  }, [])

  const value = useMemo(
    () => ({
      session,
      isHydrating,
      refreshSession,
      setSessionFromLoginResponse,
      clearSession,
      signOut,
    }),
    [session, isHydrating],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}