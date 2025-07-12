"use client";

import { TrendingUp, Package, Shirt, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsOverviewProps {
  stats: {
    swaps: number;
    points: number;
    items: number;
    favorites: number;
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: "Total Swaps",
      value: stats.swaps ?? 0,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Points Balance",
      value: stats.points ?? 0,
      icon: Package,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "My Items",
      value: stats.items ?? 0,
      icon: Shirt,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Favorites",
      value: stats.favorites ?? 0,
      icon: Heart,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="mb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Your Stats Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 relative overflow-hidden"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
            ></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p
                    className={`text-2xl lg:text-3xl font-bold ${stat.textColor} transition-colors duration-300`}
                  >
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center ${stat.bgColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <stat.icon
                    className={`w-6 h-6 lg:w-7 lg:h-7 ${stat.textColor}`}
                  />
                </div>
              </div>

              {/* Progress indicator */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Progress
                  </span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {Math.min(
                      Math.round((stat.value / Math.max(stat.value, 10)) * 100),
                      100
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-700 ease-out rounded-full`}
                    style={{
                      width: `${Math.min(
                        Math.max(
                          (stat.value / Math.max(stat.value, 10)) * 100,
                          5
                        ),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
