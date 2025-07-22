import React from "react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(139,92,246,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.08),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 dark:bg-violet-400 rounded-full animate-pulse opacity-30 dark:opacity-40" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 dark:bg-blue-400 rounded-full animate-ping opacity-20 dark:opacity-30" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400 dark:bg-emerald-400 rounded-full animate-bounce opacity-15 dark:opacity-20" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-cyan-400 dark:bg-pink-400 rounded-full animate-pulse opacity-20 dark:opacity-30" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-indigo-400 dark:bg-cyan-400 rounded-full animate-ping opacity-15 dark:opacity-25" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-8">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                💎 Transparent Pricing
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                Simple, Fair
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Choose the perfect plan for your needs. No hidden fees, no
              surprises. Start free and scale as you grow.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    Starter
                  </h3>
                  <p className="text-slate-500 dark:text-gray-400 mb-6">
                    Perfect for individuals
                  </p>
                  <div className="mb-8">
                    <span className="text-4xl font-bold text-slate-800 dark:text-white">
                      $0
                    </span>
                    <span className="text-slate-500 dark:text-gray-400 ml-2">
                      /month
                    </span>
                  </div>
                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      Up to 5 service requests
                    </li>
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      Basic support
                    </li>
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      Standard matching
                    </li>
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      Mobile app access
                    </li>
                  </ul>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                    Get Started Free
                  </button>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-lg border border-purple-400 dark:border-purple-500/30 hover:border-purple-500 dark:hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full">
                  Most Popular
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    Pro
                  </h3>
                  <p className="text-slate-500 dark:text-gray-400 mb-6">
                    Best for professionals
                  </p>
                  <div className="mb-8">
                    <span className="text-4xl font-bold text-slate-800 dark:text-white">
                      $29
                    </span>
                    <span className="text-slate-500 dark:text-gray-400 ml-2">
                      /month
                    </span>
                  </div>
                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      Unlimited service requests
                    </li>
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      Priority support
                    </li>
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      AI-powered matching
                    </li>
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      Advanced analytics
                    </li>
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      Custom integrations
                    </li>
                  </ul>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                    Start Pro Trial
                  </button>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-yellow-400 dark:hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    Enterprise
                  </h3>
                  <p className="text-slate-500 dark:text-gray-400 mb-6">
                    For large organizations
                  </p>
                  <div className="mb-8">
                    <span className="text-4xl font-bold text-slate-800 dark:text-white">
                      Custom
                    </span>
                  </div>
                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      Everything in Pro
                    </li>
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      Dedicated support
                    </li>
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      White-label solution
                    </li>
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      Custom SLA
                    </li>
                    <li className="flex items-center text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 mr-3">✓</span>
                      On-premise deployment
                    </li>
                  </ul>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Compare All Features
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                See what's included in each plan to make the best choice for
                your needs
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[600px] bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 rounded-2xl p-8">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="font-semibold text-slate-800 dark:text-white">
                    Features
                  </div>
                  <div className="text-center font-semibold text-slate-800 dark:text-white">
                    Starter
                  </div>
                  <div className="text-center font-semibold text-purple-600 dark:text-purple-400">
                    Pro
                  </div>
                  <div className="text-center font-semibold text-yellow-600 dark:text-yellow-400">
                    Enterprise
                  </div>
                </div>

                {[
                  ["Service Requests", "5/month", "Unlimited", "Unlimited"],
                  ["Provider Network", "Basic", "Premium", "Premium + Custom"],
                  [
                    "Matching Algorithm",
                    "Standard",
                    "AI-Powered",
                    "Advanced AI",
                  ],
                  ["Support Level", "Email", "Priority", "Dedicated"],
                  ["Analytics", "Basic", "Advanced", "Custom Reports"],
                  ["API Access", "❌", "✅", "✅"],
                  ["White-label", "❌", "❌", "✅"],
                  ["SLA", "None", "99.9%", "Custom"],
                ].map((row, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-4 gap-4 py-4 border-t border-slate-200 dark:border-white/10"
                  >
                    <div className="text-slate-600 dark:text-gray-300">
                      {row[0]}
                    </div>
                    <div className="text-center text-slate-600 dark:text-gray-300">
                      {row[1]}
                    </div>
                    <div className="text-center text-slate-600 dark:text-gray-300">
                      {row[2]}
                    </div>
                    <div className="text-center text-slate-600 dark:text-gray-300">
                      {row[3]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg">
                Everything you need to know about our pricing
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "Can I change plans anytime?",
                  a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
                },
                {
                  q: "Is there a free trial?",
                  a: "Yes, we offer a 14-day free trial for the Pro plan with full access to all features.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
                },
                {
                  q: "Do you offer refunds?",
                  a: "Yes, we offer a 30-day money-back guarantee for all paid plans.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10"
                >
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-blue-200/50 dark:border-white/10 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust our platform for
                their service needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Start Free Trial
                </button>
                <button className="px-8 py-4 bg-transparent border border-slate-300 dark:border-white/30 hover:border-blue-400 dark:hover:border-white/50 text-slate-700 dark:text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
