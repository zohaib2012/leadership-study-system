import { useState, useEffect } from 'react'
import {
  User,
  CheckCircle2,
  DollarSign,
  ClipboardList,
  Megaphone,
  ChevronDown,
  GraduationCap,
  CalendarDays,
  Bell,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Child {
  _id: string
  firstName: string
  lastName: string
  registrationNo: string
  class: string
}

interface ChildData {
  attendance: { present: number; total: number; percent: number }
  fees: { pending: number; totalDue: number; transactions: { date: string; description: string; paid: number }[] }
  homework: { pending: number; items: { _id: string; title: string; subject: string; dueDate: string }[] }
  announcements: { _id: string; title: string; message: string; createdAt: string }[]
}

export default function ParentDashboard() {
  const { user } = useAuthStore()
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChildId, setSelectedChildId] = useState<string>('')
  const [childData, setChildData] = useState<ChildData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/parent')
      .then((res) => {
        setChildren(res.data.data.children || [])
        if (res.data.data.children?.length > 0) {
          setSelectedChildId(res.data.data.children[0]._id)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedChildId) return
    setChildData(null)
    api.get(`/dashboard/parent/child/${selectedChildId}`)
      .then((res) => setChildData(res.data.data))
      .catch(() => {})
  }, [selectedChildId])

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-9 w-64 bg-muted rounded-lg animate-pulse" />
        <div className="h-5 w-48 bg-muted rounded animate-pulse" />
        <div className="h-14 w-full sm:w-72 bg-muted rounded-xl animate-pulse" />
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-muted rounded animate-pulse" />
            <div className="h-4 w-56 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-20 bg-muted rounded-lg animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader><div className="h-6 w-40 bg-muted rounded animate-pulse" /></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-12 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const selectedChild = children.find((c) => c._id === selectedChildId)

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 via-primary-500 to-primary-400 bg-clip-text text-transparent">
            Welcome, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">Monitor your child&apos;s academic journey</p>
        </div>
      </div>

      {children.length > 1 && (
        <Card className="border-none shadow-sm bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-950/20">
          <CardContent className="p-4">
            <label className="text-sm font-medium mb-2 block text-muted-foreground">Select Child</label>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="w-full sm:w-72 h-12 border-primary-200 dark:border-primary-800 bg-background shadow-sm hover:shadow-md transition-shadow">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    <div className="flex items-center gap-3 py-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-muted-foreground">{c.class}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {selectedChild && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-[1px] shadow-lg">
          <div className="rounded-2xl bg-background p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">{selectedChild.firstName} {selectedChild.lastName}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" /> {selectedChild.class}
                  </span>
                  <span className="text-sm text-muted-foreground">Reg: {selectedChild.registrationNo}</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <CalendarDays className="h-3.5 w-3.5" /> Active
              </div>
            </div>
          </div>
        </div>
      )}

      {childData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="group hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-background to-background relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-5 flex items-center gap-4 relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Attendance</p>
                  <p className="text-2xl font-bold mt-0.5">{childData.attendance.percent}%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <span className="text-emerald-600 font-medium">{childData.attendance.present}</span>/{childData.attendance.total} days
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-background to-background relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-5 flex items-center gap-4 relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Fees</p>
                  <p className="text-2xl font-bold mt-0.5">PKR {childData.fees.pending.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    of <span className="text-red-600 font-medium">{childData.fees.totalDue.toLocaleString()}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-background to-background relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-5 flex items-center gap-4 relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Homework</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <p className="text-2xl font-bold">{childData.homework.pending}</p>
                    {childData.homework.pending > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 font-medium">
                        Due
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-background to-background relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-5 flex items-center gap-4 relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
                  <Megaphone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Announcements</p>
                  <p className="text-2xl font-bold mt-0.5">{childData.announcements.length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">latest updates</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">Fee Payment History</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs font-normal">{childData.fees.transactions.length} entries</Badge>
              </CardHeader>
              <CardContent>
                {childData.fees.transactions.length > 0 ? (
                  <div className="space-y-2">
                    {childData.fees.transactions.slice(0, 5).map((tx, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors group/item">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">+PKR {tx.paid.toLocaleString()}</span>
                      </div>
                    ))}
                    {childData.fees.transactions.length > 5 && (
                      <button className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors py-2">
                        View all <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <DollarSign className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-sm">No payment history yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <ClipboardList className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">Pending Homework</CardTitle>
                </div>
                {childData.homework.pending > 0 && (
                  <Badge variant="destructive" className="text-xs">{childData.homework.pending} pending</Badge>
                )}
              </CardHeader>
              <CardContent>
                {childData.homework.items.length > 0 ? (
                  <div className="space-y-2">
                    {childData.homework.items.map((hw) => {
                      const isOverdue = new Date(hw.dueDate) < new Date()
                      return (
                        <div key={hw._id} className="p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isOverdue ? 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/30' : 'bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30'}`}>
                                <ClipboardList className={`h-4 w-4 ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`} />
                              </div>
                              <div>
                                <p className="text-sm font-medium truncate">{hw.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{hw.subject}</p>
                              </div>
                            </div>
                            <Badge variant={isOverdue ? 'destructive' : 'outline'} className={`text-[10px] whitespace-nowrap shrink-0 ${!isOverdue && 'border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400'}`}>
                              {isOverdue ? 'Overdue' : `Due: ${new Date(hw.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <ClipboardList className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-sm">No pending homework. All caught up!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="group hover:shadow-lg transition-all duration-300 border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg">Recent Announcements</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs font-normal">{childData.announcements.length} total</Badge>
            </CardHeader>
            <CardContent>
              {childData.announcements.length > 0 ? (
                <div className="space-y-3">
                  {childData.announcements.slice(0, 5).map((a, i) => (
                    <div key={a._id} className="flex gap-4 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors group/item">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center shrink-0">
                        <Megaphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm truncate">{a.title}</p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {new Date(a.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.message}</p>
                      </div>
                    </div>
                  ))}
                  {childData.announcements.length > 5 && (
                    <button className="w-full mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors py-2">
                      View all announcements <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Megaphone className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">No announcements.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {children.length === 0 && (
        <Card className="border-none shadow-sm">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No children linked to your account</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Please contact the institute to link your children.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
