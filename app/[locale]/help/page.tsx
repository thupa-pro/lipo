import React from "react";

export default function HelpPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div
        className={
          'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-20'
        }
      ></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8">
              <span className="text-blue-400 text-sm font-medium">
                🆘 Help Center
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                How Can We
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Help You?
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Find answers to your questions, learn how to use our platform, and
              get the support you need.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Help Categories */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Popular Help Topics
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Get quick answers to the most common questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Getting Started */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Getting Started
                </h3>
                <p className="text-gray-300 mb-6">
                  Learn the basics of using our platform and booking your first
                  service.
                </p>
                <div className="space-y-2">
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    How to create an account
                  </a>
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Booking your first service
                  </a>
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Understanding pricing
                  </a>
                </div>
              </div>

              {/* Account & Billing */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-green-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">💳</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Account & Billing
                </h3>
                <p className="text-gray-300 mb-6">
                  Manage your account settings, payments, and billing
                  information.
                </p>
                <div className="space-y-2">
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Update payment methods
                  </a>
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View billing history
                  </a>
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Change account settings
                  </a>
                </div>
              </div>

              {/* Booking Services */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Booking Services
                </h3>
                <p className="text-gray-300 mb-6">
                  Everything about finding, booking, and managing your services.
                </p>
                <div className="space-y-2">
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    How to find providers
                  </a>
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Scheduling appointments
                  </a>
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Canceling or rescheduling
                  </a>
                </div>
              </div>

              {/* Safety & Security */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-red-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Safety & Security
                </h3>
                <p className="text-gray-300 mb-6">
                  Learn about our safety measures and how to stay secure.
                </p>
                <div className="space-y-2">
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Provider verification process
                  </a>
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Safety guidelines
                  </a>
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Reporting issues
                  </a>
                </div>
              </div>

              {/* Reviews & Ratings */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Reviews & Ratings
                </h3>
                <p className="text-gray-300 mb-6">
                  How to leave reviews and understand provider ratings.
                </p>
                <div className="space-y-2">
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    How to leave a review
                  </a>
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Understanding ratings
                  </a>
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Review guidelines
                  </a>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">🔧</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Troubleshooting
                </h3>
                <p className="text-gray-300 mb-6">
                  Solutions to common technical issues and problems.
                </p>
                <div className="space-y-2">
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    App not working properly
                  </a>
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Payment failed
                  </a>
                  <a
                    href="/contact"
                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Can't find my booking
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-300 text-lg">
                Quick answers to the most common questions
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "How do I book a service?",
                  a: "Simply browse our service categories, select a provider, choose your preferred date and time, and confirm your booking. You'll receive instant confirmation and can track your service through our app.",
                },
                {
                  q: "Are all service providers background checked?",
                  a: "Yes, all our service providers undergo thorough background checks, verification of licenses and insurance, and must maintain high ratings to stay on our platform.",
                },
                {
                  q: "What if I need to cancel or reschedule?",
                  a: "You can cancel or reschedule your booking up to 24 hours before the scheduled time through our app. Some providers may allow shorter notice depending on their cancellation policy.",
                },
                {
                  q: "How does pricing work?",
                  a: "Our pricing is transparent with no hidden fees. You'll see the full cost upfront, including any applicable taxes and service fees. Providers set their rates based on the service complexity and market standards.",
                },
                {
                  q: "What if I'm not satisfied with the service?",
                  a: "We have a satisfaction guarantee. If you're not happy with the service, contact our support team within 24 hours and we'll work to resolve the issue, which may include a refund or rebooking with another provider.",
                },
                {
                  q: "How do I contact customer support?",
                  a: "You can reach our 24/7 customer support through the app's chat feature, email us at support@example.com, or call our support hotline. We typically respond within minutes.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-300">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Still Need Help?
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Our support team is here to help you 24/7. Choose the best way
                to reach us.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Live Chat */}
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Live Chat
                </h3>
                <p className="text-gray-300 mb-6">
                  Get instant help from our support team through live chat.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Start Chat
                </button>
              </div>

              {/* Email Support */}
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">📧</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Email Support
                </h3>
                <p className="text-gray-300 mb-6">
                  Send us an email and we'll respond within 2 hours.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Send Email
                </button>
              </div>

              {/* Phone Support */}
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-green-500/30 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">📞</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Phone Support
                </h3>
                <p className="text-gray-300 mb-6">
                  Call us directly for urgent matters and immediate assistance.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Knowledge Base */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Explore Our Knowledge Base
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Browse our comprehensive collection of articles, guides, and
                tutorials to get the most out of our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Browse Articles
                </button>
                <button className="px-8 py-4 bg-transparent border border-white/30 hover:border-white/50 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Watch Tutorials
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
