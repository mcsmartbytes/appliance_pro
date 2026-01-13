-- ============================================
-- INVENTORY MANAGEMENT ADDITIONS
-- ============================================

-- Add reorder point column to items
ALTER TABLE items
ADD COLUMN IF NOT EXISTS reorder_point INTEGER DEFAULT 0;

-- Add last_restock_date for tracking
ALTER TABLE items
ADD COLUMN IF NOT EXISTS last_restock_date TIMESTAMPTZ;

-- Create inventory history table for tracking changes
CREATE TABLE IF NOT EXISTS inventory_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  change_amount INTEGER NOT NULL,
  change_type VARCHAR(50) NOT NULL, -- 'RESTOCK', 'SALE', 'ADJUSTMENT', 'RETURN'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255) -- for future user tracking
);

CREATE INDEX IF NOT EXISTS idx_inventory_history_item ON inventory_history(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_date ON inventory_history(created_at DESC);

-- View: Low stock items that need reordering
CREATE OR REPLACE VIEW v_low_stock_items AS
SELECT
  i.id,
  i.item_type,
  i.title,
  i.sku,
  i.quantity_on_hand,
  i.reorder_point,
  (i.reorder_point - i.quantity_on_hand) AS units_needed,
  i.status,
  i.last_restock_date,
  p.part_number,
  cm.model_number,
  b.name AS brand_name,
  pp.primary_photo_url
FROM items i
LEFT JOIN item_part p ON p.item_id = i.id
LEFT JOIN item_new_model nm ON nm.item_id = i.id
LEFT JOIN item_used_unit uu ON uu.item_id = i.id
LEFT JOIN catalog_models cm ON cm.id = COALESCE(nm.catalog_model_id, uu.catalog_model_id)
LEFT JOIN brands b ON b.id = cm.brand_id
LEFT JOIN v_item_primary_photo pp ON pp.item_id = i.id
WHERE i.quantity_on_hand <= i.reorder_point
  AND i.reorder_point > 0
  AND i.status NOT IN ('SOLD', 'DRAFT')
ORDER BY (i.reorder_point - i.quantity_on_hand) DESC;

-- View: Full inventory overview
CREATE OR REPLACE VIEW v_inventory_overview AS
SELECT
  i.id,
  i.item_type,
  i.title,
  i.sku,
  i.quantity_on_hand,
  i.reorder_point,
  i.status,
  i.price,
  i.last_restock_date,
  i.created_at,
  CASE
    WHEN i.reorder_point > 0 AND i.quantity_on_hand <= i.reorder_point THEN 'LOW'
    WHEN i.quantity_on_hand = 0 THEN 'OUT'
    ELSE 'OK'
  END AS stock_status,
  p.part_number,
  cm.model_number,
  b.name AS brand_name,
  c.name AS category_name,
  pp.primary_photo_url
FROM items i
LEFT JOIN item_part p ON p.item_id = i.id
LEFT JOIN item_new_model nm ON nm.item_id = i.id
LEFT JOIN item_used_unit uu ON uu.item_id = i.id
LEFT JOIN catalog_models cm ON cm.id = COALESCE(nm.catalog_model_id, uu.catalog_model_id)
LEFT JOIN brands b ON b.id = cm.brand_id
LEFT JOIN categories c ON c.id = cm.category_id
LEFT JOIN v_item_primary_photo pp ON pp.item_id = i.id
WHERE i.status NOT IN ('SOLD', 'DRAFT')
ORDER BY
  CASE
    WHEN i.quantity_on_hand = 0 THEN 0
    WHEN i.reorder_point > 0 AND i.quantity_on_hand <= i.reorder_point THEN 1
    ELSE 2
  END,
  i.title;

-- Function: Update inventory with history tracking
CREATE OR REPLACE FUNCTION update_inventory(
  p_item_id UUID,
  p_new_quantity INTEGER,
  p_change_type VARCHAR(50),
  p_notes TEXT DEFAULT NULL
)
RETURNS TABLE (
  item_id UUID,
  previous_quantity INTEGER,
  new_quantity INTEGER,
  change_amount INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_previous_qty INTEGER;
BEGIN
  -- Get current quantity
  SELECT quantity_on_hand INTO v_previous_qty
  FROM items WHERE id = p_item_id;

  IF v_previous_qty IS NULL THEN
    RAISE EXCEPTION 'Item not found';
  END IF;

  -- Update the item
  UPDATE items
  SET
    quantity_on_hand = p_new_quantity,
    last_restock_date = CASE WHEN p_change_type = 'RESTOCK' THEN NOW() ELSE last_restock_date END
  WHERE id = p_item_id;

  -- Record in history
  INSERT INTO inventory_history (item_id, previous_quantity, new_quantity, change_amount, change_type, notes)
  VALUES (p_item_id, v_previous_qty, p_new_quantity, p_new_quantity - v_previous_qty, p_change_type, p_notes);

  RETURN QUERY SELECT p_item_id, v_previous_qty, p_new_quantity, (p_new_quantity - v_previous_qty);
END;
$$;

-- Function: Get inventory stats
CREATE OR REPLACE FUNCTION get_inventory_stats()
RETURNS TABLE (
  total_items BIGINT,
  total_units BIGINT,
  low_stock_count BIGINT,
  out_of_stock_count BIGINT,
  total_value NUMERIC
)
LANGUAGE SQL
STABLE
AS $$
  SELECT
    COUNT(*)::BIGINT AS total_items,
    COALESCE(SUM(quantity_on_hand), 0)::BIGINT AS total_units,
    COUNT(*) FILTER (WHERE reorder_point > 0 AND quantity_on_hand <= reorder_point AND quantity_on_hand > 0)::BIGINT AS low_stock_count,
    COUNT(*) FILTER (WHERE quantity_on_hand = 0)::BIGINT AS out_of_stock_count,
    COALESCE(SUM(quantity_on_hand * COALESCE(price, 0)), 0)::NUMERIC AS total_value
  FROM items
  WHERE status NOT IN ('SOLD', 'DRAFT');
$$;
