import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState, useEffect, FormEvent } from 'react'
import {
  Users,
  BookOpen,
  Clock,
  Laptop,
  Star,
  Building2,
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
  Handshake,
  Quote,
  TrendingUp,
  Globe,
  School,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Send,
  Rocket,
  Lightbulb,
  Camera,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import api from '@/lib/api'

const whyChooseUs = [
  { icon: BookOpen, title: 'Comprehensive Education', desc: 'From Playgroup to Grade 8 and Cambridge O & A Levels, we provide a complete educational pathway under one trusted institution.', color: 'from-primary-600 to-blue-700' },
  { icon: Users, title: 'Expert Teachers', desc: 'Highly qualified and experienced educators dedicated to academic excellence and student success.', color: 'from-amber-500 to-orange-600' },
  { icon: Target, title: 'Personalised Learning', desc: 'Small class sizes and individual attention ensure every student reaches their full potential.', color: 'from-emerald-500 to-emerald-700' },
  { icon: Award, title: 'Leadership Development', desc: 'Building confidence, character, creativity, and leadership alongside academic achievement.', color: 'from-violet-500 to-violet-700' },
  { icon: TrendingUp, title: 'Proven Academic Results', desc: 'A strong track record of preparing students for outstanding examination performance.', color: 'from-rose-500 to-rose-700' },
  { icon: Handshake, title: 'Parent Partnership', desc: 'Working closely with parents through regular communication and progress updates.', color: 'from-cyan-500 to-blue-600' },
  { icon: Laptop, title: 'Innovative Learning', desc: 'Interactive teaching, digital resources, and modern classroom practices that inspire lifelong learning.', color: 'from-primary-600 to-primary-800' },
]

const services = [
  { icon: School, title: 'PG Group to 8th Class School', desc: 'A complete schooling pathway from Playgroup to Grade 8, building strong academic foundations with care and creativity.', color: 'from-amber-500 to-orange-600', image: '/images/school-kids.jpg' },
  { icon: GraduationCap, title: 'Cambridge O and A Level Classes', desc: 'Expert-led Cambridge IGCSE, O & A Level classes preparing students for top universities and global careers.', color: 'from-primary-600 to-blue-700', image: '/images/academy-students.jpg' },
  { icon: Building2, title: 'School ERP for Schools & Academies', desc: 'A complete school management system for schools, academies, and individuals — admissions, fees, homework, results, and more.', color: 'from-violet-500 to-purple-700', image: '/images/student-laptop.jpg' },
  { icon: BookOpen, title: 'BTEC Program', desc: 'Professional guidance and support for students pursuing BTEC qualifications, from course selection to completion.', color: 'from-emerald-500 to-emerald-700', image: '/images/students-study-group.jpg' },
  { icon: Users, title: 'Find a Tutor', desc: 'Connect with qualified, verified tutors across a wide range of subjects and academic levels for personalized learning.', color: 'from-cyan-500 to-blue-600', image: '/images/students-discussion.jpg' },
]

const faculty = [
  { name: 'Muzammil Ameer', role: 'CEO and Founder', gradient: 'from-primary-600 to-blue-800', bio: 'Visionary leader with 20+ years in Cambridge education, committed to shaping the next generation of leaders.' },
  { name: 'Ms Sana Saleem', role: 'Executive Director', gradient: 'from-rose-500 to-rose-700', bio: 'Passionate about holistic student growth and nurturing confident individuals who excel academically.' },
  { name: 'Ms Umber', role: 'Executive Director', gradient: 'from-blue-600 to-blue-800', bio: 'Dedicated to academic excellence and empowering students to reach their full potential.' },
]

const testimonials = [
  { name: 'Aisha Khalid', role: 'IGCSE Student', quote: 'Leadership Study System transformed my understanding of Business Studies. The teachers are incredibly supportive and the learning environment is exceptional.', rating: 5 },
  { name: 'Saad Ahmed', role: 'A Level Student', quote: 'The comprehensive syllabus coverage and regular mock exams prepared me thoroughly for my Cambridge exams. Highly recommended!', rating: 5 },
  { name: 'Iqra Hassan', role: 'Parent', quote: 'As a parent, I appreciate the regular feedback and the genuine care the faculty shows for each student. My child has improved remarkably.', rating: 5 },
  { name: 'Fatima Khan', role: 'O Level Student', quote: 'The one-on-one attention and supportive teachers helped me achieve A* in Business Studies. Best decision I ever made!', rating: 5 },
]

const careerPaths = [
  { icon: TrendingUp, title: 'Business Leadership', desc: 'Pathways in management, strategy, and entrepreneurship for future business leaders.', color: 'from-primary-600 to-blue-700' },
  { icon: Globe, title: 'Global Opportunities', desc: 'Cambridge qualifications open doors to top universities and careers worldwide.', color: 'from-amber-500 to-orange-600' },
  { icon: Briefcase, title: 'Career Readiness', desc: 'Industry-aligned skills, career counselling, and guidance for professional growth.', color: 'from-emerald-500 to-emerald-700' },
]

const franchiseBenefits = [
  { icon: Building2, title: 'Proven Business Model', desc: 'Leverage a time-tested educational framework and operational blueprint.', color: 'from-primary-600 to-blue-700' },
  { icon: BookOpen, title: 'Curriculum & Training', desc: 'Full curriculum support, faculty training, and ongoing academic guidance.', color: 'from-amber-500 to-orange-600' },
  { icon: Users, title: 'Brand & Community', desc: 'Become part of the growing Leadership Study System family with trusted brand recognition.', color: 'from-emerald-500 to-emerald-700' },
]

const blogPosts = [
  { slug: 'why-choose-igcse-for-your-child', title: 'Why Choose IGCSE for Your Child?', excerpt: 'Discover the benefits of the Cambridge IGCSE curriculum and why it is the preferred choice for parents seeking a globally recognized qualification.', date: 'June 15, 2025', author: 'Mr. Muzammil Ameer', readTime: '5 min read', category: 'Education', gradient: 'from-primary-500 to-blue-700', image: '/images/child-study.jpg' },
  { slug: 'a-level-preparation-tips', title: 'A-Level Preparation Tips for Success', excerpt: 'Expert tips and strategies to help you excel in your Cambridge A Level examinations — from study schedules to past paper practice.', date: 'May 28, 2025', author: 'Mr. Saeed Khan', readTime: '7 min read', category: 'Exam Tips', gradient: 'from-amber-500 to-orange-600', image: '/images/student-writing.jpg' },
  { slug: 'business-studies-career-paths', title: 'Career Paths with Business Studies', excerpt: 'Explore the diverse career opportunities available to students who pursue Business Studies at IGCSE and A Level.', date: 'April 22, 2025', author: 'Mr. Muzammil Ameer', readTime: '8 min read', category: 'Career', gradient: 'from-emerald-500 to-emerald-700', image: '/images/students-study-group.jpg' },
]

const openPositions = [
  { title: 'Cambridge IGCSE / O Level Teacher', type: 'ACADEMY' },
  { title: 'Primary School Teacher (Playgroup - Class 5)', type: 'SCHOOL' },
  { title: 'AS / A Level Teacher', type: 'ACADEMY' },
  { title: 'Middle School Teacher (Class 6 - Pre O-Level)', type: 'SCHOOL' },
]

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

function SectionHeader({ badge, icon: Icon, title, subtitle }: { badge: string; icon: any; title: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <Badge className="mb-4 px-4 py-1.5 bg-gradient-to-r from-primary-600 to-blue-700 text-white border-transparent shadow-lg shadow-primary-700/20">
        <Icon className="h-4 w-4 mr-1.5 inline" /> {badge}
      </Badge>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">{title}</h2>
      {subtitle && <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">{subtitle}</p>}
    </div>
  )
}

const campusGallery = [
  { name: 'WhatsApp Image 2026-08-01 at 22.15.49.jpeg', label: 'Student Life', sub: 'Inside our classrooms' },
  { name: 'WhatsApp Image 2026-08-01 at 22.15.53.jpeg', label: 'Learning in Action', sub: 'Engaged and focused' },
  { name: 'WhatsApp Image 2026-08-01 at 22.15.56 (1).jpeg', label: 'Campus Moments', sub: 'Our day at LSS' },
  { name: 'WhatsApp Image 2026-08-01 at 22.15.56.jpeg', label: 'Classroom Time', sub: 'With our faculty' },
  { name: 'WhatsApp Image 2026-08-01 at 22.15.59.jpeg', label: 'School Days', sub: 'Making memories' },
  { name: 'WhatsApp Image 2026-08-01 at 22.16.04 (1).jpeg', label: 'Academy Class', sub: 'Preparing for exams' },
  { name: 'WhatsApp Image 2026-08-01 at 22.15.46.jpeg', label: 'At Our Campus', sub: 'F-8/3, Islamabad' },
  { name: 'WhatsApp Image 2026-08-01 at 22.15.49 (1).jpeg', label: 'Student Spotlight', sub: 'Our proud learners' },
  { name: 'WhatsApp Image 2026-08-01 at 22.15.57 (1).jpeg', label: 'Interactive Class', sub: 'Hands-on learning' },
  { name: 'WhatsApp Image 2026-08-01 at 22.15.57 (2).jpeg', label: 'Group Activity', sub: 'Learning together' },
  { name: 'WhatsApp Image 2026-08-01 at 22.16.01 (1).jpeg', label: 'Mentorship', sub: 'Personal attention' },
  { name: 'WhatsApp Image 2026-08-01 at 22.16.01 (2).jpeg', label: 'Exam Prep', sub: 'Cambridge preparation' },
  { name: 'WhatsApp Image 2026-08-01 at 22.16.02 (1).jpeg', label: 'Our Students', sub: 'Future leaders' },
  { name: 'WhatsApp Image 2026-08-01 at 22.16.03 (3).jpeg', label: 'Campus Life', sub: 'A vibrant community' },
  { name: 'WhatsApp Image 2026-08-01 at 22.16.05 (3).jpeg', label: 'Academic Excellence', sub: 'Striving for A*' },
  { name: 'WhatsApp Image 2026-08-01 at 22.16.05 (4).jpeg', label: 'Classroom Engagement', sub: 'Every student matters' },
  { name: 'WhatsApp Image 2026-08-01 at 22.16.06 (2).jpeg', label: 'Teacher Guidance', sub: 'Support at every step' },
  { name: 'WhatsApp Image 2026-08-01 at 22.16.06 (3).jpeg', label: 'Study Session', sub: 'Focused on success' },
  { name: 'WhatsApp Image 2026-08-01 at 22.16.07 (2).jpeg', label: 'Achievements', sub: 'Celebrating success' },
].map((g) => ({ id: g.name, src: `/homepage/${encodeURI(g.name)}`, label: g.label, sub: g.sub }))

export default function HomePage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [contactStatus, setContactStatus] = useState<'' | 'success' | 'error'>('')
  const [contactSending, setContactSending] = useState(false)

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setContactSending(true)
    setContactStatus('')
    try {
      const { data } = await api.post('/public/contact', contactForm)
      if (data.success) {
        setContactStatus('success')
        setContactForm({ name: '', email: '', phone: '', message: '' })
      }
    } catch (err: any) {
      setContactStatus('error')
    } finally {
      setContactSending(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Leadership Study System | Empowering Future Leaders in Business Education</title>
        <meta name="description" content="Pakistan's premier institute for Cambridge IGCSE and A Level Business Studies, Commerce, and Economics." />
      </Helmet>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 lg:pt-20">
        <div className="absolute inset-0">
          <img src="/images/classroom.jpg" alt="Modern classroom at Leadership Study System Islamabad" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-primary-950/90 to-primary-800/85" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-16 left-10 w-96 h-96 bg-primary-500 rounded-full blur-[130px] animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[520px] h-[520px] bg-blue-500 rounded-full blur-[130px] animate-pulse animation-delay-2000" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-amber-400 rounded-full blur-[110px] animate-pulse animation-delay-4000" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-violet-500 rounded-full blur-[100px] animate-pulse animation-delay-1000" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="font-cosmic text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-6 animate-fade-in animation-delay-200">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-amber-300 via-white to-blue-300 bg-clip-text text-transparent">
                  Leadership Study System
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-blue-100/80 mb-4 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in animation-delay-400">
                Education at Leadership Study System prepares students not only for examinations but for future opportunities beyond the classroom.
              </p>
              <p className="text-base sm:text-lg text-blue-100/60 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in animation-delay-400">
                At Leadership Study System, we are committed to inspiring and empowering the next generation of leaders through academic excellence and personal growth. With expert educators, innovative teaching approaches, and a supportive learning environment, we equip students with the knowledge, confidence, and critical thinking skills needed to excel in examinations and make a meaningful impact in an ever-changing world.
              </p>
            </div>

            {/* Hero showcase card */}
            <div className="hidden lg:block relative animate-fade-in animation-delay-400">
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-400/30 via-white/10 to-blue-500/30 rounded-[2.5rem] blur-2xl opacity-70" />
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <div className="relative h-40 rounded-[2rem] overflow-hidden">
                    <img src={`/homepage/${encodeURI('WhatsApp Image 2026-08-01 at 22.15.46.jpeg')}`} alt="LSS School students learning together" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">LSS School</span>
                  </div>
                  <div className="relative h-40 rounded-[2rem] overflow-hidden">
                    <img src={`/homepage/${encodeURI('WhatsApp Image 2026-08-01 at 22.15.49.jpeg')}`} alt="LSS Academy students in class" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">LSS Academy</span>
                  </div>
                </div>
                <div className="p-8 pt-5">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl" />
                      <img src="/icons/logo.jpeg" alt="Leadership Study System Logo" className="relative w-20 h-20 rounded-full object-cover border-4 border-white/40 shadow-xl" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">Leadership Study System</p>
                      <p className="text-blue-100/70 text-sm">Cambridge IGCSE • AS • A Level</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: GraduationCap, label: 'Cambridge Curriculum', color: 'from-primary-500 to-blue-600' },
                      { icon: Users, label: 'Expert Faculty', color: 'from-amber-500 to-orange-600' },
                      { icon: Award, label: 'A* Results', color: 'from-emerald-500 to-emerald-700' },
                      { icon: Globe, label: 'University Pathways', color: 'from-violet-500 to-purple-700' },
                    ].map((f) => (
                      <div key={f.label} className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all">
                        <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <f.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold">{f.label}</p>
                          <div className="h-1.5 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                            <div className="h-full w-3/4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SCHOOL VS ACADEMY ===== */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="text-center mb-14">
              <Badge className="mb-4 px-4 py-1.5 bg-gradient-to-r from-primary-600 to-blue-700 text-white border-transparent shadow-lg shadow-primary-700/20">
                <Sparkles className="h-4 w-4 mr-1.5 inline" /> Two Campuses, One Mission
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Choose Your Learning Journey</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">Dear parents and students, join us on a journey to unlock your potential and drive meaningful change in your field.</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeInSection>
              <Link to="/register/student/school" className="group block h-full">
                <div className="relative rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-600/25 group-hover:shadow-amber-600/40 group-hover:-translate-y-1.5 transition-all h-full overflow-hidden">
                  <div className="relative h-56 overflow-hidden">
                    <img src="/images/school-kids.jpg" alt="LSS School students" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-700/60 via-amber-600/10 to-transparent" />
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  </div>
                  <div className="relative p-8">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5">
                      <GraduationCap className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">LSS School</h3>
                    <p className="text-white/85 mb-6">Playgroup till Pre O-Levels — building strong foundations with care and creativity.</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {['Playgroup', 'Nursery', 'Primary', 'Middle'].map((c) => (
                        <span key={c} className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">{c}</span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-orange-700 px-5 py-2.5 rounded-xl shadow-lg group-hover:gap-3 transition-all">
                      Enroll Now <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeInSection>
            <FadeInSection>
              <Link to="/register/student/academy" className="group block h-full">
                <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-primary-800 text-white shadow-xl shadow-blue-700/25 group-hover:shadow-blue-700/40 group-hover:-translate-y-1.5 transition-all h-full overflow-hidden">
                  <div className="relative h-56 overflow-hidden">
                    <img src="/images/academy-students.jpg" alt="LSS Academy students" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-800/70 via-blue-800/10 to-transparent" />
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  </div>
                  <div className="relative p-8">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5">
                      <BookOpen className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">LSS Academy</h3>
                    <p className="text-white/85 mb-6">O & A Levels (Cambridge IGCSE / A Level) — your gateway to global universities.</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {['IGCSE O Level', 'AS Level', 'A Level'].map((c) => (
                        <span key={c} className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">{c}</span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-primary-800 px-5 py-2.5 rounded-xl shadow-lg group-hover:gap-3 transition-all">
                      Enroll Now <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeInSection>
          </div>

          <FadeInSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-700/20">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Mission Statement</h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    To provide quality education that empowers students to achieve their full potential, fostering academic excellence and personal growth, while ensuring accessibility at affordable fees.
                  </p>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-700/20">
                    <Eye className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    To be a leading educational institution dedicated to delivering exceptional learning experiences, making quality education accessible and affordable for all, and shaping future leaders equipped with knowledge and values.
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== CEO SECTION ===== */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="text-center mb-14">
              <Badge className="mb-4 px-4 py-1.5 bg-gradient-to-r from-primary-600 to-blue-700 text-white border-transparent shadow-lg shadow-primary-700/20">
                <Quote className="h-4 w-4 mr-1.5 inline" /> A Message from the CEO
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Meet Our Chief Executive</h2>
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-primary-600 to-blue-700 rounded-3xl blur-xl opacity-20" />
                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-primary-900/20 bg-white">
                  <img
                    src="/icons/pic.jpg.jpeg"
                    alt="Muzammil Ameer - Chief Executive Officer"
                    className="w-full h-[420px] sm:h-[480px] object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl shadow-primary-900/10 border border-gray-100 px-6 py-4 text-center w-[calc(100%-3rem)] sm:w-auto">
                  <p className="font-bold text-gray-900">Muzammil Ameer</p>
                  <p className="text-sm text-primary-700 font-medium">ACMA, AFPA</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 border border-primary-200 text-primary-800 text-sm font-semibold">
                  <GraduationCap className="h-4 w-4" /> Cambridge Examiner, Educator, Trainer, Author
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  A Visionary Committed to Academic Excellence
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Qualified Cost and Management Accountant with more than 20 years' experience teaching national and international curricula in Pakistan and abroad.
                </p>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 sm:p-8 relative">
                  <Quote className="h-8 w-8 text-primary-300 absolute -top-3 left-6 bg-white px-1" />
                  <p className="text-gray-600 leading-relaxed text-[15px]">
                    At Leadership Study System, I am committed to creating an environment where every student is inspired to achieve academic excellence while developing creativity, confidence, and strong values. Together with my dedicated team of educators, I strive to ensure that every student feels respected, challenged, and empowered to reach their full potential.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-[15px] mt-4">
                    My vision is to provide an educational experience that goes beyond outstanding examination results by equipping students with the knowledge, critical thinking, leadership, and life skills needed to succeed in higher education, their careers, and an ever-changing world.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-[15px] mt-4">
                    Thank you for your trust and partnership. I invite you to visit and experience our vibrant Team.
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <SectionHeader
              badge="Why Choose Us"
              icon={Award}
              title={<>Why Families <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Choose LSS</span></>}
              subtitle="A complete educational pathway under one trusted institution, from Playgroup to Cambridge O & A Levels."
            />
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => (
              <FadeInSection key={item.title}>
                <div className="group relative" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className={`h-1.5 rounded-t-2xl bg-gradient-to-r ${item.color}`} />
                  <div className="p-6 rounded-b-2xl bg-white border border-t-0 border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection>
            <div className="text-center mt-14">
              <Link to="/register/student">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-6 h-auto text-base rounded-xl shadow-2xl shadow-amber-600/30 group">
                  Start Your Journey to Success with LSS
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="relative py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <SectionHeader
              badge="Our Services"
              icon={Star}
              title={<>Our <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Services</span></>}
              subtitle="A complete educational ecosystem for schools, academies, and families."
            />
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <FadeInSection key={service.title}>
                <div className="group h-full" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="h-full rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden hover:border-primary-100">
                    <div className="relative h-48 overflow-hidden">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 to-transparent" />
                      <div className={`absolute bottom-4 left-4 w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <service.icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{service.desc}</p>
                    </div>
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

      {/* ===== CAMPUS PHOTO BANNER ===== */}
      <section className="relative h-[420px] sm:h-[480px] overflow-hidden">
        <img src="/images/students-campus.jpg" alt="Leadership Study System campus and students" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/70 to-primary-950/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <Badge className="mb-4 px-4 py-1.5 bg-amber-400/90 text-gray-900 border-transparent font-semibold">
              <Sparkles className="h-4 w-4 mr-1.5 inline" /> Join Our Community
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              500+ Students Growing into <span className="bg-gradient-to-r from-amber-300 to-blue-300 bg-clip-text text-transparent">Confident Leaders</span>
            </h2>
            <p className="text-blue-100/80 text-lg mb-8 max-w-xl leading-relaxed">
              From eager school children to ambitious Cambridge A Level students — every learner at Leadership Study System is on a journey of discovery and excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register/student">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-6 h-auto text-base rounded-xl shadow-2xl shadow-amber-600/30 group">
                  Apply for Admission
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/20 font-semibold px-8 py-6 h-auto text-base rounded-xl group">
                  About Our Institution
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAREER ===== */}
      <section className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <SectionHeader
              badge="Career Pathways"
              icon={Briefcase}
              title={<>Build a Future <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Beyond the Classroom</span></>}
              subtitle="Our programs prepare students for higher education and rewarding careers across the globe."
            />
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {careerPaths.map((path, i) => (
              <FadeInSection key={path.title}>
                <div className="group h-full" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="h-full p-8 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-center overflow-hidden hover:border-primary-100">
                    <div className={`w-16 h-16 bg-gradient-to-br ${path.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <path.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{path.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{path.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* Open positions CTA */}
          <FadeInSection>
            <div className="mt-14 rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-900 to-blue-900" />
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-10 right-10 w-72 h-72 bg-amber-400 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[100px]" />
              </div>
              <div className="relative p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/25 text-white text-sm font-medium mb-4 backdrop-blur-sm">
                    <Rocket className="h-4 w-4 text-amber-300" /> Join Our Team
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Work at Leadership Study System</h3>
                  <p className="text-blue-100/75 leading-relaxed mb-6">
                    We're hiring passionate educators for both our School and Academy. Grow your career with comprehensive training and a supportive team.
                  </p>
                  <Link to="/careers">
                    <Button size="lg" className="bg-white text-primary-800 hover:bg-blue-50 font-semibold px-8 py-6 h-auto text-base rounded-xl shadow-2xl shadow-white/20 group">
                      Explore Careers
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {openPositions.map((p) => (
                    <div key={p.title} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${p.type === 'ACADEMY' ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>
                        {p.type === 'ACADEMY' ? <GraduationCap className="h-5 w-5 text-white" /> : <Users className="h-5 w-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{p.title}</p>
                        <p className="text-blue-100/60 text-xs">{p.type === 'ACADEMY' ? 'LSS Academy' : 'LSS School'}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-amber-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== BECOME A PARTNER ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-amber-400 rounded-full blur-[110px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="text-center mb-14">
              <Badge className="mb-4 px-4 py-1.5 bg-white/10 text-white border-white/25 backdrop-blur-sm">
                <Handshake className="h-4 w-4 mr-1.5 inline" /> Become a Partner
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Grow With Us as a <span className="bg-gradient-to-r from-amber-300 to-blue-300 bg-clip-text text-transparent">Franchise Partner</span></h2>
              <p className="text-blue-100/70 max-w-2xl mx-auto text-lg">Join the Leadership Study System family and bring world-class education to your community.</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {franchiseBenefits.map((benefit, i) => (
              <FadeInSection key={benefit.title}>
                <div className="group h-full" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="h-full p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/25 transition-all text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                    <p className="text-blue-100/70 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection>
            <div className="text-center">
              <Link to="/contact">
                <Button size="lg" className="bg-white text-primary-800 hover:bg-blue-50 font-semibold px-10 py-6 h-auto text-base rounded-xl shadow-2xl shadow-white/20 group">
                  Become a Partner
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <SectionHeader
              badge="Insights & Resources"
              icon={Lightbulb}
              title={<>Latest from Our <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Blog</span></>}
              subtitle="Expert insights, tips, and resources to help students, parents, and educators navigate the world of Cambridge education."
            />
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <FadeInSection key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="group block h-full">
                  <div className="h-full rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800 hover:bg-white shadow-lg">{post.category}</Badge>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-300">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <span className="text-xs text-gray-500 flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5" />{post.author}
                        </span>
                        <span className="inline-flex items-center text-primary-700 font-medium text-sm">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection>
            <div className="text-center mt-12">
              <Link to="/blog">
                <Button variant="outline" size="lg" className="rounded-xl group border-primary-600 text-primary-700 hover:bg-primary-600 hover:text-white">
                  View All Articles
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== FACULTY ===== */}
      <section className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <SectionHeader
              badge="Our Leadership"
              icon={Users}
              title={<>Meet Our Esteemed <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Leadership</span></>}
              subtitle="Guided by experienced educators committed to academic excellence."
            />
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {faculty.map((member, i) => (
              <FadeInSection key={member.name}>
                <div className="group relative" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity" />
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <SectionHeader
              badge="Testimonials"
              icon={MessageSquare}
              title={<>What People <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Say About Us</span></>}
              subtitle="Real stories from our students and parents"
            />
          </FadeInSection>
          <FadeInSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-6 flex flex-col">
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">"{t.quote}"</p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">{t.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== STUDENT LIFE GALLERY ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-primary-800" />
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-400 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="text-center mb-14">
              <Badge className="mb-4 px-4 py-1.5 bg-white/10 text-white border-white/25 backdrop-blur-sm">
                <Camera className="h-4 w-4 mr-1.5 inline" /> Campus Life
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Life at <span className="bg-gradient-to-r from-amber-300 to-blue-300 bg-clip-text text-transparent">Leadership Study System</span></h2>
              <p className="text-blue-100/70 max-w-2xl mx-auto text-lg">A glimpse into our vibrant classrooms, dedicated faculty, and the student journey from Playgroup to A Levels.</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {campusGallery.map((g, i) => (
              <FadeInSection key={g.id}>
                <div className="group relative h-72 rounded-3xl overflow-hidden shadow-xl shadow-black/30" style={{ animationDelay: `${i * 120}ms` }}>
                  <img src={g.src} alt={g.label} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-white font-bold text-lg mb-0.5">{g.label}</p>
                    <p className="text-blue-100/70 text-sm">{g.sub}</p>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT US ===== */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <SectionHeader
              badge="Contact Us"
              icon={MessageSquare}
              title={<>Get in <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Touch</span></>}
              subtitle="Have questions about our programs or enrollment? We'd love to hear from you."
            />
          </FadeInSection>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <FadeInSection className="lg:col-span-2">
              <div className="space-y-4">
                {[
                  { icon: Phone, title: 'Call Us', value: '(+92) 305 9079079', detail: 'Mon-Fri 9am-6pm', href: 'tel:+923059079079' },
                  { icon: Mail, title: 'Email', value: 'meetceo@lsseducation.com', detail: 'We reply within 24 hours', href: 'mailto:meetceo@lsseducation.com' },
                  { icon: MapPin, title: 'Address', value: 'Street No.14, Sector F-8/3', detail: 'Islamabad, Pakistan', href: 'https://maps.app.goo.gl/BWYvSWrhcRquFY1D6' },
                ].map((item) => (
                  <a key={item.title} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group block">
                    <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary-200 hover:-translate-y-0.5 transition-all flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                        <p className="text-gray-600 text-sm font-medium break-all">{item.value}</p>
                        <p className="text-gray-400 text-xs">{item.detail}</p>
                      </div>
                    </div>
                  </a>
                ))}
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <iframe
                    title="Leadership Study System Location"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=73.0375%2C33.7150%2C73.0475%2C33.7250&amp;layer=mapnik&amp;marker=33.7200%2C73.0425"
                    className="w-full h-56"
                    style={{ border: 0 }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </FadeInSection>

            <FadeInSection className="lg:col-span-3">
              <div className="rounded-3xl bg-white border border-gray-100 shadow-xl p-6 sm:p-8">
                {contactStatus === 'success' && (
                  <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                    Message sent successfully! We'll respond within 24 hours.
                  </div>
                )}
                {contactStatus === 'error' && (
                  <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    Failed to send message. Please try again.
                  </div>
                )}
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <Input placeholder="Your full name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required className="h-11 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <Input type="email" placeholder="your@email.com" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required className="h-11 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500/20" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <Input type="tel" placeholder="+92 300 1234567" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="h-11 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Message</label>
                    <textarea placeholder="Tell us about your inquiry..." value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required rows={4} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20" />
                  </div>
                  <Button type="submit" disabled={contactSending} className="h-11 w-full rounded-xl bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800 font-semibold text-white shadow-lg shadow-primary-700/25">
                    {contactSending ? 'Sending...' : (<span className="flex items-center justify-center gap-2">Send Message <Send className="h-4 w-4" /></span>)}
                  </Button>
                </form>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-primary-800" />
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-primary-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-amber-400 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeInSection>
            <Badge className="mb-6 px-4 py-1.5 bg-white/10 text-white border-white/25 backdrop-blur-sm">
              <GraduationCap className="h-4 w-4 mr-1.5 inline" /> Get Started Today
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Start Your Journey to Success with{' '}
              <span className="bg-gradient-to-r from-amber-300 to-blue-300 bg-clip-text text-transparent">LSS</span>
            </h2>
            <p className="text-blue-100/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who have achieved academic excellence through Leadership Study System.
              Enroll today and take the first step towards a brighter future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/student">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-6 h-auto text-base rounded-xl shadow-2xl shadow-amber-600/30 group">
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
