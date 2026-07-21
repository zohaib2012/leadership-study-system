import { Helmet } from 'react-helmet-async'
import { Shield, Lock, Eye, Database, FileText, UserCheck, Mail, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const sections = [
  {
    icon: Shield, title: 'Introduction',
    content: 'Leadership Study System ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services. Please read this policy carefully to understand our practices regarding your personal data.',
  },
  {
    icon: Database, title: 'Information We Collect',
    list: [
      { label: 'Personal Information', desc: 'Name, email address, phone number, and institute details when you register for an account.' },
      { label: 'Student Data', desc: 'Student names, contact information, academic records, attendance data, and fee payment history that you enter into our system.' },
      { label: 'Usage Data', desc: 'Information about how you access and use our platform, including IP addresses, browser types, and pages visited.' },
      { label: 'Communication Data', desc: 'Records of your correspondence with us, including support tickets and feedback.' },
    ],
  },
  {
    icon: Eye, title: 'How We Use Your Information',
    list: [
      { desc: 'To provide, maintain, and improve our educational management platform' },
      { desc: 'To process your registration and manage your institute account' },
      { desc: 'To communicate with you about platform updates, new features, and support' },
      { desc: 'To ensure platform security and prevent unauthorized access' },
      { desc: 'To comply with legal obligations and enforce our terms of service' },
    ],
  },
  {
    icon: Lock, title: 'Data Security',
    content: 'We implement industry-standard security measures to protect your data, including encryption at rest and in transit, regular security audits, and strict access controls. However, no method of electronic storage or transmission is 100% secure, and we cannot guarantee absolute security of your data.',
  },
  {
    icon: FileText, title: 'Data Retention',
    content: 'We retain your personal information and institute data for as long as your account is active or as needed to provide services. Upon account termination, we will delete your data within 90 days unless retention is required by law.',
  },
  {
    icon: UserCheck, title: 'Your Rights',
    list: [
      { desc: 'Right to access and review your personal data' },
      { desc: 'Right to correct inaccurate or incomplete information' },
      { desc: 'Right to request deletion of your data, subject to legal requirements' },
      { desc: 'Right to withdraw consent for data processing at any time' },
    ],
  },
  {
    icon: Mail, title: 'Contact Us',
    content: 'If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us at privacy@leadershipstudysystem.pk or visit our office at Street No.14, Sector F-8/3, Islamabad.',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Leadership Study System</title>
        <meta name="description" content="Read Leadership Study System's privacy policy to understand how we collect, use, and protect your personal information." />
      </Helmet>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary-500 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-blue-500 rounded-full blur-[128px] animate-pulse animation-delay-2000" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge className="mb-4 px-4 py-1.5 bg-white/10 text-white border-white/20">
            <Shield className="h-4 w-4 mr-1.5 inline" /> Legal
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-blue-100/70 text-lg">Last updated: January 1, 2025</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {sections.map((section) => (
            <Card key={section.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-primary-700" />
                  </div>
                  {section.title}
                </h2>
                {section.content && (
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                )}
                {section.list && (
                  <ul className="space-y-3 mt-2">
                    {section.list.map((item: any) => (
                      <li key={item.desc} className="flex items-start gap-3 text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 flex-shrink-0" />
                        <span>{item.label ? <><strong>{item.label}:</strong> </> : ''}{item.desc}</span>
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