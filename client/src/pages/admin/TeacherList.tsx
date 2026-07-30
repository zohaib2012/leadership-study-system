import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, ChevronLeft, ChevronRight, Trash2, Edit, IndianRupee } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface TeacherItem {
  _id: string
  user?: { name: string; email: string; phone: string }
  qualification: string
  experience: number
  salary: number
  joinDate: string
  assignedClasses: {
    class: { _id: string; name: string }
    subject: { _id: string; name: string }
  }[]
  status: string
}

export default function TeacherList() {
  const [teachers, setTeachers] = useState<TeacherItem[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/teachers', { params: { page, limit: 10, search } })
      if (data.success) {
        setTeachers(data.data.teachers || data.data || [])
        setTotalPages(data.data.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch teachers:', err)
    } finally {
      setIsLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <Link to="/admin/teachers/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add Teacher
          </Button>
        </Link>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (row: TeacherItem) => (
              <div>
                <p className="font-medium">{row.user?.name || row.qualification || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">{row.user?.email}</p>
              </div>
            ),
          },
          {
            key: 'phone',
            header: 'Phone',
            render: (row: TeacherItem) => row.user?.phone || '-',
          },
          {
            key: 'subjects',
            header: 'Subjects',
            render: (row: TeacherItem) => {
              const subjectNames = [...new Set(row.assignedClasses?.map((ac) => ac.subject?.name).filter(Boolean) || [])]
              return (
                <div className="flex flex-wrap gap-1">
                  {subjectNames.length ? subjectNames.map((name, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{name}</Badge>
                  )) : '-'}
                </div>
              )
            },
          },
          {
            key: 'classes',
            header: 'Classes',
            render: (row: TeacherItem) => {
              const classIds = new Set(row.assignedClasses?.map((ac) => ac.class?._id).filter(Boolean) || [])
              const classNames = [...new Set(row.assignedClasses?.map((ac) => ac.class?.name).filter(Boolean) || [])]
              return (
                <span title={classNames.join(', ')}>{classIds.size || 0}</span>
              )
            },
          },
          {
            key: 'salary',
            header: 'Salary',
            render: (row: TeacherItem) => formatCurrency(row.salary || 0),
          },
          {
            key: 'joinDate',
            header: 'Join Date',
            render: (row: TeacherItem) => new Date(row.joinDate).toLocaleDateString('en-PK'),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: TeacherItem) => (
              <div className="flex items-center gap-1">
                <Link to={`/admin/teachers/${row._id}/edit`}>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to={`/admin/payroll`}>
                  <Button variant="ghost" size="icon" title="Generate Salary Slip">
                    <IndianRupee className="h-4 w-4 text-primary-600" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (window.confirm('Delete this teacher?')) {
                      api.delete(`/teachers/${row._id}`)
                        .then(() => fetchTeachers())
                        .catch(() => alert('Failed to delete teacher'))
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ),
          },
        ]}
        data={teachers}
        isLoading={isLoading}
        emptyMessage="No teachers found"
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
