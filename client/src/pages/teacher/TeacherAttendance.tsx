import { useState, useEffect } from 'react'
import { Save, CheckCheck } from 'lucide-react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface Class {
  _id: string
  name: string
  section?: string
}

interface Student {
  _id: string
  registrationNo: string
  firstName: string
  lastName: string
}

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE'

interface StudentAttendance {
  studentId: string
  status: AttendanceStatus
}

export default function TeacherAttendance() {
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<StudentAttendance[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/teacher/classes')
      .then((res) => setClasses(res.data.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedClassId) return
    setLoading(true)
    setMessage('')
    api.get(`/teacher/classes/${selectedClassId}/students`)
      .then((res) => {
        setStudents(res.data.data)
        setAttendance(res.data.data.map((s: Student) => ({ studentId: s._id, status: 'PRESENT' as AttendanceStatus })))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selectedClassId, date])

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) =>
      prev.map((a) => (a.studentId === studentId ? { ...a, status } : a))
    )
  }

  const markAllPresent = () => {
    setAttendance((prev) => prev.map((a) => ({ ...a, status: 'PRESENT' as AttendanceStatus })))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      await api.post('/attendance/mark', {
        classId: selectedClassId,
        date,
        records: attendance,
      })
      setMessage('Attendance saved successfully!')
    } catch {
      setMessage('Failed to save attendance.')
    } finally {
      setSaving(false)
    }
  }

  const statusColors: Record<AttendanceStatus, string> = {
    PRESENT: 'border-green-500 bg-green-50 text-green-700',
    ABSENT: 'border-red-500 bg-red-50 text-red-700',
    LATE: 'border-yellow-500 bg-yellow-50 text-yellow-700',
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground">Select class and date to mark student attendance.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-full sm:w-64">
              <label className="text-sm font-medium mb-1 block">Class</label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}{c.section ? ` - ${c.section}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClassId && !loading && students.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{students.length} students</p>
            <Button variant="outline" size="sm" onClick={markAllPresent}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Present
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium">#</th>
                    <th className="text-left p-3 text-sm font-medium">Student</th>
                    <th className="text-left p-3 text-sm font-medium">Reg. No</th>
                    <th className="text-center p-3 text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => {
                    const record = attendance.find((a) => a.studentId === s._id)
                    return (
                      <tr key={s._id} className="border-b last:border-b-0 hover:bg-muted/30">
                        <td className="p-3 text-sm">{idx + 1}</td>
                        <td className="p-3 text-sm font-medium">{s.firstName} {s.lastName}</td>
                        <td className="p-3 text-sm text-muted-foreground">{s.registrationNo}</td>
                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            {(['PRESENT', 'ABSENT', 'LATE'] as AttendanceStatus[]).map((status) => (
                              <label
                                key={status}
                                className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer border transition-colors ${
                                  record?.status === status
                                    ? statusColors[status]
                                    : 'border-gray-200 hover:bg-muted'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`attendance-${s._id}`}
                                  value={status}
                                  checked={record?.status === status}
                                  onChange={() => handleStatusChange(s._id, status)}
                                  className="sr-only"
                                />
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                              </label>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Attendance'}
            </Button>
            {message && (
              <Badge variant={message.includes('success') ? 'success' : 'destructive'}>
                {message}
              </Badge>
            )}
          </div>
        </>
      )}

      {selectedClassId && !loading && students.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No students found in this class.
          </CardContent>
        </Card>
      )}

      {selectedClassId && loading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700" />
        </div>
      )}
    </div>
  )
}
