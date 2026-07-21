import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Users,
  ClipboardList,
  CalendarDays,
  Megaphone,
  Bell,
  Clock,
  ArrowRight,
  GraduationCap,
} from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DashboardData {
  myClassesCount: number
  totalStudentsInMyClasses: number
  pendingHomeworkSubmissions: number
  todayTimetable: any[]
}

export default function TeacherDashboard() {
  const { user } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<any[]>([])

  useEffect(() => {
    api.get('/dashboard/teacher')
      .then((res) => {
        setData(res.data.data)
        if (res.data.announcements) setAnnouncements(res.data.announcements)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-72 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-200 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
                    <div className="h-7 bg-gray-200 rounded w-12 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'My Classes', value: data?.myClassesCount ?? 0, icon: BookOpen, gradient: 'from-blue-500 to-blue-600' },
    { label: 'Total Students', value: data?.totalStudentsInMyClasses ?? 0, icon: Users, gradient: 'from-emerald-500 to-emerald-600' },
    { label: 'Pending Homework', value: data?.pendingHomeworkSubmissions ?? 0, icon: ClipboardList, gradient: 'from-orange-500 to-orange-600' },
    { label: "Today's Classes", value: data?.todayTimetable?.length ?? 0, icon: CalendarDays, gradient: 'from-violet-500 to-violet-600' },
  ]

  const quickActions = [
    { label: 'Take Attendance', icon: ClipboardList, href: '/teacher/attendance', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
    { label: 'My Timetable', icon: CalendarDays, href: '/teacher/timetable', color: 'text-violet-600 bg-violet-50 hover:bg-violet-100' },
    { label: 'My Classes', icon: BookOpen, href: '/teacher/classes', color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
    { label: 'Homework', icon: GraduationCap, href: '/teacher/homework', color: 'text-orange-600 bg-orange-50 hover:bg-orange-100' },
  ]

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 via-primary-500 to-primary-400 bg-clip-text text-transparent">
            Welcome back, {user?.name?.split(' ')[0] || 'Teacher'}
          </h1>
          <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
            <Clock className="h-4 w-4" />
            {dateStr}
          </p>
        </div>
        <Badge variant="secondary" className="w-fit text-sm px-4 py-1.5">
          <GraduationCap className="h-4 w-4 mr-1.5" />
          Teacher Dashboard
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-bold tracking-tight">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className={`flex items-center gap-3 p-4 rounded-xl ${action.color} transition-all duration-200 hover:scale-[1.02] group`}
            >
              <action.icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{action.label}</span>
              <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary-500" />
              Today's Timetable
            </CardTitle>
            <Badge variant="outline">{today.toLocaleDateString('en-US', { weekday: 'long' })}</Badge>
          </CardHeader>
          <CardContent>
            {data?.todayTimetable && data.todayTimetable.length > 0 ? (
              <div className="space-y-2.5">
                {data.todayTimetable.map((slot: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center w-16 py-1 rounded-lg bg-primary-50 dark:bg-primary-950">
                      <span className="text-xs font-bold text-primary-700 leading-tight">{slot.startTime}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight">{slot.endTime || ''}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{slot.subject?.name || 'Class'}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{slot.class?.name || ''}</span>
                        {slot.room && (
                          <>
                            <span>·</span>
                            <span>Room {slot.room}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                      {slot.period || i + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <CalendarDays className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">No classes scheduled for today.</p>
                <p className="text-xs">Enjoy your day off!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary-500" />
              Recent Announcements
            </CardTitle>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {announcements.length > 0 ? (
              <div className="space-y-3">
                {announcements.slice(0, 5).map((ann: any, i: number) => (
                  <div key={ann._id || i} className="p-3.5 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm">{ann.title}</p>
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 flex-shrink-0">
                        {new Date(ann.createdAt || ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ann.content || ann.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Megaphone className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">No announcements yet.</p>
                <p className="text-xs">Check back later for updates.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
