import { sql } from '@vercel/postgres';
import ItemCard from '@/components/ItemCard';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import type { ItemCard as ItemCardType } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  try {
    const [usedResult, partsResult, newResult] = await Promise.all([
      sql<ItemCardType>`
        SELECT *
        FROM v_item_cards
        WHERE item_type = 'USED_UNIT'
          AND visibility = 'PUBLIC'
          AND status = 'AVAILABLE'
        ORDER BY created_at DESC
        LIMIT 8
      `,
      sql<ItemCardType>`
        SELECT *
        FROM v_item_cards
        WHERE item_type = 'PART'
          AND visibility = 'PUBLIC'
          AND status = 'AVAILABLE'
          AND quantity_on_hand > 0
        ORDER BY created_at DESC
        LIMIT 8
      `,
      sql<ItemCardType>`
        SELECT *
        FROM v_item_cards
        WHERE item_type = 'NEW_MODEL'
          AND visibility = 'PUBLIC'
          AND status IN ('AVAILABLE', 'RESERVED', 'IN_REPAIR')
        ORDER BY created_at DESC
        LIMIT 8
      `,
    ]);

    return {
      used: usedResult.rows,
      parts: partsResult.rows,
      new: newResult.rows,
    };
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    return { used: [], parts: [], new: [] };
  }
}

export default async function HomePage() {
  const { used, parts, new: newItems } = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Quality Appliances at{' '}
              <span className="text-blue-400">Affordable Prices</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Shop our selection of new and refurbished appliances, genuine parts,
              and schedule professional delivery to your home.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/search?type=USED_UNIT"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Shop Used Deals
              </Link>
              <Link
                href="/search?type=NEW_MODEL"
                className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Browse New
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Quality Tested</p>
                <p className="text-sm text-gray-600">All units inspected & tested</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Professional Delivery</p>
                <p className="text-sm text-gray-600">We bring it to your door</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Warranty Included</p>
                <p className="text-sm text-gray-600">30-90 day coverage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Used Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader
          title="Used Deals"
          subtitle="Refurbished appliances at great prices"
          viewAllHref="/search?type=USED_UNIT"
        />
        {used.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {used.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No used appliances available at the moment.</p>
          </div>
        )}
      </section>

      {/* Parts Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SectionHeader
            title="Parts In Stock"
            subtitle="Genuine OEM and aftermarket parts"
            viewAllHref="/search?type=PART"
          />
          {parts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {parts.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No parts available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* New Appliances Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader
          title="New Appliances"
          subtitle="Factory fresh with full warranty"
          viewAllHref="/search?type=NEW_MODEL"
        />
        {newItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No new appliances available at the moment.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Need Help Finding the Right Appliance?
          </h2>
          <p className="mt-2 text-blue-100">
            Our experts are ready to help you find exactly what you need.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+15551234567"
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Call (555) 123-4567
            </a>
            <Link
              href="/delivery"
              className="px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors"
            >
              Schedule Delivery
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
