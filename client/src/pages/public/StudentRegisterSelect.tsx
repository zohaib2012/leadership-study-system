import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { School, GraduationCap, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function StudentRegisterSelect() {
  const [visible, setVisible] = useState(false)

  useEffect(() => { setVisible(true) }, [])

  return (
    <>
      <Helmet><title>Student Registration | Leadership Study System</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-24 pb-16">
        <div className={`max-w-5xl mx-auto px-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" /> Student Registration
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Program
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Select the type of program you want to enroll in at Leadership Study System
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/register/student/school" className="group block">
              <div className="relative h-full rounded-2xl bg-white border-2 border-gray-100 hover:border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary-600 to-primary-400" />
                <div className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <School className="h-7 w-7 text-primary-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">School Program</h2>
                  <p className="text-gray-500 mb-6 leading-relaxed">
                    Playgroup to Pre-O Level — Comprehensive foundational education following the Cambridge syllabus with focus on holistic development and academic excellence.
                  </p>
                  <div className="space-y-3 mb-8">
                    {[
                      'Playgroup, Nursery, KG to Pre-O Level',
                      'Cambridge International Curriculum',
                      'Air Conditioned Classrooms',
                      'Regular Assessments & Reports',
                      'Co-curricular Activities',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-primary-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-primary-700 hover:bg-primary-800 text-white shadow-lg shadow-primary-200 group/btn h-12 text-base">
                    Register for School
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Link>
            <Link to="/register/student/academy" className="group block">
              <div className="relative h-full rounded-2xl bg-white border-2 border-gray-100 hover:border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary-600 to-primary-400" />
                <div className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-7 w-7 text-primary-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Academy Program</h2>
                  <p className="text-gray-500 mb-6 leading-relaxed">
                    Cambridge IGCSE, AS & A Level — Specialized business education with expert faculty, proven track record of A* results, and personalized attention.
                  </p>
                  <div className="space-y-3 mb-8">
                    {[
                      'Cambridge IGCSE (O Level)',
                      'Cambridge AS & A Level',
                      'Business, Commerce & Economics',
                      'One-on-One & Small Group Classes',
                      'Past Papers & Exam Preparation',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-primary-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-primary-700 hover:bg-primary-800 text-white shadow-lg shadow-primary-200 group/btn h-12 text-base">
                    Register for Academy
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Link>
          </div>
          <p className="text-center mt-10 text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2">Sign in to your account</Link>
          </p>
        </div>
      </div>
    </>
  )
}
