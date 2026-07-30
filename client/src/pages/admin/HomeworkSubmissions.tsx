import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText, CheckCircle, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Submission {
  _id: string
  studentName: string
  submittedAt: string
  fileUrl?: string
  status: string
  remark?: string
}

export default function HomeworkSubmissions() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [homework, setHomework] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [hwRes, subRes] = await Promise.all([
        api.get(`/homework/${id}`),
        api.get(`/homework/${id}/submissions`),
      ])
      if (hwRes.data.success) setHomework(hwRes.data.data)
      if (subRes.data.success) setSubmissions(subRes.data.data || [])
    } catch (err) {
      console.error('Failed to fetch submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/homework')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{homework?.title || 'Submissions'}</h1>
          {homework && (
            <p className="text-sm text-muted-foreground">
              Due: {formatDate(homework.dueDate)} — {submissions.length} submission(s)
            </p>
          )}
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">No submissions yet.</CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {submissions.map((sub) => (
            <Card key={sub._id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {sub.status === 'SUBMITTED' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                  <div>
                    <p className="font-medium">{sub.studentName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(sub.submittedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sub.fileUrl && (
                    <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" /> View File
                      </Button>
                    </a>
                  )}
                  <Badge variant={sub.status === 'SUBMITTED' ? 'success' : 'secondary'}>
                    {sub.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
