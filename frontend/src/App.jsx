import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Auth from './pages/Auth';

export default function App() {
  const { toast } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Pill */}
      <Toast toast={toast} />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content View with Routing */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
