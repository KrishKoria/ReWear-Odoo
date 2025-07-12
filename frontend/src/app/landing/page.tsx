"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Users, Shirt, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import Hero from "@/components/hero";
import Carasoul from "@/components/carasoul";
import Footer from "@/components/footer";

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 transition-colors duration-300">
      <header className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-emerald-100 dark:border-emerald-800 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/landing" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                href="/browse"
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
                asChild
                variant="outline"
                size="sm"
                className="border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Link href="/sign-up">Join ReWear</Link>
              </Button>
            </nav>

            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-300"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

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
                  href="/browse"
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
                    asChild
                    variant="outline"
                    className="border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 bg-transparent"
                  >
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Link href="/sign-up">Join ReWear</Link>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      <Hero featuredItems={featuredItems} isVisible={isVisible} />
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
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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

      <Carasoul
        featuredItems={featuredItems}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
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
              asChild
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/browse">Start Swapping Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105 bg-transparent"
            >
              <Link href="/upload">List an Item</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
