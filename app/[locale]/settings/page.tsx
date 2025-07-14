import React from "react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden relative">
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
                ⚙️ Account Settings
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                Customize Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Experience
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Personalize your account settings, preferences, and privacy
              controls to make the platform work exactly how you want it to.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-blue-400 dark:hover:border-white/20 transition-all duration-300">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  100%
                </div>
                <div className="text-slate-600 dark:text-gray-300">
                  Privacy Protected
                </div>
              </div>
              <div className="text-center p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-purple-400 dark:hover:border-white/20 transition-all duration-300">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  24/7
                </div>
                <div className="text-slate-600 dark:text-gray-300">
                  Account Security
                </div>
              </div>
              <div className="text-center p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-pink-400 dark:hover:border-white/20 transition-all duration-300">
                <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                  ∞
                </div>
                <div className="text-slate-600 dark:text-gray-300">
                  Customization Options
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Settings Categories */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Settings Categories
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Manage every aspect of your account with our comprehensive
                settings panel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Profile Settings */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  Profile Settings
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Update your personal information, profile picture, and public
                  display preferences.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Manage Profile
                </button>
              </div>

              {/* Security Settings */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-green-400 dark:hover:border-green-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  Security & Privacy
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Manage passwords, two-factor authentication, and privacy
                  controls.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Security Settings
                </button>
              </div>

              {/* Notification Settings */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">🔔</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  Notifications
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Customize email, push, and in-app notification preferences.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Notification Settings
                </button>
              </div>

              {/* Payment Settings */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-yellow-400 dark:hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">💳</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  Payment & Billing
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Manage payment methods, billing information, and subscription
                  details.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Payment Settings
                </button>
              </div>

              {/* App Preferences */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-pink-400 dark:hover:border-pink-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  App Preferences
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Customize theme, language, timezone, and display preferences.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  App Settings
                </button>
              </div>

              {/* Data & Privacy */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  Data & Privacy
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Control data sharing, export your data, and manage privacy
                  settings.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Privacy Controls
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-blue-200/50 dark:border-white/10 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">
                Need Help with Settings?
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Our support team is available 24/7 to help you configure your
                account settings and answer any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Contact Support
                </button>
                <button className="px-8 py-4 bg-transparent border border-slate-300 dark:border-white/30 hover:border-blue-400 dark:hover:border-white/50 text-slate-700 dark:text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  View Help Docs
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
