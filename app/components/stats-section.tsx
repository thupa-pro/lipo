import { Users, Star, MapPin, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active, Users",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    icon: CheckCircle,
    value: "250K+",
    label: "Jobs Completed",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Average Rating",
    color: "from-slate-500 to-slate-600",
    bgColor: "bg-slate-50 dark:bg-slate-950/20",
  },
  {
    icon: MapPin,
    value: "1,200+",
    label: "Cities Served",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
];

export function StatsSection() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="glass-strong rounded-2xl p-6 hover:scale-105 transition-all duration-300 group text-center"
        >
          <div
            className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <stat.icon className="w-7 h-7 text-white" />
          </div>
          <div className="text-3xl font-black mb-2 gradient-text">
            {stat.value}
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
