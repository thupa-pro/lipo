import { OptimizedIcon } from "@/lib/icons/optimized-icons";

export function HeroStats() {
  const stats = [
    {
      icon: "Users" as const,
      value: "50K+",
      label: "Active Users",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "Shield" as const,
      value: "250K+",
      label: "Jobs Completed",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "Star" as const,
      value: "4.9",
      label: "Average Rating",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: "MapPin" as const,
      value: "1,200+",
      label: "Cities Served",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-16">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-300 group text-center"
        >
          <div
            className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <OptimizedIcon name={stat.icon} className="w-7 h-7 text-white" />
          </div>
          <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {stat.value}
          </div>
          <div className="text-sm font-medium text-gray-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}