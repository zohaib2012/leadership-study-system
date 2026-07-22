import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, XCircle, AlertCircle, Clock, Save, CheckCheck, CalendarDays } from 'lucide-react'

interface ClassOption {
  _id: string
  name: string
  sections: { _id: string; name: string }[]
}

interface StudentRecord {
  _id: string
  studentId: string
  firstName: string
  lastName: string
  registrationNo: string
  status: string
}

const STATUS_OPTIONS = [
  { value: 'PRESENT', label: 'Present', icon: <CheckCircle className="h-4 w-4 text-green-600" />, color: 'bg-green-50 border-green-300' },
  { value: 'ABSENT', label: 'Absent', icon: <XCircle className="h-4 w-4 text-red-600" />, color: 'bg-red-50 border-red-300' },
  { value: 'LATE', label: 'Late', icon: <AlertCircle className="h-4 w-4 text-yellow-600" />, color: 'bg-yellow-50 border-yellow-300' },
  { value: 'LEAVE', label: 'Leave', icon: <Clock className="h-4 w-4 text-blue-600" />, color: 'bg-blue-50 border-blue-300' },
]

export default function AttendanceMark() {
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [sections, setSections] = useState<{ _id: string; name: string }[]>([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [attendance, setAttendance] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      const cls = classes.find((c) => c._id === selectedClass)
      setSections(cls?.sections || [])
      setSelectedSection('')
    }
  }, [selectedClass, classes])

  useEffect(() => {
    if (selectedClass) fetchStudents()
  }, [selectedClass, selectedSection, date])

  const fetchClasses = async () => {
    try {
      const { data } = await api.get('/classes')
      if (data.success) setClasses(data.data || [])
    } catch (err) {
      console.error('Failed to fetch classes:', err)
    }
  }

  const fetchStudents = async () => {
    if (!selectedClass) return
    setIsLoading(true)
    try {
      const params: any = { class: selectedClass, limit: 100, status: 'ACTIVE' }
      if (selectedSection) params.section = selectedSection
      const { data } = await api.get('/students', { params })
      if (data.success) {
        const list = data.data.students || data.data || []
        setStudents(list)
        const attMap: Record<string, string> = {}
        list.forEach((s: StudentRecord) => {
          attMap[s.studentId || s._id] = s.status || 'PRESENT'
        })
        setAttendance(attMap)
      }
      const attData = await api.get('/attendance/daily', { params: { class: selectedClass, section: selectedSection || undefined, date } })
      if (attData.data.success && attData.data.data?.length) {
        const existingMap: Record<string, string> = {}
        attData.data.data.forEach((a: any) => {
          existingMap[a.student?._id || a.student] = a.status
        })
        setAttendance((prev) => ({ ...prev, ...existingMap }))
      }
    } catch (err) {
      console.error('Failed to fetch students:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAll = (status: string) => {
    const updated: Record<string, string> = {}
    students.forEach((s) => {
      updated[s.studentId || s._id] = status
    })
    setAttendance((prev) => ({ ...prev, ...updated }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const records = students.map((s) => ({
        studentId: s.studentId || s._id,
        classId: selectedClass,
        status: attendance[s.studentId || s._id] || 'PRESENT',
      }))
      await api.post('/attendance/mark', { records })
      setToast('Attendance saved successfully!')
      setTimeout(() => setToast(''), 3000)
    } catch (err: any) {
      setToast('Failed to save attendance')
      setTimeout(() => setToast(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const stats = {
    present: Object.values(attendance).filter((v) => v === 'PRESENT').length,
    absent: Object.values(attendance).filter((v) => v === 'ABSENT').length,
    late: Object.values(attendance).filter((v) => v === 'LATE').length,
    leave: Object.values(attendance).filter((v) => v === 'LEAVE').length,
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mark Attendance</h1>

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-48">
              <label className="block text-sm font-medium mb-1">Class *</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium mb-1">Section</label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map((s) => (
                    <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleMarkAll('PRESENT')}>
              <CheckCheck className="h-4 w-4 mr-1" /> Mark All Present
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleMarkAll('ABSENT')} className="text-red-600">
              <XCircle className="h-4 w-4 mr-1" /> Mark All Absent
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleMarkAll('LATE')} className="text-yellow-600">
              <AlertCircle className="h-4 w-4 mr-1" /> Mark All Late
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {STATUS_OPTIONS.map((opt) => (
              <Card key={opt.value} className={opt.color}>
                <CardContent className="p-3 text-center">
                  <div className="flex justify-center mb-1">{opt.icon}</div>
                  <p className="text-lg font-bold">{stats[opt.value.toLowerCase() as keyof typeof stats]}</p>
                  <p className="text-xs">{opt.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left">Reg#</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const sid = student.studentId || student._id
                    return (
                      <tr key={sid} className="border-t hover:bg-muted/30">
                        <td className="px-4 py-2">{student.registrationNo}</td>
                        <td className="px-4 py-2">{student.firstName} {student.lastName}</td>
                        <td className="px-4 py-2">
                          <div className="flex justify-center gap-2">
                            {STATUS_OPTIONS.map((opt) => (
                              <label
                                key={opt.value}
                                className={`flex items-center gap-1 px-2 py-1 rounded border cursor-pointer text-xs transition-colors ${attendance[sid] === opt.value ? opt.color + ' border-2' : 'border-transparent hover:bg-gray-100'}`}
                              >
                                <input
                                  type="radio"
                                  name={`att-${sid}`}
                                  value={opt.value}
                                  checked={attendance[sid] === opt.value}
                                  onChange={() => setAttendance((prev) => ({ ...prev, [sid]: opt.value }))}
                                  className="sr-only"
                                />
                                {opt.icon}
                                {opt.label}
                              </label>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
