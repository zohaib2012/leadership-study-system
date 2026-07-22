import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Clock, User, Globe } from 'lucide-react'

export default function SuperLogs() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/super-admin/logs', { params: { limit: 50 } }).then(({ data }) => {
      if (data.success) setLogs(data.data?.logs || data.data || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-64 bg-gray-100 rounded" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Activity className="h-6 w-6 text-primary-700" />
        <h1 className="text-2xl font-bold">Activity Logs</h1>
      </div>
      {logs.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No activity logs found.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {logs.map((log: any) => (
            <Card key={log._id}>
              <CardContent className="p-3 flex items-center gap-3 text-sm">
                <Activity className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{log.action || log.message}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {log.user?.name && <span className="flex items-center gap-1"><User className="h-3 w-3" />{log.user.name}</span>}
                    {log.tenant?.name && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{log.tenant.name}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
