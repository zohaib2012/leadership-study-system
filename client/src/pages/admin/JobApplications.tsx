import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Search, ChevronLeft, ChevronRight, Trash2, Eye, School, GraduationCap,
  Download, Briefcase, FileText, Mail, Phone,
} from 'lucide-react'

interface JobApplication {
  _id: string
  name: string
  email: string
  phone: string
  academyType: 'SCHOOL' | 'ACADEMY'
  position: string
  qualification: string
  experience: string
  coverLetter: string
  cvUrl?: string
  cvPublicId?: string
  cvName?: string
  status: 'NEW' | 'SHORTLISTED' | 'REJECTED' | 'HIRED'
  createdAt: string
}

const statusVariants: Record<string, 'success' | 'destructive' | 'warning' | 'secondary' | 'default'> = {
  NEW: 'default',
  SHORTLISTED: 'warning',
  HIRED: 'success',
  REJECTED: 'destructive',
}

const statusOptions = ['NEW', 'SHORTLISTED', 'REJECTED', 'HIRED']

export default function JobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [viewApp, setViewApp] = useState<JobApplication | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchApplications = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: any = { page, limit: 10, search }
      if (typeFilter !== 'all') params.type = typeFilter
      if (statusFilter !== 'all') params.status = statusFilter
      const { data } = await api.get('/job-applications', { params })
      if (data.success) {
        setApplications(data.data || [])
        setTotalPages(data.pagination?.pages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch job applications:', err)
    } finally {
      setIsLoading(false)
    }
  }, [page, search, typeFilter, statusFilter])

  useEffect(() => { fetchApplications() }, [fetchApplications])

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActionLoading(id)
    try {
      await api.put(`/job-applications/${id}/status`, { status: newStatus })
      fetchApplications()
      if (viewApp?._id === id) setViewApp((a) => (a ? { ...a, status: newStatus as JobApplication['status'] } : a))
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await api.delete(`/job-applications/${deleteId}`)
      setDeleteId(null)
      fetchApplications()
    } catch (err) {
      console.error('Failed to delete application:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Applications submitted through the careers page</p>
        </div>
        <Badge className="bg-primary-100 text-primary-700 border-primary-200 px-3 py-1.5">
          <Briefcase className="h-3.5 w-3.5 mr-1.5" /> {applications.length} shown
        </Badge>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or position..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="SCHOOL">School</SelectItem>
            <SelectItem value="ACADEMY">Academy</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          { key: 'phone', header: 'Phone' },
          {
            key: 'type',
            header: 'Type',
            render: (row: JobApplication) => (
              <Badge variant={row.academyType === 'SCHOOL' ? 'secondary' : 'outline'} className="gap-1 whitespace-nowrap">
                {row.academyType === 'SCHOOL' ? <School className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                {row.academyType === 'SCHOOL' ? 'School' : 'Academy'}
              </Badge>
            ),
          },
          {
            key: 'position',
            header: 'Position',
            render: (row: JobApplication) => <span className="block max-w-[220px] truncate">{row.position}</span>,
          },
          {
            key: 'cv',
            header: 'CV',
            render: (row: JobApplication) => (
              row.cvUrl ? (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-primary-700 border-primary-200 hover:bg-primary-50"
                >
                  <a href={row.cvUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-3.5 w-3.5 mr-1" /> CV
                  </a>
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">No CV</span>
              )
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row: JobApplication) => (
              <Select
                value={row.status}
                disabled={actionLoading === row._id}
                onValueChange={(v) => handleStatusChange(row._id, v)}
              >
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          },
          {
            key: 'date',
            header: 'Date',
            render: (row: JobApplication) => formatDate(row.createdAt),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: JobApplication) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" title="View Details" onClick={() => setViewApp(row)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeleteId(row._id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ),
          },
        ]}
        data={applications}
        isLoading={isLoading}
        emptyMessage="No job applications found"
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

      {/* View details dialog */}
      <Dialog open={!!viewApp} onOpenChange={(open) => !open && setViewApp(null)}>
        <DialogContent className="max-w-2xl">
          {viewApp && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {viewApp.name}
                  <Badge variant={statusVariants[viewApp.status]} className="ml-2">{viewApp.status}</Badge>
                </DialogTitle>
                <p className="text-sm text-muted-foreground">Applied on {formatDate(viewApp.createdAt)}</p>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-gray-800">{viewApp.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-gray-800">{viewApp.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Position</p>
                      <p className="text-gray-800">{viewApp.position}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <School className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Institution</p>
                      <p className="text-gray-800">{viewApp.academyType === 'SCHOOL' ? 'LSS School' : 'LSS Academy'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Qualification</p>
                      <p className="text-gray-800">{viewApp.qualification || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="text-gray-800">{viewApp.experience ? `${viewApp.experience} years` : '-'}</p>
                    </div>
                  </div>
                </div>
                {viewApp.coverLetter && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cover Letter</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap rounded-lg bg-gray-50 border border-gray-100 p-3">{viewApp.coverLetter}</p>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  {viewApp.cvUrl && (
                    <Button asChild className="bg-primary-600 hover:bg-primary-700">
                      <a href={viewApp.cvUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" /> Download CV {viewApp.cvName ? `(${viewApp.cvName})` : ''}
                      </a>
                    </Button>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Update status:</span>
                    <Select value={viewApp.status} onValueChange={(v) => handleStatusChange(viewApp._id, v)}>
                      <SelectTrigger className="w-[140px] h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this application? This action cannot be undone.
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
