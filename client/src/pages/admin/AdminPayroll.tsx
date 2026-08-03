import { useState, useEffect, useRef } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { IndianRupee, Calendar, CheckCircle, XCircle, Download, Wallet, Users, Banknote, Printer, UserPlus, CheckSquare } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface TeacherOption {
  _id: string
  user: { name: string; email: string }
  salary: number
}

interface SlipItem {
  _id: string
  slipNo: string
  teacher: {
    _id: string
    salary: number
    user: { name: string; email: string; phone: string }
  }
  month: string
  basicSalary: number
  deductions: number
  bonuses: number
  netSalary: number
  status: string
  paidAt: string
  remark?: string
  createdAt: string
}

export default function AdminPayroll() {
  const [slips, setSlips] = useState<SlipItem[]>([])
  const [teachers, setTeachers] = useState<TeacherOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [statusFilter, setStatusFilter] = useState('all')
  const [generating, setGenerating] = useState(false)
  const [message, setMessage] = useState('')

  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [individualGen, setIndividualGen] = useState(false)

  const [payDialog, setPayDialog] = useState<SlipItem | null>(null)
  const [payDeductions, setPayDeductions] = useState('0')
  const [payBonuses, setPayBonuses] = useState('0')
  const [payRemark, setPayRemark] = useState('')
  const [paySaving, setPaySaving] = useState(false)

  const [bulkPaying, setBulkPaying] = useState(false)

  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchSlips(); fetchTeachers() }, [])

  useEffect(() => { fetchSlips() }, [selectedMonth, statusFilter])

  const fetchTeachers = async () => {
    try {
      const { data } = await api.get('/teachers', { params: { limit: 200 } })
      if (data.success) setTeachers(data.data.teachers || data.data || [])
    } catch (err) {
      console.error('Failed to fetch teachers:', err)
    }
  }

  const fetchSlips = async () => {
    setIsLoading(true)
    try {
      const params: any = { limit: 100 }
      if (selectedMonth) params.month = selectedMonth
      if (statusFilter !== 'all') params.status = statusFilter
      const { data } = await api.get('/teachers/salary/slips', { params })
      if (data.success) setSlips(data.data || [])
    } catch (err) {
      console.error('Failed to fetch slips:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkGenerate = async () => {
    if (!selectedMonth) return
    setGenerating(true); setMessage('')
    try {
      const { data } = await api.post('/teachers/salary/bulk-generate', { month: selectedMonth })
      if (data.success) {
        setMessage(`Generated ${data.data.generated} salary slip(s) successfully!`)
        fetchSlips()
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to generate slips')
    } finally { setGenerating(false) }
  }

  const handleIndividualGenerate = async () => {
    if (!selectedMonth || !selectedTeacher) { setMessage('Select teacher and month'); return }
    setIndividualGen(true); setMessage('')
    try {
      const teacher = teachers.find((t) => t._id === selectedTeacher)
      const { data } = await api.post('/teachers/salary/generate', {
        teacherId: selectedTeacher,
        month: selectedMonth,
        basicSalary: teacher?.salary || 0,
      })
      if (data.success) {
        setMessage(`Slip ${data.data.slipNo} generated for ${teacher?.user?.name || 'teacher'}!`)
        fetchSlips()
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to generate slip')
    } finally { setIndividualGen(false) }
  }

  const openPayDialog = (slip: SlipItem) => {
    setPayDialog(slip)
    setPayDeductions(slip.deductions.toString())
    setPayBonuses(slip.bonuses.toString())
    setPayRemark(slip.remark || '')
  }

  const handlePayWithEdit = async () => {
    if (!payDialog) return
    setPaySaving(true)
    try {
      const deductions = Number(payDeductions) || 0
      const bonuses = Number(payBonuses) || 0
      await api.patch(`/teachers/salary/slips/${payDialog._id}`, { deductions, bonuses, remark: payRemark })
      await api.patch(`/teachers/salary/slips/${payDialog._id}/pay`)
      setPayDialog(null)
      fetchSlips()
    } catch (err) {
      console.error('Failed to process payment:', err)
    } finally { setPaySaving(false) }
  }

  const handleBulkMarkPaid = async () => {
    if (!selectedMonth) return
    setBulkPaying(true)
    try {
      const { data } = await api.patch('/teachers/salary/bulk-pay', { month: selectedMonth })
      if (data.success) {
        setMessage(`Marked ${data.data.modifiedCount} slip(s) as paid!`)
        fetchSlips()
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to mark all paid')
    } finally { setBulkPaying(false) }
  }

  const handlePrint = (slip: SlipItem) => {
    const logoUrl = `${window.location.origin}/icons/logo.jpeg`
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`
      <html><head><title>Salary Slip - ${slip.slipNo}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 700px; margin: auto; }
        .header { text-align: center; border-bottom: 2px solid #1e3a5f; padding-bottom: 15px; margin-bottom: 20px; }
        .header .brand { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 6px; }
        .header .brand img { width: 56px; height: 56px; border-radius: 12px; object-fit: cover; }
        .header h1 { color: #1e3a5f; margin: 0; font-size: 22px; }
        .header p { color: #666; margin: 5px 0 0 0; font-size: 13px; }
        .slip-no { text-align: right; font-size: 14px; color: #1e3a5f; font-weight: bold; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        td, th { padding: 10px 12px; text-align: left; border-bottom: 1px solid #ddd; font-size: 14px; }
        th { background: #f5f5f5; font-weight: 600; width: 40%; }
        .total-row td { font-weight: bold; font-size: 16px; border-top: 2px solid #1e3a5f; }
        .net-amount { color: #1e3a5f; font-size: 20px; font-weight: bold; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .paid { background: #d4edda; color: #155724; }
        .pending { background: #fff3cd; color: #856404; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; }
        @media print { body { padding: 20px; } }
      </style></head><body>
        <div class="header">
          <div class="brand">
            <img src="${logoUrl}" alt="Leadership Study System Logo" />
            <div>
              <h1>Leadership Study System</h1>
              <p>Salary Slip</p>
            </div>
          </div>
        </div>
        <div class="slip-no">Slip #: ${slip.slipNo}</div>
        <table>
          <tr><th>Teacher Name</th><td>${slip.teacher?.user?.name || 'N/A'}</td></tr>
          <tr><th>Email</th><td>${slip.teacher?.user?.email || '-'}</td></tr>
          <tr><th>Month</th><td>${slip.month}</td></tr>
          <tr><th>Status</th><td><span class="status-badge ${slip.status === 'PAID' ? 'paid' : 'pending'}">${slip.status}</span></td></tr>
          <tr><th>Basic Salary</th><td>Rs. ${slip.basicSalary.toLocaleString()}</td></tr>
          <tr><th>Deductions</th><td style="color:#c00">Rs. ${slip.deductions.toLocaleString()}</td></tr>
          <tr><th>Bonuses</th><td style="color:#080">Rs. ${slip.bonuses.toLocaleString()}</td></tr>
          <tr class="total-row"><th>Net Salary</th><td class="net-amount">Rs. ${slip.netSalary.toLocaleString()}</td></tr>
        </table>
        ${slip.remark ? `<p><strong>Remark:</strong> ${slip.remark}</p>` : ''}
        ${slip.paidAt ? `<p><strong>Paid On:</strong> ${new Date(slip.paidAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
        <div class="footer">This is a computer-generated slip. &copy; ${new Date().getFullYear()} Leadership Study System</div>
        <script>window.print()</script>
      </body></html>
    `)
    w.document.close()
  }

  const netSalary = payDialog
    ? (payDialog.basicSalary - (Number(payDeductions) || 0) + (Number(payBonuses) || 0))
    : 0

  const totalPending = slips.filter((s) => s.status === 'PENDING').length
  const totalPaid = slips.filter((s) => s.status === 'PAID').length
  const totalAmount = slips.reduce((sum, s) => sum + s.netSalary, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IndianRupee className="h-6 w-6 text-primary-700" />
          <h1 className="text-2xl font-bold">Payroll Management</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Slips</p>
              <p className="text-xl font-bold">{slips.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{totalPending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Paid</p>
              <p className="text-xl font-bold text-green-600">{totalPaid}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Banknote className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Generate Salary Slips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Month</label>
              <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
                className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <Button onClick={handleBulkGenerate} disabled={generating}>
              <Download className="h-4 w-4 mr-2" />
              {generating ? 'Generating...' : 'Generate for All Teachers'}
            </Button>
            <div className="w-px h-10 bg-gray-200 mx-2 hidden sm:block" />
            <div>
              <label className="block text-sm font-medium mb-1">Teacher</label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className="w-56"><SelectValue placeholder="Select teacher..." /></SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t._id} value={t._id}>{t.user?.name} (Rs. {t.salary?.toLocaleString() || 0})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={handleIndividualGenerate} disabled={individualGen || !selectedTeacher}>
              <UserPlus className="h-4 w-4 mr-2" />
              {individualGen ? 'Generating...' : 'Generate for Selected'}
            </Button>
          </div>
          {message && (
            <div className={`mt-3 p-3 rounded-md text-sm ${message.includes('success') || message.includes('Generated') || message.includes('Marked') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Salary Slips</CardTitle>
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                </SelectContent>
              </Select>
              {totalPending > 0 && (
                <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50" onClick={handleBulkMarkPaid} disabled={bulkPaying}>
                  <CheckSquare className="h-4 w-4 mr-1" />
                  {bulkPaying ? 'Marking...' : `Mark All Paid (${totalPending})`}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'slipNo', header: 'Slip #' },
              {
                key: 'teacher', header: 'Teacher',
                render: (row: SlipItem) => (
                  <div>
                    <p className="font-medium">{row.teacher?.user?.name || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">{row.teacher?.user?.email}</p>
                  </div>
                ),
              },
              { key: 'month', header: 'Month' },
              { key: 'basicSalary', header: 'Basic', render: (row: SlipItem) => formatCurrency(row.basicSalary) },
              { key: 'deductions', header: 'Deductions', render: (row: SlipItem) => <span className="text-red-600">{formatCurrency(row.deductions)}</span> },
              { key: 'bonuses', header: 'Bonuses', render: (row: SlipItem) => <span className="text-green-600">{formatCurrency(row.bonuses)}</span> },
              { key: 'netSalary', header: 'Net Salary', render: (row: SlipItem) => <span className="font-semibold">{formatCurrency(row.netSalary)}</span> },
              {
                key: 'status', header: 'Status',
                render: (row: SlipItem) => (
                  <Badge variant={row.status === 'PAID' ? 'success' : 'warning'}>
                    {row.status === 'PAID' ? <CheckCircle className="h-3 w-3 mr-1 inline" /> : <XCircle className="h-3 w-3 mr-1 inline" />}
                    {row.status}
                  </Badge>
                ),
              },
              { key: 'paidAt', header: 'Paid Date', render: (row: SlipItem) => (row.paidAt ? formatDate(row.paidAt) : '-') },
              {
                key: 'actions', header: '',
                render: (row: SlipItem) => (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handlePrint(row)} title="Print Slip">
                      <Printer className="h-4 w-4" />
                    </Button>
                    {row.status === 'PENDING' ? (
                      <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50" onClick={() => openPayDialog(row)}>
                        <CheckCircle className="h-3 w-3 mr-1" /> Mark Paid
                      </Button>
                    ) : null}
                  </div>
                ),
              },
            ]}
            data={slips}
            isLoading={isLoading}
            emptyMessage="No salary slips found. Generate for a month to get started."
          />
        </CardContent>
      </Card>

      <Dialog open={!!payDialog} onOpenChange={(o) => { if (!o) setPayDialog(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" /> Process Payment
            </DialogTitle>
          </DialogHeader>
          {payDialog && (
            <div className="space-y-4">
              <div className="text-sm space-y-1 bg-gray-50 p-3 rounded-lg">
                <p><span className="text-muted-foreground">Teacher:</span> <span className="font-medium">{payDialog.teacher?.user?.name}</span></p>
                <p><span className="text-muted-foreground">Slip #:</span> <span className="font-medium">{payDialog.slipNo}</span></p>
                <p><span className="text-muted-foreground">Month:</span> <span className="font-medium">{payDialog.month}</span></p>
                <p><span className="text-muted-foreground">Basic Salary:</span> <span className="font-medium">{formatCurrency(payDialog.basicSalary)}</span></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Deductions</label>
                  <Input type="number" value={payDeductions} onChange={(e) => setPayDeductions(e.target.value)} placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bonuses</label>
                  <Input type="number" value={payBonuses} onChange={(e) => setPayBonuses(e.target.value)} placeholder="0" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Remark</label>
                <textarea value={payRemark} onChange={(e) => setPayRemark(e.target.value)} placeholder="Optional remark..." rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>

              <div className="bg-primary-50 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">Net Salary</p>
                <p className="text-2xl font-bold text-primary-700">{formatCurrency(netSalary)}</p>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(payDialog.basicSalary)} - {formatCurrency(Number(payDeductions) || 0)} + {formatCurrency(Number(payBonuses) || 0)}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setPayDialog(null)}>Cancel</Button>
                <Button onClick={handlePayWithEdit} disabled={paySaving} className="bg-green-700 hover:bg-green-800">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {paySaving ? 'Processing...' : 'Confirm Payment'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
