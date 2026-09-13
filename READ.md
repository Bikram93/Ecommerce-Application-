# 🛍️ Modern E-Commerce Application (Portfolio & Interview Showcase)

An enterprise-ready, full-stack E-Commerce application built specifically for portfolio showcases and technical coding interviews. It demonstrates clean software architecture, separation of concerns, and an intuitive user flow:

> **Login/Register → Browse Products (Filters & Live Search) → Product Details → Add to Cart → View Cart → Simulated Checkout & Payment → Historic Order Logs**

---

## 🏗️ Architecture & Project Structure

The project features a **two-tier decoupled architecture**: a streamlined single-app **Django REST Framework** backend and a high-performance **React + Tailwind CSS + Vite** frontend.

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
    ├── index.html               # Responsive HTML5 entry with modern typography
    ├── postcss.config.js        # PostCSS configuration for Tailwind & Autoprefixer
    ├── tailwind.config.js       # Custom color palette (Indigo/Slate), badges & animations
    ├── vite.config.js           # Fast HMR build setup + API proxy to Django backend
    ├── package.json             # React 18, Tailwind CSS, Lucide React, Axios, React Router
    │
    └── src/
        ├── main.jsx             # React DOM root wrapped with AppProvider
        ├── index.css            # Tailwind directives & smooth custom scrollbars
        ├── App.jsx              # Master application router & persistent Navbar/Footer
        │
        ├── context/
        │   └── AppContext.jsx   # Global State & API calls (Auth, Cart, Catalog, Orders, Toasts)
        │
        └── pages/               # Screen Views (All 12 Modules)
            ├── Home.jsx         # Product Listing, Hero Showcase, Category Chips & Search
            ├── ProductDetail.jsx# Product Specifications, Image Gallery, Stock & Reviews
            ├── Cart.jsx         # Shopping Cart review, quantity +/- controls & subtotal
            ├── Checkout.jsx     # Simulated Payment processing, address & 1-click test card
            ├── Orders.jsx       # Historical Orders Log with invoices & delivery tracker
            └── Auth.jsx         # Login & Registration with 1-click demo access
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | Lightning-fast HMR, modular component architecture |
| **Styling & Icons** | Tailwind CSS + Lucide React | Utility-first styling, responsive layouts, consistent iconography |
| **Routing & HTTP** | React Router v6 + Axios | Declarative client-side routing & JWT interceptors |
| **Backend Framework** | Django 5.1 + Django REST Framework | Robust ORM, declarative serialization, built-in Admin panel |
| **Authentication** | `djangorestframework-simplejwt` | Stateless JWT authentication (Access & Refresh token rotation) |
| **Filtering & Search** | `django-filter` + DRF SearchFilter | Query-param filtering (categories, price range, search query) |
| **Database** | SQLite3 | Zero-configuration local database (portable to PostgreSQL via settings) |
| **Security & Headers** | `django-cors-headers` | Cross-Origin Resource Sharing configuration for frontend integration |

---

## 🎨 Frontend Architecture & User Journey

### 1. `AppContext.jsx` (The Central Brain)
`AppContext.jsx` acts as the single source of truth across all components:
- **Centralized JWT Authentication**: Automatically attaches `Authorization: Bearer <token>` to all outgoing Axios requests.
- **Real-Time Cart Synchronization**: Manages `cart` state so that adding an item on any product card instantly updates the Navbar cart badge and Cart page without page reloads.
- **Live Catalog & Filtering**: Handles search queries, category filters, and sorting parameters seamlessly.
- **Unified Toast Notifications**: Non-intrusive alerts (*"Item added to cart!"*, *"Order placed successfully!"*).
- **One-Click Demo Access**: Functions `quickDemoLogin('customer')` and `quickDemoLogin('admin')` enable instant access for recruiters.

### 2. The 6 Core Pages Breakdown

| Screen | Core Responsibility | Key Features |
|---|---|---|
| **`Auth.jsx`** | Login & Registration | Tab switcher, input validation, 1-Click Demo buttons ("Login as Customer" / "Login as Admin") |
| **`Home.jsx`** | Product Catalog & Discovery | Hero banner, live search bar, category chips with item counts, price sorting, product cards |
| **`ProductDetail.jsx`** | Specifications & Reviews | Multi-image preview, stock counter ("In Stock", "Only 3 left"), quantity selector, customer reviews form |
| **`Cart.jsx`** | Shopping Cart Review | In-line quantity adjustment (`+` / `-`), item removal, live subtotal, tax calculation, free shipping threshold |
| **`Checkout.jsx`** | Payment & Fulfillment | Saved address selector, payment options (Cash on Delivery, Simulated Card with "Fill Test Card" autofill, UPI), atomic order placement |
| **`Orders.jsx`** | Historic Orders & Invoices | Human-friendly order IDs (`ORD-XXXX`), color-coded delivery status badges, frozen item price snapshots |

---

## 🧠 Backend Architectural Highlights (Senior Interview Concepts)

### 1. Why `apps.py` and `signals.py`?
- **`apps.py`**: Defines the `AppConfig` class and provides the `ready()` lifecycle hook that executes once when Django finishes loading models.
- **`signals.py`**: Implements the **Observer (Publish/Subscribe) Pattern**. Listening to `post_save` on `User`, it automatically creates a `Profile`, `Cart`, and `Wishlist` whenever any user is created (whether via REST API, Django Admin, or CLI `createsuperuser`). This prevents `RelatedObjectDoesNotExist` runtime crashes and keeps `views.py` thin.

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
- `GET /api/products/` — Filter products (`?category=`, `?min_price=`, `?max_price=`, `?search=`, `?ordering=`)
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

## ⚡ Quick Start & Run Guide

### 1. Backend Setup & Run
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

# Apply migrations
python manage.py migrate

# Seed initial demo data (users, categories, showcase products)
python manage.py seed_data

# Start backend server
python manage.py runserver 8000
```
- Backend REST API: `http://localhost:8000/api/`
- Django Admin: `http://localhost:8000/admin/`

### 2. Frontend Setup & Run
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
- Frontend Web App: `http://localhost:5173/`

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@example.com` | `admin123` | Full Django Admin & Dashboard Analytics |
| **Customer** | `customer@example.com` | `customer123` | Storefront browsing, Cart, Checkout, Orders |

---

## 📄 License
MIT License. Built specifically for technical portfolio showcases and live coding interview demonstrations.
