"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/authclient";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import UserProfile from "@/components/dashboard/user-profile";
import StatsOverview from "@/components/dashboard/stats-overview";
import ItemsManagement from "@/components/dashboard/items-management";
import RecentActivity from "@/components/dashboard/recent-activity";
import QuickActions from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    swaps: 0,
    points: 0,
    items: 0,
    favorites: 0,
  });
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const session = await authClient.getSession();
        if (!session.data) {
          router.push("/sign-in");
          return;
        }
        setUser(session.data.user);

        // Fetch stats
        const statsRes = await fetch(`/api/user/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch user's items
        const itemsRes = await fetch(
          `/api/items?userId=${session.data.user.id}&limit=10&sortBy=createdAt&sortOrder=desc`
        );
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setRecentItems(itemsData.items || []);
        }

        // Fetch recent activity
        const activityRes = await fetch(
          `/api/user/activity?userId=${session.data.user.id}&limit=10`
        );
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setRecentActivity(activityData.activity || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [router]);

  const handleUserUpdate = (updatedUser: any) => {
    setUser(updatedUser);
  };

  const handleItemsUpdate = (updatedItems: any[]) => {
    setRecentItems(updatedItems);
    // Update stats
    setStats((prev) => ({
      ...prev,
      items: updatedItems.length,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
        <Navigation pageTitle="Dashboard" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Loading Header */}
            <div className="text-center mb-12">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg max-w-md mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg max-w-lg mx-auto animate-pulse"></div>
            </div>

            {/* Loading Profile Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-8 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Loading Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>

            {/* Loading Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-7">
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 h-96 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-20 bg-gray-200 dark:bg-gray-700 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="xl:col-span-5">
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 h-96 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
      <Navigation pageTitle="Dashboard" />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="relative">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4">
                Welcome back, {user?.name?.split(" ")[0] || "Friend"}!
              </h1>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-lg opacity-20"></div>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your sustainable clothing exchange dashboard - Track, swap, and
              grow your eco-friendly wardrobe
            </p>
          </div>

          {/* User Profile Section */}
          <div className="mb-8 lg:mb-12">
            <UserProfile user={user} onUserUpdate={handleUserUpdate} />
          </div>

          {/* Stats Overview Section */}
          <div className="mb-8 lg:mb-12">
            <StatsOverview stats={stats} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 mb-8 lg:mb-12">
            {/* Items Management - Takes more space */}
            <div className="xl:col-span-7">
              <ItemsManagement
                items={recentItems}
                onItemsUpdate={handleItemsUpdate}
              />
            </div>

            {/* Recent Activity - Takes less space */}
            <div className="xl:col-span-5">
              <RecentActivity activities={recentActivity} />
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Bottom Spacing */}
          <div className="h-8"></div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          asChild
          size="lg"
          className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group"
        >
          <a href="/upload" title="Upload new item">
            <div className="flex items-center justify-center">
              <svg
                className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </a>
        </Button>
      </div>
    </div>
  );
}
