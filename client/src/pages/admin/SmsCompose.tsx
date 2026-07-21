import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Send, Users, MessageSquare } from 'lucide-react'

interface ClassOption {
  _id: string
  name: string
}

const TEMPLATES = [
  { id: 'fee_reminder', label: 'Fee Reminder' },
  { id: 'attendance', label: 'Attendance Alert' },
  { id: 'meeting', label: 'PTM Announcement' },
  { id: 'holiday', label: 'Holiday Notice' },
  { id: 'result', label: 'Result Announcement' },
]

export default function SmsCompose() {
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [recipientType, setRecipientType] = useState('all_parents')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [message, setMessage] = useState('')
  const [individualNumber, setIndividualNumber] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => { fetchClasses() }, [])

  const fetchClasses = async () => {
    try {
      const { data } = await api.get('/classes')
      if (data.success) setClasses(data.data || [])
    } catch (err) {
      console.error('Failed to fetch classes:', err)
    }
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const templates: Record<string, string> = {
      fee_reminder: 'Dear Parent, this is a reminder to pay the pending school fee before the due date. Please contact the office for details.',
      attendance: 'Dear Parent, your child has been marked absent today. Please contact the school office.',
      meeting: 'Dear Parent, a Parent-Teacher Meeting is scheduled on [DATE] at [TIME]. Your presence is requested.',
      holiday: 'Dear Parent, the school will remain closed on [DATE] on account of [OCCASION].',
      result: 'Dear Parent, annual exam results have been announced. Please visit the school office to collect the report card.',
    }
    setMessage(templates[templateId] || '')
  }

  const handleSend = async () => {
    if (!message.trim()) {
      setStatus('Please enter a message')
      return
    }
    setIsSending(true)
    setStatus('')
    try {
      const payload: any = { message, recipientType }
      if (recipientType === 'by_class' && selectedClass) payload.class = selectedClass
      if (recipientType === 'individual') payload.phone = individualNumber
      await api.post('/communication/sms/send', payload)
      setStatus('SMS sent successfully!')
    } catch (err: any) {
      setStatus(err?.response?.data?.message || 'Failed to send SMS')
    } finally {
      setIsSending(false)
    }
  }

  const charCount = message.length
  const smsCount = Math.ceil(charCount / 160) || 1

  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-bold">Compose SMS</h1>

      <Card>
        <CardHeader><CardTitle className="text-lg">Recipients</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${recipientType === 'all_parents' ? 'border-primary-700 bg-primary-50' : 'hover:bg-gray-50'}`}>
              <input
                type="radio"
                name="recipient"
                value="all_parents"
                checked={recipientType === 'all_parents'}
                onChange={(e) => setRecipientType(e.target.value)}
                className="sr-only"
              />
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">All Parents</span>
            </label>
            <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${recipientType === 'by_class' ? 'border-primary-700 bg-primary-50' : 'hover:bg-gray-50'}`}>
              <input
                type="radio"
                name="recipient"
                value="by_class"
                checked={recipientType === 'by_class'}
                onChange={(e) => setRecipientType(e.target.value)}
                className="sr-only"
              />
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">By Class</span>
            </label>
            <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${recipientType === 'individual' ? 'border-primary-700 bg-primary-50' : 'hover:bg-gray-50'}`}>
              <input
                type="radio"
                name="recipient"
                value="individual"
                checked={recipientType === 'individual'}
                onChange={(e) => setRecipientType(e.target.value)}
                className="sr-only"
              />
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Individual</span>
            </label>
          </div>

          {recipientType === 'by_class' && (
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {recipientType === 'individual' && (
            <Input
              placeholder="Enter phone number (03XX-XXXXXXX)"
              value={individualNumber}
              onChange={(e) => setIndividualNumber(e.target.value)}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Message</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Templates</label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
              <SelectContent>
                {TEMPLATES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your SMS message here..."
              rows={5}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{charCount} characters</span>
              <span>{smsCount} SMS ({charCount}/160)</span>
            </div>
          </div>

          {status && (
            <div className={`p-3 rounded-md text-sm ${status.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {status}
            </div>
          )}

          <Button onClick={handleSend} disabled={isSending} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            {isSending ? 'Sending...' : 'Send SMS'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
