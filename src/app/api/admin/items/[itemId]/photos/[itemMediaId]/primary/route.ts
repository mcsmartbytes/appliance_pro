import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

// TODO: Add proper authentication middleware
// This endpoint should be protected by auth in production

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ itemId: string; itemMediaId: string }> }
) {
  const { itemId, itemMediaId } = await params;

  try {
    // Verify the item exists
    const itemCheck = await sql`
      SELECT id FROM items WHERE id = ${itemId}::UUID
    `;

    if (itemCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Verify the media belongs to this item
    const mediaCheck = await sql`
      SELECT id FROM item_media
      WHERE id = ${itemMediaId}::UUID
      AND item_id = ${itemId}::UUID
    `;

    if (mediaCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Photo not found for this item' },
        { status: 404 }
      );
    }

    // Clear existing primary flag for this item
    await sql`
      UPDATE item_media
      SET is_primary = FALSE
      WHERE item_id = ${itemId}::UUID
    `;

    // Set new primary
    await sql`
      UPDATE item_media
      SET is_primary = TRUE
      WHERE id = ${itemMediaId}::UUID
      AND item_id = ${itemId}::UUID
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Set primary photo error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}
