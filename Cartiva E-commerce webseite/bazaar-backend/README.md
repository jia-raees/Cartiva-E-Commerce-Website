# Bazaar Backend

REST API for the **Bazaar** multi-vendor marketplace. Built with Node.js 24, Express, and MongoDB (Mongoose), with JWT + bcrypt authentication. Designed to be a drop-in backend for the `bazaar-frontend` React app.

## Stack

- **Node.js 24** (ESM, `"type": "module"`)
- **Express 4** — HTTP server & routing
- **MongoDB / Mongoose 8** — data storage & modeling
- **jsonwebtoken** — auth tokens
- **bcryptjs** — password hashing
- **cors**, **morgan**, **dotenv**

## Getting started

```bash
npm install
cp .env.example .env     # then edit MONGO_URI / JWT_SECRET as needed
npm run seed              # populates demo vendors, products, categories, users, orders
npm run dev                # starts the API with --watch on http://localhost:5000
```

Requires a running MongoDB instance — either local (`mongodb://127.0.0.1:27017/bazaar`) or a hosted cluster like MongoDB Atlas. Update `MONGO_URI` in `.env` accordingly.

### Demo accounts (created by `npm run seed`, password for all: `password123`)

| Role     | Email                        |
|----------|-------------------------------|
| Admin    | admin@bazaar.app              |
| Vendor   | shop@thistleandloom.com       |
| Customer | elena@example.com             |

## Project structure

```
server.js                  entry point
src/
  app.js                   express app (middleware + routes)
  config/db.js              mongoose connection
  models/                  User, Vendor, Product, Category, Order
  middleware/               auth (JWT), centralized error handling
  controllers/               route handlers
  routes/                   route definitions
  utils/                     asyncHandler, ApiError, generateToken, seed script
```

## Authentication

JWT bearer tokens. After `login`/`register`, send the token on protected routes:

```
Authorization: Bearer <token>
```

Roles: `customer`, `vendor`, `admin`. Registering with `role: "vendor"` also creates a `Vendor` stall for that account (auto-assigned stall number).

## API reference

All responses are JSON: `{ success: boolean, ...data }` on success, `{ success: false, message }` on error.

### Auth — `/api/auth`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | `{ name, email, password, role?, store? }` → `{ token, user }`. `role` is `customer` or `vendor`; when `vendor`, optional `store: { name, tagline, category, location }` seeds the new stall. |
| POST | `/login` | Public | `{ email, password }` → `{ token, user }` |
| GET | `/me` | Private | Current user from token |

### Products — `/api/products`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/?q=&category=&maxPrice=&vendorId=&sort=` | Public | List/search/filter/sort products. `sort`: `price-asc`, `price-desc`, `rating` |
| GET | `/:id` | Public | Single product |
| POST | `/` | vendor, admin | Create product (vendor: own stall; admin: pass `vendorId`). Accepts optional `image` (a URL string). |
| PUT | `/:id` | owning vendor, admin | Update product. Accepts optional `image` (a URL string). |
| DELETE | `/:id` | owning vendor, admin | Delete product |

### Vendors — `/api/vendors`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all vendor stalls |
| GET | `/:id` | Public | Single vendor |
| GET | `/:id/products` | Public | Products belonging to a vendor |
| PUT | `/:id` | owning vendor, admin | Update store settings (`name`, `tagline`, `location`, `category`, and optional `bannerImage`/`logo` URL strings) |
| PATCH | `/:id/status` | admin | `{ status: "Active" \| "Suspended" }` |

### Categories — `/api/categories`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List categories with live product counts |
| POST | `/` | admin | `{ name }` |
| DELETE | `/:id` | admin | Remove a category |

### Orders — `/api/orders`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | customer | Checkout: `{ items: [{ productId, qty }], shippingAddress }`. Splits cart into one order per vendor stall, prices from the DB, decrements stock. Returns the created order(s). |
| GET | `/mine` | customer | The logged-in customer's own orders |
| GET | `/vendor?status=` | vendor | Orders placed against the logged-in vendor's stall |
| GET | `/?status=&q=` | admin | Every order market-wide, filterable by status / order id / customer name |
| PATCH | `/:id/status` | owning vendor, admin | `{ status }` — one of `Pending, Processing, Shipped, Delivered, Cancelled` |

### Dashboards — `/api/admin`, `/api/vendor`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | admin | Revenue, vendor/order/customer counts, latest orders, top-rated vendors |
| GET | `/api/admin/customers` | admin | Customer directory with order count & lifetime spend |
| GET | `/api/vendor/stats` | vendor | Revenue, order/product counts, rating, recent orders for the logged-in stall |

## Connecting the React frontend

In `bazaar-frontend`, point requests at this API's base URL (e.g. `http://localhost:5000/api`), typically via a `.env` value like `VITE_API_URL=http://localhost:5000/api` and a small `fetch`/`axios` wrapper that attaches the JWT from `localStorage`. Replace the mock modules in `src/data/*` and the local-storage-only `AuthContext` with calls to this API; `CartContext` can stay client-side until checkout, when its items are POSTed to `/api/orders`.

## Images

No file uploads — images are plain URL strings, stored as-is in MongoDB:

- `Product.image` — optional URL. Empty by default.
- `Vendor.bannerImage` — optional URL for the stall's banner. Empty by default.
- `Vendor.logo` — optional URL for the stall's logo/avatar. Empty by default.

When a URL is empty, the original generated look still works: `Product.color` and `Vendor.banner` (a CSS gradient string) are auto-assigned on creation, so the frontend can fall back to its colored-tile / initial-letter treatment whenever `image`/`bannerImage`/`logo` is blank — e.g. `product.image || <div style={{background: product.color}}>{product.name[0]}</div>`.

## Notes

- Prices are always resolved server-side at checkout — the client cannot manipulate totals.
- Stock is decremented atomically per line item on order creation, and checkout is rejected if requested quantity exceeds available stock.
- Stall numbers, product SKUs, and order numbers are auto-assigned on creation, mirroring the original mock-data format (`stallNo: "014"`, `sku: "BZ-1000"`, `orderNumber: "BZ-ORD-8801"`).
