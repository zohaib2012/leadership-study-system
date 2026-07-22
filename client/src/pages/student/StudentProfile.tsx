import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Hash } from 'lucide-react'

export default function StudentProfile() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/students/me').then(({ data }) => {
      if (data.success) setProfile(data.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

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
              <span className="text-xl font-bold text-primary-700">{profile?.firstName?.charAt(0) || user?.name?.charAt(0)}</span>
            </div>
            <div>
              <p className="font-semibold text-lg">{profile?.firstName} {profile?.lastName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {profile?.registrationNo && (
              <div className="flex items-center gap-2 p-2.5 border rounded-lg text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span>Reg No: {profile.registrationNo}</span>
              </div>
            )}
            {profile?.fatherName && (
              <div className="flex items-center gap-2 p-2.5 border rounded-lg text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Father: {profile.fatherName}</span>
              </div>
            )}
            {profile?.fatherPhone && (
              <div className="flex items-center gap-2 p-2.5 border rounded-lg text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile.fatherPhone}</span>
              </div>
            )}
            {profile?.dob && (
              <div className="flex items-center gap-2 p-2.5 border rounded-lg text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>DOB: {profile.dob?.slice(0, 10)}</span>
              </div>
            )}
            {profile?.gender && (
              <div className="flex items-center gap-2 p-2.5 border rounded-lg text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Gender: {profile.gender}</span>
              </div>
            )}
            {profile?.address && (
              <div className="flex items-center gap-2 p-2.5 border rounded-lg text-sm sm:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.address}</span>
              </div>
            )}
          </div>

          {profile?.class && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Class Information</p>
              <div className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-lg text-sm">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">{profile.class?.name || 'N/A'}</span>
                {profile.section && <span className="text-blue-600">- Section {profile.section?.name || profile.section}</span>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
