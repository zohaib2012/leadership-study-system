import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, Construction } from 'lucide-react'

export default function SuperCommunication() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-6 w-6 text-primary-700" />
        <h1 className="text-2xl font-bold">SMS Communication</h1>
      </div>
      <Card>
        <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
          <Construction className="h-12 w-12" />
          <p>Cross-tenant SMS communication. Coming soon.</p>
        </CardContent>
      </Card>
    </div>
  )
}
