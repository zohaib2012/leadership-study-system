import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  CheckCircle,
  XCircle,
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
    monthlyPrice: 'Rs 15,000',
    yearlyPrice: 'Rs 170,000',
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
    monthlyPrice: 'Rs 30,000',
    yearlyPrice: 'Rs 340,000',
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

const allFeatures = [
  'Student Management',
  'Attendance Tracking',
  'Fee Management',
  'Homework System',
  'Exam Management',
  'SMS/Email Notifications',
  'Parent Portal',
  'Mobile App Access',
  'Custom Branding',
  'Dedicated Support',
  'API Access',
  'Analytics & Reports',
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
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
      }}
    >
      {children}
    </div>
  );
}

function Orb({ size, color, top, left, delay }: { size: number; color: string; top: string; left: string; delay: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent)`,
        top,
        left,
        filter: 'blur(60px)',
        opacity: 0.4,
        animation: `float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: 'none',
      }}
    />
  );
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Pricing - Leadership Study System</title>
      </Helmet>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-border {
          position: relative;
          border-radius: 1rem;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(135deg, #f59e0b, #ec4899, #8b5cf6, #f59e0b);
          background-size: 300% 300%;
          animation: shimmer 4s ease infinite;
          z-index: -1;
        }
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '6rem 1rem 4rem', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
        <Orb size={500} color="rgba(139, 92, 246, 0.6)" top="-10%" left="-10%" delay={0} />
        <Orb size={400} color="rgba(236, 72, 153, 0.5)" top="20%" left="60%" delay={2} />
        <Orb size={350} color="rgba(245, 158, 11, 0.4)" top="70%" left="30%" delay={4} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Badge
            variant="outline"
            style={{
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#c4b5fd',
              padding: '0.4rem 1.2rem',
              borderRadius: 9999,
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={14} style={{ marginRight: 6 }} />
            Flexible Plans for Every Institution
          </Badge>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
            Simple, Transparent{' '}
            <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Pricing
            </span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#a5b4fc', maxWidth: 600, margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Choose the perfect plan for your institution. No hidden fees, no surprises. Scale as you grow.
          </p>

          {/* Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <span style={{ color: yearly ? '#94a3b8' : '#fff', fontWeight: yearly ? 400 : 600, transition: 'color 0.3s' }}>
              Monthly
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              style={{
                width: 52,
                height: 28,
                borderRadius: 9999,
                background: yearly ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'rgba(255,255,255,0.15)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.3s',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 3,
                  left: yearly ? 27 : 3,
                  transition: 'left 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              />
            </button>
            <span style={{ color: yearly ? '#fff' : '#94a3b8', fontWeight: yearly ? 600 : 400, transition: 'color 0.3s' }}>
              Yearly
              <Badge
                variant="secondary"
                style={{
                  marginLeft: 6,
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.5rem',
                }}
              >
                Save up to 15%
              </Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section
        style={{
          position: 'relative',
          zIndex: 2,
          marginTop: '-2rem',
          padding: '2rem 1rem 5rem',
          background: 'linear-gradient(180deg, #24243e 0%, #1a1a2e 50%, #0f0c29 100%)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            maxWidth: 1280,
            margin: '0 auto',
            alignItems: 'start',
          }}
        >
          {pricingPlans.map((plan) => (
            <FadeInSection key={plan.name}>
              <div className={plan.popular ? 'gradient-border' : ''} style={{ height: '100%' }}>
                <Card
                  className="glass-card"
                  style={{
                    height: '100%',
                    border: plan.popular ? 'none' : undefined,
                    position: 'relative',
                    overflow: 'visible',
                  }}
                >
                  {plan.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
                        color: '#fff',
                        padding: '0.3rem 1.2rem',
                        borderRadius: 9999,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Star size={12} fill="currentColor" />
                      Most Popular
                    </div>
                  )}

                  <CardHeader style={{ padding: '1.75rem 1.75rem 1rem', textAlign: 'center' }}>
                    <CardTitle style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.25rem' }}>
                      {plan.name}
                    </CardTitle>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>{plan.subtitle}</p>

                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                        {plan.monthlyPrice === 'Custom' ? 'Custom' : yearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      {plan.monthlyPrice !== 'Custom' && (
                        <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: 4 }}>
                          /{yearly ? 'year' : 'month'}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#818cf8', fontSize: '0.85rem' }}>
                      <Users size={14} />
                      <span>{plan.students}</span>
                    </div>
                  </CardHeader>

                  <CardContent style={{ padding: '1rem 1.75rem 1.75rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem', textAlign: 'center' }}>
                      {plan.description}
                    </p>

                    <Button
                      asChild
                      variant={plan.popular ? 'default' : 'outline'}
                      style={{
                        width: '100%',
                        marginBottom: '1.5rem',
                        background: plan.popular ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : undefined,
                        borderColor: plan.popular ? 'transparent' : 'rgba(139, 92, 246, 0.3)',
                        color: plan.popular ? '#fff' : '#c4b5fd',
                      }}
                    >
                      <Link to="/contact">
                        {plan.monthlyPrice === 'Custom' ? 'Contact Sales' : 'Get Started'}
                        <ChevronRight size={16} style={{ marginLeft: 6 }} />
                      </Link>
                    </Button>

                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {plan.features.map((f) => (
                        <li key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                          {f.included ? (
                            <CheckCircle size={16} color="#22c55e" style={{ flexShrink: 0 }} />
                          ) : (
                            <XCircle size={16} color="#475569" style={{ flexShrink: 0 }} />
                          )}
                          <span style={{ color: f.included ? '#e2e8f0' : '#475569' }}>{f.name}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section style={{ padding: '4rem 1rem', background: '#0f0c29' }}>
        <FadeInSection>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '0.5rem' }}>
            Compare Plans Side by Side
          </h2>
          <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '3rem', maxWidth: 500, margin: '0 auto 3rem' }}>
            Find the perfect fit for your institution's needs.
          </p>

          <div style={{ overflowX: 'auto', maxWidth: 1100, margin: '0 auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 12,
                overflow: 'hidden',
                minWidth: 640,
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>Feature</th>
                  {pricingPlans.map((p) => (
                    <th
                      key={p.name}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        color: p.popular ? '#fbbf24' : '#e2e8f0',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature) => (
                  <tr key={feature} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.9rem' }}>{feature}</td>
                    {pricingPlans.map((p) => {
                      const f = p.features.find((ff) => ff.name === feature);
                      return (
                        <td key={p.name} style={{ padding: '0.85rem', textAlign: 'center' }}>
                          {f?.included ? (
                            <CheckCircle size={18} color="#22c55e" style={{ margin: '0 auto' }} />
                          ) : (
                            <XCircle size={18} color="#475569" style={{ margin: '0 auto' }} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeInSection>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '5rem 1rem', background: 'linear-gradient(180deg, #0f0c29, #1a1a2e)' }}>
        <FadeInSection>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '3rem' }}>
            Why Choose Leadership Study System?
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              maxWidth: 1100,
              margin: '0 auto',
            }}
          >
            {[
              { icon: <Shield size={28} />, title: 'Secure & Reliable', desc: 'Enterprise-grade security with 99.9% uptime guarantee.' },
              { icon: <Zap size={28} />, title: 'Lightning Fast', desc: 'Optimized performance for smooth day-to-day operations.' },
              { icon: <Headphones size={28} />, title: '24/7 Support', desc: 'Dedicated support team available round the clock.' },
              { icon: <Server size={28} />, title: 'Cloud Based', desc: 'Access from anywhere, anytime. No installation needed.' },
              { icon: <GraduationCap size={28} />, title: 'Easy to Use', desc: 'Intuitive interface designed for teachers and admin staff.' },
              { icon: <Users size={28} />, title: 'Scalable', desc: 'Grows with your institution from 50 to unlimited students.' },
            ].map((item) => (
              <div key={item.title} className="glass" style={{ padding: '1.75rem', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ color: '#818cf8', marginBottom: '1rem', display: 'inline-flex' }}>{item.icon}</div>
                <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.05rem' }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* FAQ */}
      <section style={{ padding: '5rem 1rem', background: '#0f0c29' }}>
        <FadeInSection>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '0.5rem' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '3rem' }}>
            Got questions? We've got answers.
          </p>

          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass"
                style={{ borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#e2e8f0',
                    fontWeight: 500,
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    size={18}
                    style={{
                      transform: openFaq === idx ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                      flexShrink: 0,
                      color: '#818cf8',
                    }}
                  />
                </div>
                {openFaq === idx && (
                  <div style={{ padding: '0 1.5rem 1.25rem', color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 1rem', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', textAlign: 'center' }}>
        <FadeInSection>
          <Badge
            variant="outline"
            style={{
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#c4b5fd',
              padding: '0.4rem 1.2rem',
              borderRadius: 9999,
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} style={{ marginRight: 6 }} />
            Get Started Today
          </Badge>

          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Ready to Transform Your Institution?
          </h2>
          <p style={{ color: '#a5b4fc', maxWidth: 500, margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Join thousands of institutions already using Leadership Study System. Start your free trial today.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              asChild
              size="lg"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 2rem',
              }}
            >
              <Link to="/contact">
                Start Free Trial
                <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              style={{
                borderColor: 'rgba(139, 92, 246, 0.4)',
                color: '#c4b5fd',
                padding: '0.75rem 2rem',
              }}
            >
              <Link to="/contact">Talk to Sales</Link>
            </Button>
          </div>
        </FadeInSection>
      </section>
    </>
  );
}
