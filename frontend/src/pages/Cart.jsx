import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, user } = useApp();
  const navigate = useNavigate();

  const subtotal = Number(cart.subtotal || 0);
  const shippingFee = subtotal > 100 || subtotal === 0 ? 0.00 : 10.00;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const grandTotal = subtotal + shippingFee + tax;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Please Sign In</h2>
        <p className="text-sm text-slate-500 mt-2">Sign in to view your shopping cart and saved items.</p>
        <Link
          to="/auth"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition text-sm"
        >
          Go to Sign In <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-slate-500 mt-1">Review your items before proceeding to simulated checkout.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = item.product;
            const unitPrice = product.discount_price ? Number(product.discount_price) : Number(product.price);
            const itemTotal = unitPrice * item.quantity;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-5 justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={product.thumbnail_url}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-100 border border-slate-200"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      {product.category_name}
                    </span>
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition line-clamp-1">
                        {product.title}
                      </h3>
                    </Link>
                    <span className="text-xs font-semibold text-slate-500 mt-1 block">
                      ${unitPrice.toFixed(2)} each
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg transition disabled:opacity-30 text-xs"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= product.stock}
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg transition disabled:opacity-30 text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 block">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition mt-4"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Financial Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>

          <div className="space-y-3.5 text-sm text-slate-600 pb-6 border-b border-slate-100">
            <div className="flex justify-between">
              <span>Items Subtotal ({cart.total_items})</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping Fee</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `$${shippingFee.toFixed(2)}`
                )}
              </span>
            </div>
            {subtotal < 100 && (
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-700 flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Add ${(100 - subtotal).toFixed(2)} more for <strong>FREE Shipping</strong>!</span>
              </div>
            )}
          </div>

          <div className="py-6 border-b border-slate-100 flex justify-between items-baseline">
            <span className="text-base font-bold text-slate-900">Estimated Total</span>
            <span className="text-2xl font-extrabold text-slate-900">${grandTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition flex items-center justify-center gap-2 text-sm"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Secure 256-bit SSL simulated checkout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
