import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  ChevronRight,
  Shield,
  Users,
  BookOpen,
  Clock,
  Laptop,
  Star,
  Building2,
  Quote,
  ChevronLeft,
  GraduationCap,
  UserCheck,
  MessageSquare,
  Heart,
  Target,
  Eye,
  Sparkles,
  Award,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const whyChooseUs = [
  { icon: GraduationCap, title: 'Air Conditioned Classrooms', desc: 'Comfortable learning environment with fully air conditioned classrooms for year-round comfort.', color: 'from-primary-500 to-primary-600' },
  { icon: BookOpen, title: 'Comprehensive Syllabus Coverage', desc: 'Thorough coverage of Cambridge IGCSE and A Level syllabi with structured lesson plans.', color: 'from-primary-600 to-primary-700' },
  { icon: Clock, title: 'Regular Attendance Emphasis', desc: 'We maintain strict attendance records to ensure consistent academic progress.', color: 'from-primary-500 to-primary-700' },
  { icon: Users, title: 'Collaborative Group Classes', desc: 'Small group sessions that encourage peer learning and healthy academic competition.', color: 'from-primary-600 to-primary-800' },
  { icon: MessageSquare, title: 'Monthly Performance Feedback', desc: 'Detailed monthly reports on student progress shared with parents and guardians.', color: 'from-primary-500 to-primary-700' },
  { icon: Heart, title: 'Parental Engagement', desc: 'Regular parent-teacher meetings to discuss student development and address concerns.', color: 'from-primary-600 to-primary-800' },
  { icon: UserCheck, title: 'One-on-One Classes', desc: 'Personalized individual sessions for students who need focused attention.', color: 'from-primary-500 to-primary-700' },
  { icon: Shield, title: 'Safe Environment', desc: 'A secure and nurturing campus with CCTV monitoring and strict safety protocols.', color: 'from-primary-600 to-primary-800' },
]

const services = [
  { icon: Users, title: 'Face to Face Classes', desc: 'Interactive in-person classes at our F-8/3 campus with experienced faculty.' },
  { icon: Laptop, title: 'Online Tuitions', desc: 'Live interactive online sessions accessible from anywhere with flexible scheduling.' },
  { icon: BookOpen, title: 'Books & Study Materials', desc: 'Comprehensive curated study resources including notes, past papers, and practice tests.' },
]

const courses = [
  { code: '0450', name: 'IGCSE Business Studies', teacher: 'Mr. Muzammil Ameer', level: 'O Level' },
  { code: '9609', name: 'AS Level Business', teacher: 'Mr. Muzammil Ameer', level: 'AS Level' },
  { code: '9609', name: 'A Level Business', teacher: 'Mr. Saeed Khan', level: 'A Level' },
  { code: '7100', name: 'Commerce O Level', teacher: 'Mr. Saeed Khan', level: 'O Level' },
]

const faculty = [
  { name: 'Mr. Muzammil Ameer', role: 'Chief Executive Officer', gradient: 'from-primary-600 to-primary-800', bio: 'Visionary leader with 10+ years in Cambridge education.' },
  { name: 'Mr. Muhammad Ajmal Pervaiz', role: 'Executive Director', gradient: 'from-blue-600 to-blue-800', bio: 'Dedicated to academic excellence and student development.' },
  { name: 'Ms. Sana Muzammil', role: 'Executive Director', gradient: 'from-emerald-600 to-emerald-800', bio: 'Passionate educator focused on holistic student growth.' },
]

const testimonials = [
  { name: 'Aisha Khalid', role: 'IGCSE Student', quote: 'Leadership Study System transformed my understanding of Business Studies. The teachers are incredibly supportive and the learning environment is exceptional.', rating: 5 },
  { name: 'Saad Ahmed', role: 'A Level Student', quote: 'The comprehensive syllabus coverage and regular mock exams prepared me thoroughly for my Cambridge exams. Highly recommended!', rating: 5 },
  { name: 'Iqra Hassan', role: 'Parent', quote: 'As a parent, I appreciate the regular feedback and the genuine care the faculty shows for each student. My child has improved remarkably.', rating: 5 },
  { name: 'Fatima Khan', role: 'O Level Student', quote: 'The one-on-one attention and supportive teachers helped me achieve A* in Business Studies. Best decision I ever made!', rating: 5 },
]

const partners = [
  { name: 'Cambridge Assessment', color: 'bg-red-50 border-red-200', icon: 'bg-red-100 text-red-600' },
  { name: 'Pearson Edexcel', color: 'bg-blue-50 border-blue-200', icon: 'bg-blue-100 text-blue-600' },
  { name: 'British Council', color: 'bg-indigo-50 border-indigo-200', icon: 'bg-indigo-100 text-indigo-600' },
  { name: 'Oxford University Press', color: 'bg-yellow-50 border-yellow-200', icon: 'bg-yellow-100 text-yellow-600' },
  { name: 'FBISE', color: 'bg-green-50 border-green-200', icon: 'bg-green-100 text-green-600' },
]

const stats = [
  { value: '500+', label: 'Students Enrolled' },
  { value: '98%', label: 'Success Rate' },
  { value: '15+', label: 'Expert Faculty' },
  { value: '10+', label: 'Years Excellence' },
]

function AnimatedCounter({ value }: { value: string }) {
  const [display, setDisplay] = useState('0')
  const numValue = parseInt(value.replace(/\D/g, ''))
  const suffix = value.replace(/\d/g, '')
  useEffect(() => {
    let start = 0
    const duration = 2000
    const step = Math.ceil(numValue / 60)
    const timer = setInterval(() => {
      start += step
      if (start >= numValue) { setDisplay(value); clearInterval(timer) }
      else setDisplay(start + suffix)
    }, duration / 60)
    return () => clearInterval(timer)
  }, [])
  return <span>{display}</span>
}

function FadeInSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
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
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  )
}

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <Helmet>
        <title>Leadership Study System | Empowering Future Leaders in Business Education</title>
        <meta name="description" content="Pakistan's premier institute for Cambridge IGCSE and A Level Business Studies, Commerce, and Economics." />
      </Helmet>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 lg:pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[128px] animate-pulse animation-delay-2000" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-violet-500 rounded-full blur-[128px] animate-pulse animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              Pakistan's Premier Business Education Institute
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-in animation-delay-200">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-300 via-white to-blue-200 bg-clip-text text-transparent">
                Leadership Study System
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/80 mb-10 max-w-2xl leading-relaxed animate-fade-in animation-delay-400">
              Empowering future leaders through world-class Cambridge IGCSE and A Level education.
              Join Pakistan's most trusted institute for Business Studies, Commerce, and Economics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-600">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary-800 hover:bg-blue-50 font-semibold text-base px-8 py-6 h-auto rounded-xl shadow-2xl shadow-white/20 group">
                  LSS Playgroup till Pre-O Levels
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 font-semibold text-base px-8 py-6 h-auto rounded-xl group">
                  LSS O and A Level Academy
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-1">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <FadeInSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-700/20">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    To provide quality education that develops critical thinking, ethical values, and leadership skills
                    in students. We are committed to nurturing confident individuals who excel academically and contribute
                    positively to society through innovative teaching methods and a supportive learning environment.
                  </p>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-700/20">
                    <Eye className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    To be recognized as the leading institution for business education in Pakistan, producing
                    future business leaders who drive economic growth and innovation. We envision a learning
                    community where every student discovers their potential and achieves academic excellence.
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="relative py-24 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-1.5 text-sm bg-primary-100 text-primary-700 border-primary-200" variant="secondary">
                <Award className="h-4 w-4 mr-1.5 inline" /> Why Choose Us
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                We provide an unparalleled educational experience with facilities and teaching methods designed for the modern student.
              </p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <FadeInSection key={item.title}>
                <div className="group h-full" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="h-full p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary-100 transition-all duration-300">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-1.5 text-sm bg-primary-100 text-primary-700 border-primary-200" variant="secondary">
                <Star className="h-4 w-4 mr-1.5 inline" /> Our Services
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Comprehensive Learning Solutions</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">We offer flexible learning modes to suit every student's needs.</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <FadeInSection key={service.title}>
                <div className="group h-full" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="h-full p-8 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all group text-center overflow-hidden hover:border-primary-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection>
            <div className="text-center mt-12">
              <Link to="/services">
                <Button variant="outline" size="lg" className="rounded-xl group border-primary-600 text-primary-700 hover:bg-primary-600 hover:text-white">
                  View All Services
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== COURSES ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-500 rounded-full blur-[128px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-1.5 bg-white/15 text-white border-white/20">
                <BookOpen className="h-4 w-4 mr-1.5 inline" /> Featured Courses
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Cambridge International Courses</h2>
              <p className="text-blue-100/70 max-w-2xl mx-auto text-lg">Expert-led courses aligned with Cambridge Assessment International Education standards.</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, i) => (
              <FadeInSection key={`${course.code}-${course.level}`}>
                <div className="group relative" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-primary-300">{course.code}</span>
                      <Badge className="bg-white/15 text-white border-white/20">{course.level}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-white mb-3">{course.name}</h3>
                    <p className="text-blue-200/70 text-sm flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {course.teacher}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR LEADERSHIP ===== */}
      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-1.5 bg-primary-100 text-primary-700 border-primary-200" variant="secondary">
                <Users className="h-4 w-4 mr-1.5 inline" /> Our Leadership
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Meet Our Esteemed Faculty</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">Guided by experienced educators committed to academic excellence.</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {faculty.map((member, i) => (
              <FadeInSection key={member.name}>
                <div className="group relative" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity" />
                  <div className="relative rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all overflow-hidden">
                    <div className={`h-52 bg-gradient-to-br ${member.gradient} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-2xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full blur-2xl" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 border-2 border-white/30">
                          <Users className="h-10 w-10 text-white/70" />
                        </div>
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Leadership</span>
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-bold text-xl text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-primary-700 font-medium text-sm mb-3">{member.role}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection>
            <div className="text-center mt-12">
              <Link to="/faculty">
                <Button variant="outline" size="lg" className="rounded-xl group border-primary-600 text-primary-700 hover:bg-primary-600 hover:text-white">
                  View Full Team
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-24 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="text-center mb-14">
              <Badge className="mb-4 px-4 py-1.5 bg-primary-100 text-primary-700 border-primary-200" variant="secondary">
                <MessageSquare className="h-4 w-4 mr-1.5 inline" /> Testimonials
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">What People Say About Us</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Real stories from our students and parents</p>
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="relative px-4 sm:px-12">
              <div className="relative p-8 sm:p-12 rounded-2xl bg-white border border-gray-100 shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600 rounded-t-2xl" />
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 text-center md:text-left">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto md:mx-0 shadow-inner">
                      <Users className="h-10 w-10 text-primary-600" />
                    </div>
                    <div className="mt-3 flex gap-0.5 justify-center md:justify-start">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Quote className="h-8 w-8 text-primary-200 mb-4" />
                    <p className="text-base sm:text-lg text-gray-600 italic leading-relaxed mb-6">
                      "{testimonials[activeTestimonial].quote}"
                    </p>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{testimonials[activeTestimonial].name}</h4>
                      <p className="text-sm text-primary-600 font-medium">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 border border-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 border border-gray-100"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>

              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`transition-all duration-300 ${
                      i === activeTestimonial
                        ? 'w-8 h-2.5 bg-primary-700 rounded-full'
                        : 'w-2.5 h-2.5 bg-gray-300 rounded-full hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== PARTNERS ===== */}
      <section className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-12">
              <Badge className="mb-4 px-4 py-1.5 bg-primary-100 text-primary-700 border-primary-200" variant="secondary">
                <Building2 className="h-4 w-4 mr-1.5 inline" /> Partners & Affiliations
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Trusted By Leading Organizations</h2>
            </div>
          </FadeInSection>
          <FadeInSection>
            <div className="flex flex-wrap justify-center gap-4">
              {partners.map((partner) => (
                <div key={partner.name} className={`flex items-center gap-3 px-6 py-4 rounded-xl border ${partner.color} shadow-sm hover:shadow-md transition-shadow`}>
                  <div className={`w-10 h-10 ${partner.icon} rounded-lg flex items-center justify-center font-bold text-sm`}>
                    {partner.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-700 text-sm">{partner.name}</span>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-primary-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-primary-500 rounded-full blur-[128px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeInSection>
            <Badge className="mb-6 px-4 py-1.5 bg-white/10 text-white border-white/20">
              <GraduationCap className="h-4 w-4 mr-1.5 inline" /> Get Started Today
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Start Your Journey to Success with{' '}
              <span className="bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">Leadership Study System</span>
            </h2>
            <p className="text-blue-100/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who have achieved academic excellence through Leadership Study System.
              Enroll today and take the first step towards a brighter future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary-800 hover:bg-blue-50 font-semibold px-8 py-6 h-auto text-base rounded-xl shadow-2xl shadow-white/20 group">
                  Register Now
                  <CheckCircle2 className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 font-semibold px-8 py-6 h-auto text-base rounded-xl group">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  )
}