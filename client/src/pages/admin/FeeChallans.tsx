import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard, Printer } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface ClassOption {
  _id: string
  name: string
}

interface ChallanItem {
  _id: string
  challanNo: string
  student: { _id: string; firstName: string; lastName: string; registrationNo: string }
  class: { _id: string; name: string }
  month: string
  totalAmount: number
  dueDate: string
  status: string
}

export default function FeeChallans() {
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [dueDate, setDueDate] = useState('')
  const [challans, setChallans] = useState<ChallanItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchClasses()
    fetchChallans()
  }, [])

  const fetchClasses = async () => {
    try {
      const { data } = await api.get('/classes')
      if (data.success) setClasses(data.data || [])
    } catch (err) {
      console.error('Failed to fetch classes:', err)
    }
  }

  const fetchChallans = async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/fees/challans', { params: { limit: 50 } })
      if (data.success) setChallans(data.data.challans || data.data || [])
    } catch (err) {
      console.error('Failed to fetch challans:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedClass || !month) {
      setMessage('Please select a class and month')
      return
    }
    setGenerating(true)
    setMessage('')
    try {
      const { data } = await api.post('/fees/challans/generate', {
        class: selectedClass,
        month,
        dueDate: dueDate || undefined,
      })
      if (data.success) {
        setMessage(`Generated ${data.data.count || 0} challans successfully!`)
        fetchChallans()
      } else {
        setMessage(data.message || 'Failed to generate challans')
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to generate challans')
    } finally {
      setGenerating(false)
    }
  }

  const handlePrint = (challan: ChallanItem) => {
    window.open(`/api/fees/challans/${challan._id}/print`, '_blank')
  }

  const statusVariant: Record<string, 'success' | 'destructive' | 'warning' | 'secondary'> = {
    PAID: 'success',
    PENDING: 'warning',
    OVERDUE: 'destructive',
    PARTIAL: 'secondary',
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Fee Challans</h1>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Generate Challans</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-48">
            <label className="block text-sm font-medium mb-1">Class *</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Month *</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <Button onClick={handleGenerate} disabled={generating}>
            <CreditCard className="h-4 w-4 mr-2" />
            {generating ? 'Generating...' : 'Generate Challans'}
          </Button>
        </div>
        {message && (
          <div className={`mt-3 p-3 rounded-md text-sm ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}
      </div>

      <DataTable
        columns={[
          { key: 'challanNo', header: 'Challan #' },
          {
            key: 'student',
            header: 'Student',
            render: (row: ChallanItem) => (
              <div>
                <p className="font-medium">{row.student?.firstName} {row.student?.lastName}</p>
                <p className="text-xs text-muted-foreground">{row.student?.registrationNo}</p>
              </div>
            ),
          },
          {
            key: 'class',
            header: 'Class',
            render: (row: ChallanItem) => row.class?.name || '-',
          },
          { key: 'month', header: 'Month' },
          {
            key: 'totalAmount',
            header: 'Amount',
            render: (row: ChallanItem) => formatCurrency(row.totalAmount),
          },
          {
            key: 'dueDate',
            header: 'Due Date',
            render: (row: ChallanItem) => row.dueDate ? formatDate(row.dueDate) : '-',
          },
          {
            key: 'status',
            header: 'Status',
            render: (row: ChallanItem) => (
              <Badge variant={statusVariant[row.status] || 'secondary'}>{row.status}</Badge>
            ),
          },
          {
            key: 'actions',
            header: '',
            render: (row: ChallanItem) => (
              <Button variant="ghost" size="sm" onClick={() => handlePrint(row)}>
                <Printer className="h-4 w-4 mr-1" /> Print
              </Button>
            ),
          },
        ]}
        data={challans}
        isLoading={isLoading}
        emptyMessage="No challans found"
      />
    </div>
  )
}
