import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/ui/data-table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Edit } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface FeeItem {
  _id: string
  className: string
  class: { _id: string; name: string }
  feeName: string
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
  const [form, setForm] = useState({ className: '', feeName: '', amount: '', frequency: 'MONTHLY' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchFees()
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

  const fetchFees = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/fees/structure')
      if (data.success) setFees(data.data || [])
    } catch (err) {
      console.error('Failed to fetch fees:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetForm = () => {
    setForm({ className: '', feeName: '', amount: '', frequency: 'MONTHLY' })
    setEditItem(null)
  }

  const handleSave = async () => {
    if (!form.className || !form.feeName || !form.amount) return
    setSaving(true)
    try {
      const payload = { ...form, amount: Number(form.amount) }
      if (editItem) {
        await api.put(`/fees/structure/${editItem._id}`, payload)
      } else {
        await api.post('/fees/structure', payload)
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
      className: fee.class?._id || fee.className,
      feeName: fee.feeName,
      amount: fee.amount?.toString() || '',
      frequency: fee.frequency || 'MONTHLY',
    })
    setEditItem(fee)
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await api.delete(`/fees/structure/${id}`)
      fetchFees()
    } catch (err) {
      console.error('Failed to delete fee:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fee Structure</h1>
        <Button onClick={() => { resetForm(); setShowDialog(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Fee
        </Button>
      </div>

      <DataTable
        columns={[
          {
            key: 'className',
            header: 'Class',
            render: (row: FeeItem) => row.class?.name || row.className || '-',
          },
          { key: 'feeName', header: 'Fee Name' },
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
              <Select value={form.className} onValueChange={(v) => setForm((f) => ({ ...f, className: v }))}>
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
              <Input value={form.feeName} onChange={(e) => setForm((f) => ({ ...f, feeName: e.target.value }))} placeholder="e.g. Tuition Fee" />
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
