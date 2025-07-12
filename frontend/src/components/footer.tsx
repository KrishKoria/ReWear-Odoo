import { Recycle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
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
  );
}
