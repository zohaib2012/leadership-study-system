import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Edit } from 'lucide-react'

interface SubjectItem {
  _id: string
  name: string
  code: string
  type: string
}

export default function SubjectList() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editItem, setEditItem] = useState<SubjectItem | null>(null)
  const [form, setForm] = useState({ name: '', code: '', type: 'SCHOOL' })
  const [saving, setSaving] = useState(false)

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/subjects')
      if (data.success) setSubjects(data.data || [])
    } catch (err) {
      console.error('Failed to fetch subjects:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchSubjects() }, [fetchSubjects])

  const resetForm = () => {
    setForm({ name: '', code: '', type: 'SCHOOL' })
    setEditItem(null)
  }

  const handleSave = async () => {
    if (!form.name || !form.code) return
    setSaving(true)
    try {
      if (editItem) {
        await api.put(`/subjects/${editItem._id}`, form)
      } else {
        await api.post('/subjects', form)
      }
      setShowDialog(false)
      resetForm()
      fetchSubjects()
    } catch (err) {
      console.error('Failed to save subject:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (sub: SubjectItem) => {
    setForm({ name: sub.name, code: sub.code, type: sub.type })
    setEditItem(sub)
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await api.delete(`/subjects/${id}`)
      fetchSubjects()
    } catch (err) {
      console.error('Failed to delete subject:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <Button onClick={() => { resetForm(); setShowDialog(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Subject
        </Button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'code', header: 'Code' },
          {
            key: 'type',
            header: 'Type',
            render: (row: SubjectItem) => <Badge variant="secondary">{row.type}</Badge>,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: SubjectItem) => (
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
        data={subjects}
        isLoading={isLoading}
        emptyMessage="No subjects found"
      />

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) resetForm() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Mathematics" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Code *</label>
              <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="e.g. MATH-101" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHOOL">School</SelectItem>
                  <SelectItem value="ACADEMY">Academy</SelectItem>
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
