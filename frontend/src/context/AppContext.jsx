import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // ------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ------------------------------------------------------------------
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecommerce_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ecommerce_token') || null);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  const [cart, setCart] = useState({ items: [], total_items: 0, subtotal: '0.00' });
  const [wishlist, setWishlist] = useState({ items: [] });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [toast, setToast] = useState(null);

  // ------------------------------------------------------------------
  // 2. TOAST NOTIFICATIONS
  // ------------------------------------------------------------------
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // ------------------------------------------------------------------
  // 3. AXIOS SETUP & AUTH INTERCEPTOR
  // ------------------------------------------------------------------
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('ecommerce_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('ecommerce_token');
    }
  }, [token]);

  // ------------------------------------------------------------------
  // 4. AUTH METHODS
  // ------------------------------------------------------------------
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login/', { email, password });
      const { access, user: userData } = res.data;
      setToken(access);
      setUser(userData);
      localStorage.setItem('ecommerce_user', JSON.stringify(userData));
      showToast(`Welcome back, ${userData.first_name || userData.username}!`, 'success');
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Invalid email or password.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const register = async (formData) => {
    try {
      await axios.post('/api/auth/register/', formData);
      showToast('Registration successful! Logging you in...', 'success');
      return await login(formData.email, formData.password);
    } catch (err) {
      const errorObj = err.response?.data || {};
      const errorMsg = Object.values(errorObj).flat()[0] || 'Registration failed.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCart({ items: [], total_items: 0, subtotal: '0.00' });
    setWishlist({ items: [] });
    setOrders([]);
    localStorage.removeItem('ecommerce_user');
    localStorage.removeItem('ecommerce_token');
    showToast('Logged out successfully.', 'info');
  };

  // Quick Demo Login for Portfolios & Interviews
  const quickDemoLogin = async (role = 'customer') => {
    if (role === 'admin') {
      return await login('admin@example.com', 'admin123');
    }
    return await login('customer@example.com', 'customer123');
  };

  // ------------------------------------------------------------------
  // 5. CATALOG & PRODUCT METHODS
  // ------------------------------------------------------------------
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('/api/categories/');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const fetchProducts = useCallback(async (filters = {}) => {
    setLoadingProducts(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.ordering) params.append('ordering', filters.ordering);

      const res = await axios.get(`/api/products/?${params.toString()}`);
      setProducts(res.data.results || res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // ------------------------------------------------------------------
  // 6. CART METHODS
  // ------------------------------------------------------------------
  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/cart/');
      setCart(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  }, [token]);

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      showToast('Please sign in to add items to cart.', 'error');
      return false;
    }
    try {
      const res = await axios.post('/api/cart/add/', { product_id: productId, quantity });
      setCart(res.data);
      showToast('Item added to cart!', 'success');
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Could not add item to cart.';
      showToast(msg, 'error');
      return false;
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    try {
      const res = await axios.put(`/api/cart/items/${itemId}/`, { quantity });
      setCart(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Could not update quantity.';
      showToast(msg, 'error');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await axios.delete(`/api/cart/items/${itemId}/`);
      setCart(res.data);
      showToast('Item removed from cart.', 'info');
    } catch (err) {
      showToast('Could not remove item.', 'error');
    }
  };

  const clearCart = async () => {
    try {
      const res = await axios.post('/api/cart/clear/');
      setCart(res.data);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  // ------------------------------------------------------------------
  // 7. WISHLIST METHODS
  // ------------------------------------------------------------------
  const fetchWishlist = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/wishlist/');
      setWishlist(res.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  }, [token]);

  const toggleWishlist = async (productId) => {
    if (!token) {
      showToast('Please sign in to save items.', 'error');
      return;
    }
    try {
      const res = await axios.post(`/api/wishlist/toggle/${productId}/`);
      fetchWishlist();
      showToast(res.data.message, 'success');
    } catch (err) {
      showToast('Could not update wishlist.', 'error');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.items?.some(item => item.product.id === productId);
  };

  // ------------------------------------------------------------------
  // 8. ORDERS & CHECKOUT
  // ------------------------------------------------------------------
  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const res = await axios.get('/api/orders/');
      setOrders(res.data.results || res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, [token]);

  const checkoutOrder = async (orderPayload) => {
    try {
      const res = await axios.post('/api/orders/checkout/', orderPayload);
      setCart({ items: [], total_items: 0, subtotal: '0.00' });
      fetchOrders();
      showToast('Order placed successfully!', 'success');
      return { success: true, order: res.data };
    } catch (err) {
      const msg = err.response?.data?.error || 'Order processing failed.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // ------------------------------------------------------------------
  // 9. INITIAL BOOTSTRAP
  // ------------------------------------------------------------------
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  useEffect(() => {
    if (token) {
      fetchCart();
      fetchWishlist();
      fetchOrders();
    }
  }, [token, fetchCart, fetchWishlist, fetchOrders]);

  return (
    <AppContext.Provider
      value={{
        // Auth
        user,
        token,
        login,
        register,
        logout,
        quickDemoLogin,

        // Catalog
        products,
        categories,
        loadingProducts,
        fetchProducts,

        // Cart
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,

        // Wishlist
        wishlist,
        toggleWishlist,
        isInWishlist,

        // Orders
        orders,
        loadingOrders,
        fetchOrders,
        checkoutOrder,

        // Toast
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
