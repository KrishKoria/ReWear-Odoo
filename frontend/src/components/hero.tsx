import { ArrowRight, Heart } from "lucide-react";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Button } from "./ui/button";
import { Item } from "@/db/types";

type HeroProps = {
  featuredItems: {
    id: number;
    title: string;
    image?: string;
    points: number;
    condition: string;
    category: string;
  }[];
  isVisible: boolean;
};
export default function Hero({ featuredItems, isVisible }: HeroProps) {
  return (
    <section className="pt-24 pb-16 px-4 lg:px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="space-y-4">
              <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors duration-300">
                🌱 Sustainable Fashion Revolution
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-500 bg-clip-text text-transparent">
                  Swap, Share,
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">Sustain</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Transform your wardrobe sustainably. Exchange unused clothing
                through direct swaps or our innovative point system. Join
                thousands reducing textile waste, one swap at a time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gradient-emerald hover:gradient-emerald-dark text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group focus-ring"
              >
                Start Swapping
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 transform hover:scale-105 bg-transparent focus-ring"
              >
                Browse Items
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  10K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Items Swapped
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  5K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Active Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  2.5T
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  CO₂ Saved
                </div>
              </div>
            </div>
          </div>

          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 dark:from-emerald-600 dark:to-teal-700 rounded-3xl transform rotate-6 scale-105 opacity-20 dark:opacity-30 animate-bounce-gentle"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl dark:shadow-emerald-900/20 p-8 transform hover:scale-105 transition-transform duration-500 border dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  {featuredItems.slice(0, 4).map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 transform hover:scale-110 transition-all duration-300 hover:shadow-lg dark:hover:shadow-emerald-900/30"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={120}
                        height={120}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {item.points} points
                      </p>
                    </div>
                  ))}
                </div>
                <div className="absolute -top-4 -right-4 gradient-emerald text-white rounded-full p-3 shadow-lg animate-bounce-gentle">
                  <Heart className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
