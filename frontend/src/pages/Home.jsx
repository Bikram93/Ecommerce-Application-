import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ShoppingBag, Sparkles } from 'lucide-react';

export default function Home() {
  const { products, categories, loadingProducts, fetchProducts } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts({
      category: selectedCategory,
      search: searchQuery,
      ordering,
      min_price: minPrice,
      max_price: maxPrice,
    });
  };

  const handleCategoryClick = (slug) => {
    const newCategory = selectedCategory === slug ? '' : slug;
    setSelectedCategory(newCategory);
    fetchProducts({
      category: newCategory,
      search: searchQuery,
      ordering,
      min_price: minPrice,
      max_price: maxPrice,
    });
  };

  const handleSortChange = (e) => {
    const newOrder = e.target.value;
    setOrdering(newOrder);
    fetchProducts({
      category: selectedCategory,
      search: searchQuery,
      ordering: newOrder,
      min_price: minPrice,
      max_price: maxPrice,
    });
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Full-Stack E-Commerce Demo Application
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
            Curated Products. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300">
              Seamless Shopping Flow.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Browse products, manage your cart, and simulate instant multi-step checkout with live order tracking.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search headphones, smartwatches, hoodies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/20 transition shadow-lg text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-500/30 transition flex items-center gap-2 text-sm"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Catalog View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filter Chips & Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategoryClick('')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                selectedCategory === ''
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.name} {cat.products_count > 0 && `(${cat.products_count})`}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-500">Sort by:</span>
            <select
              value={ordering}
              onChange={handleSortChange}
              className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
            >
              <option value="-created_at">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
                <div className="w-full h-56 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No products found</h3>
            <p className="text-sm text-slate-500 mt-1">Try resetting your search query or selecting another category.</p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
                fetchProducts();
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
