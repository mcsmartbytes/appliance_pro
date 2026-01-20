import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import type { ItemCard, CategoryCount, HomeStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all data in parallel
    const [usedResult, partsResult, newResult, categoryCountsResult, recentlyAddedResult, statsResult] = await Promise.all([
      // Used Deals
      sql<ItemCard>`
        SELECT *
        FROM v_item_cards
        WHERE item_type = 'USED_UNIT'
          AND visibility = 'PUBLIC'
          AND status = 'AVAILABLE'
        ORDER BY created_at DESC
        LIMIT 8
      `,

      // Parts In Stock
      sql<ItemCard>`
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
      sql<ItemCard>`
        SELECT *
        FROM v_item_cards
        WHERE item_type = 'NEW_MODEL'
          AND visibility = 'PUBLIC'
          AND status IN ('AVAILABLE', 'RESERVED', 'IN_REPAIR')
        ORDER BY created_at DESC
        LIMIT 8
      `,

      // Category counts (Used + New appliances by category)
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

      // Recently added (6 newest across all types)
      sql<ItemCard>`
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

    return NextResponse.json({
      used: usedResult.rows,
      parts: partsResult.rows,
      new: newResult.rows,
      categoryCounts: categoryCountsResult.rows,
      recentlyAdded: recentlyAddedResult.rows,
      stats: statsResult.rows[0] || { total_used: 0, total_new: 0, total_parts: 0 },
    });
  } catch (error) {
    console.error('Home API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}
