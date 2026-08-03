import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Search, ChevronLeft, ChevronRight, Trash2, Edit, Eye, School, GraduationCap, CheckCircle, XCircle } from 'lucide-react'

interface StudentItem {
  _id: string
  registrationNo: string
  firstName: string
  lastName: string
  fatherName: string
  fatherPhone: string
  class: { _id: string; name: string }
  status: string
  type: string
  academySeries: string
}

interface ClassOption {
  _id: string
  name: string
}

const statusVariants: Record<string, 'success' | 'destructive' | 'warning' | 'secondary' | 'default'> = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  PENDING: 'warning',
  PASSED_OUT: 'warning',
  TRANSFERRED: 'destructive',
}

const statusOptions = ['ACTIVE', 'INACTIVE', 'PENDING', 'PASSED_OUT', 'TRANSFERRED']

export default function StudentList({ defaultType }: { defaultType?: 'SCHOOL' | 'ACADEMY' }) {
  const [students, setStudents] = useState<StudentItem[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState(defaultType || 'all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchStudents = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: any = { page, limit: 10, search }
      if (classFilter !== 'all') params.class = classFilter
      if (statusFilter !== 'all') params.status = statusFilter
      if (typeFilter !== 'all') params.type = typeFilter
      const { data } = await api.get('/students', { params })
      if (data.success) {
        setStudents(data.data.students || data.data || [])
        setTotalPages(data.data.totalPages || data.data.pages || Math.ceil((data.data.total || 0) / 10) || 1)
      }
    } catch (err) {
      console.error('Failed to fetch students:', err)
    } finally {
      setIsLoading(false)
    }
  }, [page, search, classFilter, statusFilter, typeFilter])

  const fetchClasses = async () => {
    try {
      const { data } = await api.get('/classes')
      if (data.success) setClasses(data.data || [])
    } catch (err) {
      console.error('Failed to fetch classes:', err)
    }
  }

  useEffect(() => { fetchClasses() }, [])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await api.delete(`/students/${deleteId}`)
      setDeleteId(null)
      fetchStudents()
    } catch (err) {
      console.error('Failed to delete student:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (studentId: string, newStatus: string) => {
    setActionLoading(studentId)
    try {
      await api.put(`/students/${studentId}`, { status: newStatus })
      fetchStudents()
    } catch (err) {
      console.error('Failed to update student status:', err)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {defaultType === 'ACADEMY' ? 'Academy Students' : defaultType === 'SCHOOL' ? 'School Students' : 'Students'}
        </h1>
        <Link to="/admin/students/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add Student
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or reg#..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Select value={classFilter} onValueChange={(v) => { setClassFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map(s => (
              <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!defaultType && (
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="SCHOOL">School</SelectItem>
              <SelectItem value="ACADEMY">Academy</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <DataTable
        columns={[
          { key: 'registrationNo', header: 'Reg#' },
          {
            key: 'name',
            header: 'Name',
            render: (row: StudentItem) => `${row.firstName} ${row.lastName}`,
          },
          {
            key: 'class',
            header: 'Class',
            render: (row: StudentItem) => row.class?.name || '-',
          },
          { key: 'fatherName', header: 'Father' },
          {
            key: 'type',
            header: 'Type',
            render: (row: StudentItem) => (
              <Badge variant={row.type === 'SCHOOL' ? 'secondary' : 'outline'} className="gap-1 whitespace-nowrap">
                {row.type === 'SCHOOL' ? <School className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                {row.type === 'SCHOOL' ? 'School' : 'Academy'}
                {row.academySeries && <span className="text-xs ml-0.5">({row.academySeries.replace('_', '/')})</span>}
              </Badge>
            ),
          },
          { key: 'fatherPhone', header: 'Phone' },
          {
            key: 'status',
            header: 'Status',
            render: (row: StudentItem) => (
              <Badge variant={statusVariants[row.status] || 'secondary'}>
                {row.status?.replace(/_/g, ' ')}
              </Badge>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: StudentItem) => (
              <div className="flex items-center gap-1">
                {(row.status === 'INACTIVE' || row.status === 'PENDING') && (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Approve"
                    disabled={actionLoading === row._id}
                    onClick={() => handleStatusChange(row._id, 'ACTIVE')}
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
                {row.status === 'ACTIVE' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Deactivate"
                    disabled={actionLoading === row._id}
                    onClick={() => handleStatusChange(row._id, 'INACTIVE')}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/students/${row._id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/students/${row._id}/edit`)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(row._id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ),
          },
        ]}
        data={students}
        isLoading={isLoading}
        emptyMessage="No students found"
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this student? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
