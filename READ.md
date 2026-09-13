# 🛍️ Modern E-Commerce Application (Portfolio & Interview Showcase)

An enterprise-ready, full-stack E-Commerce application designed for portfolio showcases and technical interviews. It demonstrates clean software architecture, separation of concerns, and an intuitive user flow:

> **Login → Browse Products (Filter & Search) → Cart → Checkout → Order Tracking & Admin Analytics**

---

## 🏗️ Architecture & Project Structure

The project features a **two-tier architecture** with a decoupled frontend and a streamlined single-app Django backend:

```text
ecommerce-applicatiop/
│
├── .gitignore                   # Production-grade auto-exclusion (venv, .env, caches, logs)
├── agy.md                       # Antigravity developer blueprint & tracking file
├── READ.md                      # Complete system documentation & API reference
│
├── backend/                     # Django REST Framework Backend
│   ├── manage.py                # Django CLI management script
│   ├── db.sqlite3               # SQLite3 database (with migrations & seeded demo data)
│   ├── requirements.txt         # Django, DRF, SimpleJWT, CORS, django-filter, Pillow
│   ├── .gitignore               # Backend-specific ignore rules
│   │
│   ├── core/                    # Project Configuration Folder
│   │   ├── __init__.py
│   │   ├── asgi.py              # ASGI config for async capabilities
│   │   ├── settings.py          # DRF, JWT, CORS & single 'api' app configuration
│   │   ├── urls.py              # Master routing (directs /api/ to api.urls)
│   │   └── wsgi.py              # WSGI server config
│   │
│   └── api/                     # Single App Managing All E-Commerce APIs
│       ├── migrations/          # 0001_initial.py
│       ├── __init__.py
│       ├── admin.py             # Registered models in Django Admin
│       ├── apps.py              # AppConfig with ready() lifecycle hook
│       ├── models.py            # User, Profile, Address, Category, Product, Cart, Wishlist, Order, Payment
│       ├── serializers.py       # Serializers for all 12 modules
│       ├── signals.py           # Observer pattern: auto-provisions Profile, Cart & Wishlist
│       ├── urls.py              # RESTful API endpoints
│       ├── views.py             # Business logic & atomic checkout transaction
│       └── management/
│           └── commands/
│               └── seed_data.py # Seed command: python manage.py seed_data
│
└── frontend/                    # Client-Side Application (React.js + Tailwind CSS + Vite)
    ├── public/
    └── src/
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend Framework** | Django 5.1 + Django REST Framework | Robust ORM, declarative serialization, built-in Admin panel |
| **Authentication** | `djangorestframework-simplejwt` | Stateless JWT authentication (Access & Refresh token rotation) |
| **Filtering & Search** | `django-filter` + DRF SearchFilter | Query-param filtering (categories, price range, search query) |
| **Database** | SQLite3 | Zero-configuration local database (portable to PostgreSQL via settings) |
| **Security & Headers** | `django-cors-headers` | Cross-Origin Resource Sharing configuration for frontend integration |
| **Media & Images** | Pillow + Unsplash CDN | Product catalog images and high-resolution thumbnail storage |
| **Frontend (Target)** | React 18 + Tailwind CSS + Vite | Responsive, fast, modern e-commerce storefront |

---

## 📦 The 12 Recommended Modules Breakdown

| # | Module | Implementation Details |
|---|---|---|
| **1** | **Authentication** | JWT Register, Login, Refresh token rotation, Logout, Simulated Password Reset |
| **2** | **User Profile** | User Profile details, Password Change, Multiple Saved Shipping Addresses |
| **3** | **Product Catalog** | Title, slug, description, price, discount price, stock, SKU, rating, multi-images |
| **4** | **Category** | Hierarchical categories with live product count per category |
| **5** | **Search & Filter** | Full-text search (`?search=`), price ranges (`?min_price=`, `?max_price=`), sort by price/rating |
| **6** | **Cart** | Real-time user cart, item quantity +/- adjustments, live subtotal computation |
| **7** | **Wishlist** | Favorite items toggle, quick persistence for later purchase |
| **8** | **Checkout** | Saved address selection or custom address input, payment method selection |
| **9** | **Orders** | Atomic order placement, unique Order ID generator (`ORD-XXXX`), tracking history |
| **10** | **Payment** | Cash on Delivery (COD) + Mock Online Payment (Card / UPI simulation) |
| **11** | **Admin Panel** | Django Admin (`/admin/`) with inline editing and filters for all models |
| **12** | **Dashboard** | Sales revenue, order volume, low-stock inventory alerts, order status updates |

---

## 🧠 Architectural Highlights (Senior Interview Concepts)

### 1. Why `apps.py` and `signals.py`?
- **`apps.py`**: Defines the `AppConfig` class and provides the `ready()` lifecycle hook that runs once when Django finishes loading models.
- **`signals.py`**: Implements the **Observer (Publish/Subscribe) Pattern**. Listening to `post_save` on `User`, it automatically creates a `Profile`, `Cart`, and `Wishlist` whenever any user is created (whether via REST API, Django Admin, or CLI `createsuperuser`). This prevents `RelatedObjectDoesNotExist` runtime crashes and keeps `views.py` thin and clean.

### 2. Historical Snapshot Pattern in Orders
When an order is created, `OrderItem` copies frozen snapshots of `product_title`, `price`, and `product_image`:
- If an admin edits a product's price from $100 to $150 or deletes the product tomorrow, **past customer invoices and order histories remain 100% accurate and untampered**.

### 3. Atomic Checkout Transactions
`@transaction.atomic` wraps the checkout process:
- Validates current product stock.
- Decrements stock count atomically.
- Freezes the shipping address into JSON.
- Generates order and payment transaction records.
- Clears the user's cart in one rollback-safe operation.

---

## 📡 REST API Endpoints Reference

### 🔐 1. Authentication & Profile
- `POST /api/auth/register/` — Register a new account
- `POST /api/auth/login/` — Obtain JWT access & refresh tokens
- `POST /api/auth/token/refresh/` — Refresh access token
- `GET|PUT /api/auth/me/` — View or update user profile
- `POST /api/auth/change-password/` — Change account password
- `POST /api/auth/forgot-password/` — Simulated password reset demo
- `GET|POST|PUT|DELETE /api/addresses/` — Manage saved shipping addresses

### 📦 2. Catalog & Discovery
- `GET /api/categories/` — List categories with product count
- `GET /api/products/` — Filter products:
  - `?category=<slug>`
  - `?min_price=<num>&max_price=<num>`
  - `?search=<keyword>`
  - `?ordering=price` / `?ordering=-price` / `?ordering=-rating`
- `GET /api/products/<slug>/` — Detailed product view with gallery & customer reviews
- `POST /api/products/<id>/reviews/` — Add review and rating (1–5 stars)

### 🛒 3. Cart & Wishlist
- `GET /api/cart/` — Fetch current user cart and subtotal
- `POST /api/cart/add/` — Add item / increase quantity (validates stock)
- `PUT /api/cart/items/<id>/` — Update item quantity
- `DELETE /api/cart/items/<id>/` — Remove item from cart
- `POST /api/cart/clear/` — Clear all cart items
- `GET /api/wishlist/` — Get saved favorites
- `POST /api/wishlist/toggle/<product_id>/` — Add or remove item from wishlist

### 💳 4. Checkout & Orders
- `POST /api/orders/checkout/` — Place order (validates stock, creates order & payment, empties cart)
- `GET /api/orders/` — User's order history
- `GET /api/orders/<order_number>/` — Order detail with tracking status & items snapshot

### 📊 5. Admin Dashboard & Operations
- `GET /api/dashboard/stats/` — Store metrics (total sales revenue, order counts, low-stock alerts)
- `PATCH /api/dashboard/orders/<id>/status/` — Update order status (`PENDING` → `PROCESSING` → `SHIPPED` → `DELIVERED`)

---

## ⚡ Quick Start & Run Commands

### 1. Backend Activation & Run
```bash
# Navigate to backend
cd backend

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
.\venv\Scripts\activate.bat
# Linux/macOS:
source venv/bin/activate

# Apply migrations (already configured)
python manage.py migrate

# Seed initial demo data (users, categories, showcase products)
python manage.py seed_data

# Start backend server
python manage.py runserver 8000
```
- REST API: `http://localhost:8000/api/`
- Django Admin: `http://localhost:8000/admin/`

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@example.com` | `admin123` | Full Django Admin & Dashboard Analytics |
| **Customer** | `customer@example.com` | `customer123` | Storefront browsing, Cart, Checkout, Orders |

---

## 📄 License
MIT License. Built specifically for technical portfolio showcases and live coding interview demonstrations.
