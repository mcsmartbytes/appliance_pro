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
          <p className="hidden sm:block">Serving Sedalia &amp; Surrounding Areas Since 1998</p>
          <p className="sm:hidden">Sedalia&apos;s Appliance Shop</p>
          <div className="flex items-center gap-4">
            <a href="tel:+16605535055" className="hover:text-[#D2691E] transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (660) 553-5055
            </a>
            <span className="hidden sm:inline text-gray-500">|</span>
            <span className="hidden sm:inline">Mon-Fri: 9AM - 6PM</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-gray-900">
              Benitz<span className="text-[#D2691E]"> Appliance</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button className="text-gray-700 hover:text-[#D2691E] font-medium transition-colors flex items-center gap-1">
                Shop
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Dropdown */}
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link
                  href="/search?type=USED_UNIT"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#D2691E] first:rounded-t-lg"
                >
                  Used Appliances
                </Link>
                <Link
                  href="/search?type=NEW_MODEL"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#D2691E]"
                >
                  New Appliances
                </Link>
                <Link
                  href="/search?type=PART"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#D2691E] last:rounded-b-lg"
                >
                  Parts
                </Link>
              </div>
            </div>
            <Link
              href="/delivery"
              className="text-gray-700 hover:text-[#D2691E] font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              href="#contact"
              className="text-gray-700 hover:text-[#D2691E] font-medium transition-colors"
            >
              Contact
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
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2">Shop</p>
            <Link
              href="/search?type=USED_UNIT"
              className="block py-2 text-gray-700 hover:text-[#D2691E] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Used Appliances
            </Link>
            <Link
              href="/search?type=NEW_MODEL"
              className="block py-2 text-gray-700 hover:text-[#D2691E] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              New Appliances
            </Link>
            <Link
              href="/search?type=PART"
              className="block py-2 text-gray-700 hover:text-[#D2691E] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Parts
            </Link>
            <hr className="my-2" />
            <Link
              href="/delivery"
              className="block py-2 text-gray-700 hover:text-[#D2691E] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Delivery &amp; Services
            </Link>
            <Link
              href="#contact"
              className="block py-2 text-gray-700 hover:text-[#D2691E] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
