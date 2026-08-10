import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  BookOpen,
  Building2,
  UserSearch,
  School,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const services = [
  {
    icon: School,
    title: 'PG Group to 8th Class School',
    description:
      'A nurturing academic environment for young learners from Playgroup through Pre O-Levels, building strong foundations.',
    features: [
      'Holistic early childhood curriculum',
      'Qualified and caring educators',
      'Focus on foundational literacy and numeracy',
      'Extracurricular activities and character development',
      'Smooth transition to higher grades',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Cambridge IGCSE and A Level Classes',
    description:
      'Comprehensive academic programs following the Cambridge International curriculum for both IGCSE and Advanced Level qualifications.',
    features: [
      'Expert Cambridge-certified instructors',
      'Small class sizes for personalized attention',
      'Regular progress assessments and feedback',
      'Exam preparation with past papers and mock tests',
      'Flexible scheduling options',
    ],
  },
  {
    icon: Building2,
    title: 'School ERP for Schools, Academies and Individuals',
    description:
      'A complete school management system for schools, academies, and individuals — admissions, fees, homework, timetable, results, and more.',
    features: [
      'Student admissions and registration management',
      'Fee challans, payments and ledger tracking',
      'Homework, timetable and attendance modules',
      'Results and report generation',
      'Teacher and staff management',
    ],
  },
  {
    icon: BookOpen,
    title: 'BTEC Program',
    description:
      'Professional guidance and support for students pursuing BTEC qualifications, from course selection to completion.',
    features: [
      'BTEC course selection advisory',
      'Assignment planning and review support',
      'Portfolio development assistance',
      'Regular progress tracking',
      'Career pathway guidance',
    ],
  },
  {
    icon: UserSearch,
    title: 'Find a Tutor',
    description:
      'Connect with qualified tutors across a wide range of subjects and academic levels for personalized learning.',
    features: [
      'Verified and experienced tutors',
      'Subject matching based on requirements',
      'Flexible online and in-person sessions',
      'Progress monitoring and reports',
      'Competitive and transparent pricing',
    ],
  },
];

function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
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
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {children}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Our Services | Leadership Study System</title>
        <meta
          name="description"
          content="Explore our comprehensive educational services including Cambridge IGCSE and A Level classes, BTEC guidance, university placements, admission test preparations, tutoring, and schooling from PG to Pre O-Levels."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-28 lg:pt-36">
        <div className="absolute inset-0">
          <img src="/images/classroom.jpg" alt="Classroom at Leadership Study System" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-primary-950/90 to-gray-900/85" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] animate-pulse rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[600px] w-[600px] animate-pulse rounded-full bg-primary-700/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Badge className="mb-6 border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-primary-200 backdrop-blur-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Comprehensive Educational Services
          </Badge>
          <h1 className="mb-6 bg-gradient-to-r from-white via-primary-100 to-primary-200 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
            Our Services
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-200/80">
            From early childhood education to university placement, we provide a complete ecosystem of academic
            support services designed to help every student reach their full potential.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <FadeInSection key={index}>
                  <Card className="h-full border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900">
                        {service.title}
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-gray-500">
                        {service.description}
                      </p>
                      <ul className="mb-6 mt-auto space-y-2">
                        {service.features.map((feature, fIdx) => (
                          <li
                            key={fIdx}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
                      >
                        Learn More
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photo Banner */}
      <section className="relative h-[380px] overflow-hidden">
        <img src="/images/students-study-group.jpg" alt="Students collaborating at Leadership Study System" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-4">
          <div className="max-w-xl rounded-2xl bg-white p-8 shadow-2xl">
            <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">Every Student Gets <span className="text-primary-700">Personal Attention</span></h2>
            <p className="text-gray-600 leading-relaxed">
              Small classes, one-on-one support, and a caring faculty ensure that no learner is left behind — from our youngest school students to ambitious A Level candidates.
            </p>
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
            <Sparkles className="mr-2 h-4 w-4" />
            Get Started Today
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to Begin Your Educational Journey?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-primary-100">
            Whether you need academic classes, test preparation, or university placement guidance,
            our team is here to support you every step of the way.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-white px-8 py-6 text-base font-semibold text-primary-800 shadow-lg hover:bg-gray-100"
              >
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
              >
                Learn About Us
              </Button>
            </Link>
          </div>
        </FadeInSection>
      </section>
    </>
  );
}
