import Link from 'next/link';
import type { HomeStats } from '@/lib/db';

interface HeroSectionProps {
  stats: HomeStats;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background image and overlays */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/benitz-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-orange-900/80" />
      </div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Top contact bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm mb-8 text-gray-300">
          <a href="tel:+16605535055" className="flex items-center gap-2 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            (660) 553-5055
          </a>
          <span className="hidden sm:inline text-gray-500">|</span>
          <a
            href="https://maps.google.com/?q=701+W+Main+St+Sedalia+MO"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            701 W Main St, Sedalia, MO
          </a>
        </div>

        {/* Main hero content */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Sedalia&apos;s Trusted Used &amp; New{' '}
            <span className="text-[#D2691E]">Appliance Shop</span>{' '}
            <span className="block text-2xl sm:text-3xl mt-2 font-normal text-gray-300">Since 1998</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Clean, tested appliances from major brands at prices well below retail.
            Professional delivery and flexible warranty options available.
          </p>
          <p className="text-sm sm:text-base text-gray-400 mb-8">
            Serving Sedalia, Warrensburg, Warsaw, Boonville, and Marshall.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/search?type=USED_UNIT"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-[#D2691E] hover:bg-[#c45c18] text-white transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Shop Used Appliances
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <div className="flex gap-3">
              <Link
                href="/search?type=PART"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                Browse Parts
              </Link>
              <Link
                href="/search?type=NEW_MODEL"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                View New
              </Link>
            </div>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full border border-white/20 text-sm">
              <svg className="w-5 h-5 text-[#D2691E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cleaned &amp; Tested
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full border border-white/20 text-sm">
              <svg className="w-5 h-5 text-[#D2691E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Local Delivery
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full border border-white/20 text-sm">
              <svg className="w-5 h-5 text-[#D2691E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Warranty Options
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-[#D2691E]">{stats.total_used}</div>
              <div className="text-sm text-gray-400">Used In Stock</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#D2691E]">{stats.total_new}</div>
              <div className="text-sm text-gray-400">New Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#D2691E]">{stats.total_parts}</div>
              <div className="text-sm text-gray-400">Parts Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
