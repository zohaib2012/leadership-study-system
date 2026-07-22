import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { School, BookOpen, Users } from 'lucide-react'

export default function SuperClasses() {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/super-admin/classes').then(({ data }) => {
      if (data.success) setClasses(data.data || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-64 bg-gray-100 rounded" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <School className="h-6 w-6 text-primary-700" />
        <h1 className="text-2xl font-bold">All Classes</h1>
      </div>
      {classes.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No classes found.</CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c: any) => (
            <Card key={c._id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <School className="h-4 w-4 text-primary-700" />
                  {c.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />Type: {c.type}</p>
                <p className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />Students: {c.studentCount || 0}</p>
                <p className="flex items-center gap-2">Sections: {c.sectionCount || 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
