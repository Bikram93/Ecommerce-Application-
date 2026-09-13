import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, CreditCard, Banknote, Smartphone, CheckCircle2, ArrowLeft, Lock, Sparkles } from 'lucide-react';

export default function Checkout() {
  const { cart, checkoutOrder, user, showToast } = useApp();
  const navigate = useNavigate();

  const subtotal = Number(cart.subtotal || 0);
  const shippingFee = subtotal > 100 || subtotal === 0 ? 0.00 : 10.00;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const grandTotal = subtotal + shippingFee + tax;

  const [shippingAddress, setShippingAddress] = useState({
    full_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'John Doe',
    phone: '+1 (555) 234-5678',
    street_address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    postal_code: '62704',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('MOCK_CARD');

  // Simulated Card Details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [isProcessing, setIsProcessing] = useState(false);

  const fillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('08/29');
    setCardCvc('789');
    showToast('Simulated test card filled!', 'info');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.full_name || !shippingAddress.street_address || !shippingAddress.city) {
      showToast('Please complete all shipping address fields.', 'error');
      return;
    }

    setIsProcessing(true);
    const payload = {
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      notes: 'Demo order placed via React storefront showcase.',
    };

    const result = await checkoutOrder(payload);
    setIsProcessing(false);

    if (result.success) {
      navigate('/orders');
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mt-2">Add items to your cart before proceeding to checkout.</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-3">
          <ArrowLeft className="w-4 h-4" /> Return to Cart
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-sm text-slate-500 mt-1">Complete your shipping and simulated payment details.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Shipping Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.full_name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, full_name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street_address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street_address: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postal_code}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              Payment Method (Simulated)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {/* Mock Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('MOCK_CARD')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition ${
                  paymentMethod === 'MOCK_CARD'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'MOCK_CARD' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-800 block">Credit / Debit Card</span>
                <span className="text-[10px] text-slate-500">Instant Simulation</span>
              </button>

              {/* Mock COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition ${
                  paymentMethod === 'COD'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Banknote className={`w-6 h-6 mb-2 ${paymentMethod === 'COD' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-800 block">Cash on Delivery</span>
                <span className="text-[10px] text-slate-500">Pay upon delivery</span>
              </button>

              {/* Mock UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('MOCK_UPI')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition ${
                  paymentMethod === 'MOCK_UPI'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Smartphone className={`w-6 h-6 mb-2 ${paymentMethod === 'MOCK_UPI' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-800 block">Mock UPI / PayPal</span>
                <span className="text-[10px] text-slate-500">Instant Simulation</span>
              </button>
            </div>

            {/* Simulated Card Form */}
            {paymentMethod === 'MOCK_CARD' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" /> Simulated Card Details
                  </span>
                  <button
                    type="button"
                    onClick={fillTestCard}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Auto-fill Test Card
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">CVV / CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Review & Confirmation */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Review & Place Order</h2>

          {/* Mini Items List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 pb-4 border-b border-slate-100 mb-4">
            {cart.items.map((item) => {
              const unitPrice = item.product.discount_price ? Number(item.product.discount_price) : Number(item.product.price);
              return (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img src={item.product.thumbnail_url} alt="" className="w-10 h-10 object-cover rounded-lg bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{item.product.title}</p>
                    <p className="text-slate-500">{item.quantity} × ${unitPrice.toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-slate-900">${(unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 text-xs text-slate-600 pb-4 border-b border-slate-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="py-4 border-b border-slate-100 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-900">Grand Total</span>
            <span className="text-2xl font-extrabold text-slate-900">${grandTotal.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition flex items-center justify-center gap-2 text-sm"
          >
            {isProcessing ? (
              <span>Simulating Payment...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Place Order (${grandTotal.toFixed(2)})
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Simulated sandbox payment environment
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
