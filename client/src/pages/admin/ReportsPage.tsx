import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users, ClipboardCheck, IndianRupee, FileText, GraduationCap, ArrowRight
} from 'lucide-react'

const reports = [
  {
    title: 'Admission Report',
    description: 'Student admissions by class, gender, and date range',
    icon: Users,
    color: 'bg-blue-50 text-blue-700',
    action: '/admin/reports/admissions',
  },
  {
    title: 'Attendance Report',
    description: 'Detailed attendance analytics by class and month',
    icon: ClipboardCheck,
    color: 'bg-green-50 text-green-700',
    action: '/admin/attendance/reports',
  },
  {
    title: 'Fee Report',
    description: 'Fee collection, pending dues, and revenue summary',
    icon: IndianRupee,
    color: 'bg-orange-50 text-orange-700',
    action: '/admin/fees/pending',
  },
  {
    title: 'Student List',
    description: 'Export complete student directory with filters',
    icon: GraduationCap,
    color: 'bg-purple-50 text-purple-700',
    action: '/admin/students',
  },
  {
    title: 'Teacher Report',
    description: 'Teacher workload, attendance, and salary summary',
    icon: FileText,
    color: 'bg-pink-50 text-pink-700',
    action: '/admin/teachers',
  },
]

export default function ReportsPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">Generate and view reports for your institute</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card key={report.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${report.color}`}>
                <report.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(report.action)}
              >
                Generate <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
