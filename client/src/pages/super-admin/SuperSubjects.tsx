import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Hash, Building2 } from 'lucide-react'

export default function SuperSubjects() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/super-admin/subjects').then(({ data }) => {
      if (data.success) setSubjects(data.data || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-64 bg-gray-100 rounded" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary-700" />
        <h1 className="text-2xl font-bold">All Subjects</h1>
      </div>
      {subjects.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No subjects found.</CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s: any) => (
            <Card key={s._id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary-700" /><p className="font-medium">{s.name}</p></div>
                <div className="text-sm text-muted-foreground space-y-1">
                  {s.code && <p className="flex items-center gap-2"><Hash className="h-3.5 w-3.5" />Code: {s.code}</p>}
                  <p className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" />Type: {s.type}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
