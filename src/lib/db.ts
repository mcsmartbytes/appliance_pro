import { sql } from '@vercel/postgres';

// Types matching our database schema
export type ItemType = 'USED_UNIT' | 'PART' | 'NEW_MODEL';
export type ItemStatus = 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'IN_REPAIR';
export type ItemCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'FOR_PARTS';
export type Visibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
export type TestStatus = 'NOT_TESTED' | 'PASSED' | 'FAILED' | 'PARTIAL';
export type OemType = 'OEM' | 'AFTERMARKET' | 'UNIVERSAL';

// Item card shape (from v_item_cards view)
export interface ItemCard {
  id: string;
  item_type: ItemType;
  title: string;
  description: string | null;
  status: ItemStatus;
  condition: ItemCondition | null;
  visibility: Visibility;
  price: number | null;
  quantity_on_hand: number;
  sku: string | null;
  created_at: string;
  primary_photo_url: string | null;

  // Used unit fields
  cosmetic_grade: string | null;
  functional_test_status: TestStatus | null;
  warranty_days: number | null;
  serial_number: string | null;

  // Part fields
  part_number: string | null;
  part_manufacturer: string | null;
  oem_or_aftermarket: OemType | null;
  compatible_models: string[] | null;

  // New model fields
  catalog_model_id: string | null;
  is_floor_model: boolean | null;
  brand_id: string | null;
  brand_name: string | null;
  category_id: string | null;
  category_name: string | null;
  model_number: string | null;
  msrp: number | null;
  model_image_url: string | null;
}

// Gallery item shape
export interface GalleryItem {
  item_id: string;
  item_media_id: string;
  sort_order: number;
  is_primary: boolean;
  caption: string | null;
  public_url: string;
  mime_type: string | null;
}

// Delivery availability slot
export interface DeliverySlot {
  date: string;
  slot_id: string;
  start_time: string;
  end_time: string;
  max_deliveries: number;
  active_count: number;
  remaining: number;
}

// Category count for homepage
export interface CategoryCount {
  category_id: string;
  category_name: string;
  slug: string;
  used_count: number;
  new_count: number;
  total_count: number;
}

// Homepage stats
export interface HomeStats {
  total_used: number;
  total_new: number;
  total_parts: number;
}

// Re-export sql for direct use where needed
export { sql };
