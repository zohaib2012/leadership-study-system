import { useState, useEffect, FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'

interface ClassOption {
  _id: string
  name: string
  sections: { _id: string; name: string }[]
}

interface FormData {
  firstName: string
  lastName: string
  dob: string
  gender: string
  fatherName: string
  fatherPhone: string
  fatherEmail: string
  address: string
  class: string
  section: string
  type: string
  registrationNo: string
}

export default function StudentForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [classes, setClasses] = useState<ClassOption[]>([])
  const [sections, setSections] = useState<{ _id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'MALE',
    fatherName: '',
    fatherPhone: '',
    fatherEmail: '',
    address: '',
    class: '',
    section: '',
    type: 'SCHOOL',
    registrationNo: '',
  })

  useEffect(() => {
    fetchClasses()
    if (isEditing) fetchStudent()
  }, [id])

  const fetchClasses = async () => {
    try {
      const { data } = await api.get('/classes')
      if (data.success) setClasses(data.data || [])
    } catch (err) {
      console.error('Failed to fetch classes:', err)
    }
  }

  const fetchStudent = async () => {
    try {
      const { data } = await api.get(`/students/${id}`)
      if (data.success) {
        const s = data.data
        setForm({
          firstName: s.firstName || '',
          lastName: s.lastName || '',
          dob: s.dob ? new Date(s.dob).toISOString().split('T')[0] : '',
          gender: s.gender || 'MALE',
          fatherName: s.fatherName || '',
          fatherPhone: s.fatherPhone || '',
          fatherEmail: s.fatherEmail || '',
          address: s.address || '',
          class: s.class?._id || '',
          section: s.section?._id || '',
          type: s.type || 'SCHOOL',
          registrationNo: s.registrationNo || '',
        })
        if (s.class?._id) {
          const cls = classes.find((c) => c._id === s.class._id)
          if (cls) setSections(cls.sections || [])
        }
      }
    } catch (err) {
      console.error('Failed to fetch student:', err)
    }
  }

  const handleClassChange = (classId: string) => {
    setForm((f) => ({ ...f, class: classId, section: '' }))
    const cls = classes.find((c) => c._id === classId)
    setSections(cls?.sections || [])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.firstName || !form.fatherName || !form.class) {
      setError('Please fill all required fields')
      return
    }
    setIsLoading(true)
    try {
      const payload = { ...form }
      if (isEditing) {
        await api.put(`/students/${id}`, payload)
      } else {
        await api.post('/students', payload)
      }
      navigate('/admin/students')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save student')
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/students')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Student' : 'Add Student'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <Card>
            <CardHeader><CardTitle className="text-lg">Basic Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <Input value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} placeholder="First name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Last name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <Input type="date" value={form.dob} onChange={(e) => updateField('dob', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <Select value={form.gender} onValueChange={(v) => updateField('gender', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registration No</label>
                <Input value={form.registrationNo} disabled={!isEditing} placeholder={isEditing ? '' : 'Auto-generated'} onChange={(e) => updateField('registrationNo', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <Select value={form.type} onValueChange={(v) => updateField('type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCHOOL">School</SelectItem>
                    <SelectItem value="ACADEMY">Academy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Parent Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Father Name *</label>
                <Input value={form.fatherName} onChange={(e) => updateField('fatherName', e.target.value)} placeholder="Father name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Father Phone</label>
                <Input value={form.fatherPhone} onChange={(e) => updateField('fatherPhone', e.target.value)} placeholder="03XX-XXXXXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Father Email</label>
                <Input type="email" value={form.fatherEmail} onChange={(e) => updateField('fatherEmail', e.target.value)} placeholder="father@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Address" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Academic Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Class *</label>
                <Select value={form.class} onValueChange={handleClassChange}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Section</label>
                <Select value={form.section} onValueChange={(v) => updateField('section', v)}>
                  <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Student'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/students')}>Cancel</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
