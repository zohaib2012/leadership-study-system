import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  CalendarDays,
  BookOpen,
  Users,
} from 'lucide-react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Student {
  _id: string
  registrationNo: string
  firstName: string
  lastName: string
  photo?: string
}

interface ClassData {
  _id: string
  name: string
  subject: string
  section?: string
  studentCount: number
  students: Student[]
}

export default function TeacherClasses() {
  const [classes, setClasses] = useState<ClassData[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/teacher/classes')
      .then((res) => setClasses(res.data.data))
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

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">Manage your assigned classes and students.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <Card key={cls._id}>
            <CardHeader className="cursor-pointer" onClick={() => setExpandedId(expandedId === cls._id ? null : cls._id)}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{cls.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{cls.subject}{cls.section ? ` · Section ${cls.section}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{cls.studentCount} students</Badge>
                  {expandedId === cls._id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedId === cls._id && (
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Link to="/teacher/attendance">
                    <Button variant="outline" size="sm">
                      <ClipboardCheck className="h-4 w-4 mr-2" />
                      Mark Attendance
                    </Button>
                  </Link>
                  <Link to="/teacher/timetable">
                    <Button variant="outline" size="sm">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      View Timetable
                    </Button>
                  </Link>
                  <Link to="/teacher/homework">
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Assign Homework
                    </Button>
                  </Link>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Student List</p>
                  {cls.students.length > 0 ? (
                    <div className="space-y-2">
                      {cls.students.map((s) => (
                        <div key={s._id} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-medium">
                            {s.firstName?.[0]}{s.lastName?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{s.firstName} {s.lastName}</p>
                            <p className="text-xs text-muted-foreground">{s.registrationNo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No students enrolled.</p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No classes assigned yet.</p>
        </div>
      )}
    </div>
  )
}
