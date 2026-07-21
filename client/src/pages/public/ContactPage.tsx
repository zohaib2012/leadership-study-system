import { Helmet } from 'react-helmet-async';
import { useState, FormEvent, useEffect } from 'react';
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

const contactInfo: ContactInfo[] = [
  {
    icon: MapPin,
    label: 'Address',
    value: 'F-8/3, Islamabad',
    detail: 'Sector F-8, Capital Territory',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+92 305 9079079',
    detail: 'Mon-Fri 9am-6pm',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@leadershipstudysystem.pk',
    detail: 'We reply within 24 hours',
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: 'Monday - Friday',
    detail: '9:00 AM - 6:00 PM',
  },
];

const fadeInUp = (index: number) => ({
  opacity: 0,
  transform: 'translateY(30px)',
  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s`,
});

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            setVisible((prev) => new Set(prev).add(idx));
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('[data-observe]');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
        <meta
          name="description"
          content="Get in touch with Leadership Study System. Visit us in F-8/3 Islamabad, call +92 305 9079079, or email info@leadershipstudysystem.pk."
        />
      </Helmet>

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
          <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse [animation-delay:2s]" />
          <div className="absolute -bottom-32 left-1/4 w-[350px] h-[350px] rounded-full bg-emerald-400/5 blur-[100px] animate-pulse [animation-delay:4s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-500/3 to-blue-500/3 blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center mb-12 lg:mb-16" data-observe data-index={0}>
            <Badge className="mb-4 px-4 py-1.5 text-xs font-medium tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              Get In Touch
            </Badge>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
              style={{
                ...fadeInUp(0),
                ...(visible.has(0)
                  ? { opacity: 1, transform: 'translateY(0)' }
                  : {}),
              }}
            >
              Let's{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Connect
              </span>
            </h1>
            <p
              className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
              style={{
                ...fadeInUp(1),
                ...(visible.has(0)
                  ? { opacity: 1, transform: 'translateY(0)' }
                  : {}),
              }}
            >
              Have questions about our programs or leadership development
              opportunities? We're here to help you take the next step in your
              journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div
              className="lg:col-span-3"
              data-observe
              data-index={1}
              style={{
                ...fadeInUp(0),
                ...(visible.has(1)
                  ? { opacity: 1, transform: 'translateY(0)' }
                  : {}),
              }}
            >
              <Card className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden">
                <CardContent className="p-6 sm:p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Send us a Message
                      </h2>
                      <p className="text-sm text-slate-400">
                        Fill out the form and we'll get back to you
                      </p>
                    </div>
                  </div>

                  {submitted && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Message sent successfully! We'll respond within 24 hours.
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                          Full Name
                        </label>
                        <Input
                          placeholder="Your full name"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          required
                          className="h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          required
                          className="h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+92 300 1234567"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">
                        Message
                      </label>
                      <textarea
                        placeholder="Tell us about your inquiry..."
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all duration-300 resize-none outline-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 group"
                    >
                      <Send className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div
              className="lg:col-span-2 space-y-5"
              data-observe
              data-index={2}
              style={{
                ...fadeInUp(0),
                ...(visible.has(2)
                  ? { opacity: 1, transform: 'translateY(0)' }
                  : {}),
              }}
            >
              {contactInfo.map((item, index) => (
                <div
                  key={item.label}
                  data-observe
                  data-index={3 + index}
                  style={{
                    ...fadeInUp(0),
                    ...(visible.has(3 + index)
                      ? { opacity: 1, transform: 'translateY(0)' }
                      : {}),
                  }}
                >
                  <Card className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.06] transition-all duration-300 group">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/15 shrink-0 transition-transform duration-300 group-hover:scale-105">
                        <item.icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-white">
                          {item.value}
                        </p>
                        {item.detail && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.detail}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 ml-auto mt-1 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-400" />
                    </CardContent>
                  </Card>
                </div>
              ))}

              <div
                data-observe
                data-index={7}
                style={{
                  ...fadeInUp(0),
                  ...(visible.has(7)
                    ? { opacity: 1, transform: 'translateY(0)' }
                    : {}),
                }}
              >
                <Card className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden mt-5">
                  <CardContent className="p-0">
                    <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
                      <div className="relative text-center px-6">
                        <Building2 className="w-8 h-8 text-emerald-400/60 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">
                          F-8/3, Islamabad
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Capital Territory, Pakistan
                        </p>
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-500/40" />
                        <span className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">
                          Visit Us
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
