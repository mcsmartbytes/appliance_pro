import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get orders with item counts
    let ordersQuery;
    if (status === 'all') {
      ordersQuery = await sql`
        SELECT
          o.id,
          o.order_number,
          o.status,
          o.customer_name,
          o.customer_email,
          o.customer_phone,
          o.address_line1,
          o.city,
          o.state,
          o.zip,
          o.notes,
          o.subtotal,
          o.email_sent,
          o.viewed_at,
          o.created_at,
          COUNT(oi.id) AS item_count,
          COALESCE(SUM(oi.quantity), 0) AS total_units
        FROM online_orders o
        LEFT JOIN online_order_items oi ON oi.order_id = o.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT ${limit}
      `;
    } else {
      ordersQuery = await sql`
        SELECT
          o.id,
          o.order_number,
          o.status,
          o.customer_name,
          o.customer_email,
          o.customer_phone,
          o.address_line1,
          o.city,
          o.state,
          o.zip,
          o.notes,
          o.subtotal,
          o.email_sent,
          o.viewed_at,
          o.created_at,
          COUNT(oi.id) AS item_count,
          COALESCE(SUM(oi.quantity), 0) AS total_units
        FROM online_orders o
        LEFT JOIN online_order_items oi ON oi.order_id = o.id
        WHERE o.status = ${status}::order_status_enum
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT ${limit}
      `;
    }

    // Get stats
    const statsQuery = await sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'PENDING') AS pending_count,
        COUNT(*) FILTER (WHERE status = 'CONFIRMED') AS confirmed_count,
        COUNT(*) FILTER (WHERE status = 'PROCESSING') AS processing_count,
        COUNT(*) FILTER (WHERE status = 'READY') AS ready_count,
        COUNT(*) FILTER (WHERE viewed_at IS NULL) AS unviewed_count,
        COUNT(*) AS total_count
      FROM online_orders
    `;

    // Get low stock count for notifications
    const lowStockQuery = await sql`
      SELECT COUNT(*) AS count
      FROM items
      WHERE quantity_on_hand <= reorder_point AND status = 'ACTIVE'
    `;

    return NextResponse.json({
      orders: ordersQuery.rows,
      stats: statsQuery.rows[0],
      lowStockCount: parseInt(lowStockQuery.rows[0].count) || 0,
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
