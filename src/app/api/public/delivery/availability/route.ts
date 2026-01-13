import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import type { DeliverySlot } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dateFrom = url.searchParams.get('dateFrom');
  const days = Math.min(Number(url.searchParams.get('days') ?? '14'), 30);

  if (!dateFrom) {
    return NextResponse.json(
      { error: 'dateFrom query parameter is required (YYYY-MM-DD format)' },
      { status: 400 }
    );
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateFrom)) {
    return NextResponse.json(
      { error: 'dateFrom must be in YYYY-MM-DD format' },
      { status: 400 }
    );
  }

  try {
    const result = await sql<DeliverySlot>`
      SELECT * FROM get_delivery_availability(
        ${dateFrom}::DATE,
        ${days}::INT
      )
    `;

    // Group by date for easier frontend consumption
    const byDate: Record<string, DeliverySlot[]> = {};
    for (const slot of result.rows) {
      const dateKey = slot.date.toString().split('T')[0];
      if (!byDate[dateKey]) {
        byDate[dateKey] = [];
      }
      byDate[dateKey].push(slot);
    }

    return NextResponse.json({
      availability: result.rows,
      byDate,
    });
  } catch (error) {
    console.error('Delivery availability API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}
