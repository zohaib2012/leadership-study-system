import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface LeaveRequest {
  _id: string
  user: { _id: string; name: string }
  type: string
  from: string
  to: string
  reason: string
  status: string
}

const statusVariant: Record<string, 'success' | 'destructive' | 'warning' | 'secondary'> = {
  APPROVED: 'success',
  REJECTED: 'destructive',
  PENDING: 'warning',
}

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [isLoading, setIsLoading] = useState(true)

  const fetchLeaves = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: any = { limit: 50 }
      if (statusFilter !== 'all') params.status = statusFilter
      const { data } = await api.get('/leaves', { params })
      if (data.success) setLeaves(data.data.leaves || data.data || [])
    } catch (err) {
      console.error('Failed to fetch leaves:', err)
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchLeaves()
  }, [fetchLeaves])

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      await api.put(`/leaves/${id}`, { status: action })
      fetchLeaves()
    } catch (err) {
      console.error('Failed to update leave:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leave Requests</h1>
        <div className="w-40">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: 'user',
            header: 'Name',
            render: (row: LeaveRequest) => row.user?.name || row.user?._id || '-',
          },
          {
            key: 'type',
            header: 'Type',
            render: (row: LeaveRequest) => (
              <Badge variant="secondary">{row.type?.replace(/_/g, ' ')}</Badge>
            ),
          },
          {
            key: 'from',
            header: 'From',
            render: (row: LeaveRequest) => formatDate(row.from),
          },
          {
            key: 'to',
            header: 'To',
            render: (row: LeaveRequest) => formatDate(row.to),
          },
          {
            key: 'reason',
            header: 'Reason',
            render: (row: LeaveRequest) => (
              <span className="max-w-[200px] truncate block">{row.reason}</span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row: LeaveRequest) => (
              <Badge variant={statusVariant[row.status] || 'secondary'}>{row.status}</Badge>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: LeaveRequest) =>
              row.status === 'PENDING' ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleAction(row._id, 'APPROVED')}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleAction(row._id, 'REJECTED')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : null,
          },
        ]}
        data={leaves}
        isLoading={isLoading}
        emptyMessage="No leave requests found"
      />
    </div>
  )
}
