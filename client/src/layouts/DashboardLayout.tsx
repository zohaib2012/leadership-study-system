import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import ErrorBoundary from '@/components/ErrorBoundary'
import {
  LayoutDashboard, Users, UserCheck, GraduationCap, BookOpen, Calendar, ClipboardCheck,
  IndianRupee, MessageSquare, Megaphone, FileText, Settings, LogOut, Menu, X,
  Clock, Bell, Shield, School, BarChart3, ChevronLeft, Home, ChevronDown, Search,
} from 'lucide-react'

interface Props { role?: 'admin' | 'teacher' | 'student' | 'parent' | 'super-admin' }

const adminMenu = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Students', href: '/admin/students', icon: Users },
  { label: 'Teachers', href: '/admin/teachers', icon: UserCheck },
  { label: 'Classes', href: '/admin/classes', icon: School },
  { label: 'Subjects', href: '/admin/subjects', icon: BookOpen },
  // { label: 'Timetable', href: '/admin/timetable', icon: Calendar },
  { label: 'Attendance', href: '/admin/attendance', icon: ClipboardCheck },
  { label: 'Fees', href: '/admin/fees/structure', icon: IndianRupee },
  { label: 'Homework', href: '/admin/homework', icon: FileText },
  { label: 'Communication', href: '/admin/communication/sms', icon: MessageSquare },
  { label: 'Announcements', href: '/admin/communication/announcements', icon: Megaphone },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

const teacherMenu = [
  { label: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'My Classes', href: '/teacher/classes', icon: School },
  { label: 'Attendance', href: '/teacher/attendance', icon: ClipboardCheck },
  { label: 'Timetable', href: '/teacher/timetable', icon: Calendar },
  { label: 'Homework', href: '/teacher/homework', icon: FileText },
  { label: 'Students', href: '/teacher/students', icon: Users },
  { label: 'Salary', href: '/teacher/salary', icon: IndianRupee },
  { label: 'Profile', href: '/teacher/profile', icon: Settings },
]

const studentMenu = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'My Subjects', href: '/student/subjects', icon: BookOpen },
  { label: 'Timetable', href: '/student/timetable', icon: Calendar },
  { label: 'Attendance', href: '/student/attendance', icon: ClipboardCheck },
  { label: 'Fees', href: '/student/fees', icon: IndianRupee },
  { label: 'Homework', href: '/student/homework', icon: FileText },
  { label: 'Leave', href: '/student/leaves', icon: Clock },
  { label: 'Profile', href: '/student/profile', icon: Settings },
]

const parentMenu = [
  { label: 'Dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
  { label: 'Attendance', href: '/parent/attendance', icon: ClipboardCheck },
  { label: 'Fees', href: '/parent/fees', icon: IndianRupee },
  { label: 'Homework', href: '/parent/homework', icon: FileText },
  { label: 'Profile', href: '/parent/profile', icon: Settings },
]

export default function DashboardLayout({ role = 'admin' }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const menuMap: Record<string, typeof adminMenu> = { admin: adminMenu, teacher: teacherMenu, student: studentMenu, parent: parentMenu, 'super-admin': adminMenu }
  const menu = menuMap[role] || adminMenu

  const pageTitle = menu.find(m => m.href === location.pathname)?.label || 'Dashboard'

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-900 via-primary-950 to-gray-900 text-white transform transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative flex items-center gap-3 h-16 px-4 border-b border-white/10">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-primary-800 font-bold">LSS</span>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-semibold text-sm truncate">{user?.tenant?.name || 'Leadership Study System'}</p>
              <p className="text-xs text-blue-300/70 capitalize">{role} Portal</p>
            </div>
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-white/10" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="p-3 space-y-0.5 overflow-y-auto h-[calc(100%-4rem)]">
          {menu.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-gray-100 h-16 flex items-center justify-between px-4 lg:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <Home className="h-4 w-4" /> Home
            </Link>

            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => navigate(`/${role}/profile`)}>
              <Avatar className="h-8 w-8 ring-2 ring-primary-100">
                <AvatarFallback className="bg-gradient-to-br from-primary-600 to-primary-700 text-white text-xs font-medium">
                  {getInitials(user?.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={logout} className="rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <ErrorBoundary role={role}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}