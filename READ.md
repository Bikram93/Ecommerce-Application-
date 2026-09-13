# 🛍️ Modern Full-Stack E-Commerce Platform (Portfolio & Interview Showcase)

An enterprise-ready, full-stack E-Commerce application designed specifically for **technical portfolio showcases, code reviews, and live coding interview demonstrations**. 

It demonstrates clean architecture, strict separation of concerns, resilient error handling, and an intuitive user journey:

> **Login/Register → Browse Products (Live Search & Category Filters) → Product Details & Reviews → Add to Cart → Shopping Cart Review → Simulated Checkout & Payment → Historic Orders Log & Invoices**

---

## 🏗️ Architecture & Project Layout

The repository is built as a **two-tier decoupled system**: a streamlined single-app **Django REST Framework** backend and a reactive, modular **React + Tailwind CSS + Vite** frontend.

```text
ecommerce-applicatiop/
│
├── .gitignore                   # Production-grade auto-exclusion (venv, node_modules, .env, db.sqlite3)
├── agy.md                       # Antigravity project blueprint & execution memory
├── READ.md                      # Complete system documentation, architecture & code guide
│
├── backend/                     # Django REST Framework API Layer
│   ├── manage.py                # Django management runner
│   ├── db.sqlite3               # SQLite3 database (with migrations & realistic seed data)
│   ├── requirements.txt         # Django 5.1, DRF, SimpleJWT, CORS, django-filter, Pillow
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
│       ├── migrations/          # 0001_initial.py (All 14 relational tables)
│       ├── __init__.py
│       ├── admin.py             # Model registration in Django Admin with inlines
│       ├── apps.py              # AppConfig with ready() lifecycle hook
│       ├── models.py            # User, Profile, Address, Category, Product, Cart, Wishlist, Order, Payment
│       ├── serializers.py       # DRF serializers for all 12 modules
│       ├── signals.py           # Observer pattern: auto-provisions Profile, Cart & Wishlist
│       ├── urls.py              # RESTful API routes
│       ├── views.py             # Business logic & atomic checkout transaction
│       └── management/
│           └── commands/
│               └── seed_data.py # Seeder: python manage.py seed_data
│
└── frontend/                    # Client-Side Application (React.js + Tailwind CSS + Vite)
    ├── index.html               # Responsive HTML5 entry with Inter font & favicon
    ├── postcss.config.js        # PostCSS configuration for Tailwind & Autoprefixer
    ├── tailwind.config.js       # Custom Indigo/Slate theme, badges & animations
    ├── vite.config.js           # Fast HMR build setup + API reverse proxy to Django
    ├── package.json             # React 18, Tailwind CSS, Lucide React, Axios, React Router
    │
    └── src/
        ├── main.jsx             # React DOM root wrapped with BrowserRouter & AppProvider
        ├── index.css            # Tailwind directives & smooth custom scrollbars
        ├── App.jsx              # Master router container with persistent Navbar/Footer
        │
        ├── context/
        │   └── AppContext.jsx   # Global State & API calls (Auth, Cart, Catalog, Orders, Toasts)
        │
        ├── components/          # Reusable Presentational UI Components
        │   ├── Navbar.jsx       # Navigation, brand logo, live cart badge, auth controls
        │   ├── Footer.jsx       # Tech stack badges, copyright & value propositions
        │   ├── ProductCard.jsx  # Card with thumbnail zoom, price, discount pill & quick-add
        │   └── Toast.jsx        # Floating animated notification alerts
        │
        └── pages/               # Screen Views (All 12 Modules)
            ├── Home.jsx         # Product Listing, Hero Banner, Category Chips & Search
            ├── ProductDetail.jsx# Product Specifications, Image Gallery, Stock & Reviews
            ├── Cart.jsx         # Shopping Cart review, quantity +/- controls & subtotal
            ├── Checkout.jsx     # Simulated Payment processing, address & 1-click test card
            ├── Orders.jsx       # Historical Orders Log with invoices & delivery tracker
            └── Auth.jsx         # Login & Registration with 1-click demo access
```

---

## 🛠️ Technology Stack & Decision Matrix

| Layer | Technology | Decision Rationale |
|---|---|---|
| **Frontend Framework** | **React 18 + Vite** | Instant Hot Module Replacement (HMR), component-driven UI, fast bundling (< 3.7s). |
| **Styling & Design** | **Tailwind CSS** | Utility-first, responsive layouts, custom primary indigo/slate palette. |
| **Iconography** | **Lucide React** | Consistent, modern, lightweight SVG icons. |
| **Routing & Client HTTP** | **React Router v6 + Axios** | Declarative client routing & global Axios interceptors for stateless JWT tokens. |
| **Backend Framework** | **Django 5.1 + Django REST Framework** | Robust ORM, declarative serialization, built-in Admin panel, clean security defaults. |
| **Authentication** | **SimpleJWT** | Stateless JSON Web Tokens (Access + Refresh token rotation). |
| **Search & Filtering** | **`django-filter` + DRF SearchFilter** | Declarative query-param filtering (`?category=`, `?search=`, `?ordering=`, `?min_price=`). |
| **Database** | **SQLite3 (Portable to PostgreSQL)** | Zero-configuration local development; easily switched to PostgreSQL via environment variables. |
| **CORS & Security** | **`django-cors-headers`** | Permissive development CORS policies for clean cross-port communication. |

---

## 📦 The 12 Recommended Modules Breakdown

| # | Module | Implementation Highlights |
|---|---|---|
| **1** | **Authentication** | JWT Register, Login, Refresh token rotation, Logout, Simulated Password Reset, 1-Click Demo Buttons. |
| **2** | **User Profile** | Personal details, Password Change, Multiple Saved Shipping Addresses. |
| **3** | **Product Catalog** | Title, slug, description, price, discount price, stock, SKU, rating, multi-images. |
| **4** | **Category** | Hierarchical categories with live product count per category. |
| **5** | **Search & Filter** | Full-text search (`?search=`), price ranges (`?min_price=`, `?max_price=`), sort by price/rating. |
| **6** | **Cart** | Real-time user cart, item quantity +/- adjustments, live subtotal computation, free shipping alerts. |
| **7** | **Wishlist** | Favorite items toggle, quick persistence for later purchase. |
| **8** | **Checkout** | Saved address selection or custom address input, payment method selection. |
| **9** | **Orders** | Atomic order placement, unique Order ID generator (`ORD-XXXX`), tracking history. |
| **10** | **Payment** | Cash on Delivery (COD) + Mock Online Payment (Card / UPI simulation) with auto-fill test cards. |
| **11** | **Admin Panel** | Django Admin (`/admin/`) with inline editing and filters for all models. |
| **12** | **Dashboard** | Sales revenue, order volume, low-stock inventory alerts, order status updates. |

---

## 🧠 Senior Architectural Highlights (Interview Topics)

### 1. How Frontend & Backend Connect (The 3 Bridges)
1. **Vite Development Proxy (`vite.config.js`)**:
   ```javascript
   server: {
     port: 5173,
     proxy: {
       '/api': {
         target: 'http://127.0.0.1:8000',
         changeOrigin: true,
       }
     }
   }
   ```
   *Why it matters:* Frontend calls `/api/products/` without hardcoding `localhost:8000`, eliminating browser CORS issues in development.
2. **Stateless JWT Interceptor (`AppContext.jsx`)**:
   ```javascript
   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   ```
   *Why it matters:* Automatically attaches the JWT Bearer token to all requests without manual headers on individual pages.
3. **Django CORS Headers (`settings.py`)**:
   `corsheaders.middleware.CorsMiddleware` handles preflight OPTIONS requests cleanly.

---

### 2. The Observer Pattern in `signals.py`
Instead of polluting `views.py`, Django signals listen to `post_save` on `User`:
```python
@receiver(post_save, sender=User)
def create_user_related_records(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)
        Cart.objects.get_or_create(user=instance)
        Wishlist.objects.get_or_create(user=instance)
```
*Why it matters:* Whether a user is created via REST API, Django Admin, CLI `createsuperuser`, or OAuth, their Profile, Cart, and Wishlist are **guaranteed** to be provisioned, eliminating `RelatedObjectDoesNotExist` runtime crashes.

---

### 3. Historical Snapshot Pattern in Orders
When an order is created, `OrderItem` copies frozen snapshots of `product_title`, `price`, and `product_image`:
```python
OrderItem.objects.create(
    order=order,
    product=item.product,
    product_title=item.product.title,
    product_image=item.product.thumbnail_url,
    price=item_price,
    quantity=item.quantity,
    subtotal=item_price * item.quantity
)
```
*Why it matters:* If an admin changes a product's price from $100 to $150 or deletes the product later, **past customer invoices and order histories remain 100% accurate and untampered**.

---

### 4. Atomic Checkout Transactions
`@transaction.atomic` in `api/views.py` wraps the checkout process:
- Validates current product stock.
- Decrements stock inventory atomically.
- Freezes the shipping address into JSON.
- Generates order and payment transaction records.
- Clears the user's cart in one rollback-safe operation.

---

## 📡 Complete REST API Endpoints Reference

### 🔐 Authentication & Profile
- `POST /api/auth/register/` — Register a new account
- `POST /api/auth/login/` — Obtain JWT access & refresh tokens
- `POST /api/auth/token/refresh/` — Refresh access token
- `GET|PUT /api/auth/me/` — View or update user profile
- `POST /api/auth/change-password/` — Change account password
- `POST /api/auth/forgot-password/` — Simulated password reset demo
- `GET|POST|PUT|DELETE /api/addresses/` — Manage saved shipping addresses

### 📦 Catalog & Discovery
- `GET /api/categories/` — List categories with product count
- `GET /api/products/` — Filter products (`?category=`, `?min_price=`, `?max_price=`, `?search=`, `?ordering=`)
- `GET /api/products/<slug>/` — Detailed product view with gallery & customer reviews
- `POST /api/products/<id>/reviews/` — Add review and rating (1–5 stars)

### 🛒 Cart & Wishlist
- `GET /api/cart/` — Fetch current user cart and subtotal
- `POST /api/cart/add/` — Add item / increase quantity (validates stock)
- `PUT /api/cart/items/<id>/` — Update item quantity
- `DELETE /api/cart/items/<id>/` — Remove item from cart
- `POST /api/cart/clear/` — Clear all cart items
- `GET /api/wishlist/` — Get saved favorites
- `POST /api/wishlist/toggle/<product_id>/` — Add or remove item from wishlist

### 💳 Checkout & Orders
- `POST /api/orders/checkout/` — Place order (validates stock, creates order & payment, empties cart)
- `GET /api/orders/` — User's order history
- `GET /api/orders/<order_number>/` — Order detail with tracking status & items snapshot

### 📊 Admin Dashboard & Operations
- `GET /api/dashboard/stats/` — Store metrics (total sales revenue, order counts, low-stock alerts)
- `PATCH /api/dashboard/orders/<id>/status/` — Update order status (`PENDING` → `PROCESSING` → `SHIPPED` → `DELIVERED`)

---

## ⚡ Quick Start & Run Commands

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
python manage.py runserver 127.0.0.1:8000
```
- Backend REST API: `http://127.0.0.1:8000/api/`
- Django Admin: `http://127.0.0.1:8000/admin/`

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

| Role | Email | Password | Permissions & Features |
|---|---|---|---|
| **Demo Customer** | `customer@example.com` | `customer123` | Storefront browsing, Cart, Checkout, Order Tracking |
| **Store Administrator** | `admin@example.com` | `admin123` | Full Django Admin (`/admin/`) & Dashboard Analytics |

*Tip: You can use the **1-Click Demo Buttons** on the `/auth` page to log in instantly without typing passwords!*

---

## 📄 License
MIT License. Built specifically for technical portfolio showcases, code reviews, and interview presentations.
