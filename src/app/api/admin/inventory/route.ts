import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

// GET /api/admin/inventory - Get inventory overview
export async function GET(req: Request) {
  const url = new URL(req.url);
  const filter = url.searchParams.get('filter') || 'all'; // all, low, out
  const type = url.searchParams.get('type') || 'all'; // all, PART, USED_UNIT, NEW_MODEL
  const search = url.searchParams.get('search') || '';

  try {
    // Get stats
    const statsResult = await sql`SELECT * FROM get_inventory_stats()`;
    const stats = statsResult.rows[0];

    // Build query based on filters
    let items;

    if (filter === 'low') {
      items = await sql`
        SELECT * FROM v_low_stock_items
        WHERE (${type} = 'all' OR item_type::TEXT = ${type})
          AND (${search} = '' OR title ILIKE ${'%' + search + '%'} OR part_number ILIKE ${'%' + search + '%'})
        LIMIT 100
      `;
    } else {
      items = await sql`
        SELECT * FROM v_inventory_overview
        WHERE (${type} = 'all' OR item_type::TEXT = ${type})
          AND (${filter} = 'all' OR
               (${filter} = 'out' AND quantity_on_hand = 0) OR
               (${filter} = 'ok' AND stock_status = 'OK'))
          AND (${search} = '' OR title ILIKE ${'%' + search + '%'} OR part_number ILIKE ${'%' + search + '%'})
        LIMIT 100
      `;
    }

    return NextResponse.json({
      stats,
      items: items.rows,
    });
  } catch (error) {
    console.error('Inventory API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}
