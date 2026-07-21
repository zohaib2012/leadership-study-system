import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
import { Facebook, Twitter, Youtube, Users, Quote, GraduationCap, Award, Sparkles, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const facultyData = [
  {
    id: 1,
    name: 'Mr. Muhammad Ajmal Pervaiz',
    role: 'Executive Director',
    gradient: 'from-blue-600 to-blue-800',
    bio: 'Visionary leader with decades of experience in educational administration and strategic institutional development.',
    stats: { experience: '25+ Years', courses: '500+', students: '10,000+' },
    socials: { facebook: '#', twitter: '#', youtube: '#' },
  },
  {
    id: 2,
    name: 'Mr. Muzammil Ameer',
    role: 'Chief Executive Officer',
    gradient: 'from-primary-600 to-primary-800',
    bio: 'Dynamic CEO driving innovation in leadership education with a passion for empowering the next generation of leaders.',
    stats: { experience: '20+ Years', courses: '400+', students: '8,000+' },
    socials: { facebook: '#', twitter: '#', youtube: '#' },
  },
  {
    id: 3,
    name: 'Ms. Sana Muzammil',
    role: 'Executive Director',
    gradient: 'from-emerald-600 to-emerald-800',
    bio: 'Dedicated executive director focused on curriculum excellence and fostering inclusive learning environments.',
    stats: { experience: '15+ Years', courses: '300+', students: '6,000+' },
    socials: { facebook: '#', twitter: '#', youtube: '#' },
  },
];

const statsData = [
  { icon: Users, value: '24,000+', label: 'Students Taught' },
  { icon: GraduationCap, value: '1,200+', label: 'Courses Delivered' },
  { icon: Award, value: '60+', label: 'Years Combined Experience' },
  { icon: BookOpen, value: '50+', label: 'Programs Offered' },
];

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView(0.15);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function FacultyPage() {
  return (
    <>
      <Helmet>
        <title>Our Faculty | Leadership Study System</title>
        <meta name="description" content="Meet our distinguished faculty members at Leadership Study System." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 lg:py-32">
        {/* Animated Orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-32 top-1/3 h-80 w-80 animate-pulse rounded-full bg-emerald-500/10 blur-3xl [animation-delay:1s]" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 animate-pulse rounded-full bg-primary-500/10 blur-3xl [animation-delay:2s]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 backdrop-blur-sm">
              <Sparkles className="mr-2 inline-block h-4 w-4" />
              Our Expert Team
            </Badge>
            <h1 className="bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl lg:text-6xl">
              Meet Our Faculty
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              World-class educators and industry leaders dedicated to shaping the leaders of tomorrow through
              innovative teaching and mentorship.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950" />
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {statsData.map((stat, idx) => (
              <AnimatedSection key={idx}>
                <Card className="group border-none bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/50 dark:bg-slate-800/80 dark:shadow-slate-900/50 dark:hover:shadow-slate-700/50">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-3 rounded-full bg-gradient-to-br from-blue-500/10 to-emerald-500/10 p-3 ring-1 ring-slate-200/50 transition-all duration-300 group-hover:scale-110 group-hover:from-blue-500/20 group-hover:to-emerald-500/20 dark:ring-slate-700/50">
                      <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</span>
                    <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</span>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Cards Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {facultyData.map((member) => (
              <AnimatedSection key={member.id}>
                <Card className="group h-full overflow-hidden border-none bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-800">
                  {/* Gradient Header */}
                  <div className={`relative bg-gradient-to-br ${member.gradient} px-6 pb-16 pt-10`}>
                    <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
                    <div className="absolute bottom-0 left-0 h-16 w-16 -translate-x-4 translate-y-4 rounded-full bg-white/5" />
                    <div className="relative flex flex-col items-center">
                      <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-white/30">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-center text-xl font-bold text-white">{member.name}</h3>
                      <p className="mt-1 text-center text-sm font-medium text-white/80">{member.role}</p>
                    </div>
                  </div>

                  <CardContent className="relative -mt-8 rounded-t-2xl bg-white pb-6 pt-8 dark:bg-slate-800">
                    {/* Quote / Bio */}
                    <div className="mb-6 flex items-start gap-2 px-2">
                      <Quote className="mt-1 h-4 w-4 flex-shrink-0 rotate-180 text-blue-500/40" />
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{member.bio}</p>
                    </div>

                    {/* Mini Stats */}
                    <div className="mb-6 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
                      {Object.entries(member.stats).map(([key, val]) => (
                        <div key={key} className="text-center">
                          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {key}
                          </span>
                          <span className="block text-sm font-bold text-slate-800 dark:text-white">{val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-3">
                      <a
                        href={member.socials.facebook}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/25 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-blue-600 dark:hover:text-white"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                      <a
                        href={member.socials.twitter}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-300 hover:bg-sky-500 hover:text-white hover:shadow-lg hover:shadow-sky-500/25 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-sky-500 dark:hover:text-white"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                      <a
                        href={member.socials.youtube}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-300 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/25 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-red-600 dark:hover:text-white"
                      >
                        <Youtube className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 py-16">
        <AnimatedSection>
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to Learn from the Best?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Join thousands of students who have transformed their careers through our expert-led programs.
            </p>
            <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
              <BookOpen className="h-5 w-5" />
              Explore Programs
            </button>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
