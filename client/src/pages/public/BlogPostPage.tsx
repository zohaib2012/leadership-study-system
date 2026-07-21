import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin, ChevronRight, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BlogPost {
  title: string
  date: string
  author: string
  readTime: string
  category: string
  content: string[]
}

const blogPosts: Record<string, BlogPost> = {
  'why-choose-igcse-for-your-child': {
    title: 'Why Choose IGCSE for Your Child?',
    date: 'June 15, 2025',
    author: 'Mr. Muzammil Ameer',
    readTime: '5 min read',
    category: 'Education',
    content: [
      'The Cambridge IGCSE is one of the most respected and internationally recognized qualifications for students aged 14 to 16. With a curriculum that emphasizes critical thinking, independent research, and practical application of knowledge, IGCSE prepares students not just for exams, but for lifelong learning and success in higher education.',
      'One of the most compelling reasons to choose IGCSE is its global recognition. Universities and employers around the world value this qualification because it reflects a rigorous academic standard. Whether your child aspires to study at a local university or pursue education abroad, the IGCSE provides a strong and credible foundation that opens doors everywhere.',
      'Unlike traditional educational systems that rely heavily on rote memorization, IGCSE encourages students to think analytically and solve problems creatively. Subjects like Business Studies (0450) require students to apply theoretical concepts to real-world business scenarios, developing skills that are directly transferable to university and professional life.',
      'At Leadership Study System, we offer specialized coaching for Cambridge IGCSE Business Studies. Our experienced faculty provides personalized attention, comprehensive study materials, and regular progress assessments. We ensure that every student thoroughly understands the syllabus and is well-prepared to excel in their examinations.',
      'The flexibility of the IGCSE curriculum is another major advantage. Students can choose from a wide array of subjects, allowing them to tailor their education according to their interests and career aspirations. This breadth of choice helps maintain student engagement and motivation throughout their academic journey.',
      'Furthermore, the assessment structure of IGCSE is balanced and fair. Students are evaluated through written examinations, coursework, and practical assessments, ensuring a holistic measurement of their abilities. This multi-dimensional approach to assessment reduces the pressure of a single final exam and rewards consistent effort throughout the course.',
    ],
  },
  'a-level-preparation-tips': {
    title: 'A-Level Preparation Tips for Success',
    date: 'May 28, 2025',
    author: 'Mr. Saeed Khan',
    readTime: '7 min read',
    category: 'Exam Tips',
    content: [
      'Preparing for Cambridge A Level examinations requires a strategic approach, unwavering dedication, and the right guidance. As an experienced A Level Business (9609) educator at Leadership Study System, I have guided hundreds of students to achieve outstanding results. Here are my proven strategies for A Level success.',
      'The first and most crucial step is creating a structured study plan. A Level syllabi are extensive, and without a well-organized schedule, it is easy to fall behind. Break your syllabus into manageable topics, assign specific time blocks for each, and set weekly targets. Consistency is far more effective than last-minute cramming.',
      'Past paper practice is the single most effective preparation tool. Working through past papers from the last five to seven years helps you understand the exam format, question patterns, and marking schemes. At LSS, we conduct regular past paper sessions where students practice under timed conditions and receive detailed feedback on their answers.',
      'Understanding command words is essential for maximizing your marks. Words like "analyze," "evaluate," "discuss," and "to what extent" each require a specific approach in your answer. Learning to recognize and respond appropriately to these terms can significantly improve your exam performance and help you structure your arguments effectively.',
      'Do not underestimate the value of collaborative learning. Form study groups with classmates to discuss complex topics, debate different perspectives, and test each other\'s understanding. Teaching a concept to someone else is one of the most effective ways to solidify your own knowledge and identify gaps in your understanding.',
      'Finally, prioritize your physical and mental well-being. Aim for seven to eight hours of quality sleep each night, maintain a balanced diet, and incorporate regular physical activity into your routine. A healthy mind and body are essential for optimal cognitive function, memory retention, and sustained focus during long study sessions.',
    ],
  },
  'online-vs-in-person-learning': {
    title: 'Online vs In-Person Learning: Which is Right for You?',
    date: 'May 10, 2025',
    author: 'Ms. Sana Muzammil',
    readTime: '6 min read',
    category: 'Learning',
    content: [
      'The landscape of education has transformed dramatically in recent years, with online learning emerging as a powerful and viable alternative to traditional classroom instruction. At Leadership Study System, we offer both online and in-person classes, and I frequently help parents and students determine which mode best suits their needs.',
      'In-person learning offers irreplaceable benefits. The physical classroom environment fosters direct, face-to-face interaction between students and teachers, enabling immediate feedback and spontaneous discussion. Our F-8/3 campus in Islamabad provides a dedicated, distraction-free learning space equipped with all necessary resources, where students can build meaningful relationships with peers and instructors.',
      'The social dimension of in-person learning is equally valuable. Group discussions, collaborative projects, and peer-to-peer learning happen organically in a classroom setting. These interactions help develop essential communication and interpersonal skills that are vital for success in university and professional environments.',
      'Online learning, however, offers flexibility that traditional classrooms cannot match. Students can attend live classes from anywhere, eliminating commute time and allowing for a more personalized schedule. This is especially beneficial for students with extracurricular commitments, health considerations, or those living in areas without easy access to quality educational institutions.',
      'Our online classes are designed to be just as engaging and interactive as our in-person sessions. We use professional virtual classroom tools featuring screen sharing, digital whiteboards, real-time polling, and breakout rooms for group work. Attendance is monitored, and participation is actively encouraged to maintain high levels of student engagement.',
      'Many students find that a hybrid approach works best — attending in-person classes for core subjects while supplementing with online sessions for revision and extra practice. At LSS, we remain flexible and work with each family to find the optimal arrangement. The most important factor is choosing the environment where your child will thrive academically and personally.',
    ],
  },
  'business-studies-career-paths': {
    title: 'Top Career Paths After Business Studies',
    date: 'April 22, 2025',
    author: 'Mr. Muzammil Ameer',
    readTime: '8 min read',
    category: 'Career',
    content: [
      'Business Studies at IGCSE and A Level opens the door to a remarkably diverse range of career opportunities. The subject provides a solid foundation in key areas such as accounting, marketing, human resources, operations management, and business strategy. These skills are highly sought after across virtually every industry sector.',
      'One of the most popular career paths is accounting and finance. Students with a strong background in Business Studies can pursue professional qualifications such as ACCA, CA, or CFA, leading to roles as auditors, financial analysts, tax consultants, or investment bankers. The analytical and numerical skills developed through Business Studies provide an excellent foundation for these demanding professions.',
      'Marketing and brand management is another exciting avenue. In today\'s competitive business environment, companies need skilled professionals who can develop effective marketing strategies, understand consumer behavior, and build strong brands. Roles in digital marketing, market research, advertising, and public relations offer creative and dynamic career opportunities for Business Studies graduates.',
      'Entrepreneurship is a path that many Business Studies students find particularly appealing. The curriculum covers business planning, financial management, and strategic decision-making — all essential skills for starting and running a successful business. Many successful entrepreneurs credit their Business Studies education with giving them the confidence and knowledge to launch their ventures.',
      'Human resource management is another rewarding career option. HR professionals play a crucial role in recruiting talent, managing employee relations, developing training programs, and shaping organizational culture. The understanding of people management principles gained through Business Studies is directly applicable to this field.',
      'Management consulting offers yet another prestigious career path. Consultants help organizations solve complex problems, improve performance, and implement strategic changes. The problem-solving frameworks and analytical thinking skills developed through Business Studies are highly valued in the consulting world, making it a natural progression for top-performing students.',
    ],
  },
  'tips-for-parents': {
    title: 'How Parents Can Support Their Child\'s Academic Journey',
    date: 'March 18, 2025',
    author: 'Ms. Sana Muzammil',
    readTime: '6 min read',
    category: 'Parents',
    content: [
      'As a parent, your role in your child\'s education extends far beyond providing school fees and supplies. Active parental involvement is one of the strongest predictors of academic success. At Leadership Study System, we have seen firsthand how students thrive when their parents are engaged, encouraging, and informed about their learning journey.',
      'One of the most effective ways to support your child is by creating a conducive study environment at home. Designate a quiet, well-lit space specifically for studying, free from distractions like television and loud noises. Establish consistent daily routines for homework, revision, and relaxation. Structure and predictability help children develop self-discipline and time management skills.',
      'Communication with teachers is equally important. Attend parent-teacher meetings regularly, stay informed about your child\'s progress, and maintain an open line of communication with their instructors. At LSS, we provide regular progress reports and are always available to discuss your child\'s academic development. A strong parent-teacher partnership creates a support system that benefits the student immensely.',
      'Encourage a growth mindset in your child. Help them understand that intelligence and abilities can be developed through effort, learning, and persistence. Praise their hard work and strategies rather than fixed traits like intelligence. When children believe they can improve through effort, they are more resilient in the face of challenges and more willing to tackle difficult subjects.',
      'Be mindful of the balance between academic pressure and well-being. While high expectations are important, excessive pressure can lead to anxiety, burnout, and a loss of motivation. Encourage your child to pursue hobbies, engage in physical activity, and maintain social connections. A well-rounded life supports not only better academic performance but also long-term mental health and happiness.',
      'Finally, lead by example. Let your child see you reading, learning new skills, and approaching challenges with a positive attitude. Your attitude toward education and lifelong learning will profoundly influence your child\'s own perspective. When parents value education, children naturally follow suit and develop a genuine love for learning that lasts a lifetime.',
    ],
  },
  'importance-of-extra-curricular': {
    title: 'The Importance of Extra-Curricular Activities in Student Development',
    date: 'February 10, 2025',
    author: 'Mr. Muhammad Ajmal Pervaiz',
    readTime: '7 min read',
    category: 'Development',
    content: [
      'Extra-curricular activities are far more than just a break from academics — they are an essential component of holistic student development. At Leadership Study System, we encourage every student to participate in activities beyond the classroom. These experiences build character, develop skills, and create well-rounded individuals ready to excel in all areas of life.',
      'Participation in sports, debates, music, drama, and community service helps students develop critical soft skills that cannot be taught through textbooks alone. Teamwork, leadership, communication, time management, and resilience are all cultivated through regular engagement in extra-curricular pursuits. These skills are increasingly valued by universities and employers around the world.',
      'Sports and physical activities teach discipline, perseverance, and the importance of teamwork. Students learn to handle both victory and defeat with grace, building emotional resilience that serves them well in academic and professional settings. Regular physical activity also improves mental health, reduces stress, and enhances concentration — all of which contribute to better academic performance.',
      'Debate clubs and public speaking programs develop confidence, critical thinking, and the ability to articulate ideas clearly and persuasively. These skills are invaluable for university interviews, presentations, and future career success. Students who participate in debate often show marked improvement in their essay writing and analytical abilities across all subjects.',
      'Community service and volunteer work instill a sense of social responsibility and empathy. Students who engage in service-learning develop a broader perspective on the world and a deeper understanding of social issues. These experiences shape compassionate, responsible citizens who are aware of their role in building a better society.',
      'Universities today look beyond academic grades when evaluating applicants. A strong record of extra-curricular involvement demonstrates that a student is motivated, well-rounded, and capable of managing multiple commitments. At LSS, we help students build impressive portfolios that showcase their achievements both inside and outside the classroom, giving them a competitive edge in university admissions.',
    ],
  },
}

const allPosts = Object.entries(blogPosts).map(([slug, post]) => ({ slug, ...post }))

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? blogPosts[slug] : null

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <GraduationCap className="h-16 w-16 text-primary-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Post Not Found</h1>
          <p className="text-gray-500 mb-8">The blog post you're looking for doesn't exist or may have been moved.</p>
          <Link to="/blog">
            <Button size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <>
      <Helmet>
        <title>{post.title} | Leadership Study System Blog</title>
        <meta name="description" content={post.content[0].slice(0, 160)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content[0].slice(0, 160)} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link to="/blog" className="inline-flex items-center text-blue-200 hover:text-white mb-8 text-sm transition-colors group">
            <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
          <Badge className="mb-5 bg-white/15 text-white border-white/25 hover:bg-white/25 px-3 py-1 text-xs uppercase tracking-wider">
            {post.category}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-blue-200/90 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <User className="h-4 w-4" />
              </span>
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-12">
            {/* Share Sidebar */}
            <div className="hidden lg:flex flex-col items-center gap-4 pt-2 flex-shrink-0">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Share</span>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-gray-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 transition-all" title="Share on Facebook">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-gray-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 transition-all" title="Share on Twitter">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-gray-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 transition-all" title="Share on LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-gray-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 transition-all" title="Copy link">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <article className="prose prose-lg max-w-none">
                {post.content.map((paragraph, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-7 text-lg">
                    {paragraph}
                  </p>
                ))}
              </article>

              {/* Mobile Share */}
              <div className="lg:hidden border-t border-gray-100 mt-12 pt-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <span className="text-sm text-gray-400 flex items-center gap-1.5">
                    <Share2 className="h-4 w-4" />
                    Share this post
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                      <Facebook className="h-4 w-4" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                      <Twitter className="h-4 w-4" />
                      <span className="hidden sm:inline">Tweet</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                      <Linkedin className="h-4 w-4" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-primary-100">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">{post.author}</h4>
                    <p className="text-sm text-primary-600 font-medium mb-2">Faculty at Leadership Study System</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {post.author} is a dedicated educator at Leadership Study System with extensive experience in teaching and mentoring students. Passionate about Cambridge education and committed to helping every student reach their full potential.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back link */}
              <div className="mt-10">
                <Link to="/blog">
                  <Button variant="ghost" className="gap-2 text-primary-700 hover:text-primary-800 hover:bg-primary-50 -ml-3">
                    <ArrowLeft className="h-4 w-4" />
                    Back to All Posts
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 lg:py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px flex-1 bg-gray-200" />
              <h2 className="text-2xl font-bold text-gray-900 flex-shrink-0">Related Articles</h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  to={`/blog/${rp.slug}`}
                  className="group bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-primary-100 transition-all duration-300"
                >
                  <Badge variant="secondary" className="mb-3 text-xs">
                    {rp.category}
                  </Badge>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {rp.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{rp.content[0].slice(0, 100)}...</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {rp.date}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-primary-700 group-hover:gap-1.5 transition-all">
                      Read More
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-primary-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <GraduationCap className="h-12 w-12 text-blue-200 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-blue-100/90 text-lg mb-8 max-w-xl mx-auto">
            Join Leadership Study System and experience world-class Cambridge education with expert faculty and personalized support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-primary-800 hover:bg-blue-50 font-semibold px-8 py-6 h-auto text-base shadow-lg">
                Contact Us
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 h-auto text-base">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
