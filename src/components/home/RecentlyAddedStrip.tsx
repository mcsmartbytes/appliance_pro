import Link from 'next/link';
import Image from 'next/image';
import type { ItemCard } from '@/lib/db';
import { getItemImage, formatPrice } from '@/lib/api';

interface RecentlyAddedStripProps {
  items: ItemCard[];
}

export default function RecentlyAddedStrip({ items }: RecentlyAddedStripProps) {
  if (items.length === 0) return null;

  return (
    <section className="bg-[#D2691E]/5 py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#D2691E] rounded-full animate-pulse" />
            <h2 className="text-lg font-semibold text-gray-900">Just Added</h2>
          </div>
          <Link
            href="/search?sort=newest"
            className="text-sm text-[#D2691E] hover:underline font-medium"
          >
            View all new arrivals
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/items/${item.id}`}
              className="flex-shrink-0 w-48 group"
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={getItemImage(item)}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="192px"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`
                      px-2 py-0.5 text-xs font-medium rounded
                      ${item.item_type === 'USED_UNIT' ? 'bg-amber-100 text-amber-800' : ''}
                      ${item.item_type === 'NEW_MODEL' ? 'bg-emerald-100 text-emerald-800' : ''}
                      ${item.item_type === 'PART' ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      {item.item_type === 'USED_UNIT' ? 'Used' : item.item_type === 'NEW_MODEL' ? 'New' : 'Part'}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-[#D2691E] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 font-semibold text-[#D2691E]">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
