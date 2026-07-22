import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, AlertTriangle } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIME_SLOTS = ['08:00', '08:45', '09:30', '10:15', '11:00', '11:45', '12:30', '13:15', '14:00', '14:45']

interface ClassOption {
  _id: string
  name: string
}

interface SubjectOption {
  _id: string
  name: string
}

interface TeacherOption {
  _id: string
  name: string
}

interface TimetableSlot {
  _id: string
  dayOfWeek: string
  startTime: string
  endTime: string
  subject: { _id: string; name: string }
  teacher: { _id: string; name: string }
  room: string
}

export default function TimetableBuilder() {
  const [selectedClass, setSelectedClass] = useState('')
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [subjects, setSubjects] = useState<SubjectOption[]>([])
  const [teachers, setTeachers] = useState<TeacherOption[]>([])
  const [timetable, setTimetable] = useState<TimetableSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [conflict, setConflict] = useState('')
  const [slotForm, setSlotForm] = useState({
    day: 'Monday',
    startTime: '08:00',
    endTime: '08:45',
    subject: '',
    teacher: '',
    room: '',
  })

  useEffect(() => {
    fetchOptions()
  }, [])

  const fetchOptions = async () => {
    try {
      const [cRes, sRes, tRes] = await Promise.all([
        api.get('/classes'),
        api.get('/subjects'),
        api.get('/teachers'),
      ])
      if (cRes.data.success) setClasses(cRes.data.data || [])
      if (sRes.data.success) setSubjects(sRes.data.data || [])
      if (tRes.data.success) setTeachers(tRes.data.data?.teachers || [])
    } catch (err) {
      console.error('Failed to fetch options:', err)
    }
  }

  const fetchTimetable = useCallback(async () => {
    if (!selectedClass) return
    setIsLoading(true)
    try {
      const { data } = await api.get('/timetable', { params: { classId: selectedClass } })
      if (data.success) setTimetable(data.data || [])
    } catch (err) {
      console.error('Failed to fetch timetable:', err)
      setTimetable([])
    } finally {
      setIsLoading(false)
    }
  }, [selectedClass])

  useEffect(() => {
    fetchTimetable()
  }, [fetchTimetable])

  const checkConflict = () => {
    const ucDay = slotForm.day.toUpperCase()
    const conflictSlot = timetable.find(
      (s) => s.dayOfWeek === ucDay && s.startTime === slotForm.startTime
    )
    if (conflictSlot) {
      setConflict(`Conflict: ${conflictSlot.teacher?.name || 'Someone'} already teaches ${conflictSlot.subject?.name} at this time`)
      return true
    }
    const teacherConflict = timetable.find(
      (s) => s.dayOfWeek === ucDay && s.startTime === slotForm.startTime && s.teacher?._id === slotForm.teacher
    )
    if (teacherConflict) {
      setConflict('This teacher is already assigned at this time')
      return true
    }
    setConflict('')
    return false
  }

  const handleAddSlot = async () => {
    if (!slotForm.subject || !slotForm.teacher || checkConflict()) return
    try {
      await api.post('/timetable', {
        class: selectedClass,
        dayOfWeek: slotForm.day.toUpperCase(),
        startTime: slotForm.startTime,
        endTime: slotForm.endTime,
        subject: slotForm.subject,
        teacher: slotForm.teacher,
        room: slotForm.room,
      })
      setShowAddDialog(false)
      setSlotForm({ day: 'Monday', startTime: '08:00', endTime: '08:45', subject: '', teacher: '', room: '' })
      setConflict('')
      fetchTimetable()
    } catch (err) {
      console.error('Failed to add slot:', err)
    }
  }

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Remove this slot?')) return
    try {
      await api.delete(`/timetable/${slotId}`)
      fetchTimetable()
    } catch (err) {
      console.error('Failed to delete slot:', err)
    }
  }

  const getSlot = (day: string, time: string) => {
    return timetable.find((s) => s.dayOfWeek === day && s.startTime === time)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Timetable Builder</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-48" />
          <div className="h-64 bg-gray-100 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Timetable Builder</h1>
        <Button onClick={() => setShowAddDialog(true)} disabled={!selectedClass}>
          <Plus className="h-4 w-4 mr-2" /> Add Slot
        </Button>
      </div>

      <div className="w-64">
        <label className="block text-sm font-medium mb-1">Select Class</label>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger><SelectValue placeholder="Choose class" /></SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedClass ? (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-3 py-2 text-left font-medium border-r">Time</th>
                {DAYS.slice(0, 6).map((day) => (
                  <th key={day} className="px-3 py-2 text-left font-medium border-r">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((time) => (
                <tr key={time} className="border-t">
                  <td className="px-3 py-2 border-r text-muted-foreground">{time}</td>
                  {DAYS.slice(0, 6).map((day) => {
                    const slot = getSlot(day.toUpperCase(), time)
                    return (
                      <td key={day} className="px-3 py-2 border-r min-w-[140px]">
                        {slot ? (
                          <div className="bg-primary-50 rounded p-1.5 text-xs relative group">
                            <p className="font-medium text-primary-800">{slot.subject?.name}</p>
                            <p className="text-muted-foreground">{slot.teacher?.user?.name || slot.teacher?.name}</p>
                            {slot.room && <p className="text-muted-foreground">Room: {slot.room}</p>}
                            <button
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500"
                              onClick={() => handleDeleteSlot(slot._id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Please select a class to view or edit its timetable
          </CardContent>
        </Card>
      )}

      <Dialog open={showAddDialog} onOpenChange={(open) => { setShowAddDialog(open); if (!open) setConflict('') }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Timetable Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {conflict && (
              <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {conflict}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Day</label>
              <Select value={slotForm.day} onValueChange={(v) => setSlotForm((f) => ({ ...f, day: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAYS.slice(0, 6).map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Start</label>
                <Select value={slotForm.startTime} onValueChange={(v) => setSlotForm((f) => ({ ...f, startTime: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End</label>
                <Select value={slotForm.endTime} onValueChange={(v) => setSlotForm((f) => ({ ...f, endTime: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject *</label>
              <Select value={slotForm.subject} onValueChange={(v) => setSlotForm((f) => ({ ...f, subject: v }))}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teacher *</label>
              <Select value={slotForm.teacher} onValueChange={(v) => setSlotForm((f) => ({ ...f, teacher: v }))}>
                <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room</label>
              <Input value={slotForm.room} onChange={(e) => setSlotForm((f) => ({ ...f, room: e.target.value }))} placeholder="e.g. Room 101" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowAddDialog(false); setConflict('') }}>Cancel</Button>
              <Button onClick={handleAddSlot}>Add Slot</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
