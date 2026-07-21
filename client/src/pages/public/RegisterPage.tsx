import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, FormEvent, useEffect } from 'react';
import {
  School,
  Mail,
  Phone,
  Lock,
  Building2,
  ChevronRight,
  CheckCircle,
  Users,
  Star,
  GraduationCap,
  ArrowRight,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type InstituteType = 'school' | 'academy' | 'both';

interface FormData {
  instituteName: string;
  email: string;
  password: string;
  phone: string;
  instituteType: InstituteType;
  agreeTerms: boolean;
}

const benefits = [
  {
    icon: Sparkles,
    title: '14-Day Free Trial',
    description: 'Full access to all premium features',
  },
  {
    icon: CheckCircle,
    title: 'No Credit Card',
    description: 'Required to get started',
  },
  {
    icon: UserCheck,
    title: 'Cancel Anytime',
    description: 'No questions asked',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Personal account manager',
  },
  {
    icon: Star,
    title: 'Regular Updates',
    description: 'New features every month',
  },
];

const testimonials = [
  {
    quote:
      'Transformed how we manage student performance and institutional data.',
    author: 'Dr. Sarah Mitchell',
    role: 'Principal, Riverside Academy',
    rating: 5,
  },
  {
    quote:
      'The analytics and reporting tools have been a game-changer for our curriculum planning.',
    author: 'James Chen',
    role: 'Director, Pacific Learning Institute',
    rating: 5,
  },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    instituteName: '',
    email: '',
    password: '',
    phone: '',
    instituteType: 'school',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleChange =
    (field: keyof FormData) =>
    (
      e: React.ChangeEvent<HTMLInputElement> | string,
    ) => {
      if (typeof e === 'string') {
        setFormData((prev) => ({ ...prev, [field]: e }));
      } else {
        const value =
          e.target.type === 'checkbox'
            ? e.target.checked
            : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    console.log('Registration Data:', formData);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const instituteTypes: {
    value: InstituteType;
    label: string;
    icon: typeof School;
    description: string;
  }[] = [
    {
      value: 'school',
      label: 'School',
      icon: School,
      description: 'K-12 or primary education',
    },
    {
      value: 'academy',
      label: 'Academy',
      icon: GraduationCap,
      description: 'Coaching or training center',
    },
    {
      value: 'both',
      label: 'Both',
      icon: Building2,
      description: 'Multiple institution types',
    },
  ];

  if (isSuccess) {
    return (
      <>
        <Helmet>
          <title>Registration Successful | LeadStudy</title>
        </Helmet>
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          </div>
          <Card className="relative w-full max-w-lg mx-4 bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl">
            <CardContent className="pt-12 pb-10 px-8 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-3">
                Registration Successful!
              </CardTitle>
              <p className="text-white/60 text-lg mb-2">
                Welcome to LeadStudy,{' '}
                <span className="text-white font-semibold">
                  {formData.instituteName}
                </span>
              </p>
              <p className="text-white/40 text-sm mb-8">
                We've sent a confirmation email to{' '}
                <span className="text-indigo-300">
                  {formData.email}
                </span>
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold text-base rounded-xl shadow-lg shadow-indigo-500/25"
                >
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/5"
                >
                  <Link to="/">Return to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Register Your Institute | LeadStudy</title>
      </Helmet>

      <div className="relative min-h-screen flex overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full grid lg:grid-cols-2">
          <div className="flex items-center justify-center p-6 lg:p-12">
            <div
              className={`w-full max-w-xl transition-all duration-700 ease-out ${
                visible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="mb-8">
                <Badge className="mb-4 bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-4 py-1.5 text-sm font-medium rounded-full">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                  Premium Registration
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
                  Register Your Institute
                </h1>
                <p className="text-white/50 text-base">
                  Join thousands of institutions already using
                  LeadStudy
                </p>
              </div>

              <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-black/20">
                <CardContent className="p-6 lg:p-8">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        Institute Name
                      </label>
                      <Input
                        placeholder="e.g. Riverside Academy"
                        value={formData.instituteName}
                        onChange={handleChange('instituteName')}
                        required
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-indigo-400" />
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="admin@institute.edu"
                          value={formData.email}
                          onChange={handleChange('email')}
                          required
                          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-indigo-400" />
                          Phone
                        </label>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={handleChange('phone')}
                          required
                          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-indigo-400" />
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange('password')}
                          required
                          minLength={8}
                          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl pr-12 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                        >
                          {showPassword ? (
                            <Lock className="w-5 h-5" />
                          ) : (
                            <Lock className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <School className="w-4 h-4 text-indigo-400" />
                        Institute Type
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {instituteTypes.map(({ value, label, icon: Icon, description }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              handleChange('instituteType')(value)
                            }
                            className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                              formData.instituteType === value
                                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 mb-2 ${
                                formData.instituteType === value
                                  ? 'text-indigo-400'
                                  : 'text-white/40'
                              }`}
                            />
                            <p
                              className={`text-sm font-semibold ${
                                formData.instituteType === value
                                  ? 'text-white'
                                  : 'text-white/70'
                              }`}
                            >
                              {label}
                            </p>
                            <p className="text-xs text-white/40 mt-0.5">
                              {description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={handleChange('agreeTerms')}
                        required
                        className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/30 focus:ring-offset-0"
                      />
                      <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                        I agree to the{' '}
                        <Link
                          to="/terms"
                          className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                        >
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                          to="/privacy"
                          className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    </label>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.agreeTerms}
                      className="w-full h-12 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:from-indigo-500/50 disabled:to-violet-500/50 text-white font-semibold text-base rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Create Account
                          <ChevronRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>

                    <p className="text-center text-sm text-white/40">
                      Already registered?{' '}
                      <Link
                        to="/login"
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        Sign in to your account
                      </Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-center p-12 lg:p-16 relative">
            <div
              className={`max-w-lg transition-all duration-700 delay-300 ease-out ${
                visible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-1.5 text-sm font-medium rounded-full">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                Why LeadStudy?
              </Badge>

              <h2 className="text-3xl font-bold text-white mb-3">
                Everything you need to manage your institution
              </h2>
              <p className="text-white/50 mb-10 text-base leading-relaxed">
                From student records to analytics, LeadStudy
                provides a complete platform for modern
                educational institutions.
              </p>

              <div className="space-y-4 mb-12">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all duration-200"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {benefit.title}
                        </p>
                        <p className="text-white/40 text-xs mt-0.5">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4">
                <div className="border-t border-white/10 pt-6">
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-5 font-medium">
                    Trusted by educational leaders
                  </p>
                </div>
                {testimonials.map((item, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: item.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-amber-400 fill-amber-400"
                          />
                        ),
                      )}
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed italic mb-3">
                      "{item.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white font-semibold text-xs">
                        {item.author
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {item.author}
                        </p>
                        <p className="text-white/40 text-xs">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
