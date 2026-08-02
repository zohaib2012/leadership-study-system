import { useState, FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { LogIn, Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react'

const roleRoutes: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  SUB_ADMIN: '/admin/dashboard',
  ACCOUNTANT: '/admin/dashboard',
  TEACHER: '/teacher/dashboard',
  STUDENT: '/student/dashboard',
  PARENT: '/parent/dashboard',
  SUPER_ADMIN: '/super-admin/dashboard',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)
  const { user, token, login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => { setVisible(true) }, [])

  useEffect(() => {
    if (token && user) {
      const route = user.role ? roleRoutes[user.role] || '/admin/dashboard' : '/admin/dashboard'
      navigate(route, { replace: true })
    }
  }, [token, user, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    try {
      await login(email, password)
      const user = useAuthStore.getState().user
      const route = user?.role ? roleRoutes[user.role] || '/admin/dashboard' : '/admin/dashboard'
      navigate(route, { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
        </div>
        <div className={`max-w-lg mx-auto px-4 relative z-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <img
                src="/icons/logo.jpeg"
                alt="Leadership Study System Logo"
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl shadow-primary-900/20"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" /> Welcome Back
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-500 text-lg">Access your account to continue</p>
          </div>

          <Card className="shadow-xl border-gray-200/80 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600" />
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <p className="text-sm text-red-700 text-center">{error}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="h-11 pl-10 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary-700 hover:bg-primary-800 text-white font-semibold text-base rounded-xl shadow-lg shadow-primary-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <LogIn className="h-5 w-5" /> Sign In
                    </span>
                  )}
                </Button>

                <div className="flex items-center justify-between pt-2">
                  <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-primary-700 transition-colors">
                    Forgot Password?
                  </Link>
                  <Link to="/register" className="text-sm text-primary-700 hover:text-primary-800 font-medium inline-flex items-center gap-1 transition-colors">
                    Create Account <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center mt-6 text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} Leadership Study System. All rights reserved.
          </p>
        </div>
      </div>
    </>
  )
}
