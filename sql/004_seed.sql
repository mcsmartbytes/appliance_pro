-- ============================================
-- SEED DATA FOR TESTING
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
  ('88888888-8888-8888-8888-888888888888', 'KitchenAid');

-- Categories
INSERT INTO categories (id, name, slug) VALUES
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Refrigerators', 'refrigerators'),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Washers', 'washers'),
  ('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dryers', 'dryers'),
  ('aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dishwashers', 'dishwashers'),
  ('aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ranges', 'ranges'),
  ('aaaaaaa6-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Microwaves', 'microwaves'),
  ('aaaaaaa7-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Freezers', 'freezers');

-- Catalog Models
INSERT INTO catalog_models (id, brand_id, category_id, model_number, name, msrp, primary_image_url) VALUES
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'RF28R7351SR', 'Samsung 28 cu. ft. 4-Door French Door Refrigerator', 2799.00, '/images/placeholder-refrigerator.jpg'),
  ('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'WM4000HWA', 'LG 4.5 cu. ft. Front Load Washer', 899.00, '/images/placeholder-washer.jpg'),
  ('bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'WED5000DW', 'Whirlpool 7.0 cu. ft. Electric Dryer', 649.00, '/images/placeholder-dryer.jpg'),
  ('bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '77777777-7777-7777-7777-777777777777', 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'SHPM88Z75N', 'Bosch 800 Series Dishwasher', 1099.00, '/images/placeholder-dishwasher.jpg');

-- Sample Items - Used Units
INSERT INTO items (id, item_type, title, status, condition, visibility, price, quantity_on_hand) VALUES
  ('ccccccc1-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Samsung French Door Refrigerator - Excellent Condition', 'AVAILABLE', 'LIKE_NEW', 'PUBLIC', 1499.00, 1),
  ('ccccccc2-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'LG Front Load Washer - Great Working Condition', 'AVAILABLE', 'GOOD', 'PUBLIC', 449.00, 1),
  ('ccccccc3-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'Whirlpool Electric Dryer', 'AVAILABLE', 'GOOD', 'PUBLIC', 299.00, 1),
  ('ccccccc4-cccc-cccc-cccc-cccccccccccc', 'USED_UNIT', 'GE Profile Series Gas Range', 'RESERVED', 'FAIR', 'PUBLIC', 599.00, 1);

INSERT INTO item_used_unit (item_id, catalog_model_id, cosmetic_grade, functional_test_status, warranty_days) VALUES
  ('ccccccc1-cccc-cccc-cccc-cccccccccccc', 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'A', 'PASSED', 90),
  ('ccccccc2-cccc-cccc-cccc-cccccccccccc', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'B', 'PASSED', 60),
  ('ccccccc3-cccc-cccc-cccc-cccccccccccc', 'bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'B', 'PASSED', 30),
  ('ccccccc4-cccc-cccc-cccc-cccccccccccc', NULL, 'C', 'PASSED', 30);

-- Sample Items - Parts
INSERT INTO items (id, item_type, title, status, condition, visibility, price, quantity_on_hand) VALUES
  ('ddddddd1-dddd-dddd-dddd-dddddddddddd', 'PART', 'Samsung Refrigerator Water Filter DA29-00020B', 'AVAILABLE', 'NEW', 'PUBLIC', 34.99, 25),
  ('ddddddd2-dddd-dddd-dddd-dddddddddddd', 'PART', 'Whirlpool Dryer Heating Element 279838', 'AVAILABLE', 'NEW', 'PUBLIC', 42.99, 12),
  ('ddddddd3-dddd-dddd-dddd-dddddddddddd', 'PART', 'LG Washer Door Boot Seal MDS47123604', 'AVAILABLE', 'NEW', 'PUBLIC', 89.99, 8),
  ('ddddddd4-dddd-dddd-dddd-dddddddddddd', 'PART', 'GE Dishwasher Pump Motor WD26X10013', 'AVAILABLE', 'NEW', 'PUBLIC', 124.99, 5);

INSERT INTO item_part (item_id, part_number, manufacturer, oem_or_aftermarket, compatible_models) VALUES
  ('ddddddd1-dddd-dddd-dddd-dddddddddddd', 'DA29-00020B', 'Samsung', 'OEM', ARRAY['RF28R7351SR', 'RF28R7201SR', 'RF263BEAESR']),
  ('ddddddd2-dddd-dddd-dddd-dddddddddddd', '279838', 'Whirlpool', 'OEM', ARRAY['WED5000DW', 'WED4815EW', 'WED4850HW']),
  ('ddddddd3-dddd-dddd-dddd-dddddddddddd', 'MDS47123604', 'LG', 'OEM', ARRAY['WM4000HWA', 'WM3900HWA', 'WM3700HWA']),
  ('ddddddd4-dddd-dddd-dddd-dddddddddddd', 'WD26X10013', 'GE', 'OEM', ARRAY['GDF630PSMSS', 'GDT665SSNSS', 'GDT630PSMSS']);

-- Sample Items - New Models
INSERT INTO items (id, item_type, title, status, condition, visibility, price, quantity_on_hand) VALUES
  ('eeeeeee1-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'Samsung 28 cu. ft. 4-Door French Door Refrigerator', 'AVAILABLE', 'NEW', 'PUBLIC', 2499.00, 2),
  ('eeeeeee2-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'LG 4.5 cu. ft. Front Load Washer', 'AVAILABLE', 'NEW', 'PUBLIC', 799.00, 3),
  ('eeeeeee3-eeee-eeee-eeee-eeeeeeeeeeee', 'NEW_MODEL', 'Bosch 800 Series Dishwasher', 'AVAILABLE', 'NEW', 'PUBLIC', 999.00, 1);

INSERT INTO item_new_model (item_id, catalog_model_id, is_floor_model, has_original_packaging) VALUES
  ('eeeeeee1-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', FALSE, TRUE),
  ('eeeeeee2-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', FALSE, TRUE),
  ('eeeeeee3-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbbb', TRUE, FALSE);

-- Delivery Time Slots (Mon-Sat)
INSERT INTO delivery_time_slots (day_of_week, start_time, end_time, max_deliveries, is_active) VALUES
  (1, '08:00', '12:00', 4, TRUE),  -- Monday morning
  (1, '13:00', '17:00', 4, TRUE),  -- Monday afternoon
  (2, '08:00', '12:00', 4, TRUE),  -- Tuesday morning
  (2, '13:00', '17:00', 4, TRUE),  -- Tuesday afternoon
  (3, '08:00', '12:00', 4, TRUE),  -- Wednesday morning
  (3, '13:00', '17:00', 4, TRUE),  -- Wednesday afternoon
  (4, '08:00', '12:00', 4, TRUE),  -- Thursday morning
  (4, '13:00', '17:00', 4, TRUE),  -- Thursday afternoon
  (5, '08:00', '12:00', 4, TRUE),  -- Friday morning
  (5, '13:00', '17:00', 4, TRUE),  -- Friday afternoon
  (6, '09:00', '13:00', 3, TRUE);  -- Saturday morning only

-- Backfill search vectors for existing items
UPDATE items
SET
  search_text = s.composed_text,
  search_tsv = to_tsvector('english', COALESCE(s.composed_text, ''))
FROM v_item_search_source s
WHERE s.item_id = items.id;
