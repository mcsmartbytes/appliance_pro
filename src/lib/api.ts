import type { ItemCard, GalleryItem, DeliverySlot } from './db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

// Homepage data
export interface HomeData {
  used: ItemCard[];
  parts: ItemCard[];
  new: ItemCard[];
}

export async function fetchHomeData(): Promise<HomeData> {
  const res = await fetch(`${BASE_URL}/api/public/home`, {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });
  if (!res.ok) throw new Error('Failed to fetch home data');
  return res.json();
}

// Search
export interface SearchParams {
  q: string;
  type?: 'ALL' | 'USED_UNIT' | 'PART' | 'NEW_MODEL';
  limit?: number;
  offset?: number;
}

export interface SearchResult extends ItemCard {
  rank: number;
}

export interface SearchResponse {
  results: SearchResult[];
}

export async function searchItems(params: SearchParams): Promise<SearchResponse> {
  const searchParams = new URLSearchParams({
    q: params.q,
    type: params.type || 'ALL',
    limit: String(params.limit || 30),
    offset: String(params.offset || 0),
  });

  const res = await fetch(`${BASE_URL}/api/public/search?${searchParams}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

// Item detail
export interface ItemDetailResponse {
  item: ItemCard;
  gallery: GalleryItem[];
}

export async function fetchItemDetail(id: string): Promise<ItemDetailResponse> {
  const res = await fetch(`${BASE_URL}/api/public/items/${id}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('Item not found');
    throw new Error('Failed to fetch item');
  }
  return res.json();
}

// Delivery availability
export interface DeliveryAvailabilityResponse {
  availability: DeliverySlot[];
  byDate: Record<string, DeliverySlot[]>;
}

export async function fetchDeliveryAvailability(
  dateFrom: string,
  days: number = 14
): Promise<DeliveryAvailabilityResponse> {
  const res = await fetch(
    `${BASE_URL}/api/public/delivery/availability?dateFrom=${dateFrom}&days=${days}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to fetch delivery availability');
  return res.json();
}

// Helper to get display image
export function getItemImage(item: ItemCard): string {
  return item.primary_photo_url || item.model_image_url || '/images/placeholder.png';
}

// Helper to format price
export function formatPrice(price: number | null): string {
  if (price === null) return 'Contact for Price';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

// Helper to get item type label
export function getItemTypeLabel(type: string): string {
  switch (type) {
    case 'USED_UNIT':
      return 'Used';
    case 'PART':
      return 'Part';
    case 'NEW_MODEL':
      return 'New';
    default:
      return type;
  }
}

// Helper to get condition color
export function getConditionColor(condition: string | null): string {
  switch (condition) {
    case 'NEW':
      return 'bg-emerald-100 text-emerald-800';
    case 'LIKE_NEW':
      return 'bg-blue-100 text-blue-800';
    case 'GOOD':
      return 'bg-sky-100 text-sky-800';
    case 'FAIR':
      return 'bg-amber-100 text-amber-800';
    case 'POOR':
    case 'FOR_PARTS':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Helper to get status badge
export function getStatusBadge(status: string): { label: string; className: string } {
  switch (status) {
    case 'AVAILABLE':
      return { label: 'Available', className: 'bg-emerald-500 text-white' };
    case 'RESERVED':
      return { label: 'Reserved', className: 'bg-amber-500 text-white' };
    case 'SOLD':
      return { label: 'Sold', className: 'bg-gray-500 text-white' };
    case 'IN_REPAIR':
      return { label: 'In Repair', className: 'bg-blue-500 text-white' };
    default:
      return { label: status, className: 'bg-gray-500 text-white' };
  }
}
