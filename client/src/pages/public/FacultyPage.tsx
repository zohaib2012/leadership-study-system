import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
import { Sparkles, School, GraduationCap, Users, BookOpen, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const campuses = [
  {
    icon: School,
    title: 'LSS School',
    accent: 'from-amber-500 to-orange-600',
    sections: [
      {
        heading: 'Leadership',
        members: [
          { name: 'Mr. Muzammil Ameer', role: 'Chief Executive Officer' },
          { name: 'Mr. Muhammad Ajmal Pervaiz', role: 'Executive Director' },
          { name: 'Ms. Sana Muzammil', role: 'Executive Director' },
        ],
      },
      {
        heading: 'Teachers',
        members: [
          { name: 'Ms. Ayesha Malik', role: 'Senior Teacher (Primary)', exp: '10+ Years Experience', qual: 'M.Ed' },
          { name: 'Mr. Usman Tariq', role: 'Teacher (Playgroup-KG)', exp: '6+ Years Experience', qual: 'B.Ed' },
          { name: 'Ms. Hira Shah', role: 'Teacher (Middle Section)', exp: '8+ Years Experience', qual: 'MA English' },
          { name: 'Ms. Rabia Noor', role: 'Teacher (Pre-O Level)', exp: '7+ Years Experience', qual: 'M.Sc Mathematics' },
        ],
      },
    ],
  },
  {
    icon: GraduationCap,
    title: 'LSS Academy',
    accent: 'from-blue-500 to-primary-700',
    sections: [
      {
        heading: 'Leadership',
        members: [
          { name: 'Mr. Muzammil Ameer', role: 'Chief Executive Officer' },
          { name: 'Mr. Muhammad Ajmal Pervaiz', role: 'Executive Director' },
          { name: 'Ms. Sana Muzammil', role: 'Executive Director' },
        ],
      },
      {
        heading: 'Academy Faculty',
        members: [
          { name: 'Muzammil Ameer', role: 'Cambridge Examiner & Senior Faculty', exp: '20+ Years Experience', qual: 'ACMA, AFPA, M.A.' },
          { name: 'Saeed Khan', role: 'Commerce & Business Faculty', exp: '15+ Years Experience', qual: 'MBA (Finance)' },
          { name: 'Sana Muzammil', role: 'Economics Faculty', exp: '12+ Years Experience', qual: 'M.Phil Economics' },
          { name: 'Muhammad Ajmal Pervaiz', role: 'Business Studies Faculty', exp: '18+ Years Experience', qual: 'ACCA' },
        ],
      },
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

export default function FacultyPage() {
  return (
    <>
      <Helmet>
        <title>Meet Our Leadership | Leadership Study System</title>
        <meta name="description" content="Meet the leadership and teaching teams of LSS School and LSS Academy at Leadership Study System." />
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
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Our Leadership & Teaching Teams
            </Badge>
          </FadeInSection>
          <FadeInSection>
            <h1 className="mb-6 bg-gradient-to-r from-white via-primary-100 to-primary-200 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
              Meet Our Leadership
            </h1>
          </FadeInSection>
          <FadeInSection>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-200/80">
              Discover the leadership and teachers guiding students across LSS School and LSS Academy.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* School vs Academy */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl space-y-14">
          {campuses.map((campus, idx) => {
            const Icon = campus.icon;
            return (
              <FadeInSection key={campus.title}>
                <Card className="overflow-hidden border border-gray-200 shadow-sm">
                  <div className={`bg-gradient-to-br ${campus.accent} px-6 py-8 text-white`}>
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold sm:text-3xl">{campus.title}</h2>
                        <p className="text-white/80 text-sm">{idx === 0 ? 'Playgroup till Pre O-Levels' : 'Cambridge IGCSE / O & A Levels'}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="space-y-10 p-8">
                    {campus.sections.map((section) => (
                      <div key={section.heading}>
                        <div className="mb-5 flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary-700" />
                          <h3 className="text-xl font-bold text-gray-900">{section.heading}</h3>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {section.members.map((m) => (
                            <div key={m.name} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                              <p className="font-semibold text-gray-900">{m.name}</p>
                              <p className="mt-0.5 text-sm font-medium text-primary-700">{m.role}</p>
                              {(m.exp || m.qual) && (
                                <div className="mt-3 space-y-1 text-xs text-gray-500">
                                  {m.exp && <p className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-gray-400" /> {m.exp}</p>}
                                  {m.qual && <p className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-gray-400" /> {m.qual}</p>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </FadeInSection>
            );
          })}
        </div>
      </section>
    </>
  );
}
