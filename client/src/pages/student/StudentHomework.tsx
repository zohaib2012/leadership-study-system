import { useState, useEffect } from 'react'
import { CalendarDays, FileText, Upload } from 'lucide-react'
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
  DialogClose,
} from '@/components/ui/dialog'

interface HomeworkItem {
  _id: string
  title: string
  description: string
  subject: string
  dueDate: string
  status: 'PENDING' | 'SUBMITTED'
  submittedAt?: string
  fileUrl?: string
}

export default function StudentHomework() {
  const [homework, setHomework] = useState<HomeworkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitId, setSubmitId] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchHomework = () => {
    setLoading(true)
    api.get('/student/homework')
      .then((res) => setHomework(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchHomework()
  }, [])

  const pending = homework.filter((h) => h.status === 'PENDING')
  const submitted = homework.filter((h) => h.status === 'SUBMITTED')

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date()

  const handleSubmit = async () => {
    if (!submitId || !file) return
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      await api.post(`/homework/${submitId}/submit`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSubmitId(null)
      setFile(null)
      fetchHomework()
    } catch {}
    finally { setSubmitting(false) }
  }

  const renderCard = (hw: HomeworkItem) => (
    <Card key={hw._id}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{hw.title}</h3>
              <Badge variant={hw.status === 'SUBMITTED' ? 'success' : isOverdue(hw.dueDate) ? 'destructive' : 'warning'}>
                {hw.status === 'SUBMITTED' ? 'Submitted' : isOverdue(hw.dueDate) ? 'Overdue' : 'Pending'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{hw.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" /> {hw.subject}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                <span className={isOverdue(hw.dueDate) ? 'text-red-500 font-medium' : ''}>
                  Due: {new Date(hw.dueDate).toLocaleDateString()}
                </span>
              </span>
              {hw.submittedAt && (
                <span className="text-xs">
                  Submitted: {new Date(hw.submittedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          {hw.status === 'PENDING' && (
            <Dialog open={submitId === hw._id} onOpenChange={(v) => { if (!v) { setSubmitId(null); setFile(null) } }}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => setSubmitId(hw._id)}>
                  <Upload className="h-4 w-4 mr-1" /> Submit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Homework: {hw.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{hw.description}</p>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Upload File</label>
                    <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </div>
                  <Button className="w-full" onClick={handleSubmit} disabled={submitting || !file}>
                    {submitting ? 'Submitting...' : 'Submit Homework'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
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
      <div>
        <h1 className="text-2xl font-bold">My Homework</h1>
        <p className="text-muted-foreground">View and submit homework assignments.</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending {pending.length > 0 && `(${pending.length})`}
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Submitted {submitted.length > 0 && `(${submitted.length})`}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <div className="space-y-3">
            {pending.length > 0 ? pending.map(renderCard) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No pending homework. Great job!
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="submitted">
          <div className="space-y-3">
            {submitted.length > 0 ? submitted.map(renderCard) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No submitted homework yet.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
