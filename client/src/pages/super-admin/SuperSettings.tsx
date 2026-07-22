import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Globe, Shield, Bell } from 'lucide-react'

export default function SuperSettings() {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary-700" />
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>
      <Card>
        <CardHeader><CardTitle>Platform Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Globe className="h-5 w-5 text-primary-700" />
            <div><p className="font-medium">Global Settings</p><p className="text-sm text-muted-foreground">Manage platform-wide configuration</p></div>
          </div>
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Shield className="h-5 w-5 text-primary-700" />
            <div><p className="font-medium">Security</p><p className="text-sm text-muted-foreground">Authentication and access control</p></div>
          </div>
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Bell className="h-5 w-5 text-primary-700" />
            <div><p className="font-medium">Notifications</p><p className="text-sm text-muted-foreground">Email and SMS notification settings</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
