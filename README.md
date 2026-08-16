# Bazaar — Multi-Vendor E-Commerce Frontend

A full front-end for a multi-vendor marketplace, built with React (Vite) + Tailwind CSS v4.
No backend required — all data is mocked in `src/data/` and cart/auth state persists to
localStorage.

## Quick start

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## What's included

**Customer storefront**
- `/` — Home (hero, featured products, featured stalls)
- `/shop` — Product listing with category filter, price filter, sort, search
- `/product/:id` — Product detail page with add-to-cart / buy now
- `/vendors` — Directory of all vendor stalls
- `/vendors/:id` — Individual vendor storefront page
- `/cart` — Cart grouped by vendor stall
- `/checkout` — Shipping + payment form (demo only, no real payment)
- `/signin` — Demo role picker (Customer / Vendor / Admin)

**Vendor dashboard** (`/vendor/...`)
- Overview with revenue/orders/rating stats
- Product management (add, edit, delete — in-memory)
- Order management with status updates
- Store settings

**Admin panel** (`/admin/...`)
- Market-wide overview stats
- Vendor management (suspend/reactivate)
- Customer list
- Order management across all vendors
- Category management

## Notes for wiring up a real backend

- Replace the static files in `src/data/` (`products.js`, `vendors.js`, `orders.js`) with API calls.
- `src/context/AuthContext.jsx` currently fakes login by role — swap in real authentication.
- `src/context/CartContext.jsx` persists to `localStorage`; swap for a server-backed cart/session if needed.
- Forms (checkout, product add/edit, store settings) currently just update local state — wire their
  `onSubmit` handlers to real API endpoints.

## Tech stack

- React 19 + Vite
- React Router v6
- Tailwind CSS v4 (CSS-first config via `@theme` in `src/index.css`)
- lucide-react for icons
