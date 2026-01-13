'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart';
import type { ItemCard } from '@/lib/db';

interface AddToCartButtonProps {
  item: ItemCard;
  className?: string;
  showQuantity?: boolean;
}

export default function AddToCartButton({
  item,
  className = '',
  showQuantity = false,
}: AddToCartButtonProps) {
  const { addItem, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = isInCart(item.id);
  const isAvailable = item.status === 'AVAILABLE';
  const hasStock = item.item_type !== 'PART' || item.quantity_on_hand > 0;

  const handleAdd = () => {
    addItem(item, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!isAvailable || !hasStock) {
    return (
      <button
        disabled
        className={`px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed ${className}`}
      >
        {!isAvailable ? 'Not Available' : 'Out of Stock'}
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showQuantity && (
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            -
          </button>
          <span className="px-3 py-2 min-w-[40px] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>
      )}
      <button
        onClick={handleAdd}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
          added
            ? 'bg-emerald-600 text-white'
            : inCart
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-blue-700 text-white hover:bg-blue-800'
        }`}
      >
        {added ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Added!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {inCart ? 'Add More' : 'Add to Cart'}
          </>
        )}
      </button>
    </div>
  );
}
