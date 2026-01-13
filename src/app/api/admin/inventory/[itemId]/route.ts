import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

// GET /api/admin/inventory/[itemId] - Get item inventory details
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;

  try {
    const itemResult = await sql`
      SELECT * FROM v_inventory_overview WHERE id = ${itemId}::UUID
    `;

    if (itemResult.rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Get recent history
    const historyResult = await sql`
      SELECT * FROM inventory_history
      WHERE item_id = ${itemId}::UUID
      ORDER BY created_at DESC
      LIMIT 20
    `;

    return NextResponse.json({
      item: itemResult.rows[0],
      history: historyResult.rows,
    });
  } catch (error) {
    console.error('Inventory item API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/inventory/[itemId] - Update inventory
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;

  try {
    const body = await request.json();
    const { quantity, reorder_point, change_type, notes } = body;

    // Update quantity if provided
    if (quantity !== undefined) {
      await sql`
        SELECT * FROM update_inventory(
          ${itemId}::UUID,
          ${quantity}::INTEGER,
          ${change_type || 'ADJUSTMENT'}::VARCHAR,
          ${notes || null}::TEXT
        )
      `;
    }

    // Update reorder point if provided
    if (reorder_point !== undefined) {
      await sql`
        UPDATE items
        SET reorder_point = ${reorder_point}::INTEGER
        WHERE id = ${itemId}::UUID
      `;
    }

    // Get updated item
    const itemResult = await sql`
      SELECT * FROM v_inventory_overview WHERE id = ${itemId}::UUID
    `;

    return NextResponse.json({
      ok: true,
      item: itemResult.rows[0],
    });
  } catch (error) {
    console.error('Inventory update API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}
