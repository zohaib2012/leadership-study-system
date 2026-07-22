import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IndianRupee, Calendar, CheckCircle, XCircle } from 'lucide-react'

export default function TeacherSalary() {
  const [salary, setSalary] = useState<any>(null)
  const [slips, setSlips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/teachers/me/salary').catch(() => null),
      api.get('/salary/my-slips').catch(() => null),
    ]).then(([sRes, slipRes]) => {
      if (sRes?.data?.success) setSalary(sRes.data.data)
      if (slipRes?.data?.success) setSlips(slipRes.data.data || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-64 bg-gray-100 rounded" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <IndianRupee className="h-6 w-6 text-primary-700" />
        <h1 className="text-2xl font-bold">My Salary</h1>
      </div>

      {salary && (
        <Card>
          <CardHeader><CardTitle>Salary Details</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-primary-700">Rs. {salary.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Monthly base salary</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Salary History</CardTitle></CardHeader>
        <CardContent>
          {slips.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No salary slips found.</p>
          ) : (
            <div className="space-y-3">
              {slips.map((slip: any) => (
                <div key={slip._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{slip.month} {slip.year}</p>
                      <p className="text-sm text-muted-foreground">Rs. {slip.netSalary?.toLocaleString() || slip.amount?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {slip.status === 'PAID' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-yellow-500" />}
                    <span className="text-sm">{slip.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
