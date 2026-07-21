import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, ArrowLeft, CheckCircle, Lock, GraduationCap } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Please enter your email address')
      return
    }
    setIsLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSuccess(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary-500 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-blue-500 rounded-full blur-[128px] animate-pulse animation-delay-2000" />
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-700/30">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Forgot Password</h1>
            <p className="text-white/60 text-sm">Enter your email to receive reset instructions</p>
          </div>

          {success ? (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-white font-medium text-lg">Check your email</p>
              <p className="text-white/60 text-sm leading-relaxed">
                If an account exists for <span className="text-white/80 font-medium">{email}</span>, we've sent password reset instructions.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 rounded-xl mt-2">
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white/80">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary-500/50 focus:ring-primary-500/20 h-11 rounded-xl"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-700/25 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <Mail className="h-4 w-4" /> Send Reset Link
                  </span>
                )}
              </Button>

              <div className="text-center">
                <Link to="/login" className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white/80 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>

        <p className="text-center mt-6 text-white/30 text-xs">
          © {new Date().getFullYear()} Leadership Study System. All rights reserved.
        </p>
      </div>
    </div>
  )
}