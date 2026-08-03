import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState, FormEvent, useEffect } from 'react'
import {
  School, Mail, Phone, User, MapPin, Calendar, Users, BookOpen,
  ChevronRight, CheckCircle, Sparkles, ArrowRight, UserCheck, Globe,
  FileText, Droplets, Heart, Briefcase, ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StrengthSection, LeadershipTeamSection, StaffFacultySection, GallerySection, SocialMediaSection, ContactSection, CareerSection } from '@/components/registration/EngagementSections'

interface SchoolFormData {
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
  grade: string
  bloodGroup: string
  medicalNotes: string
  agreeTerms: boolean
}

const schoolGrades = [
  'Playgroup', 'Nursery', 'KG', 'Grade 1', 'Grade 2', 'Grade 3',
  'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Pre-O Level'
]

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function StudentSchoolRegister() {
  const [formData, setFormData] = useState<SchoolFormData>({
    firstName: '', lastName: '', dob: '', gender: '', email: '', password: '',
    fatherName: '', fatherCnic: '', fatherPhone: '', fatherEmail: '', fatherOccupation: '',
    motherName: '', motherPhone: '', address: '', city: '',
    previousSchool: '', grade: '', bloodGroup: '', medicalNotes: '',
    agreeTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => { setVisible(true) }, [])

  const handleChange = (field: keyof SchoolFormData) => (
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
      await api.post('/public/students/register', { ...formData, type: 'SCHOOL', email: formData.email, password: formData.password })
      setIsSuccess(true)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.dob || !formData.gender || !formData.grade)) return
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
      <Helmet><title>School Admission Form | Leadership Study System</title></Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`text-center mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative mb-8 overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400" />
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-5 left-10 w-24 h-24 bg-white rounded-full blur-2xl" />
                <div className="absolute bottom-5 right-10 w-32 h-32 bg-yellow-300 rounded-full blur-2xl" />
              </div>
              <div className="relative px-6 py-10 sm:px-10 sm:py-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-white text-sm font-medium mb-4">
                  <School className="w-4 h-4" /> LSS School — Admission 2026
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 leading-tight">
                  Welcome to LSS School! 🎈
                </h1>
                <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto">
                  Playgroup to Pre-O Level — A happy, caring place where your child grows, learns, and shines every single day.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {['Safe & Caring', 'Fun Learning', 'Qualified Teachers', 'Small Classes'].map(t => (
                    <span key={t} className="px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-medium">
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
                    step === s ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' :
                    step > s ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  {s < 4 && <div className={`w-12 h-0.5 ${step > s ? 'bg-amber-300' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="shadow-xl border-gray-200/80 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-400 to-rose-400" />
              <CardContent className="p-8">

                {step === 1 && (
                  <div className="transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Student Information 👧👦</h2>
                        <p className="text-sm text-gray-500">Basic details about the student</p>
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
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Blood Group</label>
                        <Select value={formData.bloodGroup} onValueChange={handleChange('bloodGroup')}>
                          <SelectTrigger className="h-11"><SelectValue placeholder="Select blood group" /></SelectTrigger>
                          <SelectContent>
                            {bloodGroups.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Choose Your Grade 🎒</h2>
                          <p className="text-sm text-gray-500">Select the class your child is applying for</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {schoolGrades.map(g => (
                          <button
                            type="button"
                            key={g}
                            onClick={() => handleChange('grade')(g)}
                            className={`p-4 rounded-2xl border-2 text-center transition-all ${
                              formData.grade === g
                                ? 'border-amber-500 bg-amber-50 shadow-lg shadow-amber-100 scale-[1.02]'
                                : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                            }`}
                          >
                            <div className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center mb-2 ${
                              formData.grade === g ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {formData.grade === g ? <CheckCircle className="w-5 h-5" /> : <BookOpen className="w-4 h-4" />}
                            </div>
                            <p className={`text-sm font-semibold ${formData.grade === g ? 'text-amber-700' : 'text-gray-700'}`}>{g}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <StrengthSection type="SCHOOL" />
                    <LeadershipTeamSection type="SCHOOL" />
                  </div>
                )}

                {step === 2 && (
                  <div className="transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Parents / Guardian Details</h2>
                        <p className="text-sm text-gray-500">We'd love to know more about the family</p>
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
                        <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-rose-500" />
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
                    <StaffFacultySection type="SCHOOL" />
                  </div>
                )}

                {step === 3 && (
                  <div className="transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-amber-600" />
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
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Academic History</h2>
                          <p className="text-sm text-gray-500">Previous schooling details</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Previous School</label>
                          <Input value={formData.previousSchool} onChange={handleChange('previousSchool')} placeholder="School name (if any)" className="h-11" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Medical Information</h2>
                          <p className="text-sm text-gray-500">Health-related details</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Medical Notes</label>
                          <Input value={formData.medicalNotes} onChange={handleChange('medicalNotes')} placeholder="Allergies, conditions, or special needs" className="h-11" />
                        </div>
                      </div>
                    </div>
                    <GallerySection type="SCHOOL" />
                    <SocialMediaSection />
                  </div>
                )}

                {step === 4 && (
                  <div className="transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-amber-600" />
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
                          <div><span className="text-gray-500">Grade:</span> <span className="font-medium text-gray-900">{formData.grade}</span></div>
                          <div><span className="text-gray-500">Blood Group:</span> <span className="font-medium text-gray-900">{formData.bloodGroup || '-'}</span></div>
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
                      <Button type="button" onClick={nextStep} className="bg-amber-500 hover:bg-amber-600 text-white gap-2 min-w-[140px]">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting || !formData.agreeTerms} className="bg-amber-500 hover:bg-amber-600 text-white gap-2 min-w-[160px]">
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
