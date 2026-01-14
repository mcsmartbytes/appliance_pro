# AppliancePro - Project Status

## Live Site
- **Production:** https://appliance-pro.vercel.app/
- **Admin Orders:** https://appliance-pro.vercel.app/admin/orders
- **Admin Inventory:** https://appliance-pro.vercel.app/admin/inventory

---

## Completed Features

### Database
- [x] PostgreSQL schema (items, media, brands, categories, delivery slots)
- [x] SQL views (v_item_cards, v_item_search_source, v_low_stock_items, etc.)
- [x] SQL functions (search_items, get_delivery_availability, update_inventory)
- [x] Online orders tables (online_orders, online_order_items)
- [x] Mock data loaded (12 used, 12 parts, 6 new appliances, 5 sample orders)

### Public Site
- [x] Homepage with Used/Parts/New sections
- [x] Search page with unified search
- [x] Item detail pages with image gallery placeholder
- [x] Shopping cart (localStorage persistence)
- [x] Checkout page with customer form
- [x] Order confirmation page

### Admin Dashboard
- [x] Inventory management (view, edit quantities, restock)
- [x] Low stock alerts
- [x] Orders dashboard (view orders, update status)
- [x] New order notifications (unviewed indicator)
- [x] Navigation between Orders and Inventory

### Integrations
- [x] Resend email integration for order notifications
- [x] CSV import templates created for client

---

## Environment Variables (Vercel)

| Variable | Description | Status |
|----------|-------------|--------|
| `POSTGRES_URL` | Database connection string | ✅ Set |
| `RESEND_API_KEY` | Resend API key for emails | ✅ Set |
| `FROM_EMAIL` | Sender email address | ✅ Set |
| `NOTIFY_EMAIL` | Email to receive order alerts | ✅ Set |

---

## Known Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Delivery calendar 500 error | Low | Works in query editor, may be env var issue |

---

## TODO - Waiting on Client

- [ ] Receive filled CSV templates with real inventory
- [ ] Build import script to load client's data
- [ ] Get real phone number for site (currently 555-123-4567)
- [ ] Get real business address
- [ ] Verify delivery days (currently Tuesday & Friday)

---

## Future Enhancements (Optional)

- [ ] Admin authentication/login
- [ ] Photo upload for items
- [ ] Customer email confirmation after order
- [ ] Order status email updates to customer
- [ ] Inventory import from CSV via admin UI

---

## SQL Files (run in order)

| File | Description | Status |
|------|-------------|--------|
| `sql/001_schema.sql` | Core tables and enums | ✅ Run |
| `sql/002_views.sql` | Views for item cards, search, etc. | ✅ Run |
| `sql/003_functions.sql` | Search, delivery, inventory functions | ✅ Run |
| `sql/004_seed.sql` | Original seed data | ⚠️ Partial |
| `sql/005_inventory.sql` | Inventory management additions | ✅ Run |
| `sql/006_orders.sql` | Online orders system | ✅ Run |
| `sql/007_mock_data.sql` | Additional mock data | Optional |
| `sql/008_complete_seed.sql` | Standalone complete seed | ✅ Run |

---

## Key Files

### API Routes
- `/api/public/home` - Homepage data
- `/api/public/search` - Unified search
- `/api/public/items/[id]` - Item detail
- `/api/public/orders` - Order submission
- `/api/public/delivery/availability` - Delivery slots
- `/api/admin/orders` - Admin orders list
- `/api/admin/orders/[orderId]` - Order detail/update
- `/api/admin/inventory` - Inventory list
- `/api/admin/inventory/[itemId]` - Update inventory

### Components
- `src/components/CartDrawer.tsx` - Shopping cart drawer
- `src/components/Header.tsx` - Site header with cart icon
- `src/components/ItemCard.tsx` - Product card component
- `src/lib/cart.tsx` - Cart context/provider
- `src/lib/email.ts` - Resend email functions

---

## GitHub
- **Repo:** git@github.com:mcsmartbytes/appliance_pro.git
- **Branch:** main

---

*Last updated: January 13, 2026*
