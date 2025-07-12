"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Package,
  Search,
  Upload,
  TrendingUp,
  Heart,
  Recycle,
  Users,
  Shirt,
  Plus,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/authclient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Navigation from "@/components/navigation";

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

        // Fetch recent items
        const itemsRes = await fetch(
          `/api/items?userId=${session.data.user.id}&limit=5&sortBy=createdAt&sortOrder=desc`
        );
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setRecentItems(itemsData.items || []);
        }

        // Fetch recent activity (swaps/transactions)
        const activityRes = await fetch(
          `/api/user/activity?userId=${session.data.user.id}&limit=5`
        );
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setRecentActivity(activityData.activity || []);
        }
      } catch (error) {
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/sign-in");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
      <Navigation pageTitle="Dashboard" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4">
              Welcome back, {user?.name?.split(" ")[0] || "Friend"}!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your sustainable clothing exchange dashboard
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Swaps
                    </p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {stats.swaps ?? 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Points Balance
                    </p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {stats.points ?? 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      My Items
                    </p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {stats.items ?? 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <Shirt className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Items and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Items */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Package className="h-5 w-5 mr-2 text-emerald-600" />
                  Recent Items
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your latest clothing items
                </p>
              </CardHeader>
              <CardContent>
                {recentItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No items yet
                    </p>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                    >
                      <Link href="/upload">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Item
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentItems.map((item) => (
                      <Card
                        key={item.id}
                        className="border border-emerald-100 dark:border-emerald-800"
                      >
                        <CardContent className="flex items-center space-x-4 p-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <Package className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-lg text-gray-900 dark:text-white">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                          <Badge className="bg-emerald-500 text-white">
                            {item.pointValue} pts
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Activity className="h-5 w-5 mr-2 text-emerald-600" />
                  Recent Activity
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your latest swaps and transactions
                </p>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No activity yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((act, idx) => (
                      <Card
                        key={idx}
                        className="border border-emerald-100 dark:border-emerald-800"
                      >
                        <CardContent className="flex items-center space-x-4 p-4">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {act.type}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {act.description}
                            </p>
                          </div>
                          <Badge className="bg-emerald-500 text-white">
                            {act.points} pts
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Recycle className="h-5 w-5 mr-2 text-emerald-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  asChild
                  className="h-auto p-6 flex flex-col items-center space-y-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <Link href="/upload">
                    <Plus className="w-8 h-8" />
                    <span className="font-medium">Add Item</span>
                    <span className="text-xs opacity-90">
                      Upload your clothing
                    </span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center space-y-2 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Link href="/browse">
                    <Search className="w-8 h-8 text-emerald-600" />
                    <span className="font-medium">Browse Items</span>
                    <span className="text-xs opacity-70">
                      Find new clothing
                    </span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center space-y-2 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Link href="/browse">
                    <TrendingUp className="w-8 h-8 text-emerald-600" />
                    <span className="font-medium">View Stats</span>
                    <span className="text-xs opacity-70">
                      Track your progress
                    </span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
