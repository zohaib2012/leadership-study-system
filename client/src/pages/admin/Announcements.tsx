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
import { Plus, Trash2, Edit, Pin } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Announcement {
  _id: string
  title: string
  content: string
  target: string
  targetClass?: { _id: string; name: string }
  isPinned: boolean
  createdAt: string
}

interface ClassOption {
  _id: string
  name: string
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editItem, setEditItem] = useState<Announcement | null>(null)
  const [form, setForm] = useState({ title: '', content: '', target: 'ALL', targetClass: '', isPinned: false })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAnnouncements()
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

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/announcements')
      if (data.success) setAnnouncements(data.data.announcements || data.data || [])
    } catch (err) {
      console.error('Failed to fetch announcements:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetForm = () => {
    setForm({ title: '', content: '', target: 'ALL', targetClass: '', isPinned: false })
    setEditItem(null)
  }

  const handleSave = async () => {
    if (!form.title || !form.content) return
    setSaving(true)
    try {
      const payload = { ...form }
      if (editItem) {
        await api.put(`/announcements/${editItem._id}`, payload)
      } else {
        await api.post('/announcements', payload)
      }
      setShowDialog(false)
      resetForm()
      fetchAnnouncements()
    } catch (err) {
      console.error('Failed to save announcement:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (a: Announcement) => {
    setForm({
      title: a.title,
      content: a.content,
      target: a.target || 'ALL',
      targetClass: a.targetClass?._id || '',
      isPinned: a.isPinned,
    })
    setEditItem(a)
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await api.delete(`/announcements/${id}`)
      fetchAnnouncements()
    } catch (err) {
      console.error('Failed to delete announcement:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Button onClick={() => { resetForm(); setShowDialog(true) }}>
          <Plus className="h-4 w-4 mr-2" /> New Announcement
        </Button>
      </div>

      <DataTable
        columns={[
          {
            key: 'title',
            header: 'Title',
            render: (row: Announcement) => (
              <div className="flex items-center gap-2">
                {row.isPinned && <Pin className="h-3 w-3 text-orange-500" />}
                <span className="font-medium">{row.title}</span>
              </div>
            ),
          },
          {
            key: 'target',
            header: 'Target',
            render: (row: Announcement) => (
              <Badge variant="secondary">
                {row.target === 'ALL' ? 'Everyone' : row.targetClass?.name || row.target}
              </Badge>
            ),
          },
          {
            key: 'createdAt',
            header: 'Date',
            render: (row: Announcement) => formatDate(row.createdAt),
          },
          {
            key: 'isPinned',
            header: 'Pinned',
            render: (row: Announcement) => (
              <Badge variant={row.isPinned ? 'success' : 'secondary'}>
                {row.isPinned ? 'Yes' : 'No'}
              </Badge>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: Announcement) => (
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
        data={announcements}
        isLoading={isLoading}
        emptyMessage="No announcements found"
      />

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) resetForm() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Announcement title" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content *</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Announcement content..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Target</label>
                <Select value={form.target} onValueChange={(v) => setForm((f) => ({ ...f, target: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Everyone</SelectItem>
                    <SelectItem value="CLASS">Specific Class</SelectItem>
                    <SelectItem value="TEACHER">Teachers Only</SelectItem>
                    <SelectItem value="STUDENT">Students Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.target === 'CLASS' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Class</label>
                  <Select value={form.targetClass} onValueChange={(v) => setForm((f) => ({ ...f, targetClass: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPinned}
                onChange={(e) => setForm((f) => ({ ...f, isPinned: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Pin this announcement</span>
            </label>
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
