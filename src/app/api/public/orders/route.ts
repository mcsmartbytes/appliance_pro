import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { sendOrderNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

interface OrderItem {
  id: string;
  title: string;
  price: number | null;
  quantity: number;
  part_number?: string | null;
  model_number?: string | null;
}

interface OrderRequest {
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
}

export async function POST(request: Request) {
  try {
    const body: OrderRequest = await request.json();
    const { customer, items, subtotal } = body;

    // Validate required fields
    if (!customer.name || !customer.email || !customer.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumResult = await sql`SELECT generate_order_number() as order_number`;
    const orderNumber = orderNumResult.rows[0].order_number;

    // Create order
    const orderResult = await sql`
      INSERT INTO online_orders (
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        address_line1,
        city,
        state,
        zip,
        notes,
        subtotal
      ) VALUES (
        ${orderNumber},
        ${customer.name},
        ${customer.email},
        ${customer.phone},
        ${customer.address || null},
        ${customer.city || null},
        ${customer.state || null},
        ${customer.zip || null},
        ${customer.notes || null},
        ${subtotal}
      )
      RETURNING id
    `;

    const orderId = orderResult.rows[0].id;

    // Insert order items
    for (const item of items) {
      await sql`
        INSERT INTO online_order_items (
          order_id,
          item_id,
          title,
          part_number,
          model_number,
          price,
          quantity
        ) VALUES (
          ${orderId}::UUID,
          ${item.id}::UUID,
          ${item.title},
          ${item.part_number || null},
          ${item.model_number || null},
          ${item.price},
          ${item.quantity}
        )
      `;
    }

    // Send email notification
    const emailResult = await sendOrderNotification({
      orderNumber,
      customer,
      items,
      subtotal,
    });

    // Update email_sent status
    if (emailResult.success) {
      await sql`
        UPDATE online_orders SET email_sent = TRUE WHERE id = ${orderId}::UUID
      `;
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error('Order submission error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit order' },
      { status: 500 }
    );
  }
}
