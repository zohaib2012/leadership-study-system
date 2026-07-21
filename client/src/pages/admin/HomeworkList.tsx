import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ClassOption {
  _id: string
  name: string
}

interface HomeworkItem {
  _id: string
  title: string
  description: string
  dueDate: string
  class: { _id: string; name: string }
  subject: { _id: string; name: string }
  teacher: { _id: string; name: string }
  submissionCount: number
  totalStudents: number
}

export default function HomeworkList() {
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [selectedClass, setSelectedClass] = useState('all')
  const [homework, setHomework] = useState<HomeworkItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const { data } = await api.get('/classes')
      if (data.success) setClasses(data.data || [])
    } catch (err) {
      console.error('Failed to fetch classes:', err)
    }
  }

  const fetchHomework = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: any = { page, limit: 20 }
      if (selectedClass !== 'all') params.class = selectedClass
      const { data } = await api.get('/homework', { params })
      if (data.success) {
        setHomework(data.data.homework || data.data || [])
        setTotalPages(data.data.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch homework:', err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedClass, page])

  useEffect(() => {
    fetchHomework()
  }, [fetchHomework])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Homework</h1>
        <Link to="/admin/homework/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Create Homework
          </Button>
        </Link>
      </div>

      <div className="w-48">
        <Select value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setPage(1) }}>
          <SelectTrigger><SelectValue placeholder="All Classes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Title' },
          {
            key: 'class',
            header: 'Class',
            render: (row: HomeworkItem) => row.class?.name || '-',
          },
          {
            key: 'teacher',
            header: 'Teacher',
            render: (row: HomeworkItem) => row.teacher?.name || '-',
          },
          {
            key: 'dueDate',
            header: 'Due Date',
            render: (row: HomeworkItem) => {
              const isOverdue = new Date(row.dueDate) < new Date()
              return (
                <span className={isOverdue ? 'text-red-600' : ''}>
                  {formatDate(row.dueDate)}
                  {isOverdue && <Badge variant="destructive" className="ml-2 text-xs">Overdue</Badge>}
                </span>
              )
            },
          },
          {
            key: 'submissions',
            header: 'Submissions',
            render: (row: HomeworkItem) => (
              <span>{row.submissionCount || 0}/{row.totalStudents || 0}</span>
            ),
          },
          {
            key: 'actions',
            header: '',
            render: (row: HomeworkItem) => (
              <Link to={`/admin/homework/${row._id}/submissions`}>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" /> Submissions
                </Button>
              </Link>
            ),
          },
        ]}
        data={homework}
        isLoading={isLoading}
        emptyMessage="No homework found"
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
