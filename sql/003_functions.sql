-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- ============================================
-- SEARCH FUNCTIONS
-- ============================================

-- Refresh search fields for a single item
CREATE OR REPLACE FUNCTION refresh_item_search(item_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  txt TEXT;
BEGIN
  SELECT composed_text INTO txt
  FROM v_item_search_source
  WHERE item_id = item_uuid;

  UPDATE items
  SET
    search_text = COALESCE(txt, ''),
    search_tsv = to_tsvector('english', COALESCE(txt, ''))
  WHERE id = item_uuid;
END;
$$;

-- Trigger function for items table
CREATE OR REPLACE FUNCTION trg_items_refresh_search()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM refresh_item_search(NEW.id);
  RETURN NEW;
END;
$$;

-- Trigger function for subtype tables
CREATE OR REPLACE FUNCTION trg_sub_refresh_search()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  id_to_refresh UUID;
BEGIN
  id_to_refresh := COALESCE(NEW.item_id, OLD.item_id);
  PERFORM refresh_item_search(id_to_refresh);
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS trg_items_refresh_search ON items;
CREATE TRIGGER trg_items_refresh_search
AFTER INSERT OR UPDATE OF title, item_type, description ON items
FOR EACH ROW EXECUTE FUNCTION trg_items_refresh_search();

DROP TRIGGER IF EXISTS trg_item_part_refresh_search ON item_part;
CREATE TRIGGER trg_item_part_refresh_search
AFTER INSERT OR UPDATE OR DELETE ON item_part
FOR EACH ROW EXECUTE FUNCTION trg_sub_refresh_search();

DROP TRIGGER IF EXISTS trg_item_used_unit_refresh_search ON item_used_unit;
CREATE TRIGGER trg_item_used_unit_refresh_search
AFTER INSERT OR UPDATE OR DELETE ON item_used_unit
FOR EACH ROW EXECUTE FUNCTION trg_sub_refresh_search();

DROP TRIGGER IF EXISTS trg_item_new_model_refresh_search ON item_new_model;
CREATE TRIGGER trg_item_new_model_refresh_search
AFTER INSERT OR UPDATE OR DELETE ON item_new_model
FOR EACH ROW EXECUTE FUNCTION trg_sub_refresh_search();

-- ============================================
-- SEARCH RPC FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION search_items(
  q TEXT,
  type_filter TEXT DEFAULT 'ALL',
  limit_n INT DEFAULT 30,
  offset_n INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  item_type item_type_enum,
  title TEXT,
  description TEXT,
  status item_status_enum,
  condition item_condition_enum,
  visibility visibility_enum,
  price NUMERIC,
  quantity_on_hand INT,
  sku VARCHAR,
  created_at TIMESTAMPTZ,
  primary_photo_url TEXT,

  cosmetic_grade VARCHAR,
  functional_test_status test_status_enum,
  warranty_days INT,
  serial_number VARCHAR,

  part_number VARCHAR,
  part_manufacturer VARCHAR,
  oem_or_aftermarket oem_enum,
  compatible_models TEXT[],

  catalog_model_id UUID,
  is_floor_model BOOLEAN,
  brand_id UUID,
  brand_name VARCHAR,
  category_id UUID,
  category_name VARCHAR,
  model_number VARCHAR,
  msrp NUMERIC,
  model_image_url TEXT,

  rank NUMERIC
)
LANGUAGE SQL
STABLE
AS $$
  WITH base AS (
    SELECT
      c.*,
      i.search_tsv,
      i.search_text
    FROM v_item_cards c
    JOIN items i ON i.id = c.id
    WHERE c.visibility = 'PUBLIC'
      AND c.status IN ('AVAILABLE', 'RESERVED', 'IN_REPAIR')
      AND (type_filter = 'ALL' OR c.item_type::TEXT = type_filter)
  ),
  scored AS (
    SELECT
      base.*,

      -- Full-text rank
      ts_rank_cd(base.search_tsv, plainto_tsquery('english', q)) AS fts_rank,

      -- Trigram similarity
      similarity(base.search_text, q) AS tri_rank,

      -- Exact-match boosts
      CASE
        WHEN base.part_number IS NOT NULL AND lower(base.part_number) = lower(q) THEN 5
        WHEN base.model_number IS NOT NULL AND lower(base.model_number) = lower(q) THEN 5
        WHEN base.title IS NOT NULL AND lower(base.title) = lower(q) THEN 2
        ELSE 0
      END AS exact_boost

    FROM base
    WHERE
      (base.search_tsv @@ plainto_tsquery('english', q))
      OR (base.search_text % q)
  )
  SELECT
    id, item_type, title, description, status, condition, visibility, price, quantity_on_hand, sku, created_at,
    primary_photo_url,
    cosmetic_grade, functional_test_status, warranty_days, serial_number,
    part_number, part_manufacturer, oem_or_aftermarket, compatible_models,
    catalog_model_id, is_floor_model, brand_id, brand_name, category_id, category_name, model_number, msrp, model_image_url,
    (fts_rank * 2.0 + tri_rank * 1.0 + exact_boost)::NUMERIC AS rank
  FROM scored
  ORDER BY rank DESC, created_at DESC
  LIMIT limit_n
  OFFSET offset_n;
$$;

-- ============================================
-- DELIVERY AVAILABILITY FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION get_delivery_availability(date_from DATE, days INTEGER)
RETURNS TABLE (
  date DATE,
  slot_id UUID,
  start_time TIME,
  end_time TIME,
  max_deliveries INTEGER,
  active_count INTEGER,
  remaining INTEGER
)
LANGUAGE SQL
STABLE
AS $$
  WITH dates AS (
    SELECT (date_from + (n || ' days')::INTERVAL)::DATE AS d
    FROM generate_series(0, GREATEST(days, 1) - 1) n
  ),
  valid_dates AS (
    SELECT d.d
    FROM dates d
    LEFT JOIN delivery_blackouts b ON b.date = d.d
    WHERE b.date IS NULL
  ),
  slots AS (
    SELECT id AS slot_id, day_of_week, start_time, end_time, max_deliveries
    FROM delivery_time_slots
    WHERE is_active = TRUE
  )
  SELECT
    vd.d AS date,
    s.slot_id,
    s.start_time,
    s.end_time,
    s.max_deliveries,
    COALESCE(vsc.active_count, 0)::INTEGER AS active_count,
    GREATEST(s.max_deliveries - COALESCE(vsc.active_count, 0), 0)::INTEGER AS remaining
  FROM valid_dates vd
  JOIN slots s
    ON EXTRACT(DOW FROM vd.d)::INT = s.day_of_week
  LEFT JOIN v_delivery_slot_counts vsc
    ON vsc.date = vd.d
   AND vsc.slot_id = s.slot_id
  ORDER BY vd.d ASC, s.start_time ASC;
$$;

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_catalog_models_updated_at
  BEFORE UPDATE ON catalog_models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at
  BEFORE UPDATE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
