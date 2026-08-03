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
        classId: selectedClass,
        month,
        dueDate: dueDate || undefined,
      })
      if (data.success) {
        setMessage(`Generated ${data.data.generated || data.data.count || 0} challans successfully!`)
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
    const logoUrl = `${window.location.origin}/icons/logo.jpeg`
    const dueDate = challan.dueDate
      ? new Date(challan.dueDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })
      : '-'
    const amountInWords = numberToWords(challan.totalAmount)
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`
      <html><head><title>Fee Challan - ${challan.challanNo}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; max-width: 720px; margin: auto; background: #f3f4f6; }
        .sheet { background: #fff; border: 2px solid #1e3a5f; padding: 28px; }
        .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #1e3a5f; padding-bottom: 14px; margin-bottom: 18px; }
        .header .brand { display: flex; align-items: center; gap: 12px; }
        .header .brand img { width: 56px; height: 56px; border-radius: 12px; object-fit: cover; }
        .header h1 { margin: 0; font-size: 20px; color: #1e3a5f; }
        .header .sub { color: #666; font-size: 12px; margin-top: 3px; }
        .challan-no { text-align: right; }
        .challan-no .label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .challan-no .value { font-size: 18px; font-weight: bold; color: #1e3a5f; }
        .title { text-align: center; font-size: 15px; letter-spacing: 2px; color: #b45309; font-weight: bold; text-transform: uppercase; margin-bottom: 16px; }
        table.info { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
        table.info td { padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; }
        table.info td.label { background: #f9fafb; font-weight: 600; width: 30%; color: #374151; }
        .amount-box { border: 2px solid #1e3a5f; border-radius: 8px; padding: 14px 18px; margin-bottom: 18px; background: #f0f7ff; }
        .amount-box .row { display: flex; justify-content: space-between; align-items: center; }
        .amount-box .amt { font-size: 26px; font-weight: bold; color: #1e3a5f; }
        .amount-box .words { font-size: 12px; color: #555; margin-top: 6px; }
        .bank-row { display: flex; justify-content: space-between; margin-top: 20px; padding-top: 14px; border-top: 1px dashed #bbb; font-size: 12px; color: #444; }
        .footer { text-align: center; color: #999; font-size: 11px; margin-top: 24px; }
        @media print { body { background: none; padding: 0; } .sheet { border-width: 2px; } }
      </style></head><body>
        <div class="sheet">
          <div class="header">
            <div class="brand">
              <img src="${logoUrl}" alt="Leadership Study System Logo" />
              <div>
                <h1>Leadership Study System</h1>
                <div class="sub">Quality Education for a Brighter Future</div>
              </div>
            </div>
            <div class="challan-no">
              <div class="label">Challan No</div>
              <div class="value">${challan.challanNo}</div>
            </div>
          </div>

          <div class="title">Fee Payment Challan</div>

          <table class="info">
            <tr>
              <td class="label">Student Name</td>
              <td>${challan.student?.firstName || ''} ${challan.student?.lastName || ''}</td>
              <td class="label">Registration No</td>
              <td>${challan.student?.registrationNo || '-'}</td>
            </tr>
            <tr>
              <td class="label">Father Name</td>
              <td>${challan.student?.fatherName || '-'}</td>
              <td class="label">Class</td>
              <td>${challan.class?.name || '-'}</td>
            </tr>
            <tr>
              <td class="label">Month</td>
              <td>${challan.month}</td>
              <td class="label">Due Date</td>
              <td>${dueDate}</td>
            </tr>
          </table>

          <div class="amount-box">
            <div class="row">
              <span style="font-weight:600;font-size:14px;">TOTAL FEE DUE</span>
              <span class="amt">Rs. ${Number(challan.totalAmount || 0).toLocaleString()}</span>
            </div>
            <div class="words">Amount in words: ${amountInWords} only</div>
          </div>

          <div style="font-size:12px;color:#555;">
            <p style="margin:0 0 4px;"><strong>Instructions:</strong></p>
            <p style="margin:0;">Please submit the amount to the Accounts Office before the due date. A late fee may apply after the due date. Keep this challan as proof of payment.</p>
          </div>

          <div class="bank-row">
            <span>Issued By: Leadership Study System</span>
            <span>Status: ${challan.status}</span>
            <span>Date: ${new Date().toLocaleDateString('en-PK')}</span>
          </div>

          <div class="footer">This is a computer-generated challan. &copy; ${new Date().getFullYear()} Leadership Study System</div>
        </div>
        <script>window.print()</script>
      </body></html>
    `)
    w.document.close()
  }

  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    const two = (n: number): string => {
      if (n < 20) return ones[n]
      return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    }
    if (num === 0) return 'Zero'
    let words = ''
    const crore = Math.floor(num / 10000000)
    if (crore) { words += two(crore) + ' Crore '; num %= 10000000 }
    const lakh = Math.floor(num / 100000)
    if (lakh) { words += two(lakh) + ' Lakh '; num %= 100000 }
    const thousand = Math.floor(num / 1000)
    if (thousand) { words += two(thousand) + ' Thousand '; num %= 1000 }
    const hundred = Math.floor(num / 100)
    if (hundred) { words += two(hundred) + ' Hundred '; num %= 100 }
    if (num) { words += (words ? 'and ' : '') + two(num) }
    return words.trim()
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
