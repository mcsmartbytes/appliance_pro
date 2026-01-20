import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'orders@resend.dev';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || '';

interface OrderItem {
  title: string;
  quantity: number;
  price: number | null;
  part_number?: string | null;
  model_number?: string | null;
}

interface OrderDetails {
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
  orderNumber: string;
}

export async function sendOrderNotification(order: OrderDetails) {
  if (!NOTIFY_EMAIL) {
    console.warn('NOTIFY_EMAIL not set, skipping email notification');
    return { success: false, error: 'NOTIFY_EMAIL not configured' };
  }

  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.title}${item.part_number ? ` (Part #${item.part_number})` : ''}${item.model_number ? ` (Model: ${item.model_number})` : ''}
   Qty: ${item.quantity} × $${item.price?.toFixed(2) || 'TBD'}`
    )
    .join('\n\n');

  const emailHtml = `
    <h2>New Order Received - #${order.orderNumber}</h2>

    <h3>Customer Information</h3>
    <p>
      <strong>Name:</strong> ${order.customer.name}<br>
      <strong>Email:</strong> ${order.customer.email}<br>
      <strong>Phone:</strong> ${order.customer.phone}
    </p>

    ${order.customer.address ? `
    <h3>Delivery Address</h3>
    <p>
      ${order.customer.address}<br>
      ${order.customer.city}, ${order.customer.state} ${order.customer.zip}
    </p>
    ` : ''}

    ${order.customer.notes ? `
    <h3>Customer Notes</h3>
    <p>${order.customer.notes}</p>
    ` : ''}

    <h3>Order Items</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: #f3f4f6;">
          <th style="text-align: left; padding: 8px; border: 1px solid #e5e7eb;">Item</th>
          <th style="text-align: center; padding: 8px; border: 1px solid #e5e7eb;">Qty</th>
          <th style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">
              ${item.title}
              ${item.part_number ? `<br><small>Part #${item.part_number}</small>` : ''}
              ${item.model_number ? `<br><small>Model: ${item.model_number}</small>` : ''}
            </td>
            <td style="text-align: center; padding: 8px; border: 1px solid #e5e7eb;">${item.quantity}</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">$${((item.price || 0) * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr style="background: #f3f4f6; font-weight: bold;">
          <td colspan="2" style="padding: 8px; border: 1px solid #e5e7eb;">Subtotal</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">$${order.subtotal.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>

    <p style="margin-top: 20px; color: #6b7280;">
      <em>Please contact the customer to confirm the order and arrange payment/delivery.</em>
    </p>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New Order #${order.orderNumber} - ${order.customer.name}`,
      html: emailHtml,
      text: `
New Order Received - #${order.orderNumber}

CUSTOMER
Name: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
${order.customer.address ? `
ADDRESS
${order.customer.address}
${order.customer.city}, ${order.customer.state} ${order.customer.zip}
` : ''}
${order.customer.notes ? `
NOTES
${order.customer.notes}
` : ''}

ORDER ITEMS
${itemsList}

SUBTOTAL: $${order.subtotal.toFixed(2)}

Please contact the customer to confirm the order and arrange payment/delivery.
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendContactInquiry(inquiry: {
  name: string;
  phone: string;
  message: string;
}) {
  if (!NOTIFY_EMAIL) {
    console.warn('NOTIFY_EMAIL not set, skipping email notification');
    return { success: false, error: 'NOTIFY_EMAIL not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `Website Inquiry from ${inquiry.name}`,
      html: `
        <h2>New Website Inquiry</h2>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Phone:</strong> <a href="tel:${inquiry.phone}">${inquiry.phone}</a></p>
        <h3>Message</h3>
        <p>${inquiry.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #6b7280; font-size: 12px;">
          This inquiry was submitted through the website contact form.
        </p>
      `,
      text: `New Website Inquiry\n\nName: ${inquiry.name}\nPhone: ${inquiry.phone}\n\nMessage:\n${inquiry.message}`,
    });

    if (error) {
      console.error('Contact email error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Contact email error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendLowStockAlert(items: { title: string; quantity: number; reorder_point: number }[]) {
  if (!NOTIFY_EMAIL) {
    return { success: false, error: 'NOTIFY_EMAIL not configured' };
  }

  const itemsList = items
    .map((item) => `• ${item.title} - ${item.quantity} left (reorder at ${item.reorder_point})`)
    .join('\n');

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `Low Stock Alert - ${items.length} item(s) need reordering`,
      html: `
        <h2>Low Stock Alert</h2>
        <p>The following items are running low and need to be reordered:</p>
        <ul>
          ${items.map(item => `
            <li><strong>${item.title}</strong> - ${item.quantity} left (reorder point: ${item.reorder_point})</li>
          `).join('')}
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/inventory">View Inventory Dashboard</a></p>
      `,
      text: `Low Stock Alert\n\n${itemsList}\n\nView inventory at: ${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/inventory`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
