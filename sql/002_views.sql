-- ============================================
-- VIEWS
-- ============================================

-- Primary photo per item
CREATE OR REPLACE VIEW v_item_primary_photo AS
SELECT
  im.item_id,
  m.public_url AS primary_photo_url
FROM item_media im
JOIN media m ON m.id = im.media_id
WHERE im.is_primary = TRUE;

-- Item gallery (all photos ordered)
CREATE OR REPLACE VIEW v_item_gallery AS
SELECT
  im.item_id,
  im.id AS item_media_id,
  im.sort_order,
  im.is_primary,
  im.caption,
  m.public_url,
  m.mime_type
FROM item_media im
JOIN media m ON m.id = im.media_id
ORDER BY im.is_primary DESC, im.sort_order ASC;

-- Unified item cards view (for lists/search)
CREATE OR REPLACE VIEW v_item_cards AS
SELECT
  i.id,
  i.item_type,
  i.title,
  i.description,
  i.status,
  i.condition,
  i.visibility,
  i.price,
  i.quantity_on_hand,
  i.sku,
  i.created_at,
  pp.primary_photo_url,

  -- Used unit fields (nullable)
  uu.cosmetic_grade,
  uu.functional_test_status,
  uu.warranty_days,
  uu.serial_number,

  -- Part fields (nullable)
  p.part_number,
  p.manufacturer AS part_manufacturer,
  p.oem_or_aftermarket,
  p.compatible_models,

  -- New model fields (nullable)
  nm.catalog_model_id,
  nm.is_floor_model,
  cm.brand_id,
  b.name AS brand_name,
  cm.category_id,
  c.name AS category_name,
  cm.model_number,
  cm.msrp,
  cm.primary_image_url AS model_image_url
FROM items i
LEFT JOIN v_item_primary_photo pp ON pp.item_id = i.id
LEFT JOIN item_used_unit uu ON uu.item_id = i.id
LEFT JOIN item_part p ON p.item_id = i.id
LEFT JOIN item_new_model nm ON nm.item_id = i.id
LEFT JOIN catalog_models cm ON cm.id = nm.catalog_model_id OR cm.id = uu.catalog_model_id
LEFT JOIN brands b ON b.id = cm.brand_id
LEFT JOIN categories c ON c.id = cm.category_id;

-- Delivery slot counts (active deliveries per slot/date)
CREATE OR REPLACE VIEW v_delivery_slot_counts AS
SELECT
  d.slot_id,
  d.date,
  COUNT(*) AS active_count
FROM deliveries d
WHERE d.status IN ('SCHEDULED', 'IN_TRANSIT')
GROUP BY d.slot_id, d.date;

-- Delivery availability view
CREATE OR REPLACE VIEW v_delivery_availability AS
SELECT
  dts.id AS slot_id,
  dts.day_of_week,
  dts.start_time,
  dts.end_time,
  dts.max_deliveries
FROM delivery_time_slots dts
WHERE dts.is_active = TRUE;

-- Item search source (for building search vectors)
CREATE OR REPLACE VIEW v_item_search_source AS
SELECT
  i.id AS item_id,
  i.item_type,
  concat_ws(' ',
    i.title,
    i.description,

    -- Part fields
    p.part_number,
    p.manufacturer,

    -- Used unit fields
    uu.serial_number,

    -- New model fields
    cm.model_number,
    b.name,
    c.name
  ) AS composed_text,

  -- Fields for exact-match boosting
  p.part_number AS part_number,
  cm.model_number AS model_number,
  b.name AS brand_name
FROM items i
LEFT JOIN item_part p ON p.item_id = i.id
LEFT JOIN item_used_unit uu ON uu.item_id = i.id
LEFT JOIN item_new_model nm ON nm.item_id = i.id
LEFT JOIN catalog_models cm ON cm.id = nm.catalog_model_id OR cm.id = uu.catalog_model_id
LEFT JOIN brands b ON b.id = cm.brand_id
LEFT JOIN categories c ON c.id = cm.category_id;
