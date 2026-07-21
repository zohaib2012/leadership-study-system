import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AttendanceRecord {
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE' | 'HALF_DAY'
}

interface AttendanceData {
  records: AttendanceRecord[]
  summary: { present: number; absent: number; late: number; total: number }
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function StudentAttendance() {
  const [data, setData] = useState<AttendanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  useEffect(() => {
    setLoading(true)
    api.get(`/student/attendance?month=${month + 1}&year=${year}`)
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [month, year])

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const today = new Date()

  const days = []
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  const getStatusForDay = (day: number): AttendanceRecord | undefined => {
    if (!data) return undefined
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return data.records.find((r) => r.date === dateStr)
  }

  const statusDot = (status: string) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle2 className="h-3 w-3 text-green-500" />
      case 'ABSENT': return <XCircle className="h-3 w-3 text-red-500" />
      case 'LATE': return <Clock className="h-3 w-3 text-yellow-500" />
      case 'LEAVE': return <div className="w-3 h-3 rounded-full bg-blue-400" />
      case 'HALF_DAY': return <div className="w-3 h-3 rounded-full bg-orange-400" />
      default: return <div className="w-3 h-3 rounded-full bg-gray-200" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-700" />
      </div>
    )
  }

  const summary = data?.summary

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Attendance</h1>
        <p className="text-muted-foreground">Monthly attendance record and statistics.</p>
      </div>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Present</p>
                <p className="text-xl font-bold">{summary.present}/{summary.total}</p>
                <p className="text-xs text-muted-foreground">
                  {summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0}%
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Absent</p>
                <p className="text-xl font-bold">{summary.absent}/{summary.total}</p>
                <p className="text-xs text-muted-foreground">
                  {summary.total > 0 ? Math.round((summary.absent / summary.total) * 100) : 0}%
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Late</p>
                <p className="text-xl font-bold">{summary.late}/{summary.total}</p>
                <p className="text-xs text-muted-foreground">
                  {summary.total > 0 ? Math.round((summary.late / summary.total) * 100) : 0}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">
            {MONTHS[month]} {year}
          </CardTitle>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-muted">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-2 py-0.5 text-xs rounded hover:bg-muted font-medium">
              Today
            </button>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-muted">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-xs font-medium text-muted-foreground py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />
              const record = getStatusForDay(day)
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              return (
                <div
                  key={`day-${day}`}
                  className={`aspect-square flex flex-col items-center justify-center rounded-md text-sm border ${
                    isToday ? 'border-primary-500 bg-primary-50' : 'border-transparent'
                  } hover:bg-muted/50`}
                >
                  <span className="text-xs font-medium">{day}</span>
                  {record ? statusDot(record.status) : <div className="w-3 h-3 rounded-full bg-gray-100" />}
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs text-muted-foreground">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-xs text-muted-foreground">Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Late</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
