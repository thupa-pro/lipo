import React from "react";
import { Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Global Background Effects - Matching Homepage */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 z-10" />

      {/* Content */}
      <div className="relative z-20">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 glass-strong rounded-full px-6 py-3 mb-8 animate-fade-in-down">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Story
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-hero-premium">
                Revolutionizing
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Service Industry
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to connect people with trusted service
              providers, making it easier than ever to get things done.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                To create a world where finding reliable, high-quality services
                is as simple as a few clicks. We believe everyone deserves
                access to trusted professionals who can help them maintain and
                improve their lives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl glass-ultra hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Quality First
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We rigorously vet all service providers to ensure you receive
                  the highest quality of service every time.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl glass-ultra hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Trust & Safety
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your safety and peace of mind are our top priorities. All
                  providers are background-checked and insured.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl glass-ultra hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Fast & Efficient
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get matched with the right service provider quickly and
                  schedule appointments that fit your busy lifestyle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                By the Numbers
              </h2>
              <p className="text-gray-300 text-lg">
                See how we're making a difference in the service industry
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                  500K+
                </div>
                <div className="text-gray-300">Happy Customers</div>
              </div>
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                  50K+
                </div>
                <div className="text-gray-300">Verified Providers</div>
              </div>
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-pink-400 mb-2">
                  2M+
                </div>
                <div className="text-gray-300">Services Completed</div>
              </div>
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
                  98%
                </div>
                <div className="text-gray-300">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  How It All Started
                </h2>
                <div className="space-y-6 text-gray-300">
                  <p className="text-lg leading-relaxed">
                    Founded in 2020, our platform was born from a simple
                    frustration: finding reliable service providers was too
                    complicated, time-consuming, and often resulted in
                    disappointing experiences.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Our founders, experienced entrepreneurs in the tech
                    industry, recognized that technology could solve this
                    problem. They envisioned a platform that would make finding
                    and booking services as easy as ordering food online.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Today, Loconomy has grown into the leading service marketplace,
                    connecting millions of customers with thousands of verified
                    professionals across hundreds of service categories.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-white/20 flex items-center justify-center">
                  <div className="text-8xl">🌟</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Meet Our Team
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                The passionate people behind our mission to revolutionize the
                service industry
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "CEO & Co-Founder",
                  bio: "Former VP of Product at major tech company. Passionate about building user-centric platforms.",
                  emoji: "👩‍💼",
                },
                {
                  name: "Michael Chen",
                  role: "CTO & Co-Founder",
                  bio: "Senior software architect with 15 years of experience building scalable platforms.",
                  emoji: "👨‍💻",
                },
                {
                  name: "Emily Rodriguez",
                  role: "Head of Operations",
                  bio: "Operations expert focused on ensuring quality and efficiency across all services.",
                  emoji: "👩‍🔧",
                },
              ].map((member, i) => (
                <div
                  key={i}
                  className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl">
                    {member.emoji}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-400 mb-4">{member.role}</p>
                  <p className="text-gray-300 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Values
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Customer-Centric",
                  description:
                    "Every decision we make starts with asking: 'How does this benefit our customers?'",
                  icon: "❤️",
                },
                {
                  title: "Transparency",
                  description:
                    "We believe in clear communication, honest pricing, and transparent business practices.",
                  icon: "🔍",
                },
                {
                  title: "Innovation",
                  description:
                    "We continuously evolve our platform to provide better experiences and new solutions.",
                  icon: "💡",
                },
                {
                  title: "Community",
                  description:
                    "We're building a community where customers and providers can thrive together.",
                  icon: "🤲",
                },
              ].map((value, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{value.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-300">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Join Our Journey
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Be part of the future of services. Whether you're looking for
                help or want to provide services, we're here to make the
                connection seamless.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Find Services
                </button>
                <button className="px-8 py-4 bg-transparent border border-white/30 hover:border-white/50 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Become a Provider
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
