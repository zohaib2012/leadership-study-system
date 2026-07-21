import { useState } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, CreditCard, CheckCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface ChallanItem {
  _id: string
  challanNo: string
  student: { _id: string; firstName: string; lastName: string; registrationNo: string; class: { name: string } }
  month: string
  totalAmount: number
  paidAmount: number
  dueDate: string
  status: string
}

interface ReceiptInfo {
  receiptNo: string
  amount: number
  date: string
}

export default function FeeCollection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ChallanItem[]>([])
  const [selectedChallan, setSelectedChallan] = useState<ChallanItem | null>(null)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [isSearching, setIsSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [receipt, setReceipt] = useState<ReceiptInfo | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setError('')
    setSelectedChallan(null)
    setReceipt(null)
    try {
      const { data } = await api.get('/fees/challans/pending', { params: { search: searchQuery } })
      if (data.success) {
        setSearchResults(data.data || [])
        if (!data.data?.length) setError('No pending challans found for this search')
      }
    } catch (err) {
      setError('Search failed')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectChallan = (challan: ChallanItem) => {
    setSelectedChallan(challan)
    setAmount((challan.totalAmount - (challan.paidAmount || 0)).toString())
    setReceipt(null)
    setError('')
  }

  const handleRecordPayment = async () => {
    if (!selectedChallan || !amount) return
    setSaving(true)
    setError('')
    try {
      const { data } = await api.post(`/fees/challans/${selectedChallan._id}/pay`, {
        amount: Number(amount),
        paymentMethod,
      })
      if (data.success) {
        setReceipt({
          receiptNo: data.data.receiptNo || `RCP-${Date.now()}`,
          amount: Number(amount),
          date: new Date().toISOString(),
        })
        setSelectedChallan(null)
        setSearchResults((prev) =>
          prev.map((c) =>
            c._id === selectedChallan._id
              ? { ...c, status: Number(amount) >= (c.totalAmount - (c.paidAmount || 0)) ? 'PAID' : 'PARTIAL', paidAmount: (c.paidAmount || 0) + Number(amount) }
              : c
          )
        )
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Payment failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-bold">Fee Collection</h1>

      <Card>
        <CardHeader><CardTitle className="text-lg">Search Student</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or registration number..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {searchResults.map((c) => (
                <div
                  key={c._id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedChallan?._id === c._id ? 'border-primary-700 bg-primary-50' : 'hover:bg-gray-50'}`}
                  onClick={() => handleSelectChallan(c)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{c.student?.firstName} {c.student?.lastName}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.student?.registrationNo} | {c.student?.class?.name} | {c.month}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(c.totalAmount)}</p>
                      <Badge variant={c.status === 'PAID' ? 'success' : c.status === 'OVERDUE' ? 'destructive' : 'warning'}>
                        {c.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedChallan && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Record Payment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Challan #</p>
                <p className="font-medium">{selectedChallan.challanNo}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Student</p>
                <p className="font-medium">{selectedChallan.student?.firstName} {selectedChallan.student?.lastName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Amount</p>
                <p className="font-medium">{formatCurrency(selectedChallan.totalAmount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Due</p>
                <p className="font-medium text-red-600">
                  {formatCurrency(selectedChallan.totalAmount - (selectedChallan.paidAmount || 0))}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p className="font-medium">{formatDate(selectedChallan.dueDate)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount *</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="JAZZCASH">JazzCash</SelectItem>
                    <SelectItem value="EASYPAISA">Easypaisa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleRecordPayment} disabled={saving} className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              {saving ? 'Processing...' : 'Record Payment'}
            </Button>
          </CardContent>
        </Card>
      )}

      {receipt && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-green-800">Payment Successful!</h3>
            <div className="mt-3 space-y-1 text-sm">
              <p>Receipt #: <span className="font-medium">{receipt.receiptNo}</span></p>
              <p>Amount: <span className="font-medium">{formatCurrency(receipt.amount)}</span></p>
              <p>Date: <span className="font-medium">{formatDate(receipt.date)}</span></p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
