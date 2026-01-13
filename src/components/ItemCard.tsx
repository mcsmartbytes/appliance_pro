'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ItemCard as ItemCardType } from '@/lib/db';
import {
  getItemImage,
  formatPrice,
  getItemTypeLabel,
  getConditionColor,
  getStatusBadge,
} from '@/lib/api';

interface ItemCardProps {
  item: ItemCardType;
  showType?: boolean;
}

export default function ItemCard({ item, showType = false }: ItemCardProps) {
  const imageUrl = getItemImage(item);
  const statusBadge = getStatusBadge(item.status);

  return (
    <Link
      href={`/items/${item.id}`}
      className="group block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Status Badge */}
        {item.status !== 'AVAILABLE' && (
          <span
            className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded ${statusBadge.className}`}
          >
            {statusBadge.label}
          </span>
        )}

        {/* Type Badge */}
        {showType && (
          <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded bg-gray-900 text-white">
            {getItemTypeLabel(item.item_type)}
          </span>
        )}

        {/* Floor Model Badge */}
        {item.is_floor_model && (
          <span className="absolute bottom-2 left-2 px-2 py-1 text-xs font-semibold rounded bg-purple-600 text-white">
            Floor Model
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand & Category */}
        {(item.brand_name || item.category_name) && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            {item.brand_name && <span>{item.brand_name}</span>}
            {item.brand_name && item.category_name && <span>•</span>}
            {item.category_name && <span>{item.category_name}</span>}
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {item.title}
        </h3>

        {/* Part Number (for parts) */}
        {item.part_number && (
          <p className="text-sm text-gray-600 mt-1">
            Part #: <span className="font-mono">{item.part_number}</span>
          </p>
        )}

        {/* Model Number (for new/used) */}
        {item.model_number && !item.part_number && (
          <p className="text-sm text-gray-600 mt-1">
            Model: <span className="font-mono">{item.model_number}</span>
          </p>
        )}

        {/* Condition & Warranty (for used) */}
        {item.item_type === 'USED_UNIT' && (
          <div className="flex items-center gap-2 mt-2">
            {item.condition && (
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded ${getConditionColor(
                  item.condition
                )}`}
              >
                {item.condition.replace('_', ' ')}
              </span>
            )}
            {item.cosmetic_grade && (
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                Grade {item.cosmetic_grade}
              </span>
            )}
            {item.warranty_days && item.warranty_days > 0 && (
              <span className="text-xs text-gray-500">
                {item.warranty_days} day warranty
              </span>
            )}
          </div>
        )}

        {/* Stock (for parts) */}
        {item.item_type === 'PART' && item.quantity_on_hand > 0 && (
          <p className="text-sm text-emerald-600 mt-2">
            {item.quantity_on_hand} in stock
          </p>
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(item.price)}
          </span>
          {item.msrp && item.price && item.price < item.msrp && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(item.msrp)}
            </span>
          )}
        </div>

        {/* Savings Badge */}
        {item.msrp && item.price && item.price < item.msrp && (
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-700">
            Save {formatPrice(item.msrp - item.price)}
          </span>
        )}
      </div>
    </Link>
  );
}
