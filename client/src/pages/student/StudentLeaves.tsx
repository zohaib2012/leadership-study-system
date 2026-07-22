import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function StudentLeaves() {
  const [leaves, setLeaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ reason: '', startDate: '', endDate: '', type: 'SICK' })

  const fetchLeaves = () => {
    api.get('/leaves/my').then(({ data }) => {
      if (data.success) setLeaves(data.data || [])
    }).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { fetchLeaves() }, [])

  const handleSubmit = async () => {
    if (!form.reason || !form.startDate || !form.endDate) return
    try {
      await api.post('/leaves', form)
      setShowForm(false)
      setForm({ reason: '', startDate: '', endDate: '', type: 'SICK' })
      fetchLeaves()
    } catch { alert('Failed to submit leave request') }
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'REJECTED': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-64 bg-gray-100 rounded" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary-700" />
          <h1 className="text-2xl font-bold">Leave Requests</h1>
        </div>
        <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-2" /> New Request</Button>
      </div>

      {leaves.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No leave requests found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {leaves.map((l: any) => (
            <Card key={l._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <p className="font-medium">{l.reason}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{l.startDate?.slice(0, 10)} → {l.endDate?.slice(0, 10)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{l.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {statusIcon(l.status)}
                  <span className="text-sm capitalize">{l.status?.toLowerCase() || 'PENDING'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Leave Request</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Leave Type</label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SICK">Sick Leave</SelectItem>
                  <SelectItem value="CASUAL">Casual Leave</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency Leave</SelectItem>
                  <SelectItem value="ANNUAL">Annual Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Reason</label>
              <Input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="Enter reason for leave" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
