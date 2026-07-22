import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, BookOpen, Users } from 'lucide-react'

export default function SuperTimetable() {
  const [slots, setSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/super-admin/timetable').then(({ data }) => {
      if (data.success) setSlots(data.data || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-64 bg-gray-100 rounded" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-primary-700" />
        <h1 className="text-2xl font-bold">All Timetables</h1>
      </div>
      {slots.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No timetable data found.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {slots.map((s: any) => (
            <Card key={s._id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{s.subject?.name || 'N/A'} — {s.class?.name || 'N/A'}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{s.dayOfWeek}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{s.startTime} - {s.endTime}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{s.teacher?.user?.name || s.teacher?.name || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
