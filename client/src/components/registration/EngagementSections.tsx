import { Link } from 'react-router-dom'
import {
  Users, Briefcase, GraduationCap, Trophy, ShieldCheck, BookOpen, Clock,
  Award, Star, Heart, Facebook, Instagram, Youtube, MessageCircle, Phone,
  Mail, MapPin, ChevronRight, Building2, Handshake, Globe, Target, Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SectionTitleProps {
  icon: React.ComponentType<{ className?: string }>
  badge: string
  title: string
  subtitle?: string
}

function SectionTitle({ icon: Icon, badge, title, subtitle }: SectionTitleProps) {
  return (
    <div className="text-center mb-10">
      <Badge className="mb-4 px-4 py-1.5 bg-primary-100 text-primary-700 border-primary-200" variant="secondary">
        <Icon className="h-4 w-4 mr-1.5 inline" /> {badge}
      </Badge>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
      {subtitle && <p className="text-gray-500 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  )
}

function SectionWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mt-10 pt-8 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  )
}

export function LeadershipTeamSection({ type }: { type: 'SCHOOL' | 'ACADEMY' }) {
  return (
    <SectionWrapper>
      <SectionTitle
        icon={Users}
        badge="Our Leadership Team"
        title="Guided by Experienced Leaders"
        subtitle="Meet the people who shape the vision of our institution."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Muzammil Ameer', role: 'Chief Executive Officer', msg: 'Committed to creating an environment where every student is inspired to achieve academic excellence while developing creativity, resilience, confidence, and strong values.' },
          { name: 'Muhammad Ajmal Pervaiz', role: 'Executive Director', msg: 'Dedicated to academic excellence and ensuring every student feels respected, challenged, and empowered to reach their full potential.' },
          { name: 'Sana Muzammil', role: 'Executive Director', msg: 'Passionate about holistic student growth and nurturing confident individuals who excel academically and contribute positively to society.' },
        ].map((m, i) => (
          <div key={m.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
              {i === 0 ? (
                <img src="/icons/ceopic.png" alt={m.name} className="w-full h-full object-cover object-top" />
              ) : (
                <Users className="h-12 w-12 text-white/70" />
              )}
            </div>
            <div className="p-5 text-center">
              <h3 className="font-bold text-gray-900">{m.name}</h3>
              <p className="text-primary-700 font-medium text-sm mb-3">{m.role}</p>
              <p className="text-sm text-gray-500 leading-relaxed">"{m.msg}"</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function StaffFacultySection({ type }: { type: 'SCHOOL' | 'ACADEMY' }) {
  const isAcademy = type === 'ACADEMY'
  const title = isAcademy ? 'Our Faculty' : 'Our Staff'
  const members = isAcademy
    ? [
        { name: 'Muzammil Ameer', role: 'Cambridge Examiner & Senior Faculty', exp: '20+ Years Experience', qual: 'ACMA, AFPA, M.A.' },
        { name: 'Saeed Khan', role: 'Commerce & Business Faculty', exp: '15+ Years Experience', qual: 'MBA (Finance)' },
        { name: 'Sana Muzammil', role: 'Economics Faculty', exp: '12+ Years Experience', qual: 'M.Phil Economics' },
        { name: 'Muhammad Ajmal Pervaiz', role: 'Business Studies Faculty', exp: '18+ Years Experience', qual: 'ACCA' },
      ]
    : [
        { name: 'Ms. Ayesha Malik', role: 'Senior Teacher (Primary)', exp: '10+ Years Experience', qual: 'M.Ed' },
        { name: 'Mr. Usman Tariq', role: 'Teacher (Playgroup-KG)', exp: '6+ Years Experience', qual: 'B.Ed' },
        { name: 'Ms. Hira Shah', role: 'Teacher (Middle Section)', exp: '8+ Years Experience', qual: 'MA English' },
        { name: 'Ms. Rabia Noor', role: 'Teacher (Pre-O Level)', exp: '7+ Years Experience', qual: 'M.Sc Mathematics' },
      ]
  return (
    <SectionWrapper>
      <SectionTitle
        icon={isAcademy ? GraduationCap : Users}
        badge={title}
        title={`Meet Our ${title}`}
        subtitle={`Dedicated ${isAcademy ? 'faculty members' : 'staff members'} committed to your child's success.`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((m, i) => (
          <div key={m.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
            <div className="h-44 bg-gradient-to-br from-gray-100 to-primary-50 flex items-center justify-center overflow-hidden">
              {isAcademy && i < 7 ? (
                <img
                  src={`/icons/faculty/faculty-${(i % 7) + 1}.jpeg`}
                  alt={m.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                />
              ) : (
                <GraduationCap className="h-12 w-12 text-primary-300" />
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900">{m.name}</h3>
              <p className="text-primary-700 text-sm font-medium mb-2">{m.role}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Clock className="h-3.5 w-3.5" /> {m.exp}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Award className="h-3.5 w-3.5" /> {m.qual}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function StrengthSection({ type }: { type: 'SCHOOL' | 'ACADEMY' }) {
  const strengths = [
    { icon: BookOpen, title: 'Comprehensive Curriculum', desc: 'Structured coverage of Cambridge syllabi with expert guidance.' },
    { icon: Users, title: 'Small Group Classes', desc: 'Personalized attention in collaborative learning sessions.' },
    { icon: Award, title: 'Expert Faculty', desc: 'Qualified and experienced teachers dedicated to your success.' },
    { icon: Clock, title: 'Regular Assessment', desc: 'Monthly feedback and mock exams to track steady progress.' },
    { icon: ShieldCheck, title: 'Safe Environment', desc: 'Secure campus with CCTV monitoring and strict safety protocols.' },
    { icon: Heart, title: 'Parental Engagement', desc: 'Regular parent-teacher meetings and transparent communication.' },
  ]
  return (
    <SectionWrapper>
      <SectionTitle
        icon={Trophy}
        badge="Our Strength"
        title="Why Families Choose Us"
        subtitle="A nurturing environment built on quality education and care."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {strengths.map((s) => (
          <div key={s.title} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center flex-shrink-0">
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function GallerySection({ type }: { type: 'SCHOOL' | 'ACADEMY' }) {
  const count = type === 'ACADEMY' ? 7 : 14
  const images = Array.from({ length: count }, (_, i) => `/icons/${type === 'ACADEMY' ? 'faculty/faculty' : 'gallery/gallery'}-${i + 1}.jpeg`)
  return (
    <SectionWrapper>
      <SectionTitle
        icon={Sparkles}
        badge="Our Gallery"
        title="Glimpses of Life at LSS"
        subtitle="A look inside our classrooms, activities, and vibrant community."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <div key={src} className="relative rounded-xl overflow-hidden aspect-square group cursor-pointer">
            <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function SocialMediaSection() {
  const socials = [
    { icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600', href: 'https://www.facebook.com/mibsconnect' },
    { icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-600', href: 'https://www.instagram.com/mibs_edu/' },
    { icon: Youtube, label: 'YouTube', color: 'hover:bg-red-600', href: 'https://www.youtube.com/@Mibsinstitute' },
    { icon: MessageCircle, label: 'WhatsApp', color: 'hover:bg-green-600', href: 'https://wa.me/923059079079' },
  ]
  return (
    <SectionWrapper>
      <SectionTitle
        icon={Heart}
        badge="Connect With Us"
        title="Follow Our Journey on Social Media"
        subtitle="Stay updated with announcements, results, and campus life."
      />
      <div className="flex flex-wrap justify-center gap-4">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-6 py-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg text-gray-700 transition-all ${s.color} hover:text-white`}
          >
            <s.icon className="h-5 w-5" />
            <span className="font-medium">{s.label}</span>
          </a>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function ContactSection() {
  const contacts = [
    { icon: Phone, label: 'Call Us', value: '+92 305 9079079', href: 'tel:+923059079079' },
    { icon: Mail, label: 'Email', value: 'meetceo@lsseducation.com', href: 'mailto:meetceo@lsseducation.com' },
    { icon: MapPin, label: 'Address', value: 'Street No.14, Sector F-8/3, Islamabad', href: 'https://maps.app.goo.gl/BWYvSWrhcRquFY1D6' },
  ]
  return (
    <SectionWrapper>
      <SectionTitle
        icon={Phone}
        badge="Contact Us"
        title="We're Here to Help"
        subtitle="Have questions? Reach out to our admissions team."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {contacts.map((c) => (
          <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group">
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <c.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">{c.label}</h3>
              <p className="text-sm text-gray-500 break-all mt-1">{c.value}</p>
            </div>
          </a>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function CareerSection() {
  const careers = [
    { icon: Building2, title: 'Join Our Team', desc: 'We are always looking for passionate educators. Send us your CV at hr@leadershipstudysystem.pk.' },
    { icon: Handshake, title: 'Franchise Opportunities', desc: 'Bring LSS to your city as a franchise partner and grow with a trusted brand.' },
    { icon: Globe, title: 'Global Careers', desc: 'Our Cambridge qualifications prepare students for top universities and careers worldwide.' },
  ]
  return (
    <SectionWrapper>
      <SectionTitle
        icon={Briefcase}
        badge="Career"
        title="Careers & Opportunities"
        subtitle="Grow with us or build your own LSS journey."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {careers.map((c) => (
          <div key={c.title} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center mb-4">
              <c.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{c.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/contact" className="inline-flex items-center gap-1 text-primary-700 hover:text-primary-800 font-medium">
          Get in Touch <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </SectionWrapper>
  )
}

export function EngagementSections({ type }: { type: 'SCHOOL' | 'ACADEMY' }) {
  return (
    <div>
      <StrengthSection type={type} />
      <LeadershipTeamSection type={type} />
      <StaffFacultySection type={type} />
      <GallerySection type={type} />
      <SocialMediaSection />
      <ContactSection />
      <CareerSection />
    </div>
  )
}
