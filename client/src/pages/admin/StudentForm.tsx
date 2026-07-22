import { useState, useEffect, FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, School, GraduationCap } from 'lucide-react'

interface ClassOption {
  _id: string
  name: string
  type: string
  sections: { _id: string; name: string }[]
}

interface SubjectOption {
  _id: string
  name: string
  type: string
}

interface FormData {
  firstName: string
  lastName: string
  dob: string
  gender: string
  fatherName: string
  fatherCnic: string
  fatherPhone: string
  fatherEmail: string
  fatherOccupation: string
  motherName: string
  motherPhone: string
  address: string
  city: string
  bloodGroup: string
  previousSchool: string
  medicalNotes: string
  class: string
  section: string
  type: string
  registrationNo: string
  academySeries: string
  subjects: string[]
}

export default function StudentForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [classes, setClasses] = useState<ClassOption[]>([])
  const [sections, setSections] = useState<{ _id: string; name: string }[]>([])
  const [subjects, setSubjects] = useState<SubjectOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'MALE',
    fatherName: '',
    fatherCnic: '',
    fatherPhone: '',
    fatherEmail: '',
    fatherOccupation: '',
    motherName: '',
    motherPhone: '',
    address: '',
    city: '',
    bloodGroup: '',
    previousSchool: '',
    medicalNotes: '',
    class: '',
    section: '',
    type: 'SCHOOL',
    registrationNo: '',
    academySeries: '',
    subjects: [],
  })

  const isSchool = form.type === 'SCHOOL'
  const isAcademy = form.type === 'ACADEMY'

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
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

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get('/subjects')
      if (data.success) setSubjects(data.data || [])
    } catch (err) {
      console.error('Failed to fetch subjects:', err)
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
          fatherCnic: s.fatherCnic || '',
          fatherPhone: s.fatherPhone || '',
          fatherEmail: s.fatherEmail || '',
          fatherOccupation: s.fatherOccupation || '',
          motherName: s.motherName || '',
          motherPhone: s.motherPhone || '',
          address: s.address || '',
          city: s.city || '',
          bloodGroup: s.bloodGroup || '',
          previousSchool: s.previousSchool || '',
          medicalNotes: s.medicalNotes || '',
          class: s.class?._id || s.class || '',
          section: s.section?._id || s.section || '',
          type: s.type || 'SCHOOL',
          registrationNo: s.registrationNo || '',
          academySeries: s.academySeries || '',
          subjects: s.subjects?.map((sub: any) => sub._id || sub) || [],
        })
        if (s.class?._id || s.class) {
          const cls = classes.find((c) => c._id === (s.class?._id || s.class))
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

  const toggleSubject = (subjectId: string) => {
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(subjectId)
        ? f.subjects.filter((sid) => sid !== subjectId)
        : [...f.subjects, subjectId],
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.firstName || !form.lastName || !form.fatherName || !form.dob) {
      setError('Please fill all required fields')
      return
    }
    if (isSchool && !form.class) {
      setError('Please select a class for school students')
      return
    }
    setIsLoading(true)
    try {
      const payload = { ...form }
      if (!isSchool) payload.section = ''
      if (!isAcademy) {
        payload.academySeries = ''
        payload.subjects = []
      }
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

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const handleTypeChange = (v: string) => {
    setForm((f) => ({
      ...f,
      type: v,
      class: '',
      section: '',
      academySeries: '',
      subjects: [],
    }))
  }

  const filteredClasses = classes.filter((c) => c.type === form.type || (isAcademy && c.type === 'ACADEMY') || (isSchool && c.type === 'SCHOOL'))

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
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Registration Type</CardTitle>
              <Badge variant={isSchool ? 'secondary' : 'outline'} className="gap-1">
                {isSchool ? <School className="h-3.5 w-3.5" /> : <GraduationCap className="h-3.5 w-3.5" />}
                {isSchool ? 'School Student' : 'Academy Student'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleTypeChange('SCHOOL')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${isSchool ? 'border-primary-600 bg-primary-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSchool ? 'bg-primary-100' : 'bg-gray-100'}`}>
                      <School className={`h-5 w-5 ${isSchool ? 'text-primary-700' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${isSchool ? 'text-primary-800' : ''}`}>School</p>
                      <p className="text-xs text-muted-foreground">Class 1-10</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Regular school program with class sections and full curriculum</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('ACADEMY')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${isAcademy ? 'border-primary-600 bg-primary-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isAcademy ? 'bg-primary-100' : 'bg-gray-100'}`}>
                      <GraduationCap className={`h-5 w-5 ${isAcademy ? 'text-primary-700' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${isAcademy ? 'text-primary-800' : ''}`}>Academy</p>
                      <p className="text-xs text-muted-foreground">Coaching / Tuition</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Subject-based coaching with flexible exam series selection</p>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Basic Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <Input value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} placeholder="First name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <Input value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Last name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth *</label>
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
                <label className="block text-sm font-medium mb-1">Blood Group</label>
                <Select value={form.bloodGroup} onValueChange={(v) => updateField('bloodGroup', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registration No</label>
                <Input value={form.registrationNo} disabled={!isEditing} placeholder={isEditing ? '' : 'Auto-generated'} onChange={(e) => updateField('registrationNo', e.target.value)} />
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
                <label className="block text-sm font-medium mb-1">Father CNIC</label>
                <Input value={form.fatherCnic} onChange={(e) => updateField('fatherCnic', e.target.value)} placeholder="00000-0000000-0" />
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
                <label className="block text-sm font-medium mb-1">Father Occupation</label>
                <Input value={form.fatherOccupation} onChange={(e) => updateField('fatherOccupation', e.target.value)} placeholder="Occupation" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mother Name</label>
                <Input value={form.motherName} onChange={(e) => updateField('motherName', e.target.value)} placeholder="Mother name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mother Phone</label>
                <Input value={form.motherPhone} onChange={(e) => updateField('motherPhone', e.target.value)} placeholder="03XX-XXXXXXX" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Address" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Input value={form.city} onChange={(e) => updateField('city', e.target.value)} placeholder="City" />
              </div>
            </CardContent>
          </Card>

          {isSchool && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <School className="h-5 w-5 text-primary-700" />
                <CardTitle className="text-lg">School Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Class *</label>
                    <Select value={form.class} onValueChange={handleClassChange}>
                      <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>
                        {filteredClasses.filter((c) => c.type === 'SCHOOL').map((c) => (
                          <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Section</label>
                    <Select value={form.section} onValueChange={(v) => updateField('section', v)} disabled={!form.class}>
                      <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Section</SelectItem>
                        {sections.map((s) => (
                          <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Previous School</label>
                  <Input value={form.previousSchool} onChange={(e) => updateField('previousSchool', e.target.value)} placeholder="Previous school name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Medical Notes</label>
                  <Input value={form.medicalNotes} onChange={(e) => updateField('medicalNotes', e.target.value)} placeholder="Any medical conditions or allergies" />
                </div>
              </CardContent>
            </Card>
          )}

          {isAcademy && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary-700" />
                <CardTitle className="text-lg">Academy Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Class/Level *</label>
                    <Select value={form.class} onValueChange={handleClassChange}>
                      <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                      <SelectContent>
                        {filteredClasses.filter((c) => c.type === 'ACADEMY').length === 0 && classes.filter((c) => c.type === 'SCHOOL').length > 0 ? (
                          classes.filter((c) => c.type === 'SCHOOL').map((c) => (
                            <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                          ))
                        ) : (
                          filteredClasses.filter((c) => c.type === 'ACADEMY').length > 0
                            ? filteredClasses.filter((c) => c.type === 'ACADEMY').map((c) => (
                              <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                            ))
                            : filteredClasses.map((c) => (
                              <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Exam Series</label>
                    <Select value={form.academySeries} onValueChange={(v) => updateField('academySeries', v)}>
                      <SelectTrigger><SelectValue placeholder="Select series" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MAY_JUNE">May / June</SelectItem>
                        <SelectItem value="OCT_NOV">Oct / Nov</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subjects</label>
                  <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                    {subjects.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No subjects available</p>
                    ) : (
                      <div className="space-y-1">
                        {subjects.map((s) => (
                          <label key={s._id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.subjects.includes(s._id)}
                              onChange={() => toggleSubject(s._id)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{s.name}</span>
                            <Badge variant="outline" className="text-xs ml-auto">{s.type}</Badge>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {form.subjects.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">{form.subjects.length} subject(s) selected</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : `Save ${isSchool ? 'School' : 'Academy'} Student`}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/students')}>Cancel</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
