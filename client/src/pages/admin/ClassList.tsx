import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Edit, Layers } from 'lucide-react'

interface ClassItem {
  _id: string
  name: string
  numericLevel: number
  type: string
  sections: { _id: string; name: string }[]
  studentCount: number
}

export default function ClassList() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editItem, setEditItem] = useState<ClassItem | null>(null)
  const [showSectionDialog, setShowSectionDialog] = useState<string | null>(null)
  const [sectionName, setSectionName] = useState('')
  const [form, setForm] = useState({ name: '', numericLevel: '', type: 'SCHOOL' })
  const [saving, setSaving] = useState(false)

  const fetchClasses = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/classes')
      if (data.success) setClasses(data.data || [])
    } catch (err) {
      console.error('Failed to fetch classes:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchClasses() }, [fetchClasses])

  const resetForm = () => {
    setForm({ name: '', numericLevel: '', type: 'SCHOOL' })
    setEditItem(null)
  }

  const handleSave = async () => {
    if (!form.name) return
    setSaving(true)
    try {
      if (editItem) {
        await api.put(`/classes/${editItem._id}`, form)
      } else {
        await api.post('/classes', form)
      }
      setShowAddDialog(false)
      resetForm()
      fetchClasses()
    } catch (err) {
      console.error('Failed to save class:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (cls: ClassItem) => {
    setForm({
      name: cls.name,
      numericLevel: cls.numericLevel?.toString() || '',
      type: cls.type,
    })
    setEditItem(cls)
    setShowAddDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    try {
      await api.delete(`/classes/${id}`)
      fetchClasses()
    } catch (err) {
      console.error('Failed to delete class:', err)
    }
  }

  const handleAddSection = async (classId: string) => {
    if (!sectionName.trim()) return
    try {
      await api.post(`/classes/${classId}/sections`, { name: sectionName })
      setSectionName('')
      setShowSectionDialog(null)
      fetchClasses()
    } catch (err) {
      console.error('Failed to add section:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Classes</h1>
        <Button onClick={() => { resetForm(); setShowAddDialog(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Class
        </Button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Class Name' },
          {
            key: 'type',
            header: 'Type',
            render: (row: ClassItem) => <Badge variant="secondary">{row.type}</Badge>,
          },
          {
            key: 'sections',
            header: 'Sections',
            render: (row: ClassItem) => (
              <div className="flex flex-wrap gap-1 items-center">
                {row.sections?.map((s) => (
                  <Badge key={s._id} variant="outline" className="text-xs">{s.name}</Badge>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => { setShowSectionDialog(row._id); setSectionName('') }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ),
          },
          {
            key: 'studentCount',
            header: 'Students',
            render: (row: ClassItem) => row.studentCount || 0,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: ClassItem) => (
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
        data={classes}
        isLoading={isLoading}
        emptyMessage="No classes found"
      />

      <Dialog open={showAddDialog} onOpenChange={(open) => { setShowAddDialog(open); if (!open) resetForm() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Class' : 'Add Class'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Class Name *</label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Class 5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Numeric Level</label>
              <Input type="number" value={form.numericLevel} onChange={(e) => setForm((f) => ({ ...f, numericLevel: e.target.value }))} placeholder="5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHOOL">School</SelectItem>
                  <SelectItem value="O_LEVEL">O Level</SelectItem>
                  <SelectItem value="AS_LEVEL">AS Level</SelectItem>
                  <SelectItem value="A_LEVEL">A Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm() }}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showSectionDialog} onOpenChange={(open) => !open && setShowSectionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Section Name</label>
              <Input value={sectionName} onChange={(e) => setSectionName(e.target.value)} placeholder="e.g. Section A" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowSectionDialog(null)}>Cancel</Button>
              <Button onClick={() => showSectionDialog && handleAddSection(showSectionDialog)}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
