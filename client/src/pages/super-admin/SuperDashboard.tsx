import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Users,
  BadgeCheck,
  CircleDollarSign,
  ArrowUpRight,
  School,
  CreditCard,
} from 'lucide-react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface DashboardData {
  stats: { totalTenants: number; active: number; trial: number; totalRevenue: number }
  recentTenants: { _id: string; name: string; subdomain: string; plan: string; status: string; students: number; createdAt: string }[]
  monthlyRevenue: { month: string; amount: number }[]
}

export default function SuperDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/super-admin')
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-700" />
      </div>
    )
  }

  const stats = [
    { label: 'Total Tenants', value: data?.stats.totalTenants ?? 0, icon: Building2, color: 'bg-blue-500' },
    { label: 'Active', value: data?.stats.active ?? 0, icon: BadgeCheck, color: 'bg-green-500' },
    { label: 'Trial', value: data?.stats.trial ?? 0, icon: Users, color: 'bg-orange-500' },
    { label: 'Total Revenue', value: `PKR ${(data?.stats.totalRevenue ?? 0).toLocaleString()}`, icon: CircleDollarSign, color: 'bg-purple-500' },
  ]

  const maxRevenue = data?.monthlyRevenue?.length
    ? Math.max(...data.monthlyRevenue.map((m) => m.amount))
    : 0

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and analytics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/super-admin/tenants">
          <Button variant="outline">
            <Building2 className="h-4 w-4 mr-2" /> Manage Tenants
          </Button>
        </Link>
        <Button variant="outline">
          <CreditCard className="h-4 w-4 mr-2" /> Plans
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
              <div className="flex items-end gap-2 h-48">
                {data.monthlyRevenue.map((m) => {
                  const height = maxRevenue > 0 ? (m.amount / maxRevenue) * 100 : 0
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-medium text-muted-foreground">PKR {m.amount.toLocaleString()}</span>
                      <div
                        className="w-full bg-primary-500 rounded-t-md transition-all"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                      <span className="text-xs text-muted-foreground">{m.month}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">No revenue data yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Tenants</CardTitle>
            <Link to="/super-admin/tenants">
              <Button variant="ghost" size="sm">
                View All <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data?.recentTenants && data.recentTenants.length > 0 ? (
              <div className="space-y-3">
                {data.recentTenants.slice(0, 5).map((t) => (
                  <div key={t._id} className="flex items-center justify-between border-b last:border-b-0 pb-2 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.subdomain}</p>
                    </div>
                    <Badge variant={t.status === 'ACTIVE' ? 'success' : t.status === 'TRIAL' ? 'warning' : 'secondary'}>
                      {t.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tenants yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
