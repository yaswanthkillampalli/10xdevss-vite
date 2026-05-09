import axios from 'axios'
import Cookies from 'js-cookie'

const baseURL =
  import.meta.env.VITE_BACKENDURL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKENDURL ||
  'http://localhost:3000'

const accessTokenKey = '10xdevss_access_token'
const refreshTokenKey = '10xdevss_refresh_token'
const accessTokenExpiryKey = '10xdevss_access_token_expiry'
const refreshTokenExpiryKey = '10xdevss_refresh_token_expiry'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const getAccessToken = () => Cookies.get(accessTokenKey)
const getRefreshToken = () => Cookies.get(refreshTokenKey)
const getAccessTokenExpiry = () => Cookies.get(accessTokenExpiryKey)
const getRefreshTokenExpiry = () => Cookies.get(refreshTokenExpiryKey)

const saveAuthTokens = ({ token, refreshToken, expiresAt, refreshExpiresAt } = {}) => {
  if (token) {
    Cookies.set(accessTokenKey, token, { secure: true, sameSite: 'strict' })
    if (expiresAt) {
      Cookies.set(accessTokenExpiryKey, new Date(expiresAt).toISOString(), { secure: true, sameSite: 'strict' })
    }
  }
  if (refreshToken) {
    Cookies.set(refreshTokenKey, refreshToken, { secure: true, sameSite: 'strict', path: '/' })
    if (refreshExpiresAt) {
      Cookies.set(refreshTokenExpiryKey, new Date(refreshExpiresAt).toISOString(), { secure: true, sameSite: 'strict' })
    }
  }
}

const clearAuthTokens = () => {
  Cookies.remove(accessTokenKey)
  Cookies.remove(refreshTokenKey)
  Cookies.remove(accessTokenExpiryKey)
  Cookies.remove(refreshTokenExpiryKey)
}

const isAuthenticated = () => Boolean(getAccessToken())

const authHeaders = () => {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearAuthTokens()
        return Promise.reject(error)
      }

      try {
        refreshPromise ||= axios.post(`${baseURL}/api/auth/refresh-token`, { refreshToken })
        const response = await refreshPromise
        refreshPromise = null

        const newToken = response.data?.token
        const newRefreshToken = response.data?.refreshToken

        if (newToken || newRefreshToken) {
          saveAuthTokens({ token: newToken, refreshToken: newRefreshToken })
        }

        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${newToken || getAccessToken()}`
        return api(originalRequest)
      } catch (refreshError) {
        refreshPromise = null
        clearAuthTokens()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

const registerUser = async (payload) => {
  const response = await api.post('/api/auth/register', payload)
  saveAuthTokens({
    token: response.data?.token,
    expiresAt: response.data?.expiresAt,
    refreshToken: response.data?.refreshToken,
    refreshExpiresAt: response.data?.refreshExpiresAt,
  })
  return response.data
}

const loginUser = async ({ email, password }) => {
  const response = await api.post('/api/auth/login', { email, password })
  saveAuthTokens({
    token: response.data?.token,
    expiresAt: response.data?.expiresAt,
    refreshToken: response.data?.refreshToken,
    refreshExpiresAt: response.data?.refreshExpiresAt,
  })
  return response.data
}

const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('Refresh token not found')
  }

  const response = await api.post('/api/auth/refresh-token', { refreshToken })
  saveAuthTokens({
    token: response.data?.token,
    expiresAt: response.data?.expiresAt,
    refreshToken: response.data?.refreshToken,
    refreshExpiresAt: response.data?.refreshExpiresAt,
  })
  return response.data
}

const logoutUser = async () => {
  try {
    await api.post('/api/auth/logout')
  } finally {
    clearAuthTokens()
  }
}

const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me')
  return response.data
}

const getMyUser = async () => {
  const response = await api.get('/api/users/me')
  return response.data
}

const updateMyUser = async (payload) => {
  const response = await api.put('/api/users/me', payload)
  return response.data
}

const searchDirectoryUsers = async (params = {}) => {
  const response = await api.get('/api/users/search', { params })
  return response.data
}

const getMyProfile = async () => {
  const response = await api.get('/api/profile/me')
  return response.data
}

const getPublicProfileByUserId = async (userId) => {
  const response = await api.get(`/api/profile/user/${userId}`)
  return response.data
}

const createMyProfile = async (payload) => {
  const response = await api.post('/api/profile', payload)
  return response.data
}

const updateMyProfile = async (payload) => {
  const response = await api.put('/api/profile', payload)
  return response.data
}

const getDashboardOverview = async (params = {}) => {
  const response = await api.get('/api/dashboard/overview', { params })
  return response.data
}

const getDiscoverProjects = async (params = {}) => {
  const response = await api.get('/api/projects/discover', { params })
  return response.data
}

const getDiscoverPublications = async (params = {}) => {
  const response = await api.get('/api/publications/discover', { params })
  return response.data
}

const getDiscoverAchievements = async (params = {}) => {
  const response = await api.get('/api/achievements/discover', { params })
  return response.data
}

const getMyProjects = async () => {
  const response = await api.get('/api/projects')
  return response.data
}

const createProject = async (payload) => {
  const response = await api.post('/api/projects', payload)
  return response.data
}

const updateProject = async (id, payload) => {
  const response = await api.put(`/api/projects/${id}`, payload)
  return response.data
}

const deleteProject = async (id) => {
  const response = await api.delete(`/api/projects/${id}`)
  return response.data
}

const getMyAchievements = async () => {
  const response = await api.get('/api/achievements')
  return response.data
}

const createAchievement = async (payload) => {
  const response = await api.post('/api/achievements', payload)
  return response.data
}

const updateAchievement = async (id, payload) => {
  const response = await api.put(`/api/achievements/${id}`, payload)
  return response.data
}

const deleteAchievement = async (id) => {
  const response = await api.delete(`/api/achievements/${id}`)
  return response.data
}

const getMyPublications = async () => {
  const response = await api.get('/api/publications')
  return response.data
}

const createPublication = async (payload) => {
  const response = await api.post('/api/publications', payload)
  return response.data
}

const updatePublication = async (id, payload) => {
  const response = await api.put(`/api/publications/${id}`, payload)
  return response.data
}

const deletePublication = async (id) => {
  const response = await api.delete(`/api/publications/${id}`)
  return response.data
}

const getMyExperience = async () => {
  const response = await api.get('/api/experience')
  return response.data
}

const createExperience = async (payload) => {
  const response = await api.post('/api/experience', payload)
  return response.data
}

const updateExperience = async (id, payload) => {
  const response = await api.put(`/api/experience/${id}`, payload)
  return response.data
}

const deleteExperience = async (id) => {
  const response = await api.delete(`/api/experience/${id}`)
  return response.data
}

const getMySkills = async () => {
  const response = await api.get('/api/skills')
  return response.data
}

const createSkill = async (payload) => {
  const response = await api.post('/api/skills', payload)
  return response.data
}

const updateSkill = async (id, payload) => {
  const response = await api.put(`/api/skills/${id}`, payload)
  return response.data
}

const deleteSkill = async (id) => {
  const response = await api.delete(`/api/skills/${id}`)
  return response.data
}

const getMyCertifications = async () => {
  const response = await api.get('/api/certifications')
  return response.data
}

const createCertification = async (payload) => {
  const response = await api.post('/api/certifications', payload)
  return response.data
}

const updateCertification = async (id, payload) => {
  const response = await api.put(`/api/certifications/${id}`, payload)
  return response.data
}

const deleteCertification = async (id) => {
  const response = await api.delete(`/api/certifications/${id}`)
  return response.data
}


const changePassword = async (payload) => {
  const response = await api.post('/api/auth/change-password', payload)
  saveAuthTokens({
    token: response.data?.token,
    refreshToken: response.data?.refreshToken,
    expiresAt: response.data?.expiresAt,
    refreshExpiresAt: response.data?.refreshExpiresAt,
  })
  return response.data
}

const forgotPassword = async (emailId) => {
  const response = await api.post('/api/auth/forgot-password', { emailId })
  return response.data
}

const resetPassword = async (payload) => {
  const response = await api.post('/api/auth/reset-password', payload)
  saveAuthTokens({
    token: response.data?.token,
    refreshToken: response.data?.refreshToken,
    expiresAt: response.data?.expiresAt,
    refreshExpiresAt: response.data?.refreshExpiresAt,
  })
  return response.data
}

export {
  api,
  authHeaders,
  clearAuthTokens,
  getAccessToken,
  getAccessTokenExpiry,
  getCurrentUser,
  getMyUser,
  updateMyUser,
  searchDirectoryUsers,
  getMyProfile,
  getPublicProfileByUserId,
  createMyProfile,
  updateMyProfile,
  getDashboardOverview,
  getDiscoverProjects,
  getDiscoverPublications,
  getDiscoverAchievements,
  getMyProjects,
  createProject,
  updateProject,
  deleteProject,
  getMyAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getMyPublications,
  createPublication,
  updatePublication,
  deletePublication,
  getMyExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  getMySkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getMyCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  changePassword,
  forgotPassword,
  resetPassword,
  getRefreshToken,
  getRefreshTokenExpiry,
  isAuthenticated,
  loginUser,
  logoutUser,
  refreshAuthToken,
  registerUser,
  saveAuthTokens,
}

export default api