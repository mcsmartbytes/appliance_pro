-- ============================================
-- MOCK DATA FOR TESTING
-- Run this after 006_orders.sql
-- ============================================

-- More Used Appliances
INSERT INTO items (id, item_type, title, description, status, condition, visibility, price, quantity_on_hand, reorder_point) VALUES
  ('ccccccc5-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Maytag Top Load Washer - Works Great', 'Reliable top load washer in good working condition. Some cosmetic wear but runs perfectly. 90-day warranty included.', 'AVAILABLE', 'GOOD', 'PUBLIC', 325.00, 1, 0),
  ('ccccccc6-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Frigidaire Side-by-Side Refrigerator', 'Stainless steel side-by-side with ice maker. Minor dents on side panel. Fully functional.', 'AVAILABLE', 'FAIR', 'PUBLIC', 475.00, 1, 0),
  ('ccccccc7-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'KitchenAid Dishwasher - Stainless Interior', 'Premium dishwasher with stainless steel interior. Very quiet operation. Like new condition.', 'AVAILABLE', 'LIKE_NEW', 'PUBLIC', 549.00, 1, 0),
  ('ccccccc8-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'GE Electric Range - Self Cleaning', 'Electric range with self-cleaning oven. Glass cooktop in excellent condition. Black finish.', 'AVAILABLE', 'GOOD', 'PUBLIC', 399.00, 1, 0),
  ('ccccccc9-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Samsung Front Load Dryer - Steam Feature', 'Large capacity dryer with steam refresh. Dries quickly and quietly.', 'AVAILABLE', 'GOOD', 'PUBLIC', 375.00, 1, 0),
  ('cccccc10-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Whirlpool Chest Freezer 7 cu ft', 'Compact chest freezer perfect for garage or basement. Runs cold and efficient.', 'AVAILABLE', 'GOOD', 'PUBLIC', 199.00, 1, 0),
  ('cccccc11-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'LG French Door Refrigerator - Ice Maker', 'Spacious French door fridge with bottom freezer. Ice maker works perfectly.', 'AVAILABLE', 'LIKE_NEW', 'PUBLIC', 899.00, 1, 0),
  ('cccccc12-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Bosch Front Load Washer - Compact', 'European style compact washer. Perfect for apartments or small spaces.', 'SOLD', 'GOOD', 'PUBLIC', 425.00, 0, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO item_used_unit (item_id, cosmetic_grade, functional_test_status, warranty_days) VALUES
  ('ccccccc5-cccc-cccc-cccc-cccccccccccc', 'B', 'PASSED', 90),
  ('ccccccc6-cccc-cccc-cccc-cccccccccccc', 'C', 'PASSED', 60),
  ('ccccccc7-cccc-cccc-cccc-cccccccccccc', 'A', 'PASSED', 90),
  ('ccccccc8-cccc-cccc-cccc-cccccccccccc', 'B', 'PASSED', 60),
  ('ccccccc9-cccc-cccc-cccc-cccccccccccc', 'B', 'PASSED', 60),
  ('cccccc10-cccc-cccc-cccc-cccccccccccc', 'B', 'PASSED', 30),
  ('cccccc11-cccc-cccc-cccc-cccccccccccc', 'A', 'PASSED', 90),
  ('cccccc12-cccc-cccc-cccc-cccccccccccc', 'B', 'PASSED', 60)
ON CONFLICT (item_id) DO NOTHING;

-- More Parts with low stock for testing alerts
INSERT INTO items (id, item_type, title, description, status, condition, visibility, price, quantity_on_hand, reorder_point) VALUES
  ('ddddddd5-dddd-dddd-dddd-dddddddddddd', 'PART', 'Whirlpool Washer Drain Pump W10130913', 'OEM drain pump for Whirlpool, Maytag, and Kenmore washers. Easy DIY install.', 'AVAILABLE', 'NEW', 'PUBLIC', 67.99, 3, 5),
  ('ddddddd6-dddd-dddd-dddd-dddddddddddd', 'PART', 'Samsung Refrigerator Ice Maker DA97-15217A', 'Complete ice maker assembly for Samsung French door refrigerators.', 'AVAILABLE', 'NEW', 'PUBLIC', 149.99, 2, 3),
  ('ddddddd7-dddd-dddd-dddd-dddddddddddd', 'PART', 'GE Dryer Belt WE12M29', 'Drum drive belt for GE and Hotpoint dryers. Genuine OEM part.', 'AVAILABLE', 'NEW', 'PUBLIC', 18.99, 15, 10),
  ('ddddddd8-dddd-dddd-dddd-dddddddddddd', 'PART', 'LG Refrigerator Compressor Start Relay', 'Start relay and overload kit for LG refrigerators. Fixes clicking/not cooling.', 'AVAILABLE', 'NEW', 'PUBLIC', 29.99, 8, 5),
  ('ddddddd9-dddd-dddd-dddd-dddddddddddd', 'PART', 'Frigidaire Oven Igniter 5303935066', 'Flat style igniter for Frigidaire and Kenmore gas ranges.', 'AVAILABLE', 'NEW', 'PUBLIC', 54.99, 6, 5),
  ('dddddd10-dddd-dddd-dddd-dddddddddddd', 'PART', 'Whirlpool Dishwasher Spray Arm W10861521', 'Upper spray arm for Whirlpool and KitchenAid dishwashers.', 'AVAILABLE', 'NEW', 'PUBLIC', 32.99, 0, 5),
  ('dddddd11-dddd-dddd-dddd-dddddddddddd', 'PART', 'Samsung Dryer Drum Roller DC97-16782A', 'Set of 4 drum support rollers with shaft. Fixes squeaking noise.', 'AVAILABLE', 'NEW', 'PUBLIC', 24.99, 1, 5),
  ('dddddd12-dddd-dddd-dddd-dddddddddddd', 'PART', 'GE Refrigerator Water Valve WR57X10032', 'Dual water inlet valve for GE side-by-side refrigerators.', 'AVAILABLE', 'NEW', 'PUBLIC', 45.99, 4, 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO item_part (item_id, part_number, manufacturer, oem_or_aftermarket, compatible_models) VALUES
  ('ddddddd5-dddd-dddd-dddd-dddddddddddd', 'W10130913', 'Whirlpool', 'OEM', ARRAY['WTW5000DW', 'WTW4816FW', 'MVWC465HW']),
  ('ddddddd6-dddd-dddd-dddd-dddddddddddd', 'DA97-15217A', 'Samsung', 'OEM', ARRAY['RF28R7351SR', 'RF28R7201SR', 'RF263BEAESR']),
  ('ddddddd7-dddd-dddd-dddd-dddddddddddd', 'WE12M29', 'GE', 'OEM', ARRAY['GTD33EASKWW', 'GTD42EASJWW', 'GTD65EBSJWS']),
  ('ddddddd8-dddd-dddd-dddd-dddddddddddd', '6749C-0014E', 'LG', 'OEM', ARRAY['LRMVS3006S', 'LRFXS2503S', 'LFXS26973S']),
  ('ddddddd9-dddd-dddd-dddd-dddddddddddd', '5303935066', 'Frigidaire', 'OEM', ARRAY['FGGH3047VF', 'FGGS3065PF', 'FFGH3054US']),
  ('dddddd10-dddd-dddd-dddd-dddddddddddd', 'W10861521', 'Whirlpool', 'OEM', ARRAY['WDT730PAHZ', 'WDF520PADM', 'WDT750SAKZ']),
  ('dddddd11-dddd-dddd-dddd-dddddddddddd', 'DC97-16782A', 'Samsung', 'OEM', ARRAY['DV45H7000EW', 'DV42H5000EW', 'DVE45R6100W']),
  ('dddddd12-dddd-dddd-dddd-dddddddddddd', 'WR57X10032', 'GE', 'OEM', ARRAY['GSS25GSHSS', 'GSE25GSHSS', 'GSS25IYNFS'])
ON CONFLICT (item_id) DO NOTHING;

-- More New Models
INSERT INTO items (id, item_type, title, description, status, condition, visibility, price, quantity_on_hand, reorder_point) VALUES
  ('eeeeeee4-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'GE Profile Smart French Door Refrigerator', 'Smart refrigerator with hands-free autofill pitcher. Fingerprint resistant stainless.', 'AVAILABLE', 'NEW', 'PUBLIC', 2299.00, 1, 1),
  ('eeeeeee5-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'Maytag Commercial Grade Washer', 'Built for durability with a 10-year warranty. Extra power button for tough stains.', 'AVAILABLE', 'NEW', 'PUBLIC', 1099.00, 2, 1),
  ('eeeeeee6-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'Frigidaire Gallery Gas Range', '5 burner gas range with air fry feature. True convection oven.', 'AVAILABLE', 'NEW', 'PUBLIC', 1199.00, 1, 1),
  ('eeeeeee7-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'LG TurboWash 360 Washer', 'AI-powered washer with allergiene cycle. Wi-Fi enabled for remote monitoring.', 'AVAILABLE', 'NEW', 'PUBLIC', 1049.00, 0, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO item_new_model (item_id, is_floor_model, has_original_packaging) VALUES
  ('eeeeeee4-eeee-eeee-eeee-eeeeeeeeeeee', FALSE, TRUE),
  ('eeeeeee5-eeee-eeee-eeee-eeeeeeeeeeee', FALSE, TRUE),
  ('eeeeeee6-eeee-eeee-eeee-eeeeeeeeeeee', TRUE, FALSE),
  ('eeeeeee7-eeee-eeee-eeee-eeeeeeeeeeee', FALSE, TRUE)
ON CONFLICT (item_id) DO NOTHING;

-- Sample Orders
INSERT INTO online_orders (id, order_number, status, customer_name, customer_email, customer_phone, address_line1, city, state, zip, notes, subtotal, email_sent, viewed_at, created_at) VALUES
  ('fffff001-ffff-ffff-ffff-ffffffffffff', 'ORD240115001', 'PENDING', 'John Smith', 'john.smith@email.com', '(555) 123-4567', '123 Main Street', 'Austin', 'TX', '78701', 'Please call before delivery', 1499.00, TRUE, NULL, NOW() - INTERVAL '2 hours'),
  ('fffff002-ffff-ffff-ffff-ffffffffffff', 'ORD240115002', 'CONFIRMED', 'Maria Garcia', 'maria.g@email.com', '(555) 234-5678', NULL, NULL, NULL, NULL, 'Will pick up Saturday morning', 377.98, TRUE, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '5 hours'),
  ('fffff003-ffff-ffff-ffff-ffffffffffff', 'ORD240114001', 'PROCESSING', 'Robert Johnson', 'rjohnson@email.com', '(555) 345-6789', '456 Oak Avenue', 'Round Rock', 'TX', '78664', NULL, 899.00, TRUE, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '1 day'),
  ('fffff004-ffff-ffff-ffff-ffffffffffff', 'ORD240113001', 'READY', 'Sarah Williams', 'swilliams@email.com', '(555) 456-7890', NULL, NULL, NULL, NULL, NULL, 67.99, TRUE, NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days'),
  ('fffff005-ffff-ffff-ffff-ffffffffffff', 'ORD240112001', 'DELIVERED', 'Michael Brown', 'mbrown@email.com', '(555) 567-8901', '789 Pine Road', 'Cedar Park', 'TX', '78613', 'Gate code: 1234', 549.00, TRUE, NOW() - INTERVAL '3 days', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- Order Items
INSERT INTO online_order_items (id, order_id, item_id, title, part_number, model_number, price, quantity) VALUES
  -- Order 1: Samsung French Door Refrigerator
  ('ggggg001-gggg-gggg-gggg-gggggggggggg', 'fffff001-ffff-ffff-ffff-ffffffffffff', 'ccccccc1-cccc-cccc-cccc-cccccccccccc', 'Samsung French Door Refrigerator - Excellent Condition', NULL, 'RF28R7351SR', 1499.00, 1),

  -- Order 2: Parts order
  ('ggggg002-gggg-gggg-gggg-gggggggggggg', 'fffff002-ffff-ffff-ffff-ffffffffffff', 'ddddddd1-dddd-dddd-dddd-dddddddddddd', 'Samsung Refrigerator Water Filter DA29-00020B', 'DA29-00020B', NULL, 34.99, 2),
  ('ggggg003-gggg-gggg-gggg-gggggggggggg', 'fffff002-ffff-ffff-ffff-ffffffffffff', 'ddddddd5-dddd-dddd-dddd-dddddddddddd', 'Whirlpool Washer Drain Pump W10130913', 'W10130913', NULL, 67.99, 1),
  ('ggggg004-gggg-gggg-gggg-gggggggggggg', 'fffff002-ffff-ffff-ffff-ffffffffffff', 'ddddddd8-dddd-dddd-dddd-dddddddddddd', 'LG Refrigerator Compressor Start Relay', '6749C-0014E', NULL, 29.99, 1),

  -- Order 3: LG French Door
  ('ggggg005-gggg-gggg-gggg-gggggggggggg', 'fffff003-ffff-ffff-ffff-ffffffffffff', 'cccccc11-cccc-cccc-cccc-cccccccccccc', 'LG French Door Refrigerator - Ice Maker', NULL, NULL, 899.00, 1),

  -- Order 4: Single part
  ('ggggg006-gggg-gggg-gggg-gggggggggggg', 'fffff004-ffff-ffff-ffff-ffffffffffff', 'ddddddd5-dddd-dddd-dddd-dddddddddddd', 'Whirlpool Washer Drain Pump W10130913', 'W10130913', NULL, 67.99, 1),

  -- Order 5: KitchenAid Dishwasher
  ('ggggg007-gggg-gggg-gggg-gggggggggggg', 'fffff005-ffff-ffff-ffff-ffffffffffff', 'ccccccc7-cccc-cccc-cccc-cccccccccccc', 'KitchenAid Dishwasher - Stainless Interior', NULL, NULL, 549.00, 1)
ON CONFLICT (id) DO NOTHING;

-- Update search vectors
UPDATE items
SET
  search_text = s.composed_text,
  search_tsv = to_tsvector('english', COALESCE(s.composed_text, ''))
FROM v_item_search_source s
WHERE s.item_id = items.id
  AND items.search_text IS DISTINCT FROM s.composed_text;

-- Summary of what was added
SELECT 'Mock data loaded successfully!' AS status;
SELECT item_type, COUNT(*) AS count FROM items GROUP BY item_type ORDER BY item_type;
SELECT status, COUNT(*) AS count FROM online_orders GROUP BY status ORDER BY status;
