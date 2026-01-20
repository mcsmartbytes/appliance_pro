import { NextRequest, NextResponse } from 'next/server';
import { sendContactInquiry } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    // Validate required fields
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, phone, and message are required' },
        { status: 400 }
      );
    }

    // Basic phone validation (at least 10 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // Send the email
    const result = await sendContactInquiry({
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });

    if (!result.success) {
      console.error('Contact form email failed:', result.error);
      // Still return success to user - we don't want to expose email issues
      // In production, you might want to log this to a database as backup
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We\'ll be in touch soon!',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}
