import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TimetableSlot {
  day: string
  timeSlot: string
  subject: string
  teacher: string
  room: string
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const TIME_SLOTS = [
  '08:00 - 08:45',
  '08:45 - 09:30',
  '09:30 - 10:15',
  '10:30 - 11:15',
  '11:15 - 12:00',
  '12:00 - 12:45',
  '13:00 - 13:45',
  '13:45 - 14:30',
]

export default function StudentTimetable() {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/timetable')
      .then((res) => setTimetable(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getSlot = (day: string, timeSlot: string) =>
    timetable.find((t) => t.day === day && t.timeSlot === timeSlot)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-700" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Timetable</h1>
        <p className="text-muted-foreground">Weekly class schedule.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className="p-3 border bg-muted/50 text-sm font-medium text-left w-32">Time</th>
                {DAYS.map((day) => (
                  <th key={day} className="p-3 border bg-muted/50 text-sm font-medium text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((timeSlot) => (
                <tr key={timeSlot}>
                  <td className="p-2 border text-xs text-muted-foreground font-medium">{timeSlot}</td>
                  {DAYS.map((day) => {
                    const slot = getSlot(day, timeSlot)
                    return (
                      <td key={`${day}-${timeSlot}`} className="p-2 border text-center min-w-[120px]">
                        {slot ? (
                          <div className="bg-primary-50 rounded-md p-1.5">
                            <p className="text-xs font-medium text-primary-800">{slot.subject}</p>
                            <p className="text-[10px] text-primary-600">{slot.teacher}</p>
                            <p className="text-[10px] text-muted-foreground">Room {slot.room}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/40">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
