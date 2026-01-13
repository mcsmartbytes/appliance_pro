import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import type { ItemCard, GalleryItem } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Fetch item details
    const itemResult = await sql<ItemCard>`
      SELECT *
      FROM v_item_cards
      WHERE id = ${id}::UUID
    `;

    if (itemResult.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const item = itemResult.rows[0];

    // Fetch gallery
    const galleryResult = await sql<GalleryItem>`
      SELECT *
      FROM v_item_gallery
      WHERE item_id = ${id}::UUID
      ORDER BY is_primary DESC, sort_order ASC
    `;

    return NextResponse.json({
      item,
      gallery: galleryResult.rows,
    });
  } catch (error) {
    console.error('Item detail API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}
