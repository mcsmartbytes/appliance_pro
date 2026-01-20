'use client';

import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import type { ItemCard } from '@/lib/db';

interface ItemActionsProps {
  item: ItemCard;
}

export default function ItemActions({ item }: ItemActionsProps) {
  return (
    <div className="space-y-3">
      <AddToCartButton item={item} showQuantity className="w-full" />
      <a
        href="tel:+16605535055"
        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        Call for Questions
      </a>
      <Link
        href="/delivery"
        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Check Delivery Availability
      </Link>
    </div>
  );
}
