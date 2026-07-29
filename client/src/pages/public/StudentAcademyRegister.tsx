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

interface AcademyFormData {
  firstName: string
  lastName: string
  dob: string
  gender: string
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
    firstName: '', lastName: '', dob: '', gender: '', fatherName: '',
    fatherCnic: '', fatherPhone: '', fatherEmail: '', fatherOccupation: '',
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
      await api.post('/public/students/register', { ...formData, type: 'ACADEMY' })
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
                We have received your academy registration request. Our admissions team will contact you at <span className="text-primary-600 font-medium">{formData.fatherPhone}</span> soon.
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4" /> Academy Admission 2026
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Academy Registration Form</h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Cambridge IGCSE, AS & A Level — Fill in the details below to enroll
            </p>
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
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-700" />
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
                        <label className="text-sm font-medium text-gray-700">Program Level <span className="text-red-500">*</span></label>
                        <Select value={formData.programLevel} onValueChange={handleChange('programLevel')}>
                          <SelectTrigger className="h-11"><SelectValue placeholder="Select program" /></SelectTrigger>
                          <SelectContent>
                            {programLevels.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Exam Series <span className="text-red-500">*</span></label>
                        <Select value={formData.academySeries} onValueChange={handleChange('academySeries')}>
                          <SelectTrigger className="h-11"><SelectValue placeholder="Select series" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MAY_JUNE">May / June</SelectItem>
                            <SelectItem value="OCT_NOV">October / November</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-5 space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Subjects Interested In <span className="text-red-500">*</span></label>
                      <Input value={formData.subjects} onChange={handleChange('subjects')} required placeholder="e.g. Business Studies, Economics, Accounting" className="h-11" />
                      <p className="text-xs text-gray-400">Separate multiple subjects with commas</p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-primary-700" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Father's Information</h2>
                        <p className="text-sm text-gray-500">Parent/guardian contact details</p>
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
                        <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
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
                  </div>
                )}

                {step === 3 && (
                  <div className="transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary-700" />
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
                          <label className="text-sm font-medium text-gray-700">Previous School / College</label>
                          <Input value={formData.previousSchool} onChange={handleChange('previousSchool')} placeholder="School/College name (if any)" className="h-11" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-700" />
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
                      <Button type="button" onClick={nextStep} className="bg-primary-700 hover:bg-primary-800 gap-2 min-w-[140px]">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting || !formData.agreeTerms} className="bg-primary-700 hover:bg-primary-800 gap-2 min-w-[160px]">
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
