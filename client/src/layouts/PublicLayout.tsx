import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, Phone, Instagram, Facebook, Youtube, MessageCircle, ChevronUp, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Our Services', href: '/services' },
  { label: 'Faculty', href: '/faculty' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
]

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      setShowTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5'
            : isHome
              ? 'bg-transparent'
              : 'bg-white/95 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg shadow-primary-700/20 group-hover:shadow-primary-700/40 transition-shadow">
                <span className="text-white font-bold text-base">LSS</span>
              </div>
              <span className={`font-bold text-lg hidden sm:block transition-colors ${scrolled || !isHome ? 'text-primary-800' : 'text-white'}`}>
                Leadership Study System
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.href
                      ? scrolled || !isHome
                        ? 'bg-primary-50 text-primary-700'
                        : 'bg-white/15 text-white'
                      : scrolled || !isHome
                        ? 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link to="/register">
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-lg font-medium border-2 transition-all ${
                    scrolled || !isHome
                      ? 'border-primary-600 text-primary-700 hover:bg-primary-600 hover:text-white'
                      : 'border-white/60 text-white hover:bg-white hover:text-primary-800'
                  }`}
                >
                  Register Now
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="sm"
                  className={`rounded-lg font-medium transition-all ${
                    scrolled || !isHome
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-700/25'
                      : 'bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25'
                  }`}
                >
                  <GraduationCap className="h-4 w-4 mr-1.5" />
                  Login
                </Button>
              </Link>
            </div>

            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled || !isHome ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className={`h-6 w-6 ${scrolled || !isHome ? 'text-gray-700' : 'text-white'}`} /> : <Menu className={`h-6 w-6 ${scrolled || !isHome ? 'text-gray-700' : 'text-white'}`} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.href ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-primary-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex gap-3">
                <Link to="/register" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-xl border-primary-600 text-primary-700">Register</Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button size="sm" className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700">Login</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="relative bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-800 font-bold text-lg">LSS</span>
                </div>
                <span className="font-bold text-lg">Leadership Study System</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                A leading institution that shapes innovative thinkers and responsible leaders in business and science.
              </p>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/mibsconnect" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 hover:text-blue-400 transition-all">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="https://www.instagram.com/mibs_edu/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 hover:text-pink-400 transition-all">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://www.youtube.com/@Mibsinstitute" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 hover:text-red-400 transition-all">
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-5 text-white/90">Quick Links</h4>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Our Services', href: '/services' },
                  { label: 'Faculty', href: '/faculty' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Registration', href: '/register' },
                  { label: 'Pricing', href: '/pricing' },
                ].map((l) => (
                  <Link key={l.href} to={l.href} className="block text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-5 text-white/90">Programs</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <p>LSS Playgroup till Pre-O Levels</p>
                <p>LSS O and A Level Academy</p>
                <p>Cambridge IGCSE</p>
                <p>Cambridge A Levels</p>
                <p>Online Tuition Programs</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-5 text-white/90">Contact Info</h4>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-400">Street No.14, Sector F-8/3</p>
                    <p className="text-gray-400">Islamabad, Pakistan</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <a href="tel:+923059079079" className="text-gray-400 hover:text-white transition-colors">+92 305 9079079</a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 rotate-45" />
                  </div>
                  <a href="mailto:info@leadershipstudysystem.pk" className="text-gray-400 hover:text-white transition-colors break-all">info@leadershipstudysystem.pk</a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Leadership Study System. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </footer>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-50 w-11 h-11 bg-primary-700 rounded-full flex items-center justify-center shadow-lg shadow-primary-700/30 hover:bg-primary-800 transition-all hover:scale-110"
        >
          <ChevronUp className="h-5 w-5 text-white" />
        </button>
      )}

      <a
        href="https://wa.me/923059079079"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-110 transition-all"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  )
}