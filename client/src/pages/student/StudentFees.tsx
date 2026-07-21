import { useState, useEffect } from 'react'
import { DollarSign, CreditCard, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FeeTransaction {
  _id: string
  date: string
  description: string
  type: 'CHALLAN' | 'PAYMENT'
  debit: number
  credit: number
  balance: number
  status: string
}

interface FeeData {
  totalDue: number
  totalPaid: number
  pending: number
  transactions: FeeTransaction[]
}

export default function StudentFees() {
  const [data, setData] = useState<FeeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/fees')
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

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Fee Status</h1>
        <p className="text-muted-foreground">View your fee ledger and payment history.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Due</p>
              <p className="text-xl font-bold">PKR {data?.totalDue?.toLocaleString() ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="text-xl font-bold">PKR {data?.totalPaid?.toLocaleString() ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">PKR {data?.pending?.toLocaleString() ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fee Ledger</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-sm font-medium">Date</th>
                <th className="text-left p-3 text-sm font-medium">Description</th>
                <th className="text-right p-3 text-sm font-medium">Debit</th>
                <th className="text-right p-3 text-sm font-medium">Credit</th>
                <th className="text-right p-3 text-sm font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {data?.transactions && data.transactions.length > 0 ? (
                data.transactions.map((tx) => (
                  <tr key={tx._id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="p-3 text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {tx.type === 'CHALLAN' ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-red-500" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5 text-green-500" />
                        )}
                        <span className="text-sm">{tx.description}</span>
                        <Badge variant={tx.status === 'PAID' ? 'success' : tx.status === 'PARTIAL' ? 'warning' : 'secondary'} className="text-[10px]">
                          {tx.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-right text-red-600 font-medium">
                      {tx.debit > 0 ? `PKR ${tx.debit.toLocaleString()}` : '—'}
                    </td>
                    <td className="p-3 text-sm text-right text-green-600 font-medium">
                      {tx.credit > 0 ? `PKR ${tx.credit.toLocaleString()}` : '—'}
                    </td>
                    <td className="p-3 text-sm text-right font-medium">
                      PKR {tx.balance.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
                    No fee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
