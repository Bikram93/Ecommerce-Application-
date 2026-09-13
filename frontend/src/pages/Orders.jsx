import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, ArrowRight, ShoppingBag } from 'lucide-react';

export default function Orders() {
  const { orders, loadingOrders, fetchOrders, user } = useApp();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Delivered
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Truck className="w-3.5 h-3.5 text-purple-600" /> Shipped
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> Processing
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending
          </span>
        );
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Please Sign In</h2>
        <p className="text-sm text-slate-500 mt-2">Sign in to view your order history and invoices.</p>
        <Link
          to="/auth"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition text-sm"
        >
          Go to Sign In <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (loadingOrders) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-20 bg-slate-100 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Package className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">No Orders Yet</h2>
        <p className="text-sm text-slate-500 mt-2">You haven't placed any orders yet. Experience the full checkout flow!</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition text-sm"
        >
          <ShoppingBag className="w-4 h-4" /> Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order History</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review past purchases, delivery status, and frozen price snapshots.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const address = order.shipping_address_json || {};

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-mono font-bold text-xs">
                    #
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-900 block">
                      {order.order_number}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="text-sm font-extrabold text-slate-900">
                    ${Number(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-6 divide-y divide-slate-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <img
                      src={item.product_image}
                      alt={item.product_title}
                      className="w-16 h-16 object-cover rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.product_title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Qty: <strong className="text-slate-700">{item.quantity}</strong> × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      ${Number(item.subtotal).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer & Delivery Info */}
              <div className="bg-slate-50/50 px-6 py-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div>
                  <span className="font-semibold text-slate-700">Shipping to:</span>{' '}
                  {address.full_name} ({address.city}, {address.state})
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Payment:</span>{' '}
                  <span className="uppercase font-medium text-slate-600">{order.payment_method}</span>{' '}
                  ({order.payment_status})
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
