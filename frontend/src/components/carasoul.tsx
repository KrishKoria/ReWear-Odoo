import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";

export default function Carasoul({
  featuredItems,
  nextSlide,
  prevSlide,
  currentSlide,
  setCurrentSlide,
}: {
  featuredItems: {
    id: number;
    title: string;
    image?: string;
    points: number;
    condition: string;
    category: string;
    size?: string;
  }[];
  nextSlide: () => void;
  prevSlide: () => void;
  currentSlide: number;
  setCurrentSlide: (slideIndex: number) => void;
}) {
  return (
    <section
      id="browse"
      className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-emerald-950 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Items
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover amazing pieces from our community
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({
                length: Math.ceil(featuredItems.length / 3),
              }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-3 gap-6 px-4">
                    {featuredItems
                      .slice(slideIndex * 3, (slideIndex + 1) * 3)
                      .map((item) => (
                        <Card
                          key={item.id}
                          className="overflow-hidden border-0 shadow-lg dark:shadow-emerald-900/20 hover:shadow-2xl dark:hover:shadow-emerald-900/30 transition-all duration-500 transform hover:scale-105 group bg-white dark:bg-gray-800 animate-scale-in"
                        >
                          <div className="relative">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={300}
                              height={300}
                              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-300 hover:bg-white dark:hover:bg-gray-800">
                                {item.category}
                              </Badge>
                            </div>
                            <div className="absolute top-4 right-4">
                              <button className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors duration-300 focus-ring">
                                <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors duration-300" />
                              </button>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                              {item.title}
                            </h3>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Size: {item.size}
                              </span>
                              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                {item.condition}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                {item.points} points
                              </span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  4.8
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-300 z-10 border dark:border-gray-700 focus-ring"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-300 z-10 border dark:border-gray-700 focus-ring"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: Math.ceil(featuredItems.length / 3) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    currentSlide === index
                      ? "bg-emerald-500 dark:bg-emerald-400"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
