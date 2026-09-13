import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Package, LogOut, Menu, X, Shield } from 'lucide-react';

export default function Navbar() {
  const { cart, user, logout } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 group-hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 transition">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition leading-none">
                LuminaStore
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                Portfolio Demo
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-xs font-bold transition ${
                location.pathname === '/' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Storefront
            </Link>
            <Link
              to="/orders"
              className={`text-xs font-bold transition flex items-center gap-1.5 ${
                location.pathname === '/orders' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              My Orders
            </Link>
          </nav>

          {/* Right Actions & User Profile */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Badge Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 transition bg-white shadow-2xs"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.total_items > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm">
                  {cart.total_items}
                </span>
              )}
            </Link>

            {/* Auth status */}
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {user.first_name ? user.first_name[0] : user.username[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {user.first_name || user.username}
                    {user.is_staff && (
                      <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                        ADMIN
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative p-2 text-slate-700">
              <ShoppingBag className="w-5 h-5" />
              {cart.total_items > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {cart.total_items}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 py-1"
          >
            Storefront
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 py-1"
          >
            My Orders
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 py-1"
          >
            Cart ({cart.total_items} items)
          </Link>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {user ? (
              <>
                <span className="text-xs font-bold text-slate-800">
                  Signed in as {user.first_name || user.username}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
