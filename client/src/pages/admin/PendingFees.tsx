import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface ClassOption {
  _id: string
  name: string
}

interface PendingFee {
  _id: string
  student: { _id: string; firstName: string; lastName: string; registrationNo: string }
  class: { _id: string; name: string }
  month: string
  totalAmount: number
  paidAmount: number
  dueDate: string
  daysOverdue: number
}

export default function PendingFees() {
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [selectedClass, setSelectedClass] = useState('all')
  const [pendingFees, setPendingFees] = useState<PendingFee[]>([])
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

  const fetchPendingFees = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: any = { status: 'PENDING', page, limit: 20 }
      if (selectedClass !== 'all') params.class = selectedClass
      const { data } = await api.get('/fees/pending', { params })
      if (data.success) {
        setPendingFees(data.data.pendingFees || data.data || [])
        setTotalPages(data.data.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch pending fees:', err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedClass, page])

  useEffect(() => {
    fetchPendingFees()
  }, [fetchPendingFees])

  const handleSendReminder = async (feeId: string) => {
    try {
      await api.post(`/fees/challans/${feeId}/reminder`)
      alert('Reminder sent!')
    } catch (err) {
      console.error('Failed to send reminder:', err)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pending Fees</h1>

      <div className="flex items-center gap-4">
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
      </div>

      <DataTable
        columns={[
          {
            key: 'student',
            header: 'Student',
            render: (row: PendingFee) => (
              <div>
                <p className="font-medium">{row.student?.firstName} {row.student?.lastName}</p>
                <p className="text-xs text-muted-foreground">{row.student?.registrationNo}</p>
              </div>
            ),
          },
          {
            key: 'class',
            header: 'Class',
            render: (row: PendingFee) => row.class?.name || '-',
          },
          { key: 'month', header: 'Month' },
          {
            key: 'amount',
            header: 'Amount',
            render: (row: PendingFee) => formatCurrency(row.totalAmount),
          },
          {
            key: 'due',
            header: 'Due',
            render: (row: PendingFee) => formatCurrency(row.totalAmount - (row.paidAmount || 0)),
          },
          {
            key: 'dueDate',
            header: 'Due Date',
            render: (row: PendingFee) => formatDate(row.dueDate),
          },
          {
            key: 'daysOverdue',
            header: 'Days Overdue',
            render: (row: PendingFee) => (
              <Badge variant={row.daysOverdue > 15 ? 'destructive' : 'warning'}>
                {row.daysOverdue || 0} days
              </Badge>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: PendingFee) => (
              <Button variant="outline" size="sm" onClick={() => handleSendReminder(row._id)}>
                <Send className="h-3 w-3 mr-1" /> Reminder
              </Button>
            ),
          },
        ]}
        data={pendingFees}
        isLoading={isLoading}
        emptyMessage="No pending fees"
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
