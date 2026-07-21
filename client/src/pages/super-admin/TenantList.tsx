import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Eye,
  ToggleLeft,
  ToggleRight,
  LogIn,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import api from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Tenant {
  _id: string
  name: string
  subdomain: string
  plan: string
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CANCELLED'
  students: number
  createdAt: string
}

export default function TenantList() {
  const navigate = useNavigate()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const limit = 10

  const fetchTenants = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter !== 'ALL') params.set('status', statusFilter)
    params.set('page', String(page))
    params.set('limit', String(limit))

    api.get(`/super-admin/tenants?${params.toString()}`)
      .then((res) => {
        setTenants(res.data.data.tenants)
        setTotal(res.data.data.total)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, statusFilter, page])

  useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    try {
      await api.put(`/super-admin/tenants/${id}`, { status: newStatus })
      fetchTenants()
    } catch {}
  }

  const handleLoginAs = async (id: string) => {
    try {
      const { data } = await api.post(`/super-admin/tenants/${id}/login-as`)
      if (data.data?.token) {
        localStorage.setItem('auth-token', data.data.token)
        window.location.href = `//${data.data.subdomain}`
      }
    } catch {}
  }

  const totalPages = Math.ceil(total / limit)

  const statusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'TRIAL': return 'warning'
      case 'SUSPENDED': return 'destructive'
      case 'CANCELLED': return 'secondary'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Tenants</h1>
        <p className="text-muted-foreground">Manage all institutes on the platform.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or subdomain..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-40">
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="TRIAL">Trial</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-sm font-medium">Institute</th>
                <th className="text-left p-3 text-sm font-medium">Subdomain</th>
                <th className="text-left p-3 text-sm font-medium">Plan</th>
                <th className="text-left p-3 text-sm font-medium">Status</th>
                <th className="text-left p-3 text-sm font-medium">Students</th>
                <th className="text-left p-3 text-sm font-medium">Created</th>
                <th className="text-right p-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700" />
                    </div>
                  </td>
                </tr>
              ) : tenants.length > 0 ? (
                tenants.map((t) => (
                  <tr key={t._id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="p-3 text-sm font-medium">{t.name}</td>
                    <td className="p-3 text-sm text-muted-foreground">{t.subdomain}</td>
                    <td className="p-3 text-sm">{t.plan}</td>
                    <td className="p-3">
                      <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                    </td>
                    <td className="p-3 text-sm">{t.students}</td>
                    <td className="p-3 text-sm text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          onClick={() => handleToggleStatus(t._id, t.status)}
                        >
                          {t.status === 'ACTIVE' ? (
                            <ToggleRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        {t.status === 'ACTIVE' && (
                          <Button variant="ghost" size="icon" title="Login As" onClick={() => handleLoginAs(t._id)}>
                            <LogIn className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground">
                    <Building2 className="h-10 w-10 mx-auto mb-2" />
                    No tenants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(p)}
                className="min-w-[36px]"
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
