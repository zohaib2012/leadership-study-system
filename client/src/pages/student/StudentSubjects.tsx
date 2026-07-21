import { useState, useEffect } from 'react'
import { BookOpen, UserCircle } from 'lucide-react'
import api from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Subject {
  _id: string
  name: string
  code?: string
  teacherName: string
  attendancePercent: number
}

export default function StudentSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/subjects')
      .then((res) => setSubjects(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-700" />
      </div>
    )
  }

  const attendanceColor = (pct: number) => {
    if (pct >= 80) return 'success'
    if (pct >= 60) return 'warning'
    return 'destructive'
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Subjects</h1>
        <p className="text-muted-foreground">View your enrolled subjects and attendance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Card key={subject._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary-700" />
                </div>
                <Badge variant={attendanceColor(subject.attendancePercent)}>
                  {subject.attendancePercent}% attendance
                </Badge>
              </div>
              <h3 className="font-semibold text-lg">{subject.name}</h3>
              {subject.code && (
                <p className="text-xs text-muted-foreground mt-0.5">{subject.code}</p>
              )}
              <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
                <UserCircle className="h-4 w-4" />
                <span>{subject.teacherName}</span>
              </div>
              <div className="mt-3 w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-primary-600 transition-all"
                  style={{ width: `${subject.attendancePercent}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subjects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No subjects enrolled.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
