import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
import { Users, Quote, GraduationCap, Award, Sparkles, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const facultyData = [
  {
    id: 1,
    name: 'Mr. Muhammad Ajmal Pervaiz',
    role: 'Executive Director',
    bio: 'Visionary leader with decades of experience in educational administration and strategic institutional development.',
    stats: { experience: '25+ Years', courses: '500+', students: '10,000+' },
  },
  {
    id: 2,
    name: 'Mr. Muzammil Ameer',
    role: 'Chief Executive Officer',
    bio: 'Dynamic CEO driving innovation in leadership education with a passion for empowering the next generation of leaders.',
    stats: { experience: '20+ Years', courses: '400+', students: '8,000+' },
  },
  {
    id: 3,
    name: 'Ms. Sana Muzammil',
    role: 'Executive Director',
    bio: 'Dedicated executive director focused on curriculum excellence and fostering inclusive learning environments.',
    stats: { experience: '15+ Years', courses: '300+', students: '6,000+' },
  },
];

const statsData = [
  { icon: Users, value: '24,000+', label: 'Students Taught' },
  { icon: GraduationCap, value: '1,200+', label: 'Courses Delivered' },
  { icon: Award, value: '60+', label: 'Years Combined Experience' },
  { icon: BookOpen, value: '50+', label: 'Programs Offered' },
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

export default function FacultyPage() {
  return (
    <>
      <Helmet>
        <title>Our Faculty | Leadership Study System</title>
        <meta name="description" content="Meet our distinguished faculty members at Leadership Study System." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 px-4 pb-16 pt-28 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] animate-pulse rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[600px] w-[600px] animate-pulse rounded-full bg-primary-700/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Badge className="mb-6 border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-primary-200 backdrop-blur-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Our Expert Team
          </Badge>
          <h1 className="mb-6 bg-gradient-to-r from-white via-primary-100 to-primary-200 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
            Meet Our Faculty
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-200/80">
            World-class educators and industry leaders dedicated to shaping the leaders of tomorrow
            through innovative teaching and mentorship.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white px-4 pb-4 pt-12">
        <div className="mx-auto max-w-5xl">
          <FadeInSection>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {statsData.map((stat, idx) => (
                <Card key={idx} className="border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="flex flex-col items-center p-5 text-center">
                    <div className="mb-2 rounded-full bg-gradient-to-br from-primary-500/10 to-primary-600/10 p-2.5">
                      <stat.icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                    <span className="mt-0.5 text-xs text-gray-500">{stat.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Faculty Cards */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {facultyData.map((member) => (
              <FadeInSection key={member.id}>
                <Card className="h-full border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="bg-gradient-to-br from-primary-600 to-primary-800 px-6 pb-14 pt-8">
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-center text-lg font-bold text-white">{member.name}</h3>
                      <p className="mt-0.5 text-center text-sm font-medium text-white/80">{member.role}</p>
                    </div>
                  </div>
                  <CardContent className="relative -mt-8 rounded-t-2xl bg-white pb-5 pt-6">
                    <div className="mb-4 flex items-start gap-2 px-1">
                      <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 rotate-180 text-primary-400/50" />
                      <p className="text-sm leading-relaxed text-gray-600">{member.bio}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-2.5">
                      {Object.entries(member.stats).map(([key, val]) => (
                        <div key={key} className="text-center">
                          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">{key}</span>
                          <span className="block text-sm font-bold text-gray-800">{val}</span>
                        </div>
                      ))}
                    </div>
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
            <Sparkles className="mr-2 h-4 w-4" />
            Join Us Today
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to Learn from the Best?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-primary-100">
            Join thousands of students who have transformed their careers through our expert-led programs.
          </p>
          <button className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
            <BookOpen className="h-5 w-5" />
            Explore Programs
          </button>
        </FadeInSection>
      </section>
    </>
  );
}
