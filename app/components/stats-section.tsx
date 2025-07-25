import { Users, Star, MapPin, Award, CheckCircle, Clock, TrendingUp, Shield } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Users",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    description: "Growing community"
  },
  {
    icon: CheckCircle,
    value: "250K+",
    label: "Jobs Completed",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    description: "Successfully delivered"
  },
  {
    icon: Star,
    value: "4.9",
    label: "Average Rating",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    description: "Customer satisfaction"
  },
  {
    icon: MapPin,
    value: "1,200+",
    label: "Cities Served",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    description: "Global coverage"
  },
  {
    icon: Clock,
    value: "< 30min",
    label: "Avg Response",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    description: "Lightning fast"
  },
  {
    icon: Shield,
    value: "100%",
    label: "Verified Pros",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    description: "Background checked"
  },
  {
    icon: TrendingUp,
    value: "300%",
    label: "Provider Growth",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    description: "Year over year"
  },
  {
    icon: Award,
    value: "98%",
    label: "Satisfaction",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    description: "Client happiness"
  },
];

export function StatsSection() {
  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Trusted by Thousands Worldwide
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Our platform continues to grow, connecting elite service providers with customers who demand excellence.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative glass-strong rounded-2xl p-6 hover:scale-105 transition-all duration-300 group text-center overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
            
            {/* Icon Container */}
            <div className="relative z-10">
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              
              {/* Main Value */}
              <div className="text-3xl font-black mb-2 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-br group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                {stat.value}
              </div>
              
              {/* Label */}
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {stat.label}
              </div>
              
              {/* Description */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </div>
            </div>

            {/* Hover Effect Indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {/* Additional Trust Elements */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-8 px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Statistics</span>
          </div>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>Verified Data</span>
          </div>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Growing Daily</span>
          </div>
        </div>
      </div>
    </div>
  );
}
