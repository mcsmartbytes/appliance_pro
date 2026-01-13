import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ImageGallery from '@/components/ImageGallery';
import type { ItemCard, GalleryItem } from '@/lib/db';
import {
  formatPrice,
  getItemTypeLabel,
  getConditionColor,
  getStatusBadge,
  getItemImage,
} from '@/lib/api';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getItemDetail(id: string) {
  try {
    const [itemResult, galleryResult] = await Promise.all([
      sql<ItemCard>`
        SELECT *
        FROM v_item_cards
        WHERE id = ${id}::UUID
      `,
      sql<GalleryItem>`
        SELECT *
        FROM v_item_gallery
        WHERE item_id = ${id}::UUID
        ORDER BY is_primary DESC, sort_order ASC
      `,
    ]);

    if (itemResult.rows.length === 0) {
      return null;
    }

    return {
      item: itemResult.rows[0],
      gallery: galleryResult.rows,
    };
  } catch (error) {
    console.error('Failed to fetch item detail:', error);
    return null;
  }
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getItemDetail(id);

  if (!data) {
    notFound();
  }

  const { item, gallery } = data;
  const statusBadge = getStatusBadge(item.status);
  const fallbackImage = item.model_image_url || '/images/placeholder.png';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-700">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/search?type=${item.item_type}`}
              className="hover:text-blue-700"
            >
              {getItemTypeLabel(item.item_type)}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate max-w-[200px]">
            {item.title}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <ImageGallery
            images={gallery}
            fallbackImage={fallbackImage}
            title={item.title}
          />
        </div>

        {/* Details */}
        <div>
          {/* Type Badge */}
          <span className="inline-block px-3 py-1 text-sm font-semibold rounded bg-gray-100 text-gray-700 mb-2">
            {getItemTypeLabel(item.item_type)}
          </span>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {item.title}
          </h1>

          {/* Brand & Category */}
          {(item.brand_name || item.category_name) && (
            <p className="text-gray-600 mb-4">
              {item.brand_name}
              {item.brand_name && item.category_name && ' • '}
              {item.category_name}
            </p>
          )}

          {/* Status */}
          {item.status !== 'AVAILABLE' && (
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded mb-4 ${statusBadge.className}`}
            >
              {statusBadge.label}
            </span>
          )}

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(item.price)}
            </span>
            {item.msrp && item.price && item.price < item.msrp && (
              <span className="ml-2 text-lg text-gray-400 line-through">
                {formatPrice(item.msrp)}
              </span>
            )}
            {item.msrp && item.price && item.price < item.msrp && (
              <span className="ml-2 px-2 py-1 text-sm font-semibold rounded bg-red-100 text-red-700">
                Save {formatPrice(item.msrp - item.price)}
              </span>
            )}
          </div>

          {/* Item-specific details */}
          <div className="space-y-4 mb-8">
            {/* Used Unit Details */}
            {item.item_type === 'USED_UNIT' && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Condition Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {item.condition && (
                    <div>
                      <span className="text-gray-500">Condition:</span>
                      <span
                        className={`ml-2 px-2 py-0.5 rounded ${getConditionColor(
                          item.condition
                        )}`}
                      >
                        {item.condition.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                  {item.cosmetic_grade && (
                    <div>
                      <span className="text-gray-500">Cosmetic Grade:</span>
                      <span className="ml-2 font-medium">{item.cosmetic_grade}</span>
                    </div>
                  )}
                  {item.functional_test_status && (
                    <div>
                      <span className="text-gray-500">Test Status:</span>
                      <span className="ml-2 font-medium">
                        {item.functional_test_status.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                  {item.warranty_days !== null && item.warranty_days > 0 && (
                    <div>
                      <span className="text-gray-500">Warranty:</span>
                      <span className="ml-2 font-medium text-emerald-600">
                        {item.warranty_days} days
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Part Details */}
            {item.item_type === 'PART' && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Part Information</h3>
                <div className="space-y-2 text-sm">
                  {item.part_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Part Number:</span>
                      <span className="font-mono font-medium">{item.part_number}</span>
                    </div>
                  )}
                  {item.part_manufacturer && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Manufacturer:</span>
                      <span className="font-medium">{item.part_manufacturer}</span>
                    </div>
                  )}
                  {item.oem_or_aftermarket && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium">{item.oem_or_aftermarket}</span>
                    </div>
                  )}
                  {item.quantity_on_hand > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">In Stock:</span>
                      <span className="font-medium text-emerald-600">
                        {item.quantity_on_hand} available
                      </span>
                    </div>
                  )}
                </div>
                {item.compatible_models && item.compatible_models.length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-500 text-sm">Compatible Models:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.compatible_models.map((model) => (
                        <span
                          key={model}
                          className="px-2 py-0.5 bg-white rounded text-xs font-mono"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* New Model Details */}
            {item.item_type === 'NEW_MODEL' && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Product Details</h3>
                <div className="space-y-2 text-sm">
                  {item.model_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Model Number:</span>
                      <span className="font-mono font-medium">{item.model_number}</span>
                    </div>
                  )}
                  {item.is_floor_model && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium text-purple-600">Floor Model</span>
                    </div>
                  )}
                  {item.quantity_on_hand > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">In Stock:</span>
                      <span className="font-medium text-emerald-600">
                        {item.quantity_on_hand} available
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{item.description}</p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="space-y-3">
            <a
              href="tel:+15551234567"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call to Purchase
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
        </div>
      </div>
    </div>
  );
}
