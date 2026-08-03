import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState, FormEvent, useEffect } from 'react'
import {
  GraduationCap, Mail, Phone, User, MapPin, Calendar, Users, BookOpen,
  ChevronRight, CheckCircle, Sparkles, ArrowRight, UserCheck, Globe,
  FileText, Heart, Briefcase, Layers, ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StrengthSection, LeadershipTeamSection, StaffFacultySection, GallerySection, SocialMediaSection, ContactSection, CareerSection } from '@/components/registration/EngagementSections'

interface AcademyFormData {
  firstName: string
  lastName: string
  dob: string
  gender: string
  email: string
  password: string
  fatherName: string
  fatherCnic: string
  fatherPhone: string
  fatherEmail: string
  fatherOccupation: string
  motherName: string
  motherPhone: string
  address: string
  city: string
  previousSchool: string
  programLevel: string
  subjects: string
  academySeries: string
  agreeTerms: boolean
}

const programLevels = ['IGCSE O Level', 'AS Level', 'A Level']
const academySeries = ['MAY_JUNE', 'OCT_NOV']

export default function StudentAcademyRegister() {
  const [formData, setFormData] = useState<AcademyFormData>({
    firstName: '', lastName: '', dob: '', gender: '', email: '', password: '',
    fatherName: '', fatherCnic: '', fatherPhone: '', fatherEmail: '', fatherOccupation: '',
    motherName: '', motherPhone: '', address: '', city: '',
    previousSchool: '', programLevel: '', subjects: '', academySeries: '',
    agreeTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => { setVisible(true) }, [])

  const handleChange = (field: keyof AcademyFormData) => (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    if (typeof e === 'string') {
      setFormData(prev => ({ ...prev, [field]: e }))
    } else {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const api = (await import('@/lib/api')).default
      await api.post('/public/students/register', { ...formData, type: 'ACADEMY', email: formData.email, password: formData.password })
      setIsSuccess(true)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.dob || !formData.gender || !formData.programLevel || !formData.subjects)) return
    if (step === 2 && (!formData.fatherName || !formData.fatherPhone)) return
    setStep(s => Math.min(s + 1, 4))
  }

  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  if (isSuccess) {
    return (
      <>
        <Helmet><title>Registration Submitted | Leadership Study System</title></Helmet>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-xl border-0">
            <CardContent className="pt-12 pb-10 px-8 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Registration Submitted!</h2>
              <p className="text-gray-500 text-lg mb-2">
                Thank you, <span className="font-semibold text-gray-900">{formData.firstName} {formData.lastName}</span>
              </p>
              <p className="text-gray-400 text-sm mb-8">
                Your account <span className="text-primary-600 font-medium">{formData.email}</span> is pending admin approval. You will be able to login once approved.
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full h-12 bg-primary-700 hover:bg-primary-800 text-white font-semibold text-base rounded-xl shadow-lg">
                  <Link to="/">Return to Home <ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet><title>Academy Admission Form | Leadership Study System</title></Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`text-center mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative mb-8 overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-900 to-primary-700" />
              <div className="absolute inset-0 opacity-25">
                <div className="absolute top-5 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl" />
                <div className="absolute bottom-5 right-10 w-40 h-40 bg-violet-400 rounded-full blur-3xl" />
              </div>
              <div className="relative px-6 py-10 sm:px-10 sm:py-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-4">
                  <GraduationCap className="w-4 h-4" /> LSS Academy — Admission 2026
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 leading-tight">
                  Unlock Your Cambridge Journey 🚀
                </h1>
                <p className="text-blue-100/80 text-base sm:text-lg max-w-2xl mx-auto">
                  Cambridge IGCSE, AS & A Level — World-class education, expert faculty, and a clear path to top universities and global careers.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {['Cambridge Curriculum', 'Expert Faculty', 'A* Results', 'University Pathways'].map(t => (
                    <span key={t} className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`flex items-center ${s < 4 ? 'gap-2' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step === s ? 'bg-primary-700 text-white shadow-lg shadow-primary-200' :
                    step > s ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  {s < 4 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary-300' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="shadow-xl border-gray-200/80 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600" />
              <CardContent className="p-8">

                {step === 1 && (
                  <div className="transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg shadow-primary-200">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Student Information</h2>
                        <p className="text-sm text-gray-500">Basic details and program selection</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                        <Input value={formData.firstName} onChange={handleChange('firstName')} required placeholder="Enter first name" className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                        <Input value={formData.lastName} onChange={handleChange('lastName')} required placeholder="Enter last name" className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                        <Input type="date" value={formData.dob} onChange={handleChange('dob')} required className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                        <Select value={formData.gender} onValueChange={handleChange('gender')}>
                          <SelectTrigger className="h-11"><SelectValue placeholder="Select gender" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                        <Input type="email" value={formData.email} onChange={handleChange('email')} required placeholder="your@email.com" className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                        <Input type="password" value={formData.password} onChange={handleChange('password')} required placeholder="Create a password" className="h-11" />
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg shadow-primary-200">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Subjects Interested In 📚</h2>
                          <p className="text-sm text-gray-500">Separate multiple subjects with commas</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Input value={formData.subjects} onChange={handleChange('subjects')} required placeholder="e.g. Business Studies, Economics, Accounting" className="h-11" />
                        <div className="flex flex-wrap gap-2 pt-2">
                          {['Business Studies', 'Economics', 'Accounting', 'Commerce'].map(subj => (
                            <button
                              type="button"
                              key={subj}
                              onClick={() => {
                                const current = formData.subjects.split(',').map(s => s.trim()).filter(Boolean)
                                const next = current.includes(subj) ? current.filter(s => s !== subj) : [...current, subj]
                                handleChange('subjects')(next.join(', '))
                              }}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                formData.subjects.split(',').map(s => s.trim()).includes(subj)
                                  ? 'border-primary-700 bg-primary-50 text-primary-700'
                                  : 'border-gray-200 bg-white text-gray-500 hover:border-primary-300 hover:text-primary-700'
                              }`}
                            >
                              {subj}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg shadow-primary-200">
                          <Layers className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Choose Your Program 🎯</h2>
                          <p className="text-sm text-gray-500">Select the level you're applying for</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {programLevels.map(p => (
                          <button
                            type="button"
                            key={p}
                            onClick={() => handleChange('programLevel')(p)}
                            className={`p-5 rounded-2xl border-2 text-left transition-all group ${
                              formData.programLevel === p
                                ? 'border-primary-700 bg-primary-50 shadow-lg shadow-primary-100 scale-[1.02]'
                                : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/40'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                              formData.programLevel === p ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-700'
                            }`}>
                              {formData.programLevel === p ? <CheckCircle className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                            </div>
                            <p className={`font-semibold ${formData.programLevel === p ? 'text-primary-800' : 'text-gray-700'}`}>{p}</p>
                            <p className="text-xs text-gray-400 mt-1">{p === 'IGCSE O Level' ? 'Foundation for AS/A Levels' : p === 'AS Level' ? 'First year of advanced study' : 'Final advanced qualification'}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg shadow-primary-200">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Exam Series 📅</h2>
                          <p className="text-sm text-gray-500">When do you plan to sit your exams?</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[{ v: 'MAY_JUNE', label: 'May / June', desc: 'Exams held in spring' }, { v: 'OCT_NOV', label: 'October / November', desc: 'Exams held in autumn' }].map(s => (
                          <button
                            type="button"
                            key={s.v}
                            onClick={() => handleChange('academySeries')(s.v)}
                            className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                              formData.academySeries === s.v
                                ? 'border-primary-700 bg-primary-50 shadow-lg shadow-primary-100'
                                : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/40'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              formData.academySeries === s.v ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {formData.academySeries === s.v ? <CheckCircle className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className={`font-semibold ${formData.academySeries === s.v ? 'text-primary-800' : 'text-gray-700'}`}>{s.label}</p>
                              <p className="text-xs text-gray-400">{s.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <StrengthSection type="ACADEMY" />
                    <LeadershipTeamSection type="ACADEMY" />
                  </div>
                )}

                {step === 2 && (
                  <div className="transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg shadow-primary-200">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Parent / Guardian Details</h2>
                        <p className="text-sm text-gray-500">Contact details of your guardian</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Father's Name <span className="text-red-500">*</span></label>
                        <Input value={formData.fatherName} onChange={handleChange('fatherName')} required placeholder="Enter full name" className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">CNIC</label>
                        <Input value={formData.fatherCnic} onChange={handleChange('fatherCnic')} placeholder="XXXXX-XXXXXXX-X" className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Phone <span className="text-red-500">*</span></label>
                        <Input type="tel" value={formData.fatherPhone} onChange={handleChange('fatherPhone')} required placeholder="03XX-XXXXXXX" className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input type="email" value={formData.fatherEmail} onChange={handleChange('fatherEmail')} placeholder="father@email.com" className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Occupation</label>
                        <Input value={formData.fatherOccupation} onChange={handleChange('fatherOccupation')} placeholder="Occupation" className="h-11" />
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg shadow-primary-200">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Mother's Information</h2>
                          <p className="text-sm text-gray-500">Optional but recommended</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Mother's Name</label>
                          <Input value={formData.motherName} onChange={handleChange('motherName')} placeholder="Enter full name" className="h-11" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Phone</label>
                          <Input type="tel" value={formData.motherPhone} onChange={handleChange('motherPhone')} placeholder="03XX-XXXXXXX" className="h-11" />
                        </div>
                      </div>
                    </div>
                    <StaffFacultySection type="ACADEMY" />
                  </div>
                )}

                {step === 3 && (
                  <div className="transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg shadow-primary-200">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Address & Location</h2>
                        <p className="text-sm text-gray-500">Residential details</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                        <Input value={formData.address} onChange={handleChange('address')} required placeholder="House/Street, Sector, City" className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">City <span className="text-red-500">*</span></label>
                        <Input value={formData.city} onChange={handleChange('city')} required placeholder="City" className="h-11" />
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg shadow-primary-200">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Academic History</h2>
                          <p className="text-sm text-gray-500">Previous schooling details</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Previous School / College</label>
                          <Input value={formData.previousSchool} onChange={handleChange('previousSchool')} placeholder="School/College name (if any)" className="h-11" />
                        </div>
                      </div>
                    </div>
                    <GallerySection type="ACADEMY" />
                    <SocialMediaSection />
                  </div>
                )}

                {step === 4 && (
                  <div className="transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg shadow-primary-200">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Review & Submit</h2>
                        <p className="text-sm text-gray-500">Please verify your information before submitting</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Student Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</span></div>
                          <div><span className="text-gray-500">DOB:</span> <span className="font-medium text-gray-900">{formData.dob}</span></div>
                          <div><span className="text-gray-500">Gender:</span> <span className="font-medium text-gray-900">{formData.gender}</span></div>
                          <div><span className="text-gray-500">Program:</span> <span className="font-medium text-gray-900">{formData.programLevel}</span></div>
                          <div><span className="text-gray-500">Series:</span> <span className="font-medium text-gray-900">{formData.academySeries === 'MAY_JUNE' ? 'May/June' : 'Oct/Nov'}</span></div>
                          <div className="md:col-span-2"><span className="text-gray-500">Subjects:</span> <span className="font-medium text-gray-900">{formData.subjects}</span></div>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Parent Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div><span className="text-gray-500">Father:</span> <span className="font-medium text-gray-900">{formData.fatherName}</span></div>
                          <div><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{formData.fatherPhone}</span></div>
                          <div><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-900">{formData.fatherEmail || '-'}</span></div>
                          <div><span className="text-gray-500">Mother:</span> <span className="font-medium text-gray-900">{formData.motherName || '-'}</span></div>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Address</h3>
                        <p className="text-sm font-medium text-gray-900">{formData.address}, {formData.city}</p>
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group mt-6">
                      <input type="checkbox" checked={formData.agreeTerms} onChange={handleChange('agreeTerms')} required className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">
                        I confirm that all provided information is accurate and I agree to the{' '}
                        <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2">Terms & Conditions</Link>
                      </span>
                    </label>
                    <ContactSection />
                    <CareerSection />
                  </div>
                )}

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  <div>
                    {step > 1 ? (
                      <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </Button>
                    ) : (
                      <Link to="/register/student" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                        <ChevronLeft className="w-4 h-4" /> Back to selection
                      </Link>
                    )}
                  </div>
                  <div>
                    {step < 4 ? (
                      <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 shadow-lg shadow-primary-200 gap-2 min-w-[140px]">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting || !formData.agreeTerms} className="bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 shadow-lg shadow-primary-200 gap-2 min-w-[160px]">
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            Submitting...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">Submit Application <CheckCircle className="w-4 h-4" /></span>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </>
  )
}
