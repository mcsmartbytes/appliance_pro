'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, Suspense } from 'react';
import ItemCard from '@/components/ItemCard';
import SearchBar from '@/components/SearchBar';
import type { ItemCard as ItemCardType } from '@/lib/db';
import { getItemTypeLabel } from '@/lib/api';

type ItemTypeFilter = 'ALL' | 'USED_UNIT' | 'PART' | 'NEW_MODEL';

interface SearchResult extends ItemCardType {
  rank?: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get('q') || '';
  const initialType = (searchParams.get('type') as ItemTypeFilter) || 'ALL';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ItemTypeFilter>(initialType);

  const doSearch = useCallback(async (query: string, type: ItemTypeFilter) => {
    if (!query.trim() && type === 'ALL') {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (type !== 'ALL') params.set('type', type);
      params.set('limit', '50');

      const res = await fetch(`/api/public/search?${params}`);
      if (!res.ok) throw new Error('Search failed');

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError('Failed to search. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial search on load
  useEffect(() => {
    if (initialQuery || initialType !== 'ALL') {
      doSearch(initialQuery, initialType);
    }
  }, [initialQuery, initialType, doSearch]);

  const handleTypeChange = (type: ItemTypeFilter) => {
    setSelectedType(type);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (type === 'ALL') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    router.push(`/search?${params.toString()}`);

    // Re-search
    doSearch(initialQuery, type);
  };

  const typeFilters: { value: ItemTypeFilter; label: string }[] = [
    { value: 'ALL', label: 'All Items' },
    { value: 'USED_UNIT', label: 'Used' },
    { value: 'PART', label: 'Parts' },
    { value: 'NEW_MODEL', label: 'New' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {initialQuery ? `Results for "${initialQuery}"` : 'Browse Inventory'}
        </h1>

        {/* Search Bar */}
        <div className="max-w-xl mb-6">
          <SearchBar defaultValue={initialQuery} />
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleTypeChange(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === filter.value
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Searching...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : results.length > 0 ? (
        <>
          <p className="text-gray-600 mb-4">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((item) => (
              <ItemCard key={item.id} item={item} showType={selectedType === 'ALL'} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
          <p className="mt-2 text-gray-500">
            {initialQuery
              ? `We couldn't find anything matching "${initialQuery}"`
              : 'Try searching for a product, part number, or brand'}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
