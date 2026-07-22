import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Mail, Phone, MapPin } from 'lucide-react'

export default function TeacherStudents() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/students').then(({ data }) => {
      if (data.success) setStudents(data.data?.students || data.data || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-64 bg-gray-100 rounded" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-primary-700" />
        <h1 className="text-2xl font-bold">My Students</h1>
      </div>
      {students.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No students assigned yet.</CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s: any) => (
            <Card key={s._id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{s.firstName} {s.lastName}</CardTitle>
                  <Badge variant="outline">{s.registrationNo}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-1.5 text-muted-foreground">
                {s.fatherName && <p className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />{s.fatherName}</p>}
                {s.fatherPhone && <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{s.fatherPhone}</p>}
                {s.address && <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{s.address}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
