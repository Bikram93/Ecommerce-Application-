# AGY Project Blueprint & Memory: Full-Stack E-Commerce Demo

> **Project Name:** Modern E-Commerce Demo Platform  
> **Target Audience:** Portfolio, Technical Interviews & Live Demonstrations  
> **Core Flow:** Register/Login → Browse/Filter Products → Cart Management → Multi-step Checkout → Order Confirmation & History

---

## 1. Project Architecture & Standards

```text
ecommerce-applicatiop/
├── .gitignore              # Production-grade auto-exclusion (venv, .env, caches, logs)
├── agy.md                  # Project blueprint, dev standards & implementation tracker
├── frontend/               # Client-Side Application (React.js + Tailwind CSS + Vite)
└── backend/                # Server-Side REST API (Django + DRF + SimpleJWT)
```

---

## 2. Technology Stack & Decision Matrix

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend UI** | React 18 + Vite | Blazing fast HMR, component modularity, instant bundling |
| **Styling** | Tailwind CSS | Utility-first, responsive, clean modern e-commerce aesthetic |
| **Icons & UX** | Lucide React | High quality, consistent, modern iconography |
| **State & HTTP** | Context API + Axios | Native state management without Redux boilerplate; clean Axios interceptors for JWT |
| **Backend API** | Django 5.x + DRF | Robust ORM, built-in admin panel, security out-of-the-box |
| **Auth** | SimpleJWT | Stateless JSON Web Tokens (Access + Refresh token rotation) |
| **CORS & Filters** | django-cors-headers, django-filter | Cross-origin security and declarative query parameter filtering |

---

## 3. The 12 Core Recommended Modules

| # | Module | Key Features | Status |
|---|---|---|---|
| 1 | **Authentication** | Register, Login, Refresh Token, Logout, Forgot Password demo | 📋 Ready to build |
| 2 | **User Profile** | View/Edit Profile, Change Password, Saved Addresses | 📋 Ready to build |
| 3 | **Product** | Product Catalog, Detail View, Images, Stock status, Ratings | 📋 Ready to build |
| 4 | **Category** | Hierarchical Categories, Dynamic Category filtering | 📋 Ready to build |
| 5 | **Search & Filter** | Full-text search, Price Slider, Sort by Newest/Price/Rating | 📋 Ready to build |
| 6 | **Cart** | Add/Remove items, Quantity increment/decrement, Live Subtotal | 📋 Ready to build |
| 7 | **Wishlist** | Toggle Favorites, Move Wishlist Item to Cart | 📋 Ready to build |
| 8 | **Checkout** | Multi-step/Accordion: Select Address, Shipping, Payment | 📋 Ready to build |
| 9 | **Orders** | Place Order, Order History, Tracking Timeline, Invoice Summary | 📋 Ready to build |
| 10 | **Payment** | Cash on Delivery (COD) + Mock Online Gateway (Card/UPI simulation) | 📋 Ready to build |
| 11 | **Admin Panel** | Django Admin & Custom Frontend Store Manager | 📋 Ready to build |
| 12 | **Dashboard** | Sales metrics, Order volume, Low stock indicators | 📋 Ready to build |

---

## 4. Production Git Ignore Standard

The `.gitignore` is configured to automatically ignore:
- All virtual environments: `venv/`, `.venv/`, `env/`, `ENV/`, `**/venv/`, `**/*venv*/`, etc.
- All environment secret files: `.env`, `.env.*`, `frontend/.env*`, `backend/.env*` (preserving templates `*.env.example`).
- All caches & build artifacts: `__pycache__/`, `*.py[cod]`, `node_modules/`, `dist/`, `.vite/`, `.pytest_cache/`.
- All database binaries: `*.sqlite3`, `*.db`, `*.sqlite3-journal`.
- All editor and OS junk: `.vscode/`, `.idea/`, `.DS_Store`, `Thumbs.db`.
