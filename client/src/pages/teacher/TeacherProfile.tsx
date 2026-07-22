import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User, Mail, Phone, BookOpen, Award, Calendar, Save } from 'lucide-react'

export default function TeacherProfile() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ phone: '', address: '' })

  useEffect(() => {
    api.get('/teachers/me').then(({ data }) => {
      if (data.success) {
        setProfile(data.data)
        setForm({ phone: data.data.user?.phone || '', address: data.data.address || '' })
      }
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/teachers/me', form)
      alert('Profile updated successfully')
    } catch { alert('Failed to update profile') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-64 bg-gray-100 rounded" /></div>

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-primary-700" />
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xl font-bold text-primary-700">{user?.name?.charAt(0)}</span>
            </div>
            <div>
              <p className="font-semibold text-lg">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email} • {user?.role}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Qualification</label>
              <div className="flex items-center gap-2 p-2.5 border rounded-lg text-sm">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.qualification || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Specialization</label>
              <div className="flex items-center gap-2 p-2.5 border rounded-lg text-sm">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.specialization || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Experience</label>
              <div className="flex items-center gap-2 p-2.5 border rounded-lg text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.experience ? `${profile.experience} years` : 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Contract Type</label>
              <div className="flex items-center gap-2 p-2.5 border rounded-lg text-sm">
                <span>{profile?.contractType || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t space-y-3">
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Update Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
