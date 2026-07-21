import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Calendar, ChevronRight, Clock, User, ArrowRight, Sparkles, BookOpen, GraduationCap, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const posts = [
  {
    slug: 'why-choose-igcse-for-your-child',
    title: 'Why Choose IGCSE for Your Child?',
    excerpt: 'Discover the benefits of the Cambridge IGCSE curriculum and why it is the preferred choice for parents seeking a globally recognized qualification for their children.',
    date: 'June 15, 2025',
    author: 'Mr. Muzammil Ameer',
    readTime: '5 min read',
    category: 'Education',
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    slug: 'a-level-preparation-tips',
    title: 'A-Level Preparation Tips for Success',
    excerpt: 'Expert tips and strategies to help you excel in your Cambridge A Level examinations. From study schedules to past paper practice, we cover everything you need.',
    date: 'May 28, 2025',
    author: 'Mr. Saeed Khan',
    readTime: '7 min read',
    category: 'Exam Tips',
    gradient: 'from-emerald-500 to-emerald-700',
  },
  {
    slug: 'online-vs-in-person-learning',
    title: 'Online vs In-Person Learning: Which is Right for You?',
    excerpt: 'A comprehensive comparison of online and in-person learning modes to help students and parents make informed decisions about their education.',
    date: 'May 10, 2025',
    author: 'Ms. Sana Muzammil',
    readTime: '6 min read',
    category: 'Learning',
    gradient: 'from-violet-500 to-violet-700',
  },
  {
    slug: 'business-studies-career-paths',
    title: 'Career Paths with Business Studies',
    excerpt: 'Explore the diverse career opportunities available to students who pursue Business Studies at IGCSE and A Level. From entrepreneurship to finance.',
    date: 'April 22, 2025',
    author: 'Mr. Muzammil Ameer',
    readTime: '8 min read',
    category: 'Career',
    gradient: 'from-amber-500 to-amber-700',
  },
  {
    slug: 'tips-for-parents',
    title: 'Tips for Parents Supporting Exam Preparation',
    excerpt: 'How parents can actively support their children during exam season with practical strategies for creating a positive study environment at home.',
    date: 'March 18, 2025',
    author: 'Ms. Sana Muzammil',
    readTime: '6 min read',
    category: 'Parents',
    gradient: 'from-rose-500 to-rose-700',
  },
  {
    slug: 'importance-of-extra-curricular',
    title: 'The Importance of Extra-Curricular Activities',
    excerpt: 'Why extra-curricular activities are essential for holistic student development and how they complement academic learning for well-rounded growth.',
    date: 'February 20, 2025',
    author: 'Mr. Muhammad Ajmal Pervaiz',
    readTime: '5 min read',
    category: 'Development',
    gradient: 'from-cyan-500 to-cyan-700',
  },
]

const categories = ['All', 'Education', 'Exam Tips', 'Learning', 'Career', 'Parents', 'Development']

function FadeInSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [visible, setVisible] = useState(false)
  const ref = (node: HTMLDivElement | null) => {
    if (node && !visible) {
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
        { threshold: 0.1 }
      )
      observer.observe(node)
    }
  }

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  )
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredPosts = activeCategory === 'All' ? posts : posts.filter((p) => p.category === activeCategory)

  return (
    <>
      <Helmet>
        <title>Blog | Leadership Study System</title>
        <meta name="description" content="Read expert insights on Cambridge education, exam preparation tips, career guidance, and more from Leadership Study System." />
      </Helmet>

      <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-16 lg:pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[128px] animate-pulse animation-delay-2000" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-violet-500 rounded-full blur-[128px] animate-pulse animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              Insights & Resources
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-blue-300 via-white to-blue-200 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
              Expert insights, tips, and resources to help students, parents, and educators
              navigate the world of Cambridge education.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-primary-700 text-white shadow-lg shadow-primary-700/30 scale-105'
                      : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 border border-gray-200 hover:border-primary-200'
                  }`}
                >
                  {cat !== 'All' && <Tag className="h-3.5 w-3.5" />}
                  {cat}
                </button>
              ))}
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, i) => (
              <FadeInSection key={post.slug}>
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group h-full flex flex-col">
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className={`h-48 bg-gradient-to-br ${post.gradient} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                      <div className="absolute -inset-1 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative transform group-hover:scale-105 transition-transform duration-500">
                        <BookOpen className="h-14 w-14 text-white/30" />
                      </div>
                      <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800 hover:bg-white shadow-lg">
                        {post.category}
                      </Badge>
                    </div>
                  </Link>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-300">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {post.author}
                      </span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center text-primary-700 font-medium text-sm group/link"
                      >
                        Read More
                        <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <FadeInSection>
              <div className="text-center py-20">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-500">No blog posts available in this category yet.</p>
              </div>
            </FadeInSection>
          )}
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-primary-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-blue-500 rounded-full blur-[128px]" />
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeInSection>
            <Badge className="mb-6 px-4 py-1.5 bg-white/10 text-white border-white/20">
              <GraduationCap className="h-4 w-4 mr-1.5 inline" /> Stay Updated
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-blue-100/70 mb-8 max-w-lg mx-auto">
              Get the latest tips, resources, and updates from Leadership Study System delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-blue-200/50 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-0"
              />
              <Button className="h-12 px-6 rounded-xl bg-white text-primary-800 hover:bg-blue-50 font-semibold flex-shrink-0 group">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  )
}
