'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Submitted!</h1>

      {orderNumber && (
        <p className="text-lg text-gray-600 mb-4">
          Order Number: <span className="font-semibold text-gray-900">{orderNumber}</span>
        </p>
      )}

      <p className="text-gray-600 mb-8">
        Thank you for your order! We have received your request and will contact you shortly to confirm
        the details and arrange payment.
      </p>

      <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
        <h2 className="font-semibold text-blue-900 mb-2">What happens next?</h2>
        <ol className="list-decimal list-inside text-blue-800 space-y-2">
          <li>We will review your order and check item availability</li>
          <li>We will call or email you to confirm and collect payment</li>
          <li>If delivery was requested, we will schedule a delivery time</li>
          <li>Your items will be prepared for pickup or delivery</li>
        </ol>
      </div>

      <div className="space-y-3">
        <Link
          href="/"
          className="block w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
        >
          Continue Shopping
        </Link>
        <a
          href="tel:+15551234567"
          className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
        >
          Call Us: (555) 123-4567
        </a>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-4 py-16 text-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
