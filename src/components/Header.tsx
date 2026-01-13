'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p>Free delivery on orders over $500</p>
          <div className="hidden sm:flex items-center gap-4">
            <a href="tel:+15551234567" className="hover:text-gray-300 transition-colors">
              (555) 123-4567
            </a>
            <span>|</span>
            <span>Mon-Sat: 9AM - 6PM</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-gray-900">
              Appliance<span className="text-blue-700">Pro</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/search?type=USED_UNIT"
              className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
            >
              Used
            </Link>
            <Link
              href="/search?type=PART"
              className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
            >
              Parts
            </Link>
            <Link
              href="/search?type=NEW_MODEL"
              className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
            >
              New
            </Link>
            <Link
              href="/delivery"
              className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
            >
              Delivery
            </Link>
            <CartIcon />
          </nav>

          {/* Cart Icon - Mobile */}
          <div className="md:hidden">
            <CartIcon />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 space-y-2">
            <Link
              href="/search?type=USED_UNIT"
              className="block py-2 text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Used Appliances
            </Link>
            <Link
              href="/search?type=PART"
              className="block py-2 text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Parts
            </Link>
            <Link
              href="/search?type=NEW_MODEL"
              className="block py-2 text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              New Appliances
            </Link>
            <Link
              href="/delivery"
              className="block py-2 text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Schedule Delivery
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
