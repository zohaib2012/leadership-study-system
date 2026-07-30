import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/ui/data-table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Edit, CreditCard, Wallet, Clock, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface FeeItem {
  _id: string
  class: { _id: string; name: string }
  name: string
  amount: number
  frequency: string
}

interface ClassOption {
  _id: string
  name: string
}

export default function FeeStructure() {
  const [fees, setFees] = useState<FeeItem[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editItem, setEditItem] = useState<FeeItem | null>(null)
  const [form, setForm] = useState({ class: '', name: '', amount: '', frequency: 'MONTHLY' })
  const [saving, setSaving] = useState(false)
  const [classFilter, setClassFilter] = useState('all')

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    fetchFees()
  }, [classFilter])

  const fetchClasses = async () => {
    try {
      const { data } = await api.get('/classes')
      if (data.success) setClasses(data.data || [])
    } catch (err) {
      console.error('Failed to fetch classes:', err)
    }
  }

  const fetchFees = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: any = {}
      if (classFilter !== 'all') params.class = classFilter
      const { data } = await api.get('/fees/structures', { params })
      if (data.success) setFees(data.data || [])
    } catch (err) {
      console.error('Failed to fetch fees:', err)
    } finally {
      setIsLoading(false)
    }
  }, [classFilter])

  const resetForm = () => {
    setForm({ class: '', name: '', amount: '', frequency: 'MONTHLY' })
    setEditItem(null)
  }

  const handleSave = async () => {
    if (!form.class || !form.name || !form.amount) return
    setSaving(true)
    try {
      const payload = { ...form, amount: Number(form.amount) }
      if (editItem) {
        await api.put(`/fees/structures/${editItem._id}`, payload)
      } else {
        await api.post('/fees/structures', payload)
      }
      setShowDialog(false)
      resetForm()
      fetchFees()
    } catch (err) {
      console.error('Failed to save fee:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (fee: FeeItem) => {
    setForm({
      class: fee.class?._id || '',
      name: fee.name,
      amount: fee.amount?.toString() || '',
      frequency: fee.frequency || 'MONTHLY',
    })
    setEditItem(fee)
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await api.delete(`/fees/structures/${id}`)
      fetchFees()
    } catch (err) {
      console.error('Failed to delete fee:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Fee Structure</h1>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { resetForm(); setShowDialog(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Fee
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/fees/challans" className="group">
          <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-5 transition-all hover:border-primary-400 hover:bg-primary-50 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Challans</p>
                  <p className="text-xs text-muted-foreground">Generate & manage fee challans</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-primary-500 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
        <Link to="/admin/fees/collect" className="group">
          <div className="rounded-xl border border-green-200 bg-green-50/50 p-5 transition-all hover:border-green-400 hover:bg-green-50 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Collection</p>
                  <p className="text-xs text-muted-foreground">Record fee payments</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-green-500 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
        <Link to="/admin/fees/pending" className="group">
          <div className="rounded-xl border border-yellow-200 bg-yellow-50/50 p-5 transition-all hover:border-yellow-400 hover:bg-yellow-50 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Pending Fees</p>
                  <p className="text-xs text-muted-foreground">View overdue & pending challans</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-yellow-500 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>

      <DataTable
        columns={[
          {
            key: 'class',
            header: 'Class',
            render: (row: FeeItem) => row.class?.name || '-',
          },
          { key: 'name', header: 'Fee Name' },
          {
            key: 'amount',
            header: 'Amount',
            render: (row: FeeItem) => formatCurrency(row.amount),
          },
          { key: 'frequency', header: 'Frequency' },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: FeeItem) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(row)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(row._id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ),
          },
        ]}
        data={fees}
        isLoading={isLoading}
        emptyMessage="No fee structures found"
      />

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) resetForm() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Fee' : 'Add Fee'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Class *</label>
              <Select value={form.class} onValueChange={(v) => setForm((f) => ({ ...f, class: v }))}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fee Name *</label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Tuition Fee" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount *</label>
              <Input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="5000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <Select value={form.frequency} onValueChange={(v) => setForm((f) => ({ ...f, frequency: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                  <SelectItem value="ONE_TIME">One Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowDialog(false); resetForm() }}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
