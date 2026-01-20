import { sql } from '@vercel/postgres';
import ItemCard from '@/components/ItemCard';
import SectionHeader from '@/components/SectionHeader';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import TrustSection from '@/components/home/TrustSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ShowroomSection from '@/components/home/ShowroomSection';
import ServicesSection from '@/components/home/ServicesSection';
import ContactSection from '@/components/home/ContactSection';
import RecentlyAddedStrip from '@/components/home/RecentlyAddedStrip';
import MobileBar from '@/components/home/MobileBar';
import type { ItemCard as ItemCardType, CategoryCount, HomeStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  try {
    const [usedResult, partsResult, newResult, categoryCountsResult, recentlyAddedResult, statsResult] = await Promise.all([
      // Used Deals
      sql<ItemCardType>`
        SELECT *
        FROM v_item_cards
        WHERE item_type = 'USED_UNIT'
          AND visibility = 'PUBLIC'
          AND status = 'AVAILABLE'
        ORDER BY created_at DESC
        LIMIT 8
      `,
      // Parts In Stock
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
      // New Appliances
      sql<ItemCardType>`
        SELECT *
        FROM v_item_cards
        WHERE item_type = 'NEW_MODEL'
          AND visibility = 'PUBLIC'
          AND status IN ('AVAILABLE', 'RESERVED', 'IN_REPAIR')
        ORDER BY created_at DESC
        LIMIT 8
      `,
      // Category counts
      sql<CategoryCount>`
        SELECT
          c.id as category_id,
          c.name as category_name,
          c.slug,
          COALESCE(SUM(CASE WHEN v.item_type = 'USED_UNIT' THEN 1 ELSE 0 END), 0)::int as used_count,
          COALESCE(SUM(CASE WHEN v.item_type = 'NEW_MODEL' THEN 1 ELSE 0 END), 0)::int as new_count,
          COUNT(v.id)::int as total_count
        FROM categories c
        LEFT JOIN v_item_cards v ON v.category_id = c.id
          AND v.visibility = 'PUBLIC'
          AND v.status = 'AVAILABLE'
        GROUP BY c.id, c.name, c.slug
        ORDER BY total_count DESC
      `,
      // Recently added
      sql<ItemCardType>`
        SELECT *
        FROM v_item_cards
        WHERE visibility = 'PUBLIC'
          AND status = 'AVAILABLE'
        ORDER BY created_at DESC
        LIMIT 6
      `,
      // Stats counts
      sql<HomeStats>`
        SELECT
          COALESCE(SUM(CASE WHEN item_type = 'USED_UNIT' THEN 1 ELSE 0 END), 0)::int as total_used,
          COALESCE(SUM(CASE WHEN item_type = 'NEW_MODEL' THEN 1 ELSE 0 END), 0)::int as total_new,
          COALESCE(SUM(CASE WHEN item_type = 'PART' THEN 1 ELSE 0 END), 0)::int as total_parts
        FROM v_item_cards
        WHERE visibility = 'PUBLIC'
          AND status = 'AVAILABLE'
      `,
    ]);

    return {
      used: usedResult.rows,
      parts: partsResult.rows,
      new: newResult.rows,
      categoryCounts: categoryCountsResult.rows,
      recentlyAdded: recentlyAddedResult.rows,
      stats: statsResult.rows[0] || { total_used: 0, total_new: 0, total_parts: 0 },
    };
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    return {
      used: [],
      parts: [],
      new: [],
      categoryCounts: [],
      recentlyAdded: [],
      stats: { total_used: 0, total_new: 0, total_parts: 0 },
    };
  }
}

export default async function HomePage() {
  const { used, parts, new: newItems, categoryCounts, recentlyAdded, stats } = await getHomeData();

  return (
    <div className="pb-16 md:pb-0">
      {/* Hero Section */}
      <HeroSection stats={stats} />

      {/* Shop by Category */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Shop by Category"
            subtitle="Find exactly what you need"
          />
          <CategoryGrid categories={categoryCounts} partsCount={stats.total_parts} />
        </div>
      </section>

      {/* What's In Stock Today - Used Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="What's In Stock Today"
            subtitle="Cleaned, tested, and ready for your home"
            viewAllHref="/search?type=USED_UNIT"
          />
          <p className="text-sm text-gray-500 mb-6">
            Updated automatically as inventory changes.
          </p>
          {used.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {used.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Check back soon for new inventory.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recently Added Strip */}
      <RecentlyAddedStrip items={recentlyAdded} />

      {/* Trust Section */}
      <TrustSection />

      {/* Showroom Section */}
      <ShowroomSection />

      {/* New Appliances Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="New Appliances"
            subtitle="Factory fresh with full manufacturer warranty"
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
              <p>Check back soon for new inventory.</p>
            </div>
          )}
        </div>
      </section>

      {/* Parts Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Parts In Stock"
            subtitle="Genuine OEM and quality aftermarket parts"
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
              <p>Check back soon for new parts.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Mobile Sticky Bar */}
      <MobileBar />
    </div>
  );
}
