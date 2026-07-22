import { Card, CardContent } from '@/components/ui/card'
import { FileText, Construction } from 'lucide-react'

export default function SuperHomework() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary-700" />
        <h1 className="text-2xl font-bold">Homework Overview</h1>
      </div>
      <Card>
        <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
          <Construction className="h-12 w-12" />
          <p>Homework tracking across all tenants. Coming soon.</p>
        </CardContent>
      </Card>
    </div>
  )
}
