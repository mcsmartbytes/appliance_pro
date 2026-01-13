import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

// GET single order with items
export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    // Get order
    const orderQuery = await sql`
      SELECT *
      FROM online_orders
      WHERE id = ${orderId}::UUID
    `;

    if (orderQuery.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Mark as viewed
    await sql`
      UPDATE online_orders
      SET viewed_at = COALESCE(viewed_at, NOW())
      WHERE id = ${orderId}::UUID
    `;

    // Get order items
    const itemsQuery = await sql`
      SELECT
        oi.*,
        i.status AS item_status,
        (SELECT m.url FROM item_media im JOIN media m ON m.id = im.media_id WHERE im.item_id = oi.item_id AND im.is_primary = TRUE LIMIT 1) AS image_url
      FROM online_order_items oi
      LEFT JOIN items i ON i.id = oi.item_id
      WHERE oi.order_id = ${orderId}::UUID
    `;

    return NextResponse.json({
      order: orderQuery.rows[0],
      items: itemsQuery.rows,
    });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH - Update order status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await sql`
      UPDATE online_orders
      SET status = ${status}::order_status_enum, updated_at = NOW()
      WHERE id = ${orderId}::UUID
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update order' },
      { status: 500 }
    );
  }
}
