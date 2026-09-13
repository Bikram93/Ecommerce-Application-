import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Star, ShoppingBag, Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const favorite = isInWishlist(product.id);
  const activePrice = product.discount_price ? Number(product.discount_price) : Number(product.price);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail & Badges */}
      <div className="relative overflow-hidden bg-slate-100 aspect-square">
        <img
          src={product.thumbnail_url}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Pill */}
        {product.discount_price && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            SALE
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
            favorite
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-white/80 text-slate-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={favorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-indigo-600 uppercase tracking-wider text-[10px]">
              {product.category_name}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{Number(product.rating).toFixed(1)}</span>
              <span className="text-slate-400">({product.reviews_count})</span>
            </div>
          </div>

          <Link to={`/products/${product.slug}`}>
            <h3 className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-slate-900">
                ${activePrice.toFixed(2)}
              </span>
              {product.discount_price && (
                <span className="text-xs text-slate-400 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] font-medium ${
                product.stock > 5 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-rose-600'
              }`}
            >
              {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link
              to={`/products/${product.slug}`}
              className="flex-1 py-2 text-center text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            >
              Details
            </Link>
            <button
              onClick={() => addToCart(product.id, 1)}
              disabled={product.stock <= 0}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-indigo-500/20 transition flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
