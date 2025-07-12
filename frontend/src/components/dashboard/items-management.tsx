"use client";

import { useState } from "react";
import { Package, Edit, Trash2, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

interface ItemsManagementProps {
  items: any[];
  onItemsUpdate: (updatedItems: any[]) => void;
}

export default function ItemsManagement({
  items,
  onItemsUpdate,
}: ItemsManagementProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedItems = items.filter((item) => item.id !== itemId);
        onItemsUpdate(updatedItems);
        toast.success("Item deleted successfully!");
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      toast.error("Error deleting item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (itemId: string, currentStatus: string) => {
    const newStatus = currentStatus === "available" ? "removed" : "available";

    setIsLoading(true);
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedItems = items.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        );
        onItemsUpdate(updatedItems);
        toast.success(
          `Item ${
            newStatus === "available" ? "activated" : "deactivated"
          } successfully!`
        );
      } else {
        toast.error("Failed to update item status");
      }
    } catch (error) {
      toast.error("Error updating item status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mr-3">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">My Items</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                  {items.length} {items.length === 1 ? "item" : "items"} in your
                  collection
                </p>
              </div>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/upload">
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
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
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="border border-emerald-100 dark:border-emerald-800 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Item Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={
                              item.images[0].startsWith("/uploads/")
                                ? item.images[0]
                                : `/uploads/${item.images[0]}`
                            }
                            alt={item.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                            {item.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={`${
                                item.status === "available"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : item.status === "reserved"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                  : item.status === "swapped"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                              }`}
                            >
                              {item.status}
                            </Badge>
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                              {item.pointValue} pts
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>Size: {item.size}</span>
                            <span>Condition: {item.condition}</span>
                            {item.categoryName && (
                              <span>Category: {item.categoryName}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-emerald-200 dark:border-emerald-700 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        >
                          <Link href={`/item/${item.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-blue-200 dark:border-blue-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Link href={`/item/${item.id}/edit`}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleToggleStatus(item.id, item.status)
                          }
                          disabled={isLoading}
                          className="border-yellow-200 dark:border-yellow-700 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                        >
                          {item.status === "available"
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={isLoading}
                          className="border-red-200 dark:border-red-700 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
