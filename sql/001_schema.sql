-- ============================================
-- APPLIANCE PRO DATABASE SCHEMA
-- Run this in Vercel Postgres SQL console
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE item_type_enum AS ENUM ('USED_UNIT', 'PART', 'NEW_MODEL');
CREATE TYPE item_status_enum AS ENUM ('DRAFT', 'AVAILABLE', 'RESERVED', 'SOLD', 'IN_REPAIR');
CREATE TYPE item_condition_enum AS ENUM ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR', 'FOR_PARTS');
CREATE TYPE visibility_enum AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED');
CREATE TYPE test_status_enum AS ENUM ('NOT_TESTED', 'PASSED', 'FAILED', 'PARTIAL');
CREATE TYPE oem_enum AS ENUM ('OEM', 'AFTERMARKET', 'UNIVERSAL');
CREATE TYPE delivery_status_enum AS ENUM ('SCHEDULED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'FAILED');

-- ============================================
-- BASE TABLES
-- ============================================

-- Brands (e.g., Samsung, LG, Whirlpool)
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories (e.g., Refrigerators, Washers, Dryers)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catalog Models (manufacturer's model catalog)
CREATE TABLE catalog_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  model_number VARCHAR(255) NOT NULL,
  name VARCHAR(500),
  description TEXT,
  msrp NUMERIC(10, 2),
  primary_image_url TEXT,
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, model_number)
);

-- Media (uploaded files)
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_url TEXT NOT NULL,
  storage_path TEXT,
  mime_type VARCHAR(100),
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items (main inventory table)
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_type item_type_enum NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status item_status_enum DEFAULT 'DRAFT',
  condition item_condition_enum,
  visibility visibility_enum DEFAULT 'PRIVATE',
  price NUMERIC(10, 2),
  cost NUMERIC(10, 2),
  quantity_on_hand INTEGER DEFAULT 1,
  sku VARCHAR(100),
  location VARCHAR(255),
  notes TEXT,

  -- Search fields (populated by trigger)
  search_text TEXT,
  search_tsv TSVECTOR,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item Media (photos/videos for items)
CREATE TABLE item_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, media_id)
);

-- Item Used Unit (subtype for used appliances)
CREATE TABLE item_used_unit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL UNIQUE REFERENCES items(id) ON DELETE CASCADE,
  catalog_model_id UUID REFERENCES catalog_models(id),
  serial_number VARCHAR(255),
  manufacture_year INTEGER,
  cosmetic_grade VARCHAR(10), -- A, B, C, D
  functional_test_status test_status_enum DEFAULT 'NOT_TESTED',
  warranty_days INTEGER DEFAULT 0,
  defects TEXT,
  repairs_made TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item Part (subtype for appliance parts)
CREATE TABLE item_part (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL UNIQUE REFERENCES items(id) ON DELETE CASCADE,
  part_number VARCHAR(255) NOT NULL,
  manufacturer VARCHAR(255),
  oem_or_aftermarket oem_enum DEFAULT 'OEM',
  compatible_models TEXT[], -- Array of model numbers this part fits
  weight_lbs NUMERIC(6, 2),
  dimensions VARCHAR(100), -- "LxWxH"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item New Model (subtype for new appliances)
CREATE TABLE item_new_model (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL UNIQUE REFERENCES items(id) ON DELETE CASCADE,
  catalog_model_id UUID NOT NULL REFERENCES catalog_models(id),
  is_floor_model BOOLEAN DEFAULT FALSE,
  has_original_packaging BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DELIVERY TABLES
-- ============================================

-- Delivery Time Slots (weekly schedule template)
CREATE TABLE delivery_time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_deliveries INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(day_of_week, start_time)
);

-- Delivery Blackouts (holidays, etc.)
CREATE TABLE delivery_blackouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  reason VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  order_number VARCHAR(50) UNIQUE,
  status VARCHAR(50) DEFAULT 'PENDING',
  subtotal NUMERIC(10, 2),
  tax NUMERIC(10, 2),
  delivery_fee NUMERIC(10, 2),
  total NUMERIC(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deliveries
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  customer_id UUID REFERENCES customers(id),
  slot_id UUID REFERENCES delivery_time_slots(id),
  date DATE NOT NULL,
  status delivery_status_enum DEFAULT 'SCHEDULED',
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip VARCHAR(20),
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Items indexes
CREATE INDEX idx_items_type ON items(item_type);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_visibility ON items(visibility);
CREATE INDEX idx_items_public_filter ON items(visibility, status, item_type);
CREATE INDEX idx_items_search_tsv ON items USING GIN(search_tsv);
CREATE INDEX idx_items_search_text_trgm ON items USING GIN(search_text gin_trgm_ops);
CREATE INDEX idx_items_created_at ON items(created_at DESC);

-- Item media indexes
CREATE INDEX idx_item_media_item_id ON item_media(item_id);
CREATE INDEX idx_item_media_primary ON item_media(item_id, is_primary) WHERE is_primary = TRUE;

-- Part number index for exact lookups
CREATE INDEX idx_part_number_lower ON item_part(lower(part_number));
CREATE INDEX idx_model_number_lower ON catalog_models(lower(model_number));

-- Delivery indexes
CREATE INDEX idx_deliveries_date ON deliveries(date);
CREATE INDEX idx_deliveries_slot_date ON deliveries(slot_id, date);
CREATE INDEX idx_deliveries_status ON deliveries(status);
