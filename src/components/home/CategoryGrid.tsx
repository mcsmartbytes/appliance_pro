import Link from 'next/link';
import type { CategoryCount } from '@/lib/db';

interface CategoryGridProps {
  categories: CategoryCount[];
  partsCount: number;
}

// SVG icons for each category
const categoryIcons: Record<string, React.ReactNode> = {
  refrigerators: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM3 10h18M12 10v11M8 6h.01M8 14h.01" />
    </svg>
  ),
  washers: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM12 16a4 4 0 100-8 4 4 0 000 8zM8 6h.01M11 6h.01" />
    </svg>
  ),
  dryers: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM12 16a4 4 0 100-8 4 4 0 000 8zM8 6h.01M11 6h2" />
    </svg>
  ),
  ranges: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM3 14h18M8 7h.01M12 7h.01M16 7h.01M7 18h2M15 18h2" />
    </svg>
  ),
  dishwashers: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM3 8h18M8 5h.01M12 12h.01M8 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </svg>
  ),
  freezers: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM12 3v18M7 8l5 4 5-4M7 16l5-4 5 4" />
    </svg>
  ),
  microwaves: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zM15 10h2M15 14h2M6 10h6v4H6z" />
    </svg>
  ),
  parts: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

function getIcon(slug: string): React.ReactNode {
  return categoryIcons[slug] || categoryIcons['refrigerators'];
}

export default function CategoryGrid({ categories, partsCount }: CategoryGridProps) {
  // Filter to main appliance categories and add parts
  const mainCategories = categories.filter(c => c.total_count > 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {mainCategories.map((category) => (
        <Link
          key={category.category_id}
          href={`/search?category=${category.slug}`}
          className="group flex flex-col items-center p-6 bg-white rounded-xl border-2 border-gray-100 hover:border-[#D2691E] transition-all hover:shadow-lg"
        >
          <div className="text-gray-400 group-hover:text-[#D2691E] transition-colors mb-3">
            {getIcon(category.slug)}
          </div>
          <h3 className="font-semibold text-gray-900 text-center mb-1">
            {category.category_name}
          </h3>
          <p className="text-sm text-gray-500">
            {category.total_count} in stock
          </p>
        </Link>
      ))}

      {/* Parts category - always show */}
      <Link
        href="/search?type=PART"
        className="group flex flex-col items-center p-6 bg-white rounded-xl border-2 border-gray-100 hover:border-[#D2691E] transition-all hover:shadow-lg"
      >
        <div className="text-gray-400 group-hover:text-[#D2691E] transition-colors mb-3">
          {categoryIcons['parts']}
        </div>
        <h3 className="font-semibold text-gray-900 text-center mb-1">
          Parts
        </h3>
        <p className="text-sm text-gray-500">
          {partsCount} available
        </p>
      </Link>
    </div>
  );
}
