import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'

interface ClassOption {
  _id: string
  name: string
}

interface AttendanceRecord {
  _id: string
  student: {
    _id: string
    firstName: string
    lastName: string
    registrationNo: string
  }
  totalDays: number
  presentDays: number
  absentDays: number
  percentage: number
}

export default function AttendanceReport() {
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [records, setRecords] = useState<AttendanceRecord[]>([])
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

  const fetchReport = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: any = { month: selectedMonth, page, limit: 20 }
      if (selectedClass !== 'all') params.classId = selectedClass
      const { data } = await api.get('/attendance/monthly', { params })
      if (data.success) {
        setRecords(data.data.records || data.data || [])
        setTotalPages(data.data.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch report:', err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedClass, selectedMonth, page])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const handleExport = () => {
    window.open(`/api/attendance/monthly/export?classId=${selectedClass}&month=${selectedMonth}`, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Attendance Reports</h1>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="w-48">
          <label className="block text-sm font-medium mb-1">Class</label>
          <Select value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setPage(1) }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => { setSelectedMonth(e.target.value); setPage(1) }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: 'student',
            header: 'Student Name',
            render: (row: AttendanceRecord) => (
              <div>
                <p className="font-medium">{row.student?.firstName} {row.student?.lastName}</p>
                <p className="text-xs text-muted-foreground">{row.student?.registrationNo}</p>
              </div>
            ),
          },
          { key: 'totalDays', header: 'Total Days' },
          { key: 'presentDays', header: 'Present' },
          { key: 'absentDays', header: 'Absent' },
          {
            key: 'percentage',
            header: 'Percentage',
            render: (row: AttendanceRecord) => {
              const pct = row.percentage || 0
              return (
                <Badge variant={pct >= 75 ? 'success' : pct >= 50 ? 'warning' : 'destructive'}>
                  {pct.toFixed(1)}%
                </Badge>
              )
            },
          },
        ]}
        data={records}
        isLoading={isLoading}
        emptyMessage="No attendance records found"
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
