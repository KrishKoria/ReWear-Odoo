"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authclient";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (!session.data) {
          router.push("/auth/signin");
        }
      } catch (error) {
        router.push("/auth/signin");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome to ReWear Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Your sustainable clothing exchange platform
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-card rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold mb-2">Browse Items</h3>
                <p className="text-muted-foreground">
                  Discover amazing clothing items from the community
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold mb-2">List Items</h3>
                <p className="text-muted-foreground">
                  Share your clothing items with others
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold mb-2">Your Profile</h3>
                <p className="text-muted-foreground">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
