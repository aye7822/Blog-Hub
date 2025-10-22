import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata'
import Link from 'next/link'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  BarChart3, 
  Search, 
  Calendar, 
  Zap, 
  Shield, 
  Globe, 
  Heart,
  Twitter,
  Github,
  Linkedin,
  Mail,
  Star,
  TrendingUp,
  BookOpen,
  PenTool
} from 'lucide-react'

export const metadata: Metadata = generateSEOMetadata({
  title: "Home",
  description: "Welcome to our modern BlogHub built with Next.js 15, PostgreSQL, Drizzle ORM, and tRPC for type-safe API development.",
  keywords: ['blog', 'next.js', 'postgresql', 'drizzle', 'trpc', 'typescript', 'modern web development'],
})

export default function Home() {
  return (
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                BlogHub
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Blog
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Amazing Content
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            A modern BlogHub that makes it easy to write, publish, and grow your audience with professional tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/blog">Read Posts</Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="px-8 py-3 border-blue-600 text-blue-600 hover:bg-blue-50">
              <Link href="/dashboard">Start Writing</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Blogging Features
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and grow your blog with professional tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Multi-Author Support */}
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-blue-300/50 group bg-white shadow-lg hover:shadow-xl">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold mb-2 text-gray-900">Multi-Author Support</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Collaborate with multiple writers on your BlogHub
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Invite team members, assign roles, and manage content creation workflows seamlessly.
                </p>
              </CardContent>
            </Card>

            {/* Advanced Analytics */}
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-green-300/50 group bg-white shadow-lg hover:shadow-xl">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold mb-2 text-gray-900">Advanced Analytics</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Track your blog's performance with detailed insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Monitor page views, reading time, popular posts, and audience engagement metrics.
                </p>
              </CardContent>
            </Card>

            {/* SEO Optimization */}
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-orange-300/50 group bg-white shadow-lg hover:shadow-xl">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold mb-2 text-gray-900">SEO Optimization</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Built-in SEO tools to maximize your blog's visibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Automatic meta tags, sitemap generation, and SEO-friendly URLs for better search rankings.
                </p>
              </CardContent>
            </Card>

            {/* Content Scheduling */}
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-purple-300/50 group bg-white shadow-lg hover:shadow-xl">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold mb-2 text-gray-900">Content Scheduling</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Plan and schedule your posts for optimal publishing times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Draft posts, set publication dates, and maintain a consistent content calendar.
                </p>
              </CardContent>
            </Card>

            {/* Type-Safe Development */}
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-indigo-300/50 group bg-white shadow-lg hover:shadow-xl">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold mb-2 text-gray-900">Type-Safe API</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Built with tRPC for end-to-end type safety
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Automatic type inference ensures data consistency across your entire application.
                </p>
              </CardContent>
            </Card>

            {/* Modern Technology Stack */}
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-teal-300/50 group bg-white shadow-lg hover:shadow-xl">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold mb-2 text-gray-900">Modern Stack</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Next.js 15, PostgreSQL, Drizzle ORM for optimal performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Built with the latest technologies for a fast, scalable, and maintainable codebase.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="mt-24 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Content Creators
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join thousands of writers who are already using our platform to share their stories
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600 font-medium">Active Writers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">50K+</div>
                <div className="text-gray-600 font-medium">Posts Published</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">2M+</div>
                <div className="text-gray-600 font-medium">Monthly Readers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-orange-600 mb-2">99.9%</div>
                <div className="text-gray-600 font-medium">Uptime</div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "This platform has revolutionized how I manage my blog. The analytics and SEO tools are incredible!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      S
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Sarah Chen</div>
                      <div className="text-sm text-gray-500">Tech Blogger</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "The multi-author features and content scheduling have made our team collaboration seamless."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      M
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Michael Rodriguez</div>
                      <div className="text-sm text-gray-500">Content Manager</div>
                    </div>
                  </div>
              </CardContent>
            </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "The type-safe API and modern stack make development a breeze. Highly recommend!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      A
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Alex Thompson</div>
                      <div className="text-sm text-gray-500">Developer</div>
                    </div>
                  </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Blogging Journey?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of writers who trust our platform to share their stories and ideas with the world.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/dashboard/posts/new">Start Writing</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/blog">Explore Posts</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* About */}
            <div>
              <div className="flex items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  BlogHub
                </h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                A modern full-stack BlogHub built with Next.js 15, PostgreSQL, Drizzle ORM, and tRPC for type-safe API development.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog Posts</Link></li>
                <li><Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Tutorials</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Status Page</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Feature Requests</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Bug Reports</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Feedback</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Stay Updated</h4>
              <p className="text-gray-300 mb-4">
                Subscribe to our newsletter for the latest updates and blogging tips.
              </p>
              <div className="flex flex-col space-y-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Subscribe
                </Button>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-400">
                <Heart className="h-4 w-4 mr-1 text-red-500" />
                Join 10,000+ subscribers
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; 2025 BlogHub. All rights reserved. Built with modern web technologies.
              </div>
              <div className="flex space-x-6 text-sm">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">GDPR</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
  )
}
