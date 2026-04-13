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

export {
  api,
  authHeaders,
  clearAuthTokens,
  getAccessToken,
  getAccessTokenExpiry,
  getCurrentUser,
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