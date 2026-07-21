import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ActivityLog {
  _id: string
  user: { _id: string; name: string; email: string }
  action: string
  details: string
  ip: string
  createdAt: string
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/logs', { params: { page, limit: 25, search } })
      if (data.success) {
        setLogs(data.data.logs || data.data || [])
        setTotalPages(data.data.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err)
    } finally {
      setIsLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Activity Logs</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by user, action..."
          className="pl-9"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      <DataTable
        columns={[
          {
            key: 'user',
            header: 'User',
            render: (row: ActivityLog) => (
              <div>
                <p className="font-medium">{row.user?.name || 'System'}</p>
                <p className="text-xs text-muted-foreground">{row.user?.email}</p>
              </div>
            ),
          },
          {
            key: 'action',
            header: 'Action',
            render: (row: ActivityLog) => (
              <Badge variant="secondary">{row.action}</Badge>
            ),
          },
          {
            key: 'details',
            header: 'Details',
            render: (row: ActivityLog) => (
              <span className="max-w-[250px] truncate block">{row.details || '-'}</span>
            ),
          },
          {
            key: 'createdAt',
            header: 'Date',
            render: (row: ActivityLog) => (
              <span className="text-sm">{formatDate(row.createdAt)}</span>
            ),
          },
          { key: 'ip', header: 'IP' },
        ]}
        data={logs}
        isLoading={isLoading}
        emptyMessage="No activity logs found"
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
