"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  Package,
  Calendar,
  Palette,
  Shirt,
  ArrowRight,
  ArrowLeft as ChevronLeft,
  Send,
  Coins,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/authclient";
import Image from "next/image";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

interface Item {
  id: string;
  title: string;
  description: string;
  condition: string;
  size: string;
  brand?: string;
  color?: string;
  pointValue: number;
  status: string;
  images: string[];
  userId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [swapMessage, setSwapMessage] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    checkAuth();
    if (params.id) {
      fetchItem(params.id as string);
    }
  }, [params.id]);

  const checkAuth = async () => {
    try {
      const session = await authClient.getSession();
      if (session.data) {
        setUser(session.data.user);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  };

  const fetchItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}`);
      if (response.ok) {
        const data = await response.json();
        setItem(data);
      } else {
        toast.error("Item not found");
        router.push("/browse");
      }
    } catch (error) {
      console.error("Error fetching item:", error);
      toast.error("Failed to load item");
    } finally {
      setLoading(false);
    }
  };

  const handleSwapRequest = async () => {
    if (!user) {
      toast.error("Please sign in to request a swap");
      router.push("/sign-in");
      return;
    }

    if (!item) return;

    setIsSwapping(true);
    try {
      const response = await fetch("/api/swaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestedItemId: item.id,
          message: swapMessage,
        }),
      });

      if (response.ok) {
        toast.success("Swap request sent successfully!");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to send swap request");
      }
    } catch (error) {
      console.error("Error sending swap request:", error);
      toast.error("Failed to send swap request");
    } finally {
      setIsSwapping(false);
    }
  };

  const handlePointRedeem = async () => {
    if (!user) {
      toast.error("Please sign in to redeem with points");
      router.push("/sign-in");
      return;
    }

    if (!item) return;

    try {
      const response = await fetch("/api/points/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: item.id,
          pointsSpent: item.pointValue,
        }),
      });

      if (response.ok) {
        toast.success("Item redeemed successfully!");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to redeem item");
      }
    } catch (error) {
      console.error("Error redeeming item:", error);
      toast.error("Failed to redeem item");
    }
  };

  const nextImage = () => {
    if (item && item.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item && item.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + item.images.length) % item.images.length
      );
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "fair":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "poor":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Item Not Found
          </h1>
          <Button asChild>
            <Link href="/browse">Browse Items</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Link
                href="/landing"
                className="text-2xl font-bold text-green-600 dark:text-green-400"
              >
                ReWear
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button asChild variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              {item.images && item.images.length > 0 ? (
                <>
                  <Image
                    src={item.images[currentImageIndex]}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {item.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Package className="h-16 w-16 mb-2" />
                  <p>No Image Available</p>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {item.images && item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 ${
                      index === currentImageIndex
                        ? "ring-2 ring-green-500"
                        : "ring-1 ring-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {item.title}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <Badge
                  variant="secondary"
                  className="text-lg font-bold px-3 py-1"
                >
                  <Coins className="h-4 w-4 mr-1" />
                  {item.pointValue} Points
                </Badge>
                <Badge
                  className={`${getConditionColor(item.condition)} text-sm`}
                >
                  {item.condition}
                </Badge>
                <Badge variant="outline">Size {item.size.toUpperCase()}</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {item.brand && (
                  <div className="flex items-center space-x-2">
                    <Shirt className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Brand:
                    </span>
                    <span className="text-sm font-medium">{item.brand}</span>
                  </div>
                )}
                {item.color && (
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Color:
                    </span>
                    <span className="text-sm font-medium">{item.color}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Listed:
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            {user && user.id !== item.userId && item.status === "available" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Request This Item
                  </h3>
                  <Textarea
                    placeholder="Add a message to your swap request (optional)"
                    value={swapMessage}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setSwapMessage(e.target.value)
                    }
                    className="mb-4"
                  />
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleSwapRequest}
                      disabled={isSwapping}
                      className="flex-1"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSwapping ? "Sending..." : "Request Swap"}
                    </Button>
                    <Button
                      onClick={handlePointRedeem}
                      variant="outline"
                      className="flex-1"
                    >
                      <Coins className="h-4 w-4 mr-2" />
                      Redeem with Points
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {user && user.id === item.userId && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  This is your item. You can manage it from your dashboard.
                </p>
                <Button asChild className="mt-2">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            )}

            {!user && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Sign in to request this item or redeem with points.
                </p>
                <Button asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            )}

            {item.status !== "available" && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-800 dark:text-red-200 font-medium">
                  This item is no longer available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
