import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Award,
  GraduationCap,
  CheckCircle,
  Heart,
  Star,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Quote,
  Target,
  Laptop,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      {children}
    </div>
  );
}

const stats = [
  { icon: Users, value: '500+', label: 'Active Students' },
  { icon: BookOpen, value: '15+', label: 'Education Courses' },
  { icon: Award, value: '10+', label: 'Experience Teachers' },
  { icon: Star, value: '3', label: 'Awards Achieved' },
  { icon: GraduationCap, value: '1000+', label: 'Alumni Worldwide' },
  { icon: Clock, value: '5+ Years', label: 'of Excellence' },
];

const reasons = [
  { icon: GraduationCap, title: 'Comprehensive Education', description: 'From Playgroup to Grade 8 and Cambridge O & A Levels, we provide a complete educational pathway under one trusted institution.' },
  { icon: Users, title: 'Expert Teachers', description: 'Highly qualified and experienced educators dedicated to academic excellence and student success.' },
  { icon: Target, title: 'Personalised Learning', description: 'Small class sizes and individual attention ensure every student reaches their full potential.' },
  { icon: Star, title: 'Leadership Development', description: 'Building confidence, character, creativity, and leadership alongside academic achievement.' },
  { icon: TrendingUp, title: 'Proven Academic Results', description: 'A strong track record of preparing students for outstanding examination performance.' },
  { icon: Heart, title: 'Parent Partnership', description: 'Working closely with parents through regular communication and progress updates.' },
  { icon: Laptop, title: 'Innovative Learning', description: 'Interactive teaching, digital resources, and modern classroom practices that inspire lifelong learning.' },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Leadership Study System</title>
        <meta name="description" content="Discover the mission, vision, and story behind Leadership Study System. Learn why thousands of students trust us for their educational journey." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 px-4 pb-16 pt-28 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] animate-pulse rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[600px] w-[600px] animate-pulse rounded-full bg-primary-700/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <FadeInSection>
            <Badge className="mb-6 border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-primary-200 backdrop-blur-sm">
              <Sparkles className="mr-2 h-3.5 w-3.5" />Discover Our Story
            </Badge>
          </FadeInSection>
          <FadeInSection>
            <h1 className="mb-6 bg-gradient-to-r from-white via-primary-100 to-primary-200 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
              About Leadership Study System
            </h1>
          </FadeInSection>
          <FadeInSection>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-primary-200/80">
              Shaping the future of business education in Pakistan through innovation, dedication, and academic excellence.
            </p>
          </FadeInSection>
          <FadeInSection>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white px-8 py-6 text-base font-semibold text-primary-800 shadow-lg hover:bg-gray-100">
                <Link to="/courses">Explore Programs</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <FadeInSection>
            <div className="text-center mb-10">
              <Badge className="mb-4 border-primary-200 bg-primary-50 text-primary-700">Our Impact</Badge>
              <h2 className="text-3xl font-bold text-gray-900">By the Numbers</h2>
              <p className="mt-2 text-gray-500">A snapshot of our journey and achievements.</p>
            </div>
          </FadeInSection>
          <FadeInSection>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
              {stats.map((stat, index) => (
                <div key={index} className="rounded-xl border border-gray-100 bg-gradient-to-b from-white to-gray-50/50 p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                    <stat.icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="block text-xl font-bold text-gray-900">{stat.value}</span>
                  <span className="mt-0.5 block text-xs text-gray-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeInSection>
              <Badge className="mb-4 border-primary-200 bg-primary-50 text-primary-700">Our Mission</Badge>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">Committed to Educational Excellence</h2>
              <p className="mb-4 leading-relaxed text-gray-600">
                At Leadership Study System, our mission is to empower students with the knowledge, skills, and confidence they need to excel in Cambridge IGCSE and A Level examinations. We believe that every student has the potential to achieve greatness when provided with the right guidance and learning environment.
              </p>
              <p className="mb-6 leading-relaxed text-gray-600">
                Founded with a vision to revolutionize business education in Pakistan, we offer specialized courses in Business Studies, Commerce, and Economics. Our curriculum is meticulously designed to align with Cambridge International standards while incorporating real-world business concepts.
              </p>
              <div className="space-y-3">
                {[
                  'Expert Cambridge-trained faculty with 10+ years of experience',
                  'Proven track record of outstanding examination results',
                  'Modern facilities with fully air conditioned classrooms',
                  'Comprehensive resources including past papers and study materials',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-gray-700">{text}</span>
                  </div>
                ))}
              </div>
            </FadeInSection>
            <FadeInSection>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary-500/20 to-amber-500/20 blur-xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img src="/icons/gallery/gallery-1.jpeg" alt="LSS School students learning together" className="h-72 w-full object-cover sm:h-80" />
                </div>
                <div className="absolute -bottom-5 -left-3 sm:left-6 rounded-2xl bg-white px-5 py-3 shadow-xl">
                  <p className="text-2xl font-bold text-primary-700">500+</p>
                  <p className="text-xs text-gray-500">Happy Learners</p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeInSection className="lg:order-2">
              <Badge className="mb-4 border-primary-200 bg-primary-50 text-primary-700">Our Vision</Badge>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">Building Tomorrow's Business Leaders</h2>
              <p className="mb-4 leading-relaxed text-gray-600">
                Our vision is to be the most trusted and respected institution for Cambridge business education in Pakistan. We aim to produce graduates who are not just academically accomplished but also equipped with critical thinking skills, ethical values, and a global perspective.
              </p>
              <p className="mb-6 leading-relaxed text-gray-600">
                We envision a future where Leadership Study System alumni lead businesses, drive economic growth, and contribute meaningfully to society. Through continuous improvement and innovation in our teaching methods, we strive to set new benchmarks in educational excellence.
              </p>
              <div className="flex gap-8">
                {[
                  { val: '5+', label: 'Years of Excellence' },
                  { val: '1000+', label: 'Students Taught' },
                  { val: '95%', label: 'Success Rate' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-3xl font-bold text-primary-700">{item.val}</div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </FadeInSection>
            <FadeInSection className="lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary-600/20 to-primary-800/20 blur-xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img src="/icons/gallery/gallery-2.jpeg" alt="LSS Academy students preparing for Cambridge exams" className="h-72 w-full object-cover sm:h-80" />
                </div>
                <div className="absolute -bottom-5 -right-3 sm:right-6 rounded-2xl bg-white px-5 py-3 shadow-xl">
                  <p className="text-2xl font-bold text-primary-700">1000+</p>
                  <p className="text-xs text-gray-500">Alumni Worldwide</p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Campus Gallery */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <FadeInSection>
            <div className="text-center mb-10">
              <Badge className="mb-4 border-primary-200 bg-primary-50 text-primary-700">Our Campus</Badge>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Inside Our Classrooms</h2>
              <p className="mt-2 text-gray-500 max-w-lg mx-auto">A glimpse into the learning environment that makes LSS special.</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { src: '/icons/gallery/gallery-3.jpeg', label: 'Dedicated Faculty' },
              { src: '/icons/gallery/gallery-4.jpeg', label: 'Group Learning' },
              { src: '/icons/gallery/gallery-5.jpeg', label: 'Lecture Halls' },
              { src: '/icons/gallery/gallery-6.jpeg', label: 'Our Achievers' },
            ].map((img, i) => (
              <FadeInSection key={img.label}>
                <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-md">
                  <img src={img.src} alt={img.label} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                  <p className="absolute bottom-3 left-3 text-sm font-semibold text-white">{img.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <FadeInSection>
            <div className="text-center mb-12">
              <Badge className="mb-4 border-primary-200 bg-primary-50 text-primary-700">Leadership</Badge>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Message from Our Leaders</h2>
              <p className="mt-2 text-gray-500 max-w-lg mx-auto">Words of wisdom and vision from the people who lead us.</p>
            </div>
          </FadeInSection>

          <div className="space-y-6">
            {[
              {
                name: 'Mr. Muzammil Ameer',
                role: 'Chief Executive Officer',
                gradient: 'from-primary-600 to-primary-800',
                text: 'Education is not just about acquiring knowledge; it is about shaping character, building confidence, and preparing for the challenges of tomorrow. At Leadership Study System, we are committed to providing an educational experience that goes beyond textbooks. Our dedicated team works tirelessly to ensure that every student receives the guidance and support they need to excel in Cambridge examinations and beyond. I invite you to join us on this journey of academic excellence and personal growth. Together, we can build a brighter future for our students and our nation.',
              },
              {
                name: 'Ms. Sana Muzammil',
                role: 'Executive Director',
                gradient: 'from-primary-500 to-primary-700',
                text: 'As an educator, I believe that every child possesses unique talents waiting to be discovered and nurtured. Our approach at Leadership Study System focuses on understanding each student\'s individual learning style and providing personalized support. We create an environment where students feel safe to ask questions, explore ideas, and develop a genuine love for learning. Seeing our students grow into confident, capable individuals is the greatest reward of our work. I welcome you to experience the LSS difference.',
              },
            ].map((m, i) => (
              <FadeInSection key={i}>
                <Card className="overflow-hidden border-0 shadow-sm">
                  <div className="flex flex-col sm:flex-row">
                    <div className={`flex items-center justify-center bg-gradient-to-br ${m.gradient} px-6 py-8 sm:w-48 sm:flex-col sm:py-10`}>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                        <Quote className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4 sm:ml-0 sm:mt-3 sm:text-center">
                        <p className="text-sm font-bold text-white">{m.name}</p>
                        <p className="text-xs text-white/70">{m.role}</p>
                      </div>
                    </div>
                    <div className="flex-1 p-6 sm:p-8">
                      <p className="text-sm leading-relaxed text-gray-600 italic">"{m.text}"</p>
                    </div>
                  </div>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <FadeInSection>
            <div className="text-center mb-12">
              <Badge className="mb-4 border-primary-200 bg-primary-50 text-primary-700">Why Students Choose Us</Badge>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">The LSS Advantage</h2>
              <p className="mt-2 text-gray-500 max-w-lg mx-auto">Discover why students and parents trust us for Cambridge education.</p>
            </div>
          </FadeInSection>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, index) => (
              <FadeInSection key={index}>
                <Card className="group h-full border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md transition-transform duration-300 group-hover:scale-110">
                      <reason.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{reason.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-gray-500">{reason.description}</p>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-700 to-primary-900 px-4 py-20 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>
        <FadeInSection>
          <Badge className="mb-6 border-white/20 bg-white/10 px-4 py-1.5 text-white backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4" />Join Us Today
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Ready to Join Our Community?</h2>
          <p className="mx-auto mb-8 max-w-xl text-primary-100">Take the first step towards academic excellence. Enroll at Leadership Study System today.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white px-8 py-6 text-base font-semibold text-primary-800 shadow-lg hover:bg-gray-100">
              <Link to="/register">Register Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20">
              <Link to="/pricing">Get School ERP Services</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20">
              <Link to="/pricing">Become a Partner</Link>
            </Button>
          </div>
        </FadeInSection>
      </section>
    </>
  );
}
