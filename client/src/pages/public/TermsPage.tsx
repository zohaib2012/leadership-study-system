import { Helmet } from 'react-helmet-async'
import { FileText, Shield, Users, CreditCard, AlertTriangle, Ban, Mail, Scale, RefreshCw, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const sections = [
  {
    icon: FileText, title: 'Acceptance of Terms',
    content: 'By accessing or using the Leadership Study System platform ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the Service. These terms apply to all users, including administrators, teachers, students, and parents.',
  },
  {
    icon: Users, title: 'Account Registration',
    list: [
      'Maintaining the confidentiality of your account credentials',
      'All activities that occur under your account',
      'Notifying us immediately of any unauthorized use of your account',
      'Ensuring that all registration information remains current and accurate',
    ],
  },
  {
    icon: Scale, title: 'Acceptable Use',
    list: [
      'Use the Service for any illegal or unauthorized purpose',
      'Attempt to gain unauthorized access to any part of the Service',
      'Upload or transmit viruses, malware, or other malicious code',
      'Interfere with or disrupt the Service or its infrastructure',
      'Resell, sublicense, or commercially exploit the Service without authorization',
      'Use the Service to harass, abuse, or harm other users',
    ],
    isWarning: true,
  },
  {
    icon: CreditCard, title: 'Payment Terms',
    content: 'Subscription fees are billed monthly or annually based on your selected plan. Payments are due at the start of each billing period. All fees are non-refundable except as required by applicable law. We reserve the right to change pricing with 30 days notice. Continued use after a price change constitutes acceptance of the new pricing.',
  },
  {
    icon: Shield, title: 'Intellectual Property',
    content: 'The Service, including its original content, features, and functionality, is owned by Leadership Study System and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works from any part of the Service without our prior written consent.',
  },
  {
    icon: AlertTriangle, title: 'Limitation of Liability',
    content: 'The Service is provided on an "as is" and "as available" basis. Leadership Study System makes no warranties, express or implied, regarding the Service reliability, availability, or fitness for a particular purpose. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to loss of data or business interruption.',
  },
  {
    icon: Ban, title: 'Termination',
    content: 'We reserve the right to suspend or terminate your account at any time for violation of these terms, fraudulent activity, or any conduct that we deem harmful to the Service or other users. Upon termination, your right to use the Service will cease immediately. You may terminate your account at any time by contacting us.',
  },
  {
    icon: RefreshCw, title: 'Changes to Terms',
    content: 'We may modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Your continued use of the Service after modifications constitutes acceptance of the updated terms. We will make reasonable efforts to notify you of material changes via email or through the platform.',
  },
  {
    icon: Mail, title: 'Contact Information',
    content: 'If you have any questions about these Terms and Conditions, please contact us at legal@leadershipstudysystem.pk or visit our office at Street No.14, Sector F-8/3, Islamabad, Pakistan.',
  },
]

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Leadership Study System</title>
        <meta name="description" content="Read the terms and conditions for using Leadership Study System's education management platform and services." />
      </Helmet>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary-500 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-blue-500 rounded-full blur-[128px] animate-pulse animation-delay-2000" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge className="mb-4 px-4 py-1.5 bg-white/10 text-white border-white/20">
            <FileText className="h-4 w-4 mr-1.5 inline" /> Legal
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-blue-100/70 text-lg">Last updated: January 1, 2025</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {sections.map((section) => (
            <Card key={section.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${section.isWarning ? 'bg-amber-100' : 'bg-primary-100'}`}>
                    <section.icon className={`h-5 w-5 ${section.isWarning ? 'text-amber-600' : 'text-primary-700'}`} />
                  </div>
                  {section.title}
                </h2>
                {section.content && (
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                )}
                {section.list && (
                  <ul className="space-y-3 mt-2">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-600">
                        <span className={`w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0 ${section.isWarning ? 'bg-amber-500' : 'bg-primary-500'}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}