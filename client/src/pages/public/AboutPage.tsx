import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Target,
  Eye,
  Users,
  BookOpen,
  Award,
  GraduationCap,
  CheckCircle,
  Heart,
  Shield,
  Star,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function FadeInSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

const stats = [
  { icon: Users, value: '500+', label: 'Active Students' },
  { icon: BookOpen, value: '15+', label: 'Education Courses' },
  { icon: Award, value: '10+', label: 'Experience Teachers' },
  { icon: Star, value: '3', label: 'Award Achieved' },
  { icon: GraduationCap, value: '1000+', label: 'Alumni Worldwide' },
  { icon: Clock, value: '5+ Years', label: 'of Excellence' },
];

const reasons = [
  {
    icon: GraduationCap,
    title: 'Qualified Faculty',
    description:
      'Highly experienced Cambridge-trained teachers with proven track records of student success.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Resources',
    description:
      'Access to extensive study materials, past papers, and practice resources.',
  },
  {
    icon: Clock,
    title: 'Flexible Learning',
    description:
      'Both in-person and online class options to accommodate diverse learning preferences.',
  },
  {
    icon: TrendingUp,
    title: 'Proven Results',
    description:
      'Consistent history of outstanding Cambridge examination results year after year.',
  },
  {
    icon: Heart,
    title: 'Student-Centric Approach',
    description:
      'Personalized attention ensuring each student reaches their full potential.',
  },
  {
    icon: Shield,
    title: 'Safe Learning Space',
    description:
      'Secure, well-equipped campus designed for focused academic pursuit.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Leadership Study System</title>
        <meta
          name="description"
          content="Discover the mission, vision, and story behind Leadership Study System. Learn why thousands of students trust us for their educational journey."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 pb-20 pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-40 right-20 h-96 w-96 rounded-full bg-primary-400/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <FadeInSection>
            <Badge className="mb-6 border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-sm text-primary-300">
              Discover Our Story
            </Badge>
          </FadeInSection>
          <FadeInSection>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              About Leadership
              <br />
              <span className="bg-gradient-to-r from-primary-300 to-primary-100 bg-clip-text text-transparent">
                Study System
              </span>
            </h1>
          </FadeInSection>
          <FadeInSection>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300 sm:text-xl">
              Shaping the future of business education in Pakistan through
              innovation, dedication, and academic excellence.
            </p>
          </FadeInSection>
          <FadeInSection>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary-900 shadow-lg hover:bg-gray-100"
              >
                <Link to="/courses">Explore Programs</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-400/40 text-white hover:bg-white/10"
              >
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeInSection>
              <div>
                <Badge className="mb-4 border-primary-200 bg-primary-50 text-primary-700">
                  Our Mission
                </Badge>
                <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Committed to Educational Excellence
                </h2>
                <p className="mb-4 text-lg leading-relaxed text-gray-600">
                  At Leadership Study System, our mission is to empower students
                  with the knowledge, skills, and confidence they need to excel
                  in Cambridge IGCSE and A Level examinations. We believe that
                  every student has the potential to achieve greatness when
                  provided with the right guidance and learning environment.
                </p>
                <p className="mb-6 text-lg leading-relaxed text-gray-600">
                  Founded with a vision to revolutionize business education in
                  Pakistan, we offer specialized courses in Business Studies,
                  Commerce, and Economics. Our curriculum is meticulously
                  designed to align with Cambridge International standards while
                  incorporating real-world business concepts.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <span className="text-gray-700">
                      Expert Cambridge-trained faculty with 10+ years of
                      experience
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <span className="text-gray-700">
                      Proven track record of outstanding examination results
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <span className="text-gray-700">
                      Modern facilities with fully air conditioned classrooms
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <span className="text-gray-700">
                      Comprehensive resources including past papers and study
                      materials
                    </span>
                  </div>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection>
              <div className="flex justify-center">
                <div className="flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl">
                  <Target className="h-32 w-32 text-white" />
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeInSection className="lg:order-2">
              <div>
                <Badge className="mb-4 border-primary-200 bg-primary-50 text-primary-700">
                  Our Vision
                </Badge>
                <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Building Tomorrow's Business Leaders
                </h2>
                <p className="mb-4 text-lg leading-relaxed text-gray-600">
                  Our vision is to be the most trusted and respected institution
                  for Cambridge business education in Pakistan. We aim to
                  produce graduates who are not just academically accomplished
                  but also equipped with critical thinking skills, ethical
                  values, and a global perspective.
                </p>
                <p className="mb-6 text-lg leading-relaxed text-gray-600">
                  We envision a future where Leadership Study System alumni lead
                  businesses, drive economic growth, and contribute meaningfully
                  to society. Through continuous improvement and innovation in
                  our teaching methods, we strive to set new benchmarks in
                  educational excellence.
                </p>
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-700">
                      5+
                    </div>
                    <div className="text-sm text-gray-500">
                      Years of Excellence
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-700">
                      1000+
                    </div>
                    <div className="text-sm text-gray-500">Students Taught</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-700">
                      95%
                    </div>
                    <div className="text-sm text-gray-500">Success Rate</div>
                  </div>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="lg:order-1">
              <div className="flex justify-center">
                <div className="flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 shadow-2xl">
                  <Eye className="h-32 w-32 text-white" />
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* CEO Message */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <Badge className="mb-4 border-primary-200 bg-primary-50 text-primary-700">
              Leadership Message
            </Badge>
          </FadeInSection>
          <FadeInSection>
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Message from Our CEO
            </h2>
          </FadeInSection>
          <div className="mx-auto max-w-4xl">
            <FadeInSection>
              <Card className="overflow-hidden border-0 shadow-xl">
                <CardContent className="p-8 sm:p-12">
                  <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                    <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800">
                      <Users className="h-16 w-16 text-white/60" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-xl font-bold text-gray-900">
                        Mr. Muzammil Ameer
                      </h3>
                      <p className="mb-4 font-medium text-primary-700">
                        Chief Executive Officer
                      </p>
                      <p className="leading-relaxed text-gray-600">
                        Education is not just about acquiring knowledge; it is
                        about shaping character, building confidence, and
                        preparing for the challenges of tomorrow. At Leadership
                        Study System, we are committed to providing an
                        educational experience that goes beyond textbooks. Our
                        dedicated team works tirelessly to ensure that every
                        student receives the guidance and support they need to
                        excel in Cambridge examinations and beyond. I invite you
                        to join us on this journey of academic excellence and
                        personal growth. Together, we can build a brighter
                        future for our students and our nation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ED Message */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <Badge className="mb-4 border-primary-200 bg-primary-50 text-primary-700">
              Executive Message
            </Badge>
          </FadeInSection>
          <FadeInSection>
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Message from Our Executive Director
            </h2>
          </FadeInSection>
          <div className="mx-auto max-w-4xl">
            <FadeInSection>
              <Card className="overflow-hidden border-0 shadow-xl">
                <CardContent className="p-8 sm:p-12">
                  <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                    <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800">
                      <Users className="h-16 w-16 text-white/60" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-xl font-bold text-gray-900">
                        Ms. Sana Muzammil
                      </h3>
                      <p className="mb-4 font-medium text-emerald-700">
                        Executive Director
                      </p>
                      <p className="leading-relaxed text-gray-600">
                        As an educator, I believe that every child possesses
                        unique talents waiting to be discovered and nurtured.
                        Our approach at Leadership Study System focuses on
                        understanding each student's individual learning style
                        and providing personalized support. We create an
                        environment where students feel safe to ask questions,
                        explore ideas, and develop a genuine love for learning.
                        Seeing our students grow into confident, capable
                        individuals is the greatest reward of our work. I
                        welcome you to experience the LSS difference.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-40 left-20 h-96 w-96 rounded-full bg-primary-400/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4">
          <FadeInSection>
            <Badge className="mb-4 border-primary-400/30 bg-primary-500/10 text-primary-300">
              By the Numbers
            </Badge>
          </FadeInSection>
          <FadeInSection>
            <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
              Our Impact in Numbers
            </h2>
          </FadeInSection>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <FadeInSection key={index}>
                <div className="group rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition duration-300 hover:border-primary-400/30 hover:bg-white/10">
                  <stat.icon className="mx-auto mb-4 h-10 w-10 text-primary-400" />
                  <p className="mb-1 text-3xl font-extrabold text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Students Choose Us */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <Badge className="mb-4 border-primary-200 bg-primary-50 text-primary-700">
              Why Students Choose Us
            </Badge>
          </FadeInSection>
          <FadeInSection>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              The LSS Advantage
            </h2>
          </FadeInSection>
          <FadeInSection>
            <p className="mb-12 max-w-2xl text-lg text-gray-600">
              Discover why students and parents trust us for Cambridge
              education.
            </p>
          </FadeInSection>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, index) => (
              <FadeInSection key={index}>
                <Card className="group h-full border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl">
                  <CardHeader>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <reason.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {reason.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-gray-600">
                      {reason.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 right-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <FadeInSection>
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              Ready to Join Our Community?
            </h2>
          </FadeInSection>
          <FadeInSection>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-100">
              Take the first step towards academic excellence. Enroll at
              Leadership Study System today.
            </p>
          </FadeInSection>
          <FadeInSection>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary-900 shadow-lg hover:bg-gray-100"
              >
                <Link to="/register">Register Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  );
}
