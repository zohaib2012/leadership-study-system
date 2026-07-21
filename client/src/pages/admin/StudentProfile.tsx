import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Edit, UserCircle, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const statusVariants: Record<string, 'success' | 'destructive' | 'warning' | 'secondary'> = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  PASSED_OUT: 'warning',
  TRANSFERRED: 'destructive',
}

const attendanceStatusIcons: Record<string, React.ReactNode> = {
  PRESENT: <CheckCircle className="h-4 w-4 text-green-600" />,
  ABSENT: <XCircle className="h-4 w-4 text-red-600" />,
  LATE: <AlertCircle className="h-4 w-4 text-yellow-600" />,
  LEAVE: <AlertCircle className="h-4 w-4 text-blue-600" />,
}

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [student, setStudent] = useState<any>(null)
  const [fees, setFees] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [attendanceSummary, setAttendanceSummary] = useState({ total: 0, present: 0, absent: 0, late: 0, leave: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStudent()
  }, [id])

  const fetchStudent = async () => {
    try {
      const { data } = await api.get(`/students/${id}`)
      if (data.success) {
        setStudent(data.data.student || data.data)
        setFees(data.data.fees || [])
        setAttendance(data.data.attendance || [])
        const attSummary = data.data.attendanceSummary
        if (attSummary) {
          setAttendanceSummary({
            total: attSummary.total || 0,
            present: attSummary.present || 0,
            absent: attSummary.absent || 0,
            late: attSummary.late || 0,
            leave: attSummary.leave || 0,
          })
        }
      }
    } catch (err) {
      console.error('Failed to fetch student:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Student not found</p>
        <Button variant="link" onClick={() => navigate('/admin/students')}>Back to Students</Button>
      </div>
    )
  }

  const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/students')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Student Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <UserCircle className="h-4 w-4 mr-2" /> ID Card
          </Button>
          <Link to={`/admin/students/${id}/edit`}>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  {student.photo ? (
                    <img src={student.photo} alt={fullName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <UserCircle className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <p className="text-sm text-muted-foreground mb-2">Reg# {student.registrationNo || '-'}</p>
                <Badge variant={statusVariants[student.status] || 'secondary'} className="mb-4">
                  {student.status?.replace(/_/g, ' ')}
                </Badge>
                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Class:</span>
                    <span className="font-medium">{student.class?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Section:</span>
                    <span className="font-medium">{student.section?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{student.type || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Join Date:</span>
                    <span className="font-medium">{formatDate(student.joiningDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-lg">Personal Information</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">First Name</p>
                    <p className="font-medium">{student.firstName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Name</p>
                    <p className="font-medium">{student.lastName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{student.dob ? formatDate(student.dob) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium">{student.gender || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">{student.address || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader><CardTitle className="text-lg">Parent Information</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Father Name</p>
                    <p className="font-medium">{student.fatherName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{student.fatherPhone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{student.fatherEmail || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Fee Ledger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { key: 'challanNo', header: 'Challan #' },
                  { key: 'month', header: 'Month' },
                  {
                    key: 'totalAmount',
                    header: 'Amount',
                    render: (row: any) => formatCurrency(row.totalAmount),
                  },
                  {
                    key: 'paidAmount',
                    header: 'Paid',
                    render: (row: any) => formatCurrency(row.paidAmount || 0),
                  },
                  {
                    key: 'due',
                    header: 'Due',
                    render: (row: any) => formatCurrency((row.totalAmount || 0) - (row.paidAmount || 0)),
                  },
                  {
                    key: 'dueDate',
                    header: 'Due Date',
                    render: (row: any) => row.dueDate ? formatDate(row.dueDate) : '-',
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row: any) => {
                      const v: Record<string, 'success' | 'destructive' | 'warning'> = {
                        PAID: 'success',
                        PENDING: 'warning',
                        OVERDUE: 'destructive',
                        PARTIAL: 'warning',
                      }
                      return <Badge variant={v[row.status] || 'secondary'}>{row.status}</Badge>
                    },
                  },
                ]}
                data={fees}
                emptyMessage="No fee records found"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader><CardTitle className="text-lg">Monthly Attendance Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                <Card className="bg-gray-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{attendanceSummary.total}</p>
                    <p className="text-xs text-muted-foreground">Total Days</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-700">{attendanceSummary.present}</p>
                    <p className="text-xs text-green-600">Present</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-700">{attendanceSummary.absent}</p>
                    <p className="text-xs text-red-600">Absent</p>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-700">{attendanceSummary.late}</p>
                    <p className="text-xs text-yellow-600">Late</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-700">{attendanceSummary.leave}</p>
                    <p className="text-xs text-blue-600">Leave</p>
                  </CardContent>
                </Card>
              </div>
              <DataTable
                columns={[
                  {
                    key: 'date',
                    header: 'Date',
                    render: (row: any) => formatDate(row.date),
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row: any) => (
                      <span className="flex items-center gap-2">
                        {attendanceStatusIcons[row.status] || null}
                        {row.status}
                      </span>
                    ),
                  },
                ]}
                data={attendance}
                emptyMessage="No attendance records found"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
