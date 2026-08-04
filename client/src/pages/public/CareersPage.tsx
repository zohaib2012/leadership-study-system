import { Helmet } from 'react-helmet-async'
import { useState, useEffect, FormEvent } from 'react'
import {
  Briefcase, Send, Users, School, GraduationCap, Sparkles, Mail, Phone, MapPin,
  ArrowRight, CheckCircle2, Clock, BadgeCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import api from '@/lib/api'

interface Position {
  title: string
  type: 'SCHOOL' | 'ACADEMY'
  subjects: string[]
}

function FadeInSection({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const ref = (node: HTMLDivElement | null) => {
    if (node && !visible) {
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
        { threshold: 0.1 }
      )
      observer.observe(node)
    }
  }
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </div>
  )
}

const benefits = [
  { icon: BadgeCheck, title: 'Professional Growth', desc: 'Continuous training, workshops and clear career progression pathways.' },
  { icon: Users, title: 'Supportive Team', desc: 'Join a passionate team of educators who collaborate and grow together.' },
  { icon: Clock, title: 'Work-Life Balance', desc: 'Structured schedules and a healthy, positive working environment.' },
  { icon: GraduationCap, title: 'Cambridge Training', desc: 'Access to Cambridge Assessment professional development programs.' },
]

export default function CareersPage() {
  const [positions, setPositions] = useState<Position[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    academyType: 'SCHOOL',
    position: '',
    qualification: '',
    experience: '',
    coverLetter: '',
  })

  useEffect(() => {
    api.get('/public/careers/positions').then(({ data }) => {
      if (data.success) setPositions(data.data || [])
    }).catch(() => {})
  }, [])

  const filteredPositions = form.academyType
    ? positions.filter((p) => p.type === form.academyType)
    : positions

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')
    try {
      const { data } = await api.post('/public/careers/apply', form)
      if (data.success) {
        setSubmitted(true)
        setForm({ name: '', email: '', phone: '', academyType: 'SCHOOL', position: '', qualification: '', experience: '', coverLetter: '' })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Careers | Leadership Study System</title>
        <meta name="description" content="Join the Leadership Study System team. Explore teaching and administrative career opportunities at our School and Academy." />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden pt-16 lg:pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-primary-800" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-400 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/3 right-0 w-[420px] h-[420px] bg-blue-500 rounded-full blur-[130px] animate-pulse animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-amber-400 rounded-full blur-[110px] animate-pulse animation-delay-4000" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/85 text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Join Our Team
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Build Your Career at{' '}
              <span className="bg-gradient-to-r from-amber-300 via-white to-blue-300 bg-clip-text text-transparent">
                LSS
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed mb-8">
              We're always looking for passionate educators and talented professionals to join our
              School and Academy. Shape the future leaders of tomorrow with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#openings" className="group">
                <Button size="lg" className="bg-white text-primary-800 hover:bg-blue-50 font-semibold px-8 py-6 h-auto text-base rounded-xl shadow-2xl shadow-white/20 w-full sm:w-auto">
                  View Openings
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="#apply" className="group">
                <Button size="lg" className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/20 font-semibold px-8 py-6 h-auto text-base rounded-xl w-full sm:w-auto">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-14">
              <Badge className="mb-4 px-4 py-1.5 bg-primary-100 text-primary-700 border-primary-200">
                <Users className="h-4 w-4 mr-1.5 inline" /> Why Work With Us
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">A Rewarding Career Awaits</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">We invest in our people because they invest in our students.</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <FadeInSection key={b.title}>
                <div className="group h-full" style={{ animationDelay: `${i * 120}ms` }}>
                  <div className="h-full p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <b.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section id="openings" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-12">
              <Badge className="mb-4 px-4 py-1.5 bg-primary-100 text-primary-700 border-primary-200">
                <Briefcase className="h-4 w-4 mr-1.5 inline" /> Open Positions
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Current Opportunities</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">Find the role that fits your passion and expertise.</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {filteredPositions.map((p, i) => (
              <FadeInSection key={p.title}>
                <div className="group h-full" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="h-full p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.type === 'ACADEMY' ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>
                        {p.type === 'ACADEMY' ? <GraduationCap className="h-6 w-6 text-white" /> : <School className="h-6 w-6 text-white" />}
                      </div>
                      <Badge variant={p.type === 'ACADEMY' ? 'outline' : 'secondary'} className="whitespace-nowrap">
                        {p.type === 'ACADEMY' ? 'Academy' : 'School'}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                    {p.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4 mt-2">
                        {p.subjects.map((s) => (
                          <span key={s} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">{s}</span>
                        ))}
                      </div>
                    )}
                    <a
                      href="#apply"
                      onClick={() => setForm((f) => ({ ...f, academyType: p.type, position: p.title }))}
                      className="mt-auto inline-flex items-center text-primary-700 font-semibold text-sm group/link"
                    >
                      Apply for this position
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                    </a>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection>
            <div className="text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8">
              <p className="text-gray-600 mb-3">Don't see a position that fits? We're always open to talent.</p>
              <a href="mailto:careers@leadershipstudysystem.pk" className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800">
                <Mail className="h-5 w-5" /> Send us your CV at careers@leadershipstudysystem.pk
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section id="apply" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="text-center mb-12">
              <Badge className="mb-4 px-4 py-1.5 bg-white/10 text-white border-white/20">
                <Send className="h-4 w-4 mr-1.5 inline" /> Apply Now
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Submit Your Application</h2>
              <p className="text-blue-100/70 max-w-2xl mx-auto text-lg">Fill in your details and our HR team will get back to you shortly.</p>
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-2xl shadow-black/30">
              {submitted && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  Application submitted successfully! We will review it and contact you soon.
                </div>
              )}
              {message && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Institution Type *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, academyType: 'SCHOOL', position: '' }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          form.academyType === 'SCHOOL' ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-gray-200 bg-white hover:border-amber-300'
                        }`}
                      >
                        <School className={`h-5 w-5 mb-1.5 ${form.academyType === 'SCHOOL' ? 'text-amber-600' : 'text-gray-400'}`} />
                        <p className="text-sm font-semibold text-gray-900">LSS School</p>
                        <p className="text-xs text-gray-500">Playgroup - Pre O-Level</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, academyType: 'ACADEMY', position: '' }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          form.academyType === 'ACADEMY' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <GraduationCap className={`h-5 w-5 mb-1.5 ${form.academyType === 'ACADEMY' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <p className="text-sm font-semibold text-gray-900">LSS Academy</p>
                        <p className="text-xs text-gray-500">O & A Levels</p>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Position *</label>
                    <select
                      value={form.position}
                      onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                      required
                      className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
                    >
                      <option value="">Select a position</option>
                      {filteredPositions.map((p) => (
                        <option key={p.title} value={p.title}>{p.title}</option>
                      ))}
                    </select>
                    {form.academyType && filteredPositions.length === 0 && (
                      <p className="text-xs text-gray-400 mt-1">No open positions currently listed for this institution.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Full Name *</label>
                    <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="Your full name" className="h-11 border-gray-300" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Email Address *</label>
                    <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required placeholder="your@email.com" className="h-11 border-gray-300" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                  <Input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required placeholder="+92 3XX XXXXXXX" className="h-11 border-gray-300" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Qualification</label>
                    <Input value={form.qualification} onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))} placeholder="e.g. M.Sc, B.Ed, ACCA" className="h-11 border-gray-300" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Experience (Years)</label>
                    <Input value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} placeholder="e.g. 5" className="h-11 border-gray-300" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Cover Letter / Message</label>
                  <textarea
                    value={form.coverLetter}
                    onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
                    rows={4}
                    placeholder="Tell us about your teaching experience, achievements and why you'd like to join us..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 text-white font-semibold shadow-lg shadow-primary-700/30">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">Submit Application <Send className="h-4 w-4" /></span>
                  )}
                </Button>
              </form>
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Phone, label: 'Call HR', value: '+92 305 9079079', href: 'tel:+923059079079' },
                { icon: Mail, label: 'Email', value: 'careers@leadershipstudysystem.pk', href: 'mailto:careers@leadershipstudysystem.pk' },
                { icon: MapPin, label: 'Campus', value: 'F-8/3, Islamabad', href: 'https://maps.app.goo.gl/BWYvSWrhcRquFY1D6' },
              ].map((c) => (
                <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group">
                  <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/20 transition-all text-center">
                    <c.icon className="h-6 w-6 text-amber-300 mx-auto mb-2" />
                    <p className="text-xs text-blue-100/60">{c.label}</p>
                    <p className="text-sm font-semibold text-white break-all">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  )
}
