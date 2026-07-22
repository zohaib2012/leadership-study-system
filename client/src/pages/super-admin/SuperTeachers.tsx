import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { UserCheck, Search, Mail, Phone, Building2, Award } from 'lucide-react'

export default function SuperTeachers() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/super-admin/users', { params: { role: 'TEACHER', limit: 50 } }).then(({ data }) => {
      if (data.success) setTeachers(data.data?.users || data.data || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = teachers.filter(t =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-64 bg-gray-100 rounded" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <UserCheck className="h-6 w-6 text-primary-700" />
        <h1 className="text-2xl font-bold">All Teachers</h1>
      </div>
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No teachers found.</CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t: any) => (
            <Card key={t._id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-green-700">{t.name?.charAt(0)}</span>
                  </div>
                  <p className="font-medium">{t.name}</p>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{t.email}</p>
                  {t.phone && <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{t.phone}</p>}
                  <p className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" />{t.tenant?.name || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
