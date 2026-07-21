import { useState, useEffect, FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, X } from 'lucide-react'

interface ClassOption {
  _id: string
  name: string
}

interface SubjectOption {
  _id: string
  name: string
  type: string
}

export default function TeacherForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [subjects, setSubjects] = useState<SubjectOption[]>([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    salary: '',
    contractType: 'FULL_TIME',
    password: '',
    assignedClasses: [] as string[],
    subjectAssignments: [] as { class: string; subjects: string[] }[],
  })

  useEffect(() => {
    fetchOptions()
    if (isEditing) fetchTeacher()
  }, [id])

  const fetchOptions = async () => {
    try {
      const [classesRes, subjectsRes] = await Promise.all([
        api.get('/classes'),
        api.get('/subjects'),
      ])
      if (classesRes.data.success) setClasses(classesRes.data.data || [])
      if (subjectsRes.data.success) setSubjects(subjectsRes.data.data || [])
    } catch (err) {
      console.error('Failed to fetch options:', err)
    }
  }

  const fetchTeacher = async () => {
    try {
      const { data } = await api.get(`/teachers/${id}`)
      if (data.success) {
        const t = data.data
        setForm({
          name: t.user?.name || t.name || '',
          email: t.user?.email || t.email || '',
          phone: t.user?.phone || t.phone || '',
          qualification: t.qualification || '',
          experience: t.experience?.toString() || '',
          salary: t.salary?.toString() || '',
          contractType: t.contractType || 'FULL_TIME',
          password: '',
          assignedClasses: t.assignedClasses?.map((c: any) => c._id || c) || [],
          subjectAssignments: t.subjectAssignments || [],
        })
      }
    } catch (err) {
      console.error('Failed to fetch teacher:', err)
    }
  }

  const toggleClass = (classId: string) => {
    setForm((f) => ({
      ...f,
      assignedClasses: f.assignedClasses.includes(classId)
        ? f.assignedClasses.filter((id) => id !== classId)
        : [...f.assignedClasses, classId],
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email) {
      setError('Name and email are required')
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        ...form,
        experience: Number(form.experience) || 0,
        salary: Number(form.salary) || 0,
        password: form.password || undefined,
      }
      if (isEditing) {
        await api.put(`/teachers/${id}`, payload)
      } else {
        await api.post('/teachers', payload)
      }
      navigate('/admin/teachers')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save teacher')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/teachers')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Teacher' : 'Add Teacher'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <Card>
            <CardHeader><CardTitle className="text-lg">Personal Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="teacher@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="03XX-XXXXXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Qualification</label>
                <Input value={form.qualification} onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))} placeholder="e.g. M.Sc, B.Ed" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Experience (years)</label>
                <Input type="number" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} placeholder="5" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
                <Input type="number" value={form.salary} onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))} placeholder="50000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contract Type</label>
                <Select value={form.contractType} onValueChange={(v) => setForm((f) => ({ ...f, contractType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Set password" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Class & Subject Assignment</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classes.map((cls) => (
                  <div key={cls._id} className="border rounded-lg p-3">
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={form.assignedClasses.includes(cls._id)}
                        onChange={() => toggleClass(cls._id)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{cls.name}</span>
                    </label>
                    {form.assignedClasses.includes(cls._id) && (
                      <div className="pl-6 flex flex-wrap gap-2">
                        {subjects.map((sub) => (
                          <Badge
                            key={sub._id}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary-50"
                          >
                            {sub.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Teacher'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/teachers')}>Cancel</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
