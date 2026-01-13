-- ============================================
-- ONLINE ORDERS SYSTEM
-- ============================================

-- Order status enum
DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'DELIVERED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Online orders table (separate from existing orders table which is for completed sales)
CREATE TABLE IF NOT EXISTS online_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  status order_status_enum DEFAULT 'PENDING',

  -- Customer info
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,

  -- Address (optional)
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip VARCHAR(20),

  -- Order details
  notes TEXT,
  subtotal NUMERIC(10, 2),

  -- Tracking
  email_sent BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS online_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES online_orders(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE SET NULL,

  -- Snapshot of item at time of order
  title VARCHAR(500) NOT NULL,
  part_number VARCHAR(255),
  model_number VARCHAR(255),
  price NUMERIC(10, 2),
  quantity INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_online_orders_status ON online_orders(status);
CREATE INDEX IF NOT EXISTS idx_online_orders_created ON online_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_online_order_items_order ON online_order_items(order_id);

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(20)
LANGUAGE plpgsql
AS $$
DECLARE
  new_number VARCHAR(20);
  today_prefix VARCHAR(8);
  seq_num INTEGER;
BEGIN
  today_prefix := 'ORD' || TO_CHAR(NOW(), 'YYMMDD');

  SELECT COUNT(*) + 1 INTO seq_num
  FROM online_orders
  WHERE order_number LIKE today_prefix || '%';

  new_number := today_prefix || LPAD(seq_num::TEXT, 3, '0');
  RETURN new_number;
END;
$$;

-- View for orders with item count
CREATE OR REPLACE VIEW v_online_orders AS
SELECT
  o.*,
  COUNT(oi.id) AS item_count,
  SUM(oi.quantity) AS total_units
FROM online_orders o
LEFT JOIN online_order_items oi ON oi.order_id = o.id
GROUP BY o.id
ORDER BY o.created_at DESC;

-- Updated_at trigger
CREATE OR REPLACE TRIGGER update_online_orders_updated_at
  BEFORE UPDATE ON online_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
