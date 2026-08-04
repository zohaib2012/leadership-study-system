import { Helmet } from 'react-helmet-async';
import { useState, FormEvent, useEffect, useRef } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ChevronRight,
  MessageSquare,
  Building2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContactInfo {
  icon: typeof MapPin;
  label: string;
  value: string;
  detail?: string;
}

const campusInfo = [
  {
    icon: Building2,
    name: 'LSS School',
    address: 'House F-767, Block F, Satellite Town, Rawalpindi',
    phone: '0334 5430644',
    phoneHref: 'tel:+923345430644',
    email: 'meetceo@lsseducation.com',
  },
  {
    icon: GraduationCap,
    name: 'LSS Academy',
    address: 'Street No.14, Sector F-8/3, Islamabad, Pakistan',
    phone: '+92 305 9079079',
    phoneHref: 'tel:+923059079079',
    email: 'meetceo@lsseducation.com',
  },
];

const contactInfo: ContactInfo[] = [
  { icon: Mail, label: 'Email', value: 'info@leadershipstudysystem.pk', detail: 'We reply within 24 hours' },
  { icon: Clock, label: 'Working Hours', value: 'Monday - Friday', detail: '9:00 AM - 6:00 PM' },
];

function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
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

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Leadership Study System</title>
        <meta name="description" content="Get in touch with Leadership Study System. Visit us at Street No.14, Sector F-8/3, Islamabad, Pakistan. Call +92 305 9079079 or email info@leadershipstudysystem.pk." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 px-4 pb-16 pt-28 lg:pt-36">
        <div className="absolute inset-0 opacity-25">
          <img
            src="/images/students-campus.jpg"
            alt="Leadership Study System campus in Islamabad"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] animate-pulse rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[600px] w-[600px] animate-pulse rounded-full bg-primary-700/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Badge className="mb-6 border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-primary-200 backdrop-blur-sm">
            <MessageSquare className="mr-2 h-3.5 w-3.5" />Get In Touch
          </Badge>
          <h1 className="mb-6 bg-gradient-to-r from-white via-primary-100 to-primary-200 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
            Let's Connect
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-200/80">
            Have questions about our programs or leadership development opportunities? We're here to help.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
            {/* Form */}
            <div className="lg:col-span-3">
              <FadeInSection>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                  <p className="mt-1 text-sm text-gray-500">Fill out the form below and we'll get back to you within 24 hours.</p>
                </div>

                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-6 sm:p-8">
                    {submitted && (
                      <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        Message sent successfully! We'll respond within 24 hours.
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Full Name</label>
                          <Input placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="h-11 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500/20" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Email Address</label>
                          <Input type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="h-11 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500/20" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <Input type="tel" placeholder="+92 300 1234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500/20" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Message</label>
                        <textarea placeholder="Tell us about your inquiry..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={4} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20" />
                      </div>

                      <Button type="submit" className="h-11 w-full rounded-lg bg-primary-600 font-semibold text-white shadow-sm hover:bg-primary-700">
                        <Send className="mr-2 h-4 w-4" />Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </FadeInSection>
            </div>

            {/* Info + Map */}
            <div className="space-y-5 lg:col-span-2">
              {campusInfo.map((item, index) => (
                <FadeInSection key={item.name}>
                  <Card className="group border border-gray-200 shadow-sm transition-all duration-200 hover:border-primary-200 hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100">
                          <item.icon className="h-5 w-5 text-primary-700" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-400">Visit Us</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                          <p className="text-sm text-gray-700">{item.address}</p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Phone className="h-4 w-4 shrink-0 text-primary-500" />
                          <a href={item.phoneHref} className="text-sm font-medium text-gray-900 hover:text-primary-700 transition-colors">
                            {item.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Mail className="h-4 w-4 shrink-0 text-primary-500" />
                          <a href={`mailto:${item.email}`} className="text-sm font-medium text-gray-900 hover:text-primary-700 transition-colors break-all">
                            {item.email}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}

              {contactInfo.map((item, index) => (
                <FadeInSection key={item.label}>
                  <Card className="group border border-gray-200 shadow-sm transition-all duration-200 hover:border-primary-200 hover:shadow-md">
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                        <item.icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                        {item.detail && <p className="mt-0.5 text-xs text-gray-500">{item.detail}</p>}
                      </div>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}

              {/* Map */}
              <FadeInSection>
                <Card className="overflow-hidden border border-gray-200 shadow-sm">
                  <div className="aspect-[4/3] w-full bg-gray-100">
                    <iframe
                      title="Leadership Study System Location"
                      src="https://www.openstreetmap.org/export/embed.html?bbox=73.0375%2C33.7150%2C73.0475%2C33.7250&amp;layer=mapnik&amp;marker=33.7200%2C73.0425"
                      width="100%" height="100%" style={{ border: 0 }}
                      allowFullScreen loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-1.5 border-t border-gray-100 px-4 py-2.5">
                    <MapPin className="h-3.5 w-3.5 text-primary-500" />
                    <span className="text-xs font-medium text-gray-500">Street No.14, Sector F-8/3, Islamabad, Pakistan</span>
                  </div>
                </Card>
              </FadeInSection>

              {/* Quick Contact */}
              <FadeInSection>
                <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4 text-center">
                  <p className="text-xs font-medium text-primary-700">Need immediate assistance?</p>
                  <a href="tel:+923059079079" className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-primary-800 hover:text-primary-900">
                    <Phone className="h-4 w-4" />+92 305 9079079
                  </a>
                </div>
              </FadeInSection>
            </div>
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
            <Sparkles className="mr-2 h-4 w-4" />Get Started Today
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Ready to Start Your Journey?</h2>
          <p className="mx-auto mb-8 max-w-xl text-primary-100">Take the first step towards academic excellence. Enroll at Leadership Study System today.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="tel:+923059079079">
              <Button size="lg" className="bg-white px-8 py-6 text-base font-semibold text-primary-800 shadow-lg hover:bg-gray-100">
                <Phone className="mr-2 h-5 w-5" />Call Us Now
              </Button>
            </a>
            <a href="mailto:info@leadershipstudysystem.pk">
              <Button size="lg" variant="outline" className="border-white/30 bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20">
                <Mail className="mr-2 h-5 w-5" />Email Us
              </Button>
            </a>
          </div>
        </FadeInSection>
      </section>
    </>
  );
};

export default ContactPage;
