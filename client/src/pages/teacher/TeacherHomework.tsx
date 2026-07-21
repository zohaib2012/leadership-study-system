import { useState, useEffect } from 'react'
import { Plus, FileText, Eye, Users, CalendarDays } from 'lucide-react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Class {
  _id: string
  name: string
}

interface Homework {
  _id: string
  title: string
  description: string
  className: string
  dueDate: string
  submissionCount: number
  totalStudents: number
  status: 'ACTIVE' | 'PAST'
}

interface Submission {
  _id: string
  studentName: string
  submittedAt: string
  fileUrl?: string
  status: string
}

export default function TeacherHomework() {
  const [activeHomework, setActiveHomework] = useState<Homework[]>([])
  const [pastHomework, setPastHomework] = useState<Homework[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [subsLoading, setSubsLoading] = useState(false)

  const [form, setForm] = useState({
    classId: '',
    title: '',
    description: '',
    dueDate: '',
    file: null as File | null,
  })
  const [creating, setCreating] = useState(false)

  const fetchHomework = () => {
    api.get('/homework')
      .then((res) => {
        const all: Homework[] = res.data.data
        setActiveHomework(all.filter((h) => h.status === 'ACTIVE'))
        setPastHomework(all.filter((h) => h.status === 'PAST'))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const fetchClasses = () => {
    api.get('/teacher/classes')
      .then((res) => setClasses(res.data.data))
      .catch(() => {})
  }

  useEffect(() => {
    fetchHomework()
    fetchClasses()
  }, [])

  const handleExpand = (hwId: string) => {
    if (expandedId === hwId) {
      setExpandedId(null)
      setSubmissions([])
      return
    }
    setExpandedId(hwId)
    setSubsLoading(true)
    api.get(`/homework/${hwId}/submissions`)
      .then((res) => setSubmissions(res.data.data))
      .catch(() => {})
      .finally(() => setSubsLoading(false))
  }

  const handleCreate = async () => {
    if (!form.classId || !form.title || !form.dueDate) return
    setCreating(true)
    try {
      const fd = new FormData()
      fd.append('classId', form.classId)
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('dueDate', form.dueDate)
      if (form.file) fd.append('file', form.file)
      await api.post('/homework', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setDialogOpen(false)
      setForm({ classId: '', title: '', description: '', dueDate: '', file: null })
      fetchHomework()
    } catch {}
    finally { setCreating(false) }
  }

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date()

  const renderHomeworkCard = (hw: Homework) => (
    <Card key={hw._id}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold">{hw.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{hw.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" /> {hw.className}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                <span className={isOverdue(hw.dueDate) ? 'text-red-500 font-medium' : ''}>
                  {new Date(hw.dueDate).toLocaleDateString()}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {hw.submissionCount}/{hw.totalStudents}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleExpand(hw._id)}>
            <Eye className="h-4 w-4 mr-1" />
            {expandedId === hw._id ? 'Hide' : 'Submissions'}
          </Button>
        </div>

        {expandedId === hw._id && (
          <div className="mt-4 border-t pt-3">
            <p className="text-sm font-medium mb-2">Student Submissions</p>
            {subsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-700" />
              </div>
            ) : submissions.length > 0 ? (
              <div className="space-y-2">
                {submissions.map((sub) => (
                  <div key={sub._id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{sub.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sub.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {sub.fileUrl && (
                        <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <FileText className="h-3 w-3 mr-1" /> View
                          </Button>
                        </a>
                      )}
                      <Badge variant={sub.status === 'SUBMITTED' ? 'success' : 'secondary'}>
                        {sub.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No submissions yet.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-700" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Homework</h1>
          <p className="text-muted-foreground">Create and manage homework assignments.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Create Homework
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Homework</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Class</label>
                <Select value={form.classId} onValueChange={(v) => setForm({ ...form, classId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Homework title" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Due Date</label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Attachment (optional)</label>
                <Input type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} />
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={creating}>
                {creating ? 'Creating...' : 'Create Homework'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Homework</TabsTrigger>
          <TabsTrigger value="past">Past Homework</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="space-y-3">
            {activeHomework.length > 0 ? activeHomework.map(renderHomeworkCard) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No active homework.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="space-y-3">
            {pastHomework.length > 0 ? pastHomework.map(renderHomeworkCard) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No past homework.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
