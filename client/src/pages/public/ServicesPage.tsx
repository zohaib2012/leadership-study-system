import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Building2,
  FileText,
  UserSearch,
  School,
  ChevronRight,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const services = [
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
    icon: BookOpen,
    title: 'BTEC Guidance',
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
    icon: Building2,
    title: 'International and Local Universities Placements Guidance',
    description:
      'End-to-end university placement services helping students secure admissions at top institutions worldwide.',
    features: [
      'University shortlisting based on profile',
      'Application essay and SOP assistance',
      'Interview preparation sessions',
      'Scholarship and financial aid guidance',
      'Visa application support',
    ],
  },
  {
    icon: FileText,
    title: 'University Admission Test Preparations',
    description:
      'Targeted preparation programs for university admission tests including SAT, ACT, IELTS, TOEFL, and more.',
    features: [
      'Comprehensive test strategy sessions',
      'Full-length practice tests with analysis',
      'Weakness identification and improvement plans',
      'Time management techniques',
      'One-on-one coaching available',
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
  {
    icon: School,
    title: 'PG till Pre O-Levels School',
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
];

function useScrollReveal() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            setVisibleItems((prev) => new Set(prev).add(idx));
          }
        }
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('[data-index]');
    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return visibleItems;
}

export default function ServicesPage() {
  const visibleItems = useScrollReveal();

  return (
    <>
      <Helmet>
        <title>Our Services | Leadership Study System</title>
        <meta
          name="description"
          content="Explore our comprehensive educational services including Cambridge IGCSE and A Level classes, BTEC guidance, university placements, admission test preparations, tutoring, and schooling from PG to Pre O-Levels."
        />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pb-20 pt-28 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] animate-pulse rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[600px] w-[600px] animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute left-1/3 top-1/2 h-[400px] w-[400px] animate-pulse rounded-full bg-cyan-500/5 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-indigo-200 backdrop-blur-sm">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Comprehensive Educational Services
            </Badge>
            <h1 className="mb-6 bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
              Our Services
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-indigo-200/80">
              From early childhood education to university placement, we provide
              a complete ecosystem of academic support services designed to help
              every student reach their full potential.
            </p>
          </div>
        </div>
      </section>

      <section className="relative -mt-12 pb-24 pt-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isVisible = visibleItems.has(index);

              return (
                <div
                  key={index}
                  data-index={index}
                  className={`group relative transform-gpu transition-all duration-700 ease-out ${
                    isVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-indigo-400/20 via-purple-400/10 to-transparent opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-indigo-400/40 via-purple-400/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <Card className="relative h-full overflow-hidden border-white/10 bg-white/5 shadow-xl shadow-black/5 backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-400/30 group-hover:shadow-indigo-500/10 group-hover:shadow-2xl">
                    <CardContent className="flex h-full flex-col p-8">
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 ring-1 ring-white/10 transition-all duration-500 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 group-hover:ring-indigo-400/30">
                        <Icon className="h-7 w-7 text-indigo-300 transition-colors duration-500 group-hover:text-indigo-200" />
                      </div>
                      <h3 className="mb-3 text-xl font-semibold text-white">
                        {service.title}
                      </h3>
                      <p className="mb-6 text-sm leading-relaxed text-indigo-200/70">
                        {service.description}
                      </p>
                      <ul className="mb-8 mt-auto space-y-2.5">
                        {service.features.map((feature, fIdx) => (
                          <li
                            key={fIdx}
                            className="flex items-start gap-3 text-sm text-indigo-200/60"
                          >
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/contact"
                        className="group/link mt-2 inline-flex items-center gap-2 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                      >
                        Learn More
                        <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/30 to-transparent" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/40 shadow-2xl shadow-indigo-500/5">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
            </div>
            <div className="relative px-8 py-16 text-center md:px-16">
              <Badge className="mb-4 border-indigo-400/20 bg-indigo-500/10 text-indigo-200">
                Get Started Today
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Ready to Begin Your Educational Journey?
              </h2>
              <p className="mb-8 mx-auto max-w-2xl text-indigo-200/70">
                Whether you need academic classes, test preparation, or
                university placement guidance, our team is here to support you
                every step of the way.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/contact">
                  <Button className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 text-base font-medium text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-400 hover:to-purple-500 hover:shadow-xl hover:shadow-indigo-500/30">
                    <span className="relative z-10 flex items-center gap-2">
                      Contact Us
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    variant="outline"
                    className="border-white/10 bg-white/5 px-8 py-6 text-base font-medium text-indigo-200 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-white"
                  >
                    Learn About Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
