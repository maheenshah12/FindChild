'use client'

import Link from 'next/link'
import { useScrollAnimation } from './hooks/useScrollAnimation'
import AnimatedCounter from './components/AnimatedCounter'

export default function Home() {
  const hero = useScrollAnimation()
  const stats = useScrollAnimation()
  const features = useScrollAnimation()
  const cases = useScrollAnimation()
  const testimonials = useScrollAnimation()
  const cta = useScrollAnimation()


  return (
    <div className="relative overflow-hidden bg-white">
      {/* Floating Dots Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-violet-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              opacity: 0.4,
              boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)',
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-32">
        <div
          ref={hero.ref}
          className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 ${
            hero.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full text-violet-700 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
            AI-Powered Child Safety Platform
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-gray-900 leading-tight">
            Help bring children home safely
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto font-normal">
            Connect communities through technology to reunite families. Every second counts when a child goes missing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/report"
              className="px-8 py-4 bg-violet-600 text-white rounded-full font-medium text-base hover:bg-violet-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Report Missing Child
            </Link>
            <Link
              href="/cases"
              className="px-8 py-4 bg-gray-100 text-gray-900 rounded-full font-medium text-base hover:bg-gray-200 hover:scale-105 transition-all duration-300"
            >
              View Active Cases
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div
            ref={stats.ref}
            className={`grid md:grid-cols-3 gap-12 max-w-5xl mx-auto transition-all duration-1000 ${
              stats.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={1247} isVisible={stats.isVisible} />+
              </div>
              <div className="text-lg text-gray-600 font-medium">Cases Solved</div>
              <div className="mt-2 text-sm text-gray-500">Children reunited with families</div>
            </div>

            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={15420} isVisible={stats.isVisible} />+
              </div>
              <div className="text-lg text-gray-600 font-medium">Trusted Users</div>
              <div className="mt-2 text-sm text-gray-500">Active community members</div>
            </div>

            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={94} isVisible={stats.isVisible} />%
              </div>
              <div className="text-lg text-gray-600 font-medium">Success Rate</div>
              <div className="mt-2 text-sm text-gray-500">Within first 48 hours</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-white">
        <div className="container mx-auto px-6">
          <div
            ref={features.ref}
            className={`max-w-6xl mx-auto transition-all duration-1000 ${
              features.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                How it works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our platform makes it easy to spread awareness and coordinate search efforts
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-3xl p-10 hover:shadow-xl hover:border-violet-200 transition-all duration-300">
                <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Submit a Report</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fill out a simple form with the child's details, photo, and last known location. Our system processes it instantly.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl p-10 hover:shadow-xl hover:border-violet-200 transition-all duration-300">
                <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Processing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI generates an urgent, detailed alert message optimized for maximum reach and engagement.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl p-10 hover:shadow-xl hover:border-violet-200 transition-all duration-300">
                <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Instant Distribution</h3>
                <p className="text-gray-600 leading-relaxed">
                  Alert is distributed to WhatsApp community groups and volunteers within seconds of submission.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl p-10 hover:shadow-xl hover:border-violet-200 transition-all duration-300">
                <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🏠</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Community Action</h3>
                <p className="text-gray-600 leading-relaxed">
                  Local community mobilizes quickly to help search and share information to bring children home safely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="relative py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div
            ref={cases.ref}
            className={`transition-all duration-1000 ${
              cases.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Recent success stories
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real families reunited through our platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { name: 'Emma Rodriguez', age: 7, location: 'Los Angeles, CA', time: '4 hours', color: 'from-emerald-400 to-teal-500' },
                { name: 'Michael Chen', age: 5, location: 'San Francisco, CA', time: '2 hours', color: 'from-blue-400 to-cyan-500' },
                { name: 'Sofia Martinez', age: 9, location: 'Miami, FL', time: '6 hours', color: 'from-violet-400 to-purple-500' },
              ].map((child, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-violet-200 transition-all duration-300"
                >
                  <div className={`h-56 bg-gradient-to-br ${child.color} flex items-center justify-center`}>
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-5xl">👤</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-4">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Found Safe
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{child.name}</h3>
                    <p className="text-gray-600 text-sm mb-1">Age {child.age} • {child.location}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Reunited in {child.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-32 bg-white">
        <div className="container mx-auto px-6">
          <div
            ref={testimonials.ref}
            className={`transition-all duration-1000 ${
              testimonials.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Trusted by families
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Stories from parents who found hope through our platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Mother',
                  text: 'FindChildd helped us find our daughter in just 3 hours. The community response was overwhelming. Forever grateful!',
                },
                {
                  name: 'David Martinez',
                  role: 'Father',
                  text: 'The AI alert system reached thousands of people instantly. Our son was found safe thanks to a community member.',
                },
                {
                  name: 'Lisa Thompson',
                  role: 'Volunteer',
                  text: 'Being part of this network gives me purpose. I helped reunite 3 families this year. This platform saves lives.',
                },
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center text-2xl mr-4">
                      👤
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gray-50">
        <div
          ref={cta.ref}
          className={`container mx-auto px-6 text-center transition-all duration-1000 ${
            cta.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Join our community
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Be part of a network that brings children home. Every member makes a difference.
            </p>
            <Link
              href="/contact"
              className="inline-block px-10 py-4 bg-violet-600 text-white rounded-full font-medium text-lg hover:bg-violet-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Get Involved Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
