import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import type { ItemCard } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all three sections in parallel
    const [usedResult, partsResult, newResult] = await Promise.all([
      // Used Deals
      sql<ItemCard>`
        SELECT *
        FROM v_item_cards
        WHERE item_type = 'USED_UNIT'
          AND visibility = 'PUBLIC'
          AND status = 'AVAILABLE'
        ORDER BY created_at DESC
        LIMIT 12
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
        LIMIT 12
      `,

      // New Appliances
      sql<ItemCard>`
        SELECT *
        FROM v_item_cards
        WHERE item_type = 'NEW_MODEL'
          AND visibility = 'PUBLIC'
          AND status IN ('AVAILABLE', 'RESERVED', 'IN_REPAIR')
        ORDER BY created_at DESC
        LIMIT 12
      `,
    ]);

    return NextResponse.json({
      used: usedResult.rows,
      parts: partsResult.rows,
      new: newResult.rows,
    });
  } catch (error) {
    console.error('Home API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}
