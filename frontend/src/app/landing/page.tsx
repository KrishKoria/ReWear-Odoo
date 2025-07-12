"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Recycle,
  Users,
  Shirt,
  ArrowRight,
  Star,
  Heart,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";

const featuredItems = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    size: "M",
    condition: "Excellent",
    points: 45,
    image: "/placeholder.svg?height=300&width=250",
    category: "Outerwear",
  },
  {
    id: 2,
    title: "Floral Summer Dress",
    size: "S",
    condition: "Like New",
    points: 35,
    image: "/placeholder.svg?height=300&width=250",
    category: "Dresses",
  },
  {
    id: 3,
    title: "Designer Sneakers",
    size: "9",
    condition: "Good",
    points: 55,
    image: "/placeholder.svg?height=300&width=250",
    category: "Shoes",
  },
  {
    id: 4,
    title: "Wool Sweater",
    size: "L",
    condition: "Excellent",
    points: 40,
    image: "/placeholder.svg?height=300&width=250",
    category: "Knitwear",
  },
  {
    id: 5,
    title: "Leather Handbag",
    size: "One Size",
    condition: "Very Good",
    points: 60,
    image: "/placeholder.svg?height=300&width=250",
    category: "Accessories",
  },
];

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % Math.ceil(featuredItems.length / 3)
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredItems.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(featuredItems.length / 3)) %
        Math.ceil(featuredItems.length / 3)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 transition-colors duration-300 scroll-smooth">
      <header className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-enhanced border-b border-emerald-100 dark:border-emerald-800 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 gradient-emerald rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Recycle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                ReWear
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#how-it-works"
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 font-medium"
              >
                How It Works
              </Link>
              <Link
                href="#browse"
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 font-medium"
              >
                Browse Items
              </Link>
              <Link
                href="#community"
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 font-medium"
              >
                Community
              </Link>
              <ThemeToggle />
              <Button
                variant="outline"
                className="border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 bg-transparent focus-ring"
              >
                Sign In
              </Button>
              <Button className="gradient-emerald hover:gradient-emerald-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus-ring">
                Join ReWear
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-300 focus-ring"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-emerald-100 dark:border-emerald-800 animate-fade-in">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="#how-it-works"
                  className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 font-medium"
                >
                  How It Works
                </Link>
                <Link
                  href="#browse"
                  className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 font-medium"
                >
                  Browse Items
                </Link>
                <Link
                  href="#community"
                  className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 font-medium"
                >
                  Community
                </Link>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button
                    variant="outline"
                    className="border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 bg-transparent focus-ring"
                  >
                    Sign In
                  </Button>
                  <Button className="gradient-emerald hover:gradient-emerald-dark text-white focus-ring">
                    Join ReWear
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
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

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How ReWear Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Three simple steps to start your sustainable fashion journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shirt,
                title: "List Your Items",
                description:
                  "Upload photos of clothes you no longer wear. Set swap preferences or point values.",
                step: "01",
              },
              {
                icon: Users,
                title: "Connect & Swap",
                description:
                  "Browse items from other users. Make direct swaps or use points to get what you love.",
                step: "02",
              },
              {
                icon: Recycle,
                title: "Sustain & Repeat",
                description:
                  "Enjoy your new-to-you items while reducing textile waste. Keep the cycle going!",
                step: "03",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-0 shadow-lg dark:shadow-emerald-900/20 hover:shadow-2xl dark:hover:shadow-emerald-900/30 transition-all duration-500 transform hover:-translate-y-2 group bg-white dark:bg-gray-800 animate-scale-in"
              >
                <CardContent className="p-8 text-center">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-emerald-100 dark:text-emerald-900/30 group-hover:text-emerald-200 dark:group-hover:text-emerald-800/50 transition-colors duration-300">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 gradient-emerald rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
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

      {/* CTA Section */}
      <section className="py-20 gradient-emerald-dark text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of fashion-forward individuals making a positive
            impact on the planet, one swap at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus-ring"
            >
              Start Swapping Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105 bg-transparent focus-ring"
            >
              List an Item
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 gradient-emerald rounded-lg flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ReWear</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 leading-relaxed">
                Transforming fashion through sustainable swapping. Join the
                movement towards a more conscious wardrobe.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li>
                  <Link
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    Browse Items
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    List an Item
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    Point System
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li>
                  <Link
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    Style Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li>
                  <Link
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500">
            <p>
              &copy; 2024 ReWear. All rights reserved. Made with 💚 for a
              sustainable future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
