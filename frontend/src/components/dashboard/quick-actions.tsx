"use client";

import {
  Plus,
  Search,
  TrendingUp,
  Settings,
  MessageCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function QuickActions() {
  const actions = [
    {
      title: "Add New Item",
      description: "Upload your clothing",
      icon: Plus,
      href: "/upload",
      color: "from-emerald-500 to-teal-500",
      hoverColor: "from-emerald-600 to-teal-600",
    },
    {
      title: "Browse Items",
      description: "Find new clothing",
      icon: Search,
      href: "/browse",
      color: "from-blue-500 to-cyan-500",
      hoverColor: "from-blue-600 to-cyan-600",
    },
    {
      title: "View Analytics",
      description: "Track your progress",
      icon: TrendingUp,
      href: "/dashboard/analytics",
      color: "from-purple-500 to-pink-500",
      hoverColor: "from-purple-600 to-pink-600",
    },
    {
      title: "Account Settings",
      description: "Manage your account",
      icon: Settings,
      href: "/settings",
      color: "from-gray-500 to-gray-600",
      hoverColor: "from-gray-600 to-gray-700",
    },
    {
      title: "Community",
      description: "Connect with others",
      icon: MessageCircle,
      href: "/community",
      color: "from-orange-500 to-red-500",
      hoverColor: "from-orange-600 to-red-600",
    },
    {
      title: "Help & Support",
      description: "Get help when needed",
      icon: Shield,
      href: "/help",
      color: "from-indigo-500 to-blue-500",
      hoverColor: "from-indigo-600 to-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Quick Actions
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get started with these common tasks
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <Link key={index} href={action.href} className="group relative">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
              {/* Background gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
              ></div>

              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                >
                  <action.icon className="w-7 h-7 text-white" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>

              {/* Subtle border animation */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-emerald-200 dark:group-hover:border-emerald-800 transition-colors duration-300"></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
