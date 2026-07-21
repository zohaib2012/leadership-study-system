import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'

const roleRoutes: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  SUB_ADMIN: '/admin/dashboard',
  ACCOUNTANT: '/admin/dashboard',
  TEACHER: '/teacher/dashboard',
  STUDENT: '/student/dashboard',
  PARENT: '/parent/dashboard',
  SUPER_ADMIN: '/super-admin/dashboard',
}

export default function AuthLayout() {
  const { token, user } = useAuthStore()
  if (token && user) {
    const route = user.role ? roleRoutes[user.role] || '/admin/dashboard' : '/admin/dashboard'
    return <Navigate to={route} replace />
  }
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-[128px] animate-pulse animation-delay-2000" />
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="relative z-10 w-full">
        <Outlet />
      </div>
    </div>
  )
}
