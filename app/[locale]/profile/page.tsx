import React from "react";

export default function ProfilePage() {
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
                👤 Your Profile
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                Manage Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Profile
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Update your information, track your activity, and customize your
              experience on our platform.
            </p>
          </div>
        </section>

        {/* Profile Overview */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="p-8 rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-lg border border-blue-200/50 dark:border-white/20 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white text-3xl">👤</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    John Doe
                  </h2>
                  <p className="text-slate-500 dark:text-gray-400 mb-4">
                    john.doe@example.com
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
                    <span className="text-green-600 dark:text-green-400 text-sm">
                      ✓ Verified
                    </span>
                  </div>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Services Booked
                      </h3>
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      47
                    </div>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">
                      +3 this month
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Total Spent
                      </h3>
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      $2,847
                    </div>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">
                      Lifetime value
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Average Rating
                      </h3>
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                      4.9
                    </div>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">
                      From 32 reviews
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Member Since
                      </h3>
                      <span className="text-2xl">🗓️</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      2023
                    </div>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">
                      2 years ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Sections */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Profile Management
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Access and manage different aspects of your profile and account
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">ℹ️</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  Personal Info
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Update your name, email, phone number, and other personal
                  details.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300">
                  Edit Info
                </button>
              </div>

              {/* Booking History */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">📜</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  Booking History
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  View all your past and upcoming service bookings and their
                  details.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300">
                  View History
                </button>
              </div>

              {/* Reviews & Ratings */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-yellow-400 dark:hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  Reviews
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Manage your reviews and see ratings from service providers.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-medium transition-all duration-300">
                  Manage Reviews
                </button>
              </div>

              {/* Preferences */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-green-400 dark:hover:border-green-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  Preferences
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Set your service preferences, availability, and notification
                  settings.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-300">
                  Set Preferences
                </button>
              </div>

              {/* Payment Methods */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-pink-400 dark:hover:border-pink-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">💳</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  Payment Methods
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Manage your saved payment methods and billing information.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300">
                  Manage Payment
                </button>
              </div>

              {/* Security */}
              <div className="group p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-red-400 dark:hover:border-red-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  Security
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Update password, enable 2FA, and manage account security
                  settings.
                </p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300">
                  Security Settings
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Recent Activity
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Your latest interactions and updates on the platform
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  type: "booking",
                  title: "Home Cleaning Service Booked",
                  time: "2 hours ago",
                  status: "confirmed",
                  icon: "🏠",
                },
                {
                  type: "review",
                  title: "Left review for Plumbing Service",
                  time: "1 day ago",
                  status: "completed",
                  icon: "⭐",
                },
                {
                  type: "payment",
                  title: "Payment processed for Lawn Care",
                  time: "3 days ago",
                  status: "completed",
                  icon: "💳",
                },
                {
                  type: "profile",
                  title: "Profile picture updated",
                  time: "1 week ago",
                  status: "completed",
                  icon: "👤",
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-lg border border-blue-200/50 dark:border-white/10 hover:border-blue-400 dark:hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500/20 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-xl">{activity.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-slate-800 dark:text-white font-semibold">
                          {activity.title}
                        </h3>
                        <p className="text-slate-500 dark:text-gray-400 text-sm">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.status === "confirmed"
                          ? "bg-blue-500/20 text-blue-700 dark:text-blue-400"
                          : activity.status === "completed"
                            ? "bg-green-500/20 text-green-700 dark:text-green-400"
                            : "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {activity.status}
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
            <div className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-blue-200/50 dark:border-white/10 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">
                Keep Your Profile Updated
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                A complete and updated profile helps us provide better service
                recommendations and improves your overall experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  Complete Profile
                </button>
                <button className="px-8 py-4 bg-transparent border border-slate-300 dark:border-white/30 hover:border-blue-400 dark:hover:border-white/50 text-slate-700 dark:text-white rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105">
                  View Settings
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
