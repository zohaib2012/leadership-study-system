import { useState, useEffect } from 'react'
import { CheckCircle2, DollarSign, ClipboardList, CalendarDays, BookOpen, Clock, TrendingUp, GraduationCap } from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DashboardData {
  attendancePercentage?: number
  pendingFees?: number
  pendingHomework?: number
  todayTimetable?: {
    subject?: { name?: string } | string
    teacher?: { user?: { name?: string } } | string
    room?: string
    startTime?: string
    endTime?: string
  }[]
}

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/student')
        setData(res.data?.data || res.data)
      } catch (err) {
        console.error('Failed to fetch dashboard', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load dashboard data.</p>
      </div>
    )
  }

  const recentGrades: { subject: string; grade: string; date: string }[] = (data as any).recentGrades || []
  const upcomingExams: { subject: string; date: string; syllabus: string }[] = (data as any).upcomingExams || []

  const todayClasses = (data.todayTimetable || []).map((cls) => ({
    subject: typeof cls.subject === 'object' ? cls.subject?.name || 'Unknown' : cls.subject || 'Unknown',
    time: cls.startTime ? `${cls.startTime}${cls.endTime ? ` - ${cls.endTime}` : ''}` : 'N/A',
    room: cls.room || 'N/A',
    teacher: typeof cls.teacher === 'object' ? cls.teacher?.user?.name || 'N/A' : cls.teacher || 'N/A',
  }))

  const statCards = [
    {
      label: 'Attendance',
      value: `${data.attendancePercentage ?? 0}%`,
      sub: 'overall attendance',
      gradient: 'from-emerald-500 to-emerald-600',
      icon: CheckCircle2,
    },
    {
      label: 'Pending Fees',
      value: `₹${(data.pendingFees ?? 0).toLocaleString()}`,
      sub: 'due amount',
      gradient: 'from-red-500 to-red-600',
      icon: DollarSign,
    },
    {
      label: 'Pending Homework',
      value: String(data.pendingHomework ?? 0),
      sub: 'not submitted',
      gradient: 'from-orange-500 to-orange-600',
      icon: ClipboardList,
    },
    {
      label: "Today's Classes",
      value: String(todayClasses.length),
      sub: 'scheduled',
      gradient: 'from-violet-500 to-violet-600',
      icon: CalendarDays,
    },
  ]

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back,{' '}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {user?.name || 'Student'}
          </span>
        </h1>
        <p className="text-muted-foreground">Here's your academic overview for today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                    <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.sub}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              Today's Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayClasses.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No classes scheduled today.</p>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((cls, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{cls.subject}</p>
                      <p className="text-xs text-muted-foreground">{cls.teacher}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium">{cls.time}</p>
                      <p className="text-xs text-muted-foreground">{cls.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentGrades.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No grades available yet.</p>
            ) : (
              <div className="space-y-3">
                {recentGrades.map((g, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{g.subject}</p>
                      <p className="text-xs text-muted-foreground">{g.date}</p>
                    </div>
                    <Badge variant="outline" className="text-sm font-semibold">{g.grade}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="w-5 h-5 text-primary" />
            Upcoming Exams
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingExams.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No upcoming exams.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingExams.map((exam, i) => (
                <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 space-y-2">
                  <p className="font-semibold">{exam.subject}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {exam.date}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{exam.syllabus}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-primary" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'Subjects', icon: BookOpen, href: '/student/subjects', gradient: 'from-blue-500 to-cyan-500' },
              { label: 'Fees', icon: DollarSign, href: '/student/fees', gradient: 'from-green-500 to-emerald-500' },
              { label: 'Homework', icon: ClipboardList, href: '/student/homework', gradient: 'from-orange-500 to-amber-500' },
              { label: 'Attendance', icon: CheckCircle2, href: '/student/attendance', gradient: 'from-purple-500 to-pink-500' },
              { label: 'Exams', icon: GraduationCap, href: '/student/exams', gradient: 'from-red-500 to-rose-500' },
            ].map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted border border-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {link.label}
                  </span>
                </a>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
