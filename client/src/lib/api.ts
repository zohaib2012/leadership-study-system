import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp ? payload.exp * 1000 < Date.now() : false
  } catch {
    return false
  }
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    const isSessionCheck = url.includes('/auth/me')
    const token = localStorage.getItem('auth-token')
    const sessionExpired = status === 401 && (isSessionCheck || (token ? isTokenExpired(token) : false))
    if (sessionExpired) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
