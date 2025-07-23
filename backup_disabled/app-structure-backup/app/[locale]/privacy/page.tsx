import React from "react";

export default function PrivacyPage() {
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
                🔒 Privacy Policy
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Your Privacy
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Matters
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              We are committed to protecting your privacy and ensuring the
              security of your personal information.
            </p>

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
              <span className="text-green-400 text-sm font-medium">
                Last updated: January 2024
              </span>
            </div>
          </div>
        </section>

        {/* Privacy Principles */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Privacy Principles
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                The core values that guide how we handle your data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Data Protection
                </h3>
                <p className="text-gray-300">
                  We use industry-leading security measures to protect your
                  personal information from unauthorized access.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Minimal Collection
                </h3>
                <p className="text-gray-300">
                  We only collect data that is necessary to provide and improve
                  our services to you.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Transparency
                </h3>
                <p className="text-gray-300">
                  We clearly explain what data we collect, how we use it, and
                  give you control over your information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Sections */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {/* Information We Collect */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  1. Information We Collect
                </h2>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Personal Information
                    </h3>
                    <p>
                      Name, email address, phone number, and payment information
                      when you create an account or book services.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Service Information
                    </h3>
                    <p>
                      Details about the services you book, your preferences, and
                      communication with service providers.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Usage Data
                    </h3>
                    <p>
                      Information about how you use our platform, including
                      pages visited, features used, and interaction patterns.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Location Data
                    </h3>
                    <p>
                      Your location information to help match you with nearby
                      service providers (with your permission).
                    </p>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  2. How We Use Your Information
                </h2>
                <div className="space-y-4 text-gray-300">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>
                        Provide and improve our service matching platform
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Process payments and manage your bookings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>
                        Send important updates about your bookings and account
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>
                        Improve our platform through analytics and user feedback
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>
                        Provide customer support and respond to your inquiries
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>
                        Ensure platform safety and prevent fraudulent activity
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Information Sharing */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  3. Information Sharing
                </h2>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Service Providers
                    </h3>
                    <p>
                      We share necessary contact and booking information with
                      service providers to fulfill your requests.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Service Partners
                    </h3>
                    <p>
                      We work with trusted partners for payment processing,
                      analytics, and customer support.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Legal Requirements
                    </h3>
                    <p>
                      We may disclose information when required by law or to
                      protect our users and platform.
                    </p>
                  </div>
                  <p className="font-semibold text-blue-400">
                    We never sell your personal information to third parties.
                  </p>
                </div>
              </div>

              {/* Data Security */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  4. Data Security
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>We implement comprehensive security measures including:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>End-to-end encryption for sensitive data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>
                        Regular security audits and penetration testing
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Secure data centers with 24/7 monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>
                        Employee training on data protection best practices
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>
                        Multi-factor authentication for account access
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Your Rights */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  5. Your Privacy Rights
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>You have the right to:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Access and download your personal data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Correct or update your information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Delete your account and associated data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Opt out of promotional communications</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Restrict how we process your data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Request data portability</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cookies and Tracking */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  6. Cookies and Tracking
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Remember your preferences and settings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Analyze platform usage and performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Provide personalized recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Ensure platform security and prevent fraud</span>
                    </li>
                  </ul>
                  <p>
                    You can control cookie settings through your browser
                    preferences.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  7. Contact Us
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    If you have questions about this privacy policy or how we
                    handle your data, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p>
                      <strong className="text-white">Email:</strong>{" "}
                      privacy@example.com
                    </p>
                    <p>
                      <strong className="text-white">Phone:</strong>{" "}
                      1-800-PRIVACY
                    </p>
                    <p>
                      <strong className="text-white">Address:</strong> 123
                      Privacy Street, Data City, DC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Tools */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Privacy Management Tools
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Take control of your privacy with these easy-to-use tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">📥</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Download Your Data
                </h3>
                <p className="text-gray-300 mb-6">
                  Get a copy of all your personal data in a portable format.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300">
                  Request Data
                </button>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Privacy Settings
                </h3>
                <p className="text-gray-300 mb-6">
                  Control how your data is used and shared.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300">
                  Manage Settings
                </button>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-red-500/30 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">🗑️</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Delete Account
                </h3>
                <p className="text-gray-300 mb-6">
                  Permanently delete your account and all associated data.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Questions About Your Privacy?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Our privacy team is here to help you understand and control your
                data. Reach out with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Contact Privacy Team
                </button>
                <button className="px-8 py-4 bg-transparent border border-white/30 hover:border-white/50 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  View Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
