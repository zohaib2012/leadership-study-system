import { useState, useEffect, FormEvent } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Upload } from 'lucide-react'

interface InstituteProfile {
  name: string
  address: string
  phone: string
  email: string
  logo: string
}

interface AcademicSession {
  name: string
  startDate: string
  endDate: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<InstituteProfile>({
    name: '',
    address: '',
    phone: '',
    email: '',
    logo: '',
  })
  const [session, setSession] = useState<AcademicSession>({
    name: '',
    startDate: '',
    endDate: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings')
      if (data.success) {
        const s = data.data
        setProfile({
          name: s.name || '',
          address: s.address || '',
          phone: s.phone || '',
          email: s.email || '',
          logo: s.logo || '',
        })
        if (s.academicSession) {
          setSession({
            name: s.academicSession.name || '',
            startDate: s.academicSession.startDate ? new Date(s.academicSession.startDate).toISOString().split('T')[0] : '',
            endDate: s.academicSession.endDate ? new Date(s.academicSession.endDate).toISOString().split('T')[0] : '',
          })
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    }
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')
    try {
      await api.put('/settings', { profile, academicSession: session })
      setMessage('Settings saved successfully!')
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      {message && (
        <div className={`p-3 rounded-md text-sm ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Institute Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Institute Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Leadership Study System"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    value={profile.address}
                    onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                    placeholder="Full address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="03XX-XXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    placeholder="info@leadershipstudy.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Logo</label>
                  <div className="flex items-center gap-4">
                    {profile.logo && (
                      <img src={profile.logo} alt="Logo" className="w-16 h-16 rounded-lg object-cover border" />
                    )}
                    <div className="flex-1">
                      <Input
                        value={profile.logo}
                        onChange={(e) => setProfile((p) => ({ ...p, logo: e.target.value }))}
                        placeholder="Logo URL"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Academic Session</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Session Name</label>
                <Input
                  value={session.name}
                  onChange={(e) => setSession((s) => ({ ...s, name: e.target.value }))}
                  placeholder="2025-2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <Input
                  type="date"
                  value={session.startDate}
                  onChange={(e) => setSession((s) => ({ ...s, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <Input
                  type="date"
                  value={session.endDate}
                  onChange={(e) => setSession((s) => ({ ...s, endDate: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Role Management</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Role management is limited to super-admin. Current roles include Admin, Teacher, Student, Parent, Accountant, and Sub-Admin.
              </p>
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
