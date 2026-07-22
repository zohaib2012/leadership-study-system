import { Card, CardContent } from '@/components/ui/card'
import { IndianRupee, Construction } from 'lucide-react'

export default function SuperFees() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <IndianRupee className="h-6 w-6 text-primary-700" />
        <h1 className="text-2xl font-bold">Fee Management</h1>
      </div>
      <Card>
        <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
          <Construction className="h-12 w-12" />
          <p>Cross-tenant fee reports and management. Coming soon.</p>
        </CardContent>
      </Card>
    </div>
  )
}
