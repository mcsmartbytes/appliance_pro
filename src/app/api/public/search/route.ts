import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const type = (url.searchParams.get('type') ?? 'ALL').toUpperCase();
  const limit = Math.min(Number(url.searchParams.get('limit') ?? '30'), 50);
  const offset = Math.max(Number(url.searchParams.get('offset') ?? '0'), 0);

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Use the search_items function we created
    const result = await sql`
      SELECT * FROM search_items(
        ${q}::TEXT,
        ${type}::TEXT,
        ${limit}::INT,
        ${offset}::INT
      )
    `;

    return NextResponse.json({ results: result.rows });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search error' },
      { status: 500 }
    );
  }
}
