import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Users, UserCheck, CalendarCheck, IndianRupee, AlertTriangle, TrendingUp, GraduationCap, DollarSign, Activity, ArrowUpRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  todayAttendance: { total: number; present: number; absent: number; percentage: number }
  monthlyFeeCollected: number
  pendingFeesTotal: number
}

interface MonthlyFee {
  monthKey: string
  collected: number
}

interface ClassStat {
  _id?: string
  classId?: string
  className?: string
  name?: string
  count: number
}

interface RecentAdmission {
  _id: string
  registrationNo: string
  firstName: string
  lastName: string
  class?: { name: string }
  joiningDate: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ totalStudents: 0, totalTeachers: 0, todayAttendance: { total: 0, present: 0, absent: 0, percentage: 0 }, monthlyFeeCollected: 0, pendingFeesTotal: 0 })
  const [monthlyFees, setMonthlyFees] = useState<MonthlyFee[]>([])
  const [classStats, setClassStats] = useState<ClassStat[]>([])
  const [recentAdmissions, setRecentAdmissions] = useState<RecentAdmission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/dashboard/admin')
      if (data.success) {
        const d = data.data
        setStats({
          totalStudents: d.totalStudents || 0,
          totalTeachers: d.totalTeachers || 0,
          todayAttendance: d.todayAttendance || { total: 0, present: 0, absent: 0, percentage: 0 },
          monthlyFeeCollected: d.monthlyFeeCollected || 0,
          pendingFeesTotal: d.pendingFeesTotal || 0,
        })
        setMonthlyFees(d.monthlyFeeTrend || [])
        setClassStats((d.classWiseStudentCount || []).map((c: any) => ({ ...c, className: c.className || c.name || 'Unknown', count: c.count })))
        setRecentAdmissions(d.recentStudents || [])
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const maxFeeAmount = Math.max(...monthlyFees.map((f) => f.collected), 1)

  const statCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      trend: '+12%',
    },
    {
      label: 'Total Teachers',
      value: stats.totalTeachers,
      icon: UserCheck,
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      trend: '+5%',
    },
    {
      label: "Today's Attendance",
      value: `${typeof stats.todayAttendance === 'object' ? stats.todayAttendance.percentage : stats.todayAttendance}%`,
      icon: CalendarCheck,
      gradient: 'from-violet-500 to-violet-600',
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      trend: `${stats.todayAttendance.present}/${stats.todayAttendance.total}`,
    },
    {
      label: 'Monthly Collection',
      value: formatCurrency(stats.monthlyFeeCollected),
      icon: IndianRupee,
      gradient: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      trend: 'This month',
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6">
          <div className="h-7 w-64 bg-slate-700 rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-slate-700 rounded-lg animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-20 animate-pulse" />
                    <div className="h-7 bg-slate-200 rounded w-16 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <div className="h-5 bg-slate-200 rounded w-40 animate-pulse" />
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-8 bg-slate-100 rounded animate-pulse" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-slate-400 text-sm mt-1">
              {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">System Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <Card
              key={idx}
              className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {(card.label === 'Total Students' || card.label === 'Total Teachers') && (
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-medium px-2 py-1 rounded-full">
                      <ArrowUpRight className="h-3 w-3" />
                      {card.trend}
                    </div>
                  )}
                  {card.label === "Today's Attendance" && (
                    <Badge variant={stats.todayAttendance.percentage >= 75 ? 'success' : 'warning'} className="text-xs">
                      {card.trend}
                    </Badge>
                  )}
                  {card.label === 'Monthly Collection' && (
                    <span className="text-xs text-muted-foreground">{card.trend}</span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${card.text}`}>{card.value}</p>
                </div>
                <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-500 group-hover:opacity-80`}
                    style={{ width: card.label === 'Monthly Collection' ? '100%' : `${Math.min(100, (typeof card.value === 'string' ? parseFloat(card.value) : Number(card.value)) * 2)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg">Monthly Fee Collection</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyFees.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">No data available</p>
              ) : (
                monthlyFees.map((item) => (
                  <div key={item.monthKey} className="group/item">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{item.monthKey}</span>
                      <span className="text-sm font-semibold text-slate-900">{formatCurrency(item.collected)}</span>
                    </div>
                    <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-700 ease-out group-hover/item:shadow-lg group-hover/item:shadow-amber-200"
                        style={{ width: `${(item.collected / maxFeeAmount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg">Class-wise Student Count</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classStats.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">No data available</p>
              ) : (
                classStats.map((cls, i) => (
                  <div
                    key={cls._id || i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow flex items-center justify-center text-white text-xs font-bold">
                        {cls.className || cls.name || '?'}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{cls.className || cls.name || 'Unknown'}</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                      {cls.count} students
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 shadow flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-lg">Recent Admissions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'registrationNo', header: 'Reg#' },
              {
                key: 'name',
                header: 'Name',
                render: (row: RecentAdmission) => (
                  <span className="font-medium text-slate-800">{row.firstName} {row.lastName}</span>
                ),
              },
              {
                key: 'class',
                header: 'Class',
                render: (row: RecentAdmission) => (
                  <Badge variant="outline" className="text-xs">{row.class?.name || '-'}</Badge>
                ),
              },
              {
                key: 'joiningDate',
                header: 'Join Date',
                render: (row: RecentAdmission) => (
                  <span className="text-muted-foreground">{new Date(row.joiningDate).toLocaleDateString('en-PK')}</span>
                ),
              },
            ]}
            data={recentAdmissions.slice(0, 5)}
            emptyMessage="No recent admissions"
          />
        </CardContent>
      </Card>

      {stats.pendingFeesTotal > 0 && (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/40 to-transparent rounded-bl-full" />
          <CardHeader className="relative">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              Pending Fees Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-lg font-semibold text-amber-900">{formatCurrency(stats.pendingFeesTotal)} pending in total</p>
            <p className="text-sm text-amber-600 mt-1">Immediate attention required for fee recovery</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
