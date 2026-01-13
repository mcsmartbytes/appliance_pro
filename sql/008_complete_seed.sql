-- ============================================
-- COMPLETE SEED DATA (STANDALONE)
-- Run this if you have empty tables
-- ============================================

-- Brands
INSERT INTO brands (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Samsung'),
  ('22222222-2222-2222-2222-222222222222', 'LG'),
  ('33333333-3333-3333-3333-333333333333', 'Whirlpool'),
  ('44444444-4444-4444-4444-444444444444', 'GE'),
  ('55555555-5555-5555-5555-555555555555', 'Maytag'),
  ('66666666-6666-6666-6666-666666666666', 'Frigidaire'),
  ('77777777-7777-7777-7777-777777777777', 'Bosch'),
  ('88888888-8888-8888-8888-888888888888', 'KitchenAid')
ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO categories (id, name, slug) VALUES
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Refrigerators', 'refrigerators'),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Washers', 'washers'),
  ('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dryers', 'dryers'),
  ('aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dishwashers', 'dishwashers'),
  ('aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ranges', 'ranges'),
  ('aaaaaaa6-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Microwaves', 'microwaves'),
  ('aaaaaaa7-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Freezers', 'freezers')
ON CONFLICT (id) DO NOTHING;

-- Delivery Time Slots (Tuesday and Friday only per client)
INSERT INTO delivery_time_slots (day_of_week, start_time, end_time, max_deliveries, is_active) VALUES
  (2, '08:00', '12:00', 4, TRUE),
  (2, '13:00', '17:00', 4, TRUE),
  (5, '08:00', '12:00', 4, TRUE),
  (5, '13:00', '17:00', 4, TRUE)
ON CONFLICT DO NOTHING;

-- ============================================
-- USED APPLIANCES
-- ============================================
INSERT INTO items (id, item_type, title, description, status, condition, visibility, price, quantity_on_hand, reorder_point) VALUES
  ('ccccccc1-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Samsung French Door Refrigerator - Excellent Condition', 'Beautiful stainless steel French door refrigerator. Ice maker works perfectly. Minor scratches on side panel. 90-day warranty.', 'AVAILABLE', 'LIKE_NEW', 'PUBLIC', 1499.00, 1, 0),
  ('ccccccc2-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'LG Front Load Washer - Great Working Condition', 'Large capacity front load washer with steam feature. Spins quietly. Some wear on door seal but fully functional.', 'AVAILABLE', 'GOOD', 'PUBLIC', 449.00, 1, 0),
  ('ccccccc3-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Whirlpool Electric Dryer', 'Reliable electric dryer with multiple heat settings. Dries clothes efficiently. White finish.', 'AVAILABLE', 'GOOD', 'PUBLIC', 299.00, 1, 0),
  ('ccccccc4-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'GE Profile Series Gas Range', 'Professional style gas range with 5 burners. Self-cleaning oven. Some cosmetic wear on grates.', 'AVAILABLE', 'FAIR', 'PUBLIC', 599.00, 1, 0),
  ('ccccccc5-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Maytag Top Load Washer - Works Great', 'Reliable top load washer in good working condition. Some cosmetic wear but runs perfectly. 90-day warranty included.', 'AVAILABLE', 'GOOD', 'PUBLIC', 325.00, 1, 0),
  ('ccccccc6-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Frigidaire Side-by-Side Refrigerator', 'Stainless steel side-by-side with ice maker. Minor dents on side panel. Fully functional.', 'AVAILABLE', 'FAIR', 'PUBLIC', 475.00, 1, 0),
  ('ccccccc7-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'KitchenAid Dishwasher - Stainless Interior', 'Premium dishwasher with stainless steel interior. Very quiet operation. Like new condition.', 'AVAILABLE', 'LIKE_NEW', 'PUBLIC', 549.00, 1, 0),
  ('ccccccc8-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'GE Electric Range - Self Cleaning', 'Electric range with self-cleaning oven. Glass cooktop in excellent condition. Black finish.', 'AVAILABLE', 'GOOD', 'PUBLIC', 399.00, 1, 0),
  ('ccccccc9-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Samsung Front Load Dryer - Steam Feature', 'Large capacity dryer with steam refresh. Dries quickly and quietly. Platinum finish.', 'AVAILABLE', 'GOOD', 'PUBLIC', 375.00, 1, 0),
  ('cccccc10-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Whirlpool Chest Freezer 7 cu ft', 'Compact chest freezer perfect for garage or basement. Runs cold and efficient.', 'AVAILABLE', 'GOOD', 'PUBLIC', 199.00, 1, 0),
  ('cccccc11-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'LG French Door Refrigerator - Ice Maker', 'Spacious French door fridge with bottom freezer. Ice maker works perfectly. Stainless steel.', 'AVAILABLE', 'LIKE_NEW', 'PUBLIC', 899.00, 1, 0),
  ('cccccc12-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Bosch Front Load Washer - Compact', 'European style compact washer. Perfect for apartments or small spaces. Very quiet.', 'AVAILABLE', 'GOOD', 'PUBLIC', 425.00, 1, 0)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO item_used_unit (item_id, cosmetic_grade, functional_test_status, warranty_days) VALUES
  ('ccccccc1-cccc-cccc-cccc-cccccccccccc', 'A', 'PASSED', 90),
  ('ccccccc2-cccc-cccc-cccc-cccccccccccc', 'B', 'PASSED', 60),
  ('ccccccc3-cccc-cccc-cccc-cccccccccccc', 'B', 'PASSED', 30),
  ('ccccccc4-cccc-cccc-cccc-cccccccccccc', 'C', 'PASSED', 30),
  ('ccccccc5-cccc-cccc-cccc-cccccccccccc', 'B', 'PASSED', 90),
  ('ccccccc6-cccc-cccc-cccc-cccccccccccc', 'C', 'PASSED', 60),
  ('ccccccc7-cccc-cccc-cccc-cccccccccccc', 'A', 'PASSED', 90),
  ('ccccccc8-cccc-cccc-cccc-cccccccccccc', 'B', 'PASSED', 60),
  ('ccccccc9-cccc-cccc-cccc-cccccccccccc', 'B', 'PASSED', 60),
  ('cccccc10-cccc-cccc-cccc-cccccccccccc', 'B', 'PASSED', 30),
  ('cccccc11-cccc-cccc-cccc-cccccccccccc', 'A', 'PASSED', 90),
  ('cccccc12-cccc-cccc-cccc-cccccccccccc', 'B', 'PASSED', 60)
ON CONFLICT (item_id) DO UPDATE SET cosmetic_grade = EXCLUDED.cosmetic_grade;

-- ============================================
-- PARTS
-- ============================================
INSERT INTO items (id, item_type, title, description, status, condition, visibility, price, quantity_on_hand, reorder_point) VALUES
  ('ddddddd1-dddd-dddd-dddd-dddddddddddd', 'PART', 'Samsung Refrigerator Water Filter DA29-00020B', 'Genuine Samsung water filter. Reduces chlorine, lead, and other contaminants. 6-month filter life.', 'AVAILABLE', 'NEW', 'PUBLIC', 34.99, 25, 10),
  ('ddddddd2-dddd-dddd-dddd-dddddddddddd', 'PART', 'Whirlpool Dryer Heating Element 279838', 'OEM heating element for Whirlpool dryers. Fixes no-heat issue. Easy DIY installation.', 'AVAILABLE', 'NEW', 'PUBLIC', 42.99, 12, 5),
  ('ddddddd3-dddd-dddd-dddd-dddddddddddd', 'PART', 'LG Washer Door Boot Seal MDS47123604', 'Door gasket seal for LG front load washers. Fixes water leaks. Includes installation clips.', 'AVAILABLE', 'NEW', 'PUBLIC', 89.99, 8, 5),
  ('ddddddd4-dddd-dddd-dddd-dddddddddddd', 'PART', 'GE Dishwasher Pump Motor WD26X10013', 'Circulation pump motor for GE dishwashers. Fixes poor cleaning and drainage issues.', 'AVAILABLE', 'NEW', 'PUBLIC', 124.99, 5, 3),
  ('ddddddd5-dddd-dddd-dddd-dddddddddddd', 'PART', 'Whirlpool Washer Drain Pump W10130913', 'OEM drain pump for Whirlpool, Maytag, and Kenmore washers. Easy DIY install.', 'AVAILABLE', 'NEW', 'PUBLIC', 67.99, 3, 5),
  ('ddddddd6-dddd-dddd-dddd-dddddddddddd', 'PART', 'Samsung Refrigerator Ice Maker DA97-15217A', 'Complete ice maker assembly for Samsung French door refrigerators. Includes wiring harness.', 'AVAILABLE', 'NEW', 'PUBLIC', 149.99, 2, 3),
  ('ddddddd7-dddd-dddd-dddd-dddddddddddd', 'PART', 'GE Dryer Belt WE12M29', 'Drum drive belt for GE and Hotpoint dryers. Genuine OEM part. Fixes squeaking and tumbling issues.', 'AVAILABLE', 'NEW', 'PUBLIC', 18.99, 15, 10),
  ('ddddddd8-dddd-dddd-dddd-dddddddddddd', 'PART', 'LG Refrigerator Compressor Start Relay', 'Start relay and overload kit for LG refrigerators. Fixes clicking noise and not cooling issue.', 'AVAILABLE', 'NEW', 'PUBLIC', 29.99, 8, 5),
  ('ddddddd9-dddd-dddd-dddd-dddddddddddd', 'PART', 'Frigidaire Oven Igniter 5303935066', 'Flat style igniter for Frigidaire and Kenmore gas ranges. Fixes oven not heating.', 'AVAILABLE', 'NEW', 'PUBLIC', 54.99, 6, 5),
  ('dddddd10-dddd-dddd-dddd-dddddddddddd', 'PART', 'Whirlpool Dishwasher Spray Arm W10861521', 'Upper spray arm for Whirlpool and KitchenAid dishwashers. Improves cleaning performance.', 'AVAILABLE', 'NEW', 'PUBLIC', 32.99, 0, 5),
  ('dddddd11-dddd-dddd-dddd-dddddddddddd', 'PART', 'Samsung Dryer Drum Roller DC97-16782A', 'Set of 4 drum support rollers with shaft. Fixes squeaking and thumping noise.', 'AVAILABLE', 'NEW', 'PUBLIC', 24.99, 1, 5),
  ('dddddd12-dddd-dddd-dddd-dddddddddddd', 'PART', 'GE Refrigerator Water Valve WR57X10032', 'Dual water inlet valve for GE side-by-side refrigerators. Fixes slow water/ice dispenser.', 'AVAILABLE', 'NEW', 'PUBLIC', 45.99, 4, 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO item_part (item_id, part_number, manufacturer, oem_or_aftermarket, compatible_models) VALUES
  ('ddddddd1-dddd-dddd-dddd-dddddddddddd', 'DA29-00020B', 'Samsung', 'OEM', ARRAY['RF28R7351SR', 'RF28R7201SR', 'RF263BEAESR']),
  ('ddddddd2-dddd-dddd-dddd-dddddddddddd', '279838', 'Whirlpool', 'OEM', ARRAY['WED5000DW', 'WED4815EW', 'WED4850HW']),
  ('ddddddd3-dddd-dddd-dddd-dddddddddddd', 'MDS47123604', 'LG', 'OEM', ARRAY['WM4000HWA', 'WM3900HWA', 'WM3700HWA']),
  ('ddddddd4-dddd-dddd-dddd-dddddddddddd', 'WD26X10013', 'GE', 'OEM', ARRAY['GDF630PSMSS', 'GDT665SSNSS', 'GDT630PSMSS']),
  ('ddddddd5-dddd-dddd-dddd-dddddddddddd', 'W10130913', 'Whirlpool', 'OEM', ARRAY['WTW5000DW', 'WTW4816FW', 'MVWC465HW']),
  ('ddddddd6-dddd-dddd-dddd-dddddddddddd', 'DA97-15217A', 'Samsung', 'OEM', ARRAY['RF28R7351SR', 'RF28R7201SR', 'RF263BEAESR']),
  ('ddddddd7-dddd-dddd-dddd-dddddddddddd', 'WE12M29', 'GE', 'OEM', ARRAY['GTD33EASKWW', 'GTD42EASJWW', 'GTD65EBSJWS']),
  ('ddddddd8-dddd-dddd-dddd-dddddddddddd', '6749C-0014E', 'LG', 'OEM', ARRAY['LRMVS3006S', 'LRFXS2503S', 'LFXS26973S']),
  ('ddddddd9-dddd-dddd-dddd-dddddddddddd', '5303935066', 'Frigidaire', 'OEM', ARRAY['FGGH3047VF', 'FGGS3065PF', 'FFGH3054US']),
  ('dddddd10-dddd-dddd-dddd-dddddddddddd', 'W10861521', 'Whirlpool', 'OEM', ARRAY['WDT730PAHZ', 'WDF520PADM', 'WDT750SAKZ']),
  ('dddddd11-dddd-dddd-dddd-dddddddddddd', 'DC97-16782A', 'Samsung', 'OEM', ARRAY['DV45H7000EW', 'DV42H5000EW', 'DVE45R6100W']),
  ('dddddd12-dddd-dddd-dddd-dddddddddddd', 'WR57X10032', 'GE', 'OEM', ARRAY['GSS25GSHSS', 'GSE25GSHSS', 'GSS25IYNFS'])
ON CONFLICT (item_id) DO UPDATE SET part_number = EXCLUDED.part_number;

-- ============================================
-- NEW APPLIANCES
-- ============================================
INSERT INTO items (id, item_type, title, description, status, condition, visibility, price, quantity_on_hand, reorder_point) VALUES
  ('eeeeeee1-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'Samsung 28 cu. ft. 4-Door French Door Refrigerator', 'Brand new in box. Features FlexZone drawer, ice maker, and fingerprint resistant finish.', 'AVAILABLE', 'NEW', 'PUBLIC', 2499.00, 2, 1),
  ('eeeeeee2-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'LG 4.5 cu. ft. Front Load Washer', 'New with full warranty. TurboWash technology cleans in under 30 minutes. Steam clean option.', 'AVAILABLE', 'NEW', 'PUBLIC', 799.00, 3, 1),
  ('eeeeeee3-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'Bosch 800 Series Dishwasher', 'Ultra quiet dishwasher at only 42 dBA. CrystalDry technology for sparkling dishes.', 'AVAILABLE', 'NEW', 'PUBLIC', 999.00, 1, 1),
  ('eeeeeee4-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'GE Profile Smart French Door Refrigerator', 'Smart refrigerator with hands-free autofill pitcher. Fingerprint resistant stainless.', 'AVAILABLE', 'NEW', 'PUBLIC', 2299.00, 1, 1),
  ('eeeeeee5-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'Maytag Commercial Grade Top Load Washer', 'Built for durability with a 10-year warranty. Extra power button for tough stains.', 'AVAILABLE', 'NEW', 'PUBLIC', 1099.00, 2, 1),
  ('eeeeeee6-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'Frigidaire Gallery Gas Range', '5 burner gas range with air fry feature. True convection oven. Stainless steel.', 'AVAILABLE', 'NEW', 'PUBLIC', 1199.00, 1, 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO item_new_model (item_id, is_floor_model, has_original_packaging) VALUES
  ('eeeeeee1-eeee-eeee-eeee-eeeeeeeeeeee', FALSE, TRUE),
  ('eeeeeee2-eeee-eeee-eeee-eeeeeeeeeeee', FALSE, TRUE),
  ('eeeeeee3-eeee-eeee-eeee-eeeeeeeeeeee', TRUE, FALSE),
  ('eeeeeee4-eeee-eeee-eeee-eeeeeeeeeeee', FALSE, TRUE),
  ('eeeeeee5-eeee-eeee-eeee-eeeeeeeeeeee', FALSE, TRUE),
  ('eeeeeee6-eeee-eeee-eeee-eeeeeeeeeeee', TRUE, FALSE)
ON CONFLICT (item_id) DO UPDATE SET is_floor_model = EXCLUDED.is_floor_model;

-- ============================================
-- SAMPLE ORDERS
-- ============================================
INSERT INTO online_orders (id, order_number, status, customer_name, customer_email, customer_phone, address_line1, city, state, zip, notes, subtotal, email_sent, viewed_at, created_at) VALUES
  ('fffff001-ffff-ffff-ffff-ffffffffffff', 'ORD260113001', 'PENDING', 'John Smith', 'john.smith@email.com', '(555) 123-4567', '123 Main Street', 'Austin', 'TX', '78701', 'Please call before delivery', 1499.00, TRUE, NULL, NOW() - INTERVAL '2 hours'),
  ('fffff002-ffff-ffff-ffff-ffffffffffff', 'ORD260113002', 'CONFIRMED', 'Maria Garcia', 'maria.g@email.com', '(555) 234-5678', NULL, NULL, NULL, NULL, 'Will pick up Saturday morning', 132.97, TRUE, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '5 hours'),
  ('fffff003-ffff-ffff-ffff-ffffffffffff', 'ORD260112001', 'PROCESSING', 'Robert Johnson', 'rjohnson@email.com', '(555) 345-6789', '456 Oak Avenue', 'Round Rock', 'TX', '78664', NULL, 899.00, TRUE, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '1 day'),
  ('fffff004-ffff-ffff-ffff-ffffffffffff', 'ORD260111001', 'READY', 'Sarah Williams', 'swilliams@email.com', '(555) 456-7890', NULL, NULL, NULL, NULL, NULL, 67.99, TRUE, NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days'),
  ('fffff005-ffff-ffff-ffff-ffffffffffff', 'ORD260110001', 'DELIVERED', 'Michael Brown', 'mbrown@email.com', '(555) 567-8901', '789 Pine Road', 'Cedar Park', 'TX', '78613', 'Gate code: 1234', 549.00, TRUE, NOW() - INTERVAL '3 days', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

INSERT INTO online_order_items (id, order_id, item_id, title, part_number, model_number, price, quantity) VALUES
  ('ggggg001-gggg-gggg-gggg-gggggggggggg', 'fffff001-ffff-ffff-ffff-ffffffffffff', 'ccccccc1-cccc-cccc-cccc-cccccccccccc', 'Samsung French Door Refrigerator - Excellent Condition', NULL, 'RF28R7351SR', 1499.00, 1),
  ('ggggg002-gggg-gggg-gggg-gggggggggggg', 'fffff002-ffff-ffff-ffff-ffffffffffff', 'ddddddd1-dddd-dddd-dddd-dddddddddddd', 'Samsung Refrigerator Water Filter DA29-00020B', 'DA29-00020B', NULL, 34.99, 2),
  ('ggggg003-gggg-gggg-gggg-gggggggggggg', 'fffff002-ffff-ffff-ffff-ffffffffffff', 'ddddddd5-dddd-dddd-dddd-dddddddddddd', 'Whirlpool Washer Drain Pump W10130913', 'W10130913', NULL, 67.99, 1),
  ('ggggg005-gggg-gggg-gggg-gggggggggggg', 'fffff003-ffff-ffff-ffff-ffffffffffff', 'cccccc11-cccc-cccc-cccc-cccccccccccc', 'LG French Door Refrigerator - Ice Maker', NULL, NULL, 899.00, 1),
  ('ggggg006-gggg-gggg-gggg-gggggggggggg', 'fffff004-ffff-ffff-ffff-ffffffffffff', 'ddddddd5-dddd-dddd-dddd-dddddddddddd', 'Whirlpool Washer Drain Pump W10130913', 'W10130913', NULL, 67.99, 1),
  ('ggggg007-gggg-gggg-gggg-gggggggggggg', 'fffff005-ffff-ffff-ffff-ffffffffffff', 'ccccccc7-cccc-cccc-cccc-cccccccccccc', 'KitchenAid Dishwasher - Stainless Interior', NULL, NULL, 549.00, 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- ============================================
-- UPDATE SEARCH VECTORS
-- ============================================
UPDATE items
SET
  search_text = title || ' ' || COALESCE(description, ''),
  search_tsv = to_tsvector('english', title || ' ' || COALESCE(description, ''));

-- ============================================
-- VERIFY DATA
-- ============================================
SELECT 'Items by type:' AS info;
SELECT item_type, COUNT(*) AS count FROM items GROUP BY item_type ORDER BY item_type;

SELECT 'Orders by status:' AS info;
SELECT status, COUNT(*) AS count FROM online_orders GROUP BY status ORDER BY status;

SELECT 'Low stock items:' AS info;
SELECT title, quantity_on_hand, reorder_point FROM items WHERE quantity_on_hand <= reorder_point AND reorder_point > 0;
