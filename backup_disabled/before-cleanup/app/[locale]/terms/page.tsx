import React from "react";

export default function TermsPage() {
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
                📋 Terms of Service
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Terms of
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Service
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our platform. They
              govern your use of our services and establish our mutual rights
              and responsibilities.
            </p>

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
              <span className="text-green-400 text-sm font-medium">
                Effective Date: January 1, 2024
              </span>
            </div>
          </div>
        </section>

        {/* Key Points */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Key Terms Overview
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                A quick summary of the most important points in our terms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Fair Use
                </h3>
                <p className="text-gray-300">
                  Use our platform responsibly and in accordance with applicable
                  laws and regulations.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  User Safety
                </h3>
                <p className="text-gray-300">
                  We're committed to maintaining a safe environment for all
                  users and service providers.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">💳</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Payment Terms
                </h3>
                <p className="text-gray-300">
                  Clear and transparent payment processing with secure
                  transaction handling.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {/* Acceptance of Terms */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  1. Acceptance of Terms
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    By accessing or using our platform, you agree to be bound by
                    these Terms of Service and all applicable laws and
                    regulations. If you do not agree with any of these terms,
                    you are prohibited from using our services.
                  </p>
                  <p>
                    These terms may be updated from time to time. We will notify
                    users of significant changes via email or platform
                    notifications. Continued use of the platform after changes
                    constitutes acceptance of the new terms.
                  </p>
                </div>
              </div>

              {/* Use of Service */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  2. Use of Service
                </h2>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Permitted Uses
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>
                          Book legitimate services from verified providers
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>
                          Communicate professionally with service providers
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>Leave honest reviews and ratings</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>Use platform features as intended</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Prohibited Uses
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span>Fraudulent or illegal activities</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span>Harassment or inappropriate behavior</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span>Attempting to hack or exploit the platform</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span>
                          Creating false accounts or impersonating others
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* User Accounts */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  3. User Accounts
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    You are responsible for maintaining the confidentiality of
                    your account credentials and for all activities that occur
                    under your account. You must notify us immediately of any
                    unauthorized use of your account.
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Account Requirements
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>
                          Must be 18 years or older (or legal age in your
                          jurisdiction)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Provide accurate and complete information</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Keep account information up to date</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>One account per person or entity</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  4. Payment Terms
                </h2>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Payment Processing
                    </h3>
                    <p>
                      All payments are processed securely through our payment
                      partners. We do not store your full payment information on
                      our servers.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Pricing and Fees
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>
                          Service prices are set by individual providers
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>
                          Platform fees are clearly disclosed before booking
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>
                          All taxes and fees are included in the total price
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>
                          Prices may vary based on location and demand
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Refunds and Cancellations
                    </h3>
                    <p>
                      Refund policies vary by service provider and are clearly
                      stated before booking. Generally, cancellations made 24+
                      hours in advance are eligible for full refunds.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Provider Terms */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  5. Service Provider Terms
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Service providers are independent contractors, not employees
                    of our platform. We facilitate connections but do not
                    directly provide services.
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Provider Responsibilities
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span>Maintain appropriate licenses and insurance</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span>
                          Provide services as described and agreed upon
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span>Communicate professionally with customers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span>
                          Comply with all applicable laws and regulations
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Intellectual Property */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  6. Intellectual Property
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Our platform, including its design, code, content, and
                    trademarks, is protected by intellectual property laws. You
                    may not copy, modify, or distribute our content without
                    permission.
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      User Content
                    </h3>
                    <p>
                      You retain ownership of content you submit (reviews,
                      photos, etc.) but grant us a license to use it for
                      platform operations. You're responsible for ensuring you
                      have rights to any content you share.
                    </p>
                  </div>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  7. Limitation of Liability
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Our platform facilitates connections between users and
                    service providers. We are not liable for the quality,
                    safety, or legality of services provided by third-party
                    providers.
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Platform Limitations
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>
                          We cannot guarantee service availability or quality
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>
                          Technical issues may occasionally affect platform
                          performance
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>
                          Service providers are independent contractors
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>
                          Our total liability is limited to amounts paid through
                          the platform
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Termination */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  8. Termination
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Either party may terminate this agreement at any time. We
                    reserve the right to suspend or terminate accounts for
                    violations of these terms or for any reason with appropriate
                    notice.
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Effects of Termination
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span>Loss of access to platform features</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span>
                          Cancellation of pending bookings (where possible)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span>Retention of data as required by law</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span>
                          Survival of payment obligations and disputes
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Governing Law */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  9. Governing Law and Disputes
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    These terms are governed by the laws of [Jurisdiction]. Any
                    disputes will be resolved through binding arbitration or in
                    the courts of [Jurisdiction].
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Dispute Resolution
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>
                          First attempt resolution through customer support
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Mediation before formal legal proceedings</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Binding arbitration for unresolved disputes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Class action waiver applies</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  10. Contact Information
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    If you have questions about these terms or need to contact
                    us regarding legal matters:
                  </p>
                  <div className="space-y-2">
                    <p>
                      <strong className="text-white">Legal Department:</strong>{" "}
                      legal@example.com
                    </p>
                    <p>
                      <strong className="text-white">Customer Support:</strong>{" "}
                      support@example.com
                    </p>
                    <p>
                      <strong className="text-white">Mailing Address:</strong>{" "}
                      123 Legal Street, Terms City, TC 12345
                    </p>
                    <p>
                      <strong className="text-white">Phone:</strong> 1-800-TERMS
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agreement Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Agreement Acknowledgment
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                By continuing to use our platform, you acknowledge that you have
                read, understood, and agree to be bound by these Terms of
                Service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  I Agree to Terms
                </button>
                <button className="px-8 py-4 bg-transparent border border-white/30 hover:border-white/50 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
