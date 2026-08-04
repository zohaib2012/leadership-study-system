import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  Star,
  Shield,
  Users,
  Headphones,
  Server,
  Zap,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PricingPlan {
  name: string;
  subtitle: string;
  monthlyPrice: string;
  yearlyPrice: string;
  students: string;
  description: string;
  popular?: boolean;
  features: { name: string; included: boolean }[];
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Basic',
    subtitle: 'For small schools & academies',
    monthlyPrice: 'Rs 5,000',
    yearlyPrice: 'Rs 55,000',
    students: 'Up to 50 students',
    description: 'Everything you need to get started with digital school management.',
    features: [
      { name: 'Student Management', included: true },
      { name: 'Attendance Tracking', included: true },
      { name: 'Fee Management', included: true },
      { name: 'Homework System', included: true },
      { name: 'Exam Management', included: false },
      { name: 'SMS/Email Notifications', included: false },
      { name: 'Parent Portal', included: false },
      { name: 'Mobile App Access', included: false },
      { name: 'Custom Branding', included: false },
      { name: 'Dedicated Support', included: false },
      { name: 'API Access', included: false },
      { name: 'Analytics & Reports', included: false },
    ],
  },
  {
    name: 'Standard',
    subtitle: 'For growing institutions',
    monthlyPrice: 'Rs 10,000',
    yearlyPrice: 'Rs 110,000',
    students: 'Up to 200 students',
    description: 'Advanced tools to manage your growing institution effectively.',
    popular: true,
    features: [
      { name: 'Student Management', included: true },
      { name: 'Attendance Tracking', included: true },
      { name: 'Fee Management', included: true },
      { name: 'Homework System', included: true },
      { name: 'Exam Management', included: true },
      { name: 'SMS/Email Notifications', included: true },
      { name: 'Parent Portal', included: true },
      { name: 'Mobile App Access', included: false },
      { name: 'Custom Branding', included: false },
      { name: 'Dedicated Support', included: false },
      { name: 'API Access', included: false },
      { name: 'Analytics & Reports', included: false },
    ],
  },
  {
    name: 'Professional',
    subtitle: 'For large schools & chains',
    monthlyPrice: 'Rs 15,000',
    yearlyPrice: 'Rs 165,000',
    students: 'Up to 500 students',
    description: 'Complete solution with premium features and priority support.',
    features: [
      { name: 'Student Management', included: true },
      { name: 'Attendance Tracking', included: true },
      { name: 'Fee Management', included: true },
      { name: 'Homework System', included: true },
      { name: 'Exam Management', included: true },
      { name: 'SMS/Email Notifications', included: true },
      { name: 'Parent Portal', included: true },
      { name: 'Mobile App Access', included: true },
      { name: 'Custom Branding', included: true },
      { name: 'Dedicated Support', included: true },
      { name: 'API Access', included: false },
      { name: 'Analytics & Reports', included: false },
    ],
  },
  {
    name: 'Enterprise',
    subtitle: 'For districts & large chains',
    monthlyPrice: 'Custom',
    yearlyPrice: 'Custom',
    students: 'Unlimited students',
    description: 'Tailored solutions with enterprise-grade infrastructure.',
    features: [
      { name: 'Student Management', included: true },
      { name: 'Attendance Tracking', included: true },
      { name: 'Fee Management', included: true },
      { name: 'Homework System', included: true },
      { name: 'Exam Management', included: true },
      { name: 'SMS/Email Notifications', included: true },
      { name: 'Parent Portal', included: true },
      { name: 'Mobile App Access', included: true },
      { name: 'Custom Branding', included: true },
      { name: 'Dedicated Support', included: true },
      { name: 'API Access', included: true },
      { name: 'Analytics & Reports', included: true },
    ],
  },
];

const faqs = [
  {
    q: 'Can I switch plans later?',
    a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    q: 'Is there a free trial available?',
    a: 'Absolutely! We offer a 14-day free trial on all plans with no credit card required. Experience the full power of our platform risk-free.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, debit cards, bank transfers, and UPI payments. Enterprise customers can request invoice-based billing.',
  },
  {
    q: 'Do you offer training and onboarding?',
    a: 'All plans include basic onboarding. Standard and above include personalized training sessions. Enterprise plans come with dedicated account management.',
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

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Pricing - Leadership Study System</title>
        <meta name="description" content="Choose the perfect plan for your institution. Transparent pricing for schools and academies of all sizes." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 px-4 pb-16 pt-28 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] animate-pulse rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[600px] w-[600px] animate-pulse rounded-full bg-primary-700/10 blur-3xl" />
          <div className="absolute left-1/3 top-1/2 h-[400px] w-[400px] animate-pulse rounded-full bg-primary-400/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Badge className="mb-6 border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-primary-200 backdrop-blur-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Flexible Plans for Every Institution
          </Badge>
          <h1 className="mb-6 bg-gradient-to-r from-white via-primary-100 to-primary-200 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-primary-200/80">
            Choose the perfect plan for your institution. No hidden fees, no surprises. Scale as you grow.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm font-medium transition-colors ${yearly ? 'text-primary-200/60' : 'text-white'}`}>
              Monthly
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                yearly ? 'bg-primary-600' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  yearly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${yearly ? 'text-white' : 'text-primary-200/60'}`}>
              Yearly
              <Badge className="ml-1.5 bg-amber-500/20 px-1.5 py-0 text-xs text-amber-400">
                Save up to 15%
              </Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 -mt-8 bg-gradient-to-b from-gray-50 to-white px-4 pb-20 pt-8 dark:from-gray-900 dark:to-gray-900">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <FadeInSection key={plan.name}>
              <div className="relative h-full">
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary-600 to-primary-700 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                      <Star className="mr-1 h-3 w-3 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card
                  className={`h-full border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    plan.popular
                      ? 'relative ring-2 ring-primary-600'
                      : 'dark:bg-gray-800'
                  }`}
                >
                  <CardHeader className={`pb-4 text-center ${plan.popular ? 'bg-gradient-to-br from-primary-600 to-primary-700 rounded-t-lg' : ''}`}>
                    <CardTitle className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {plan.name}
                    </CardTitle>
                    <p className={`text-sm ${plan.popular ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {plan.subtitle}
                    </p>
                    <div className="mt-3">
                      <span className={`text-3xl font-extrabold ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        {plan.monthlyPrice === 'Custom' ? 'Custom' : yearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      {plan.monthlyPrice !== 'Custom' && (
                        <span className={`ml-1 text-sm ${plan.popular ? 'text-primary-200' : 'text-gray-400'}`}>
                          /{yearly ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    <div className={`mt-2 flex items-center justify-center gap-1 text-sm ${plan.popular ? 'text-primary-200' : 'text-primary-600 dark:text-primary-400'}`}>
                      <Users className="h-4 w-4" />
                      <span>{plan.students}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className={`mb-5 text-center text-sm ${plan.popular ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                      {plan.description}
                    </p>

                    <Button
                      asChild
                      className={`mb-6 w-full ${
                        plan.popular
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'border border-primary-200 bg-white text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:bg-gray-800 dark:text-primary-300 dark:hover:bg-gray-700'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      <Link to="/contact">
                        {plan.monthlyPrice === 'Custom' ? 'Contact Sales' : 'Get Started'}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 px-4 py-20 dark:bg-gray-800">
        <FadeInSection>
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Why Choose Leadership Study System?
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-gray-500 dark:text-gray-400">
            Built to empower educational institutions with modern tools.
          </p>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Shield className="h-7 w-7" />, title: 'Secure & Reliable', desc: 'Enterprise-grade security with 99.9% uptime guarantee.' },
              { icon: <Zap className="h-7 w-7" />, title: 'Lightning Fast', desc: 'Optimized performance for smooth day-to-day operations.' },
              { icon: <Headphones className="h-7 w-7" />, title: '24/7 Support', desc: 'Dedicated support team available round the clock.' },
              { icon: <Server className="h-7 w-7" />, title: 'Cloud Based', desc: 'Access from anywhere, anytime. No installation needed.' },
              { icon: <GraduationCap className="h-7 w-7" />, title: 'Easy to Use', desc: 'Intuitive interface designed for teachers and admin staff.' },
              { icon: <Users className="h-7 w-7" />, title: 'Scalable', desc: 'Grows with your institution from 50 to unlimited students.' },
            ].map((item) => (
              <Card key={item.title} className="border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg">
                    {item.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* FAQ */}
      <section className="bg-white px-4 py-20 dark:bg-gray-900">
        <FadeInSection>
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-gray-500 dark:text-gray-400">
            Got questions? We've got answers.
          </p>

          <div className="mx-auto max-w-2xl space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="cursor-pointer rounded-xl border border-gray-200 transition-all dark:border-gray-700"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between px-6 py-4">
                  <span className="font-medium text-gray-900 dark:text-white">{faq.q}</span>
                  <ChevronRight
                    className={`h-5 w-5 shrink-0 text-primary-600 transition-transform ${
                      openFaq === idx ? 'rotate-90' : ''
                    }`}
                  />
                </div>
                {openFaq === idx && (
                  <div className="border-t border-gray-100 px-6 pb-4 pt-3 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeInSection>
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
            Ready to Transform Your Institution?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-primary-100">
            Join thousands of institutions already using Leadership Study System. Start your free trial today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white px-8 py-6 text-base font-semibold text-primary-800 shadow-lg hover:bg-gray-100"
            >
              <Link to="/contact">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Link to="/contact">Talk to Sales</Link>
            </Button>
          </div>
        </FadeInSection>
      </section>
    </>
  );
}
