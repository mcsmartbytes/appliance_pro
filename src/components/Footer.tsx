import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold text-white">
              Benitz<span className="text-[#D2691E]"> Appliance</span>
            </span>
            <p className="mt-4 text-gray-400 max-w-md">
              Sedalia&apos;s trusted source for quality used and new appliances since 1998.
              Clean, tested units plus genuine parts. Professional delivery throughout the area.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Serving Sedalia, Warrensburg, Warsaw, Boonville, and Marshall
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search?type=USED_UNIT" className="hover:text-[#D2691E] transition-colors">
                  Used Appliances
                </Link>
              </li>
              <li>
                <Link href="/search?type=NEW_MODEL" className="hover:text-[#D2691E] transition-colors">
                  New Appliances
                </Link>
              </li>
              <li>
                <Link href="/search?type=PART" className="hover:text-[#D2691E] transition-colors">
                  Parts
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-[#D2691E] transition-colors">
                  Delivery &amp; Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="tel:+16605535055" className="hover:text-[#D2691E] transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (660) 553-5055
                </a>
              </li>
              <li>
                <a href="mailto:info@benitzapplianceshop.com" className="hover:text-[#D2691E] transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  info@benitzapplianceshop.com
                </a>
              </li>
              <li className="text-gray-400 flex items-start gap-2">
                <svg className="w-4 h-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  701 W Main St<br />
                  Sedalia, MO 65301
                </span>
              </li>
              <li className="text-gray-400 flex items-start gap-2">
                <svg className="w-4 h-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Mon-Fri: 9AM - 6PM<br />
                  Sat: 9AM - 3PM<br />
                  Sun: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Benitz Appliance Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
