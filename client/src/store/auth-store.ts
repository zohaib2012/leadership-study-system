import { create } from 'zustand'
import api from '@/lib/api'

interface User {
  _id: string
  name: string
  email: string
  role: string
  phone?: string
  image?: string
  tenant?: {
    _id: string
    name: string
    subdomain: string
    logo?: string
    type: string
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isInitialized: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loadUser: () => Promise<void>
  initialize: () => Promise<void>
}

const USER_KEY = 'auth-user'

const readStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: readStoredUser(),
  token: localStorage.getItem('auth-token'),
  isLoading: false,
  isInitialized: false,

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      if (data.success) {
        localStorage.setItem('auth-token', data.data.token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.data.user))
        set({ user: data.data.user, token: data.data.token, isLoading: false })
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem(USER_KEY)
    set({ user: null, token: null, isInitialized: true })
    window.location.href = '/login'
  },

  loadUser: async () => {
    try {
      const { data } = await api.get('/auth/me')
      localStorage.setItem(USER_KEY, JSON.stringify(data.data))
      set({ user: data.data, isLoading: false })
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('auth-token')
        localStorage.removeItem(USER_KEY)
        set({ user: null, token: null, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    }
  },

  initialize: async () => {
    const token = get().token
    if (token && !get().user) {
      await get().loadUser()
      if (get().token && !get().user && !get().isLoading) {
        get().loadUser()
      }
    } else if (token && get().user) {
      get().loadUser()
    }
    set({ isInitialized: true })
  },
}))
