"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";

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
  price?: number;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function BrowsePage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const conditions = ["excellent", "good", "fair", "poor"];
  const sizes = ["xs", "s", "m", "l", "xl", "xxl", "xxxl", "one-size"];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [search, selectedCategory, selectedCondition, selectedSize, sortBy, page]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sortBy,
        sortOrder: "desc",
      });

      if (search) params.append("search", search);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedCondition) params.append("condition", selectedCondition);
      if (selectedSize) params.append("size", selectedSize);

      const response = await fetch(`/api/items?${params}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedCondition("");
    setSelectedSize("");
    setSortBy("createdAt");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
      <Navigation pageTitle="Browse Items" />

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </form>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-800">
              <div>
                <Label
                  htmlFor="category"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Category
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="border-emerald-200 dark:border-emerald-700">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="condition"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Condition
                </Label>
                <Select
                  value={selectedCondition}
                  onValueChange={setSelectedCondition}
                >
                  <SelectTrigger className="border-emerald-200 dark:border-emerald-700">
                    <SelectValue placeholder="All Conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Conditions</SelectItem>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="size"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Size
                </Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="border-emerald-200 dark:border-emerald-700">
                    <SelectValue placeholder="All Sizes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sizes</SelectItem>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="sort"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Sort By
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="border-emerald-200 dark:border-emerald-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Newest First</SelectItem>
                    <SelectItem value="pointValue">Point Value</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card
                key={i}
                className="animate-pulse bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800"
              >
                <CardHeader className="pb-3">
                  <div className="h-48 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-4 bg-emerald-100 dark:bg-emerald-900/20 rounded w-3/4" />
                  <div className="h-4 bg-emerald-100 dark:bg-emerald-900/20 rounded w-1/2" />
                  <div className="h-4 bg-emerald-100 dark:bg-emerald-900/20 rounded w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="group hover:shadow-lg transition-shadow cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 hover:border-emerald-200 dark:hover:border-emerald-700"
                >
                  <CardHeader className="pb-3">
                    <div className="relative h-48 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </div>
                    <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {item.price} points
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
