"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Package,
  ShoppingCart,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/authclient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: string;
  totalPoints: number;
  createdAt: string;
  items: any[];
}

interface Listing {
  id: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  pointValue: number;
  status: string;
  createdAt: string;
  images: string[];
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const session = await authClient.getSession();
        if (!session.data) {
          router.push("/sign-in");
          return;
        }

        // Type assertion to include role
        const currentUser = session.data.user as any;
        setUser(currentUser);

        // Check if user is admin
        if (currentUser.role !== "admin") {
          toast.error("Access denied. Admin privileges required.");
          router.push("/dashboard");
          return;
        }

        // Fetch admin data
        await fetchAdminData();
      } catch (error) {
        console.error("Error checking admin access:", error);
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  const fetchAdminData = async () => {
    try {
      // Fetch users
      const usersRes = await fetch("/api/admin/users");
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      // Fetch orders (swaps)
      const ordersRes = await fetch("/api/admin/orders");
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      // Fetch listings
      const listingsRes = await fetch("/api/admin/listings");
      if (listingsRes.ok) {
        const listingsData = await listingsRes.json();
        setListings(listingsData.listings || []);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("User deleted successfully");
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        toast.success(
          `User ${!isActive ? "activated" : "deactivated"} successfully`
        );
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, isActive: !isActive } : u
          )
        );
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Error updating user status");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Order deleted successfully");
        setOrders(orders.filter((o) => o.id !== orderId));
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order");
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Order status updated successfully");
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          )
        );
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Listing deleted successfully");
        setListings(listings.filter((l) => l.id !== listingId));
      } else {
        toast.error("Failed to delete listing");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Error deleting listing");
    }
  };

  const handleUpdateListingStatus = async (
    listingId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Listing status updated successfully");
        setListings(
          listings.map((l) =>
            l.id === listingId ? { ...l, status: newStatus } : l
          )
        );
      } else {
        toast.error("Failed to update listing status");
      }
    } catch (error) {
      console.error("Error updating listing status:", error);
      toast.error("Error updating listing status");
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
      <Navigation pageTitle="Admin Panel" />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4">
              Admin Panel
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage users, orders, and listings
            </p>
          </div>

          {/* Admin Management Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users ({users.length})
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Orders ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="listings" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Listings ({listings.length})
              </TabsTrigger>
            </TabsList>

            {/* Users Management */}
            <TabsContent value="users">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Users className="h-5 w-5 mr-2 text-emerald-600" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          No users found
                        </p>
                      </div>
                    ) : (
                      users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-emerald-200 dark:border-emerald-700"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                  variant={
                                    user.role === "admin"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {user.role}
                                </Badge>
                                <Badge
                                  variant={
                                    user.isActive ? "default" : "destructive"
                                  }
                                >
                                  {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleToggleUserStatus(user.id, user.isActive)
                              }
                              className="flex items-center gap-2"
                            >
                              {user.isActive ? (
                                <>
                                  <UserX className="w-4 h-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4" />
                                  Activate
                                </>
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Management */}
            <TabsContent value="orders">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <ShoppingCart className="h-5 w-5 mr-2 text-emerald-600" />
                    Order Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          No orders found
                        </p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-emerald-200 dark:border-emerald-700"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                Order #{order.id.slice(-8)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {order.userName} ({order.userEmail})
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                  variant={
                                    order.status === "completed"
                                      ? "default"
                                      : order.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {order.status}
                                </Badge>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {order.totalPoints} pts
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, "completed")
                              }
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Complete
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, "cancelled")
                              }
                              className="flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Listings Management */}
            <TabsContent value="listings">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Package className="h-5 w-5 mr-2 text-emerald-600" />
                    Listing Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {listings.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          No listings found
                        </p>
                      </div>
                    ) : (
                      listings.map((listing) => (
                        <div
                          key={listing.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-emerald-200 dark:border-emerald-700"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              {listing.images && listing.images.length > 0 ? (
                                <img
                                  src={listing.images[0]}
                                  alt={listing.title}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <Package className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {listing.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                By {listing.userName}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                  variant={
                                    listing.status === "active"
                                      ? "default"
                                      : listing.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {listing.status}
                                </Badge>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {listing.pointValue} pts
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateListingStatus(listing.id, "active")
                              }
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateListingStatus(
                                  listing.id,
                                  "rejected"
                                )
                              }
                              className="flex items-center gap-2"
                            >
                              <Ban className="w-4 h-4" />
                              Reject
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteListing(listing.id)}
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
