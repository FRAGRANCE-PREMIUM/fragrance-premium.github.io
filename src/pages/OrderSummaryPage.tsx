import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  QrCode,
  Banknote,
  Building,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_CONFIG } from '../config/config';
import { CustomerDetails, PaymentMethod, Order, ActivePage } from '../types';
import { getOriginalPrice } from '../utils/pricing';

interface OrderSummaryPageProps {
  setActivePage: (page: ActivePage) => void;
  onOrderSuccess: (order: Order) => void;
}

export const OrderSummaryPage: React.FC<OrderSummaryPageProps> = ({
  setActivePage,
  onOrderSuccess,
}) => {
  const { items, subtotal, clearCart, addOrder } = useCart();

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    orderNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiRefNumber, setUpiRefNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const shippingFee = subtotal >= BRAND_CONFIG.freeShippingThreshold ? 0 : BRAND_CONFIG.standardShippingFee;
  const grandTotal = subtotal + shippingFee;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(BRAND_CONFIG.payments.upi.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!customer.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!customer.phone.trim() || customer.phone.replace(/\D/g, '').length < 10)
      errors.phone = 'Valid 10-digit mobile number is required';
    if (!customer.address.trim()) errors.address = 'Street address is required';
    if (!customer.city.trim()) errors.city = 'City / Town is required';
    if (!customer.pinCode.trim() || customer.pinCode.length < 6)
      errors.pinCode = 'Valid 6-digit PIN code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Your Order Bag is empty. Please add fragrances first.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const orderId = `FP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalQuantity = items.reduce((s, it) => s + it.quantity, 0);

    const newOrder: Order = {
      orderId,
      createdAt: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...items],
      customer: { ...customer },
      paymentMethod,
      subtotal,
      shippingFee,
      grandTotal,
      status: 'Received',
    };

    // 1. Save to in-app Order Management Context & LocalStorage
    addOrder(newOrder);

    // 2. Automated Instant Order Notification to nskproject01@gmail.com
    try {
      const itemsListFormatted = items
        .map((it, idx) => `${idx + 1}. ${it.name} (${it.ml}ml) x ${it.quantity} = ₹${it.unitPrice * it.quantity}`)
        .join('\n');

      const emailPayload = {
        _subject: `🛍️ New Attar Order #${orderId} - ₹${grandTotal} (${customer.fullName})`,
        _template: 'table',
        Order_ID: orderId,
        Customer_Name: customer.fullName,
        Customer_Phone: customer.phone,
        Customer_Email: customer.email || 'Not Provided',
        Delivery_Address: `${customer.address}, ${customer.city}, ${customer.state} - PIN: ${customer.pinCode}`,
        Items_Ordered: itemsListFormatted,
        Total_Items: `${totalQuantity} Items`,
        Items_Subtotal: `₹${subtotal}`,
        Delivery_Fee: shippingFee === 0 ? 'FREE' : `₹${shippingFee}`,
        Grand_Total: `₹${grandTotal}`,
        Payment_Mode: paymentMethod.toUpperCase(),
        Customer_Notes: customer.orderNotes || 'None',
        Order_Timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };

      // Dispatch to nskproject01@gmail.com
      fetch('https://formsubmit.co/ajax/nskproject01@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(emailPayload),
        keepalive: true,
      }).catch((err) => console.log('Gmail notify:', err));
    } catch (err) {
      console.log('Order notification error:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      onOrderSuccess(newOrder);
    }, 400);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4 bg-transparent text-[#30272A]">
        <div className="w-16 h-16 rounded-full bg-[#EDE1D0] text-[#591D2B] flex items-center justify-center mx-auto border border-[#DED1BE]">
          <ShoppingBag className="w-8 h-8 opacity-70" />
        </div>
        <h2 className="font-serif text-2xl font-normal text-[#591D2B]">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-[#30272A]/75 max-w-sm mx-auto">
          You have no attars selected for checkout yet. Visit our collection to explore pure fragrances.
        </p>
        <button
          onClick={() => setActivePage('collection')}
          className="px-6 py-3 rounded-lg text-xs font-semibold tracking-wider bg-[#591D2B] hover:bg-[#713142] text-white transition-colors"
        >
          EXPLORE ATTAR COLLECTION
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-transparent text-[#30272A]">
      
      {/* Header Back & Trust Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('collection')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#765C46] hover:text-[#591D2B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[#765C46]">
          <Lock className="w-3.5 h-3.5 text-[#D6B887]" />
          <span>Direct Secure Order Dispatch</span>
        </div>
      </div>

      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#765C46] font-semibold">
          Checkout
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl text-[#591D2B] font-normal mt-1">
          Order Summary & Details
        </h1>
        <p className="text-sm text-[#30272A]/75 mt-1">
          Confirm your chosen flacons, provide your delivery destination, and select your payment mode.
        </p>
      </div>

      {/* Split Checkout Layout */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ORDER SUMMARY (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#DED1BE] rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#DED1BE]/60">
            <h2 className="font-serif text-base font-bold text-[#591D2B] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#D6B887]" />
              Order Items ({items.length})
            </h2>
            <button
              type="button"
              onClick={() => setActivePage('collection')}
              className="text-xs font-semibold text-[#591D2B] hover:text-[#713142]"
            >
              Modify
            </button>
          </div>

          {/* Itemized List */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3.5 bg-[#F7F0E5] border border-[#DED1BE] p-2.5 rounded-xl"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F1E8DA] flex-shrink-0 border border-[#DED1BE]/60 flex items-center justify-center p-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-bold text-[#591D2B] truncate">
                    {item.name}
                  </h4>
                  <div className="text-xs text-[#765C46] mt-0.5">
                    <span className="text-[#591D2B] font-semibold">{item.ml}ml</span> · {item.category}
                  </div>
                  <div className="text-xs text-[#765C46] mt-1 flex justify-between font-semibold items-baseline">
                    <span>Qty: {item.quantity}</span>
                    <div className="flex items-baseline gap-1.5 tabular-nums">
                      <span className="line-through text-[#7A664F]/60 text-[11px] font-normal">
                        {BRAND_CONFIG.currencySymbol}{getOriginalPrice(item.unitPrice) * item.quantity}
                      </span>
                      <span className="font-bold text-[#143628]">
                        {BRAND_CONFIG.currencySymbol}{item.unitPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Math Breakdown */}
          <div className="pt-4 border-t border-[#DED1BE]/60 space-y-2 text-xs text-[#30272A]">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-bold text-[#30272A] tabular-nums">
                {BRAND_CONFIG.currencySymbol}{subtotal}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charges:</span>
              <span className="tabular-nums">
                {shippingFee === 0 ? (
                  <span className="text-[#591D2B] font-semibold">FREE (Order above ₹{BRAND_CONFIG.freeShippingThreshold})</span>
                ) : (
                  <span className="font-bold text-[#30272A]">{BRAND_CONFIG.currencySymbol}{shippingFee}</span>
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-[#DED1BE]/60 flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#591D2B] font-bold block">
                  Grand Total Amount
                </span>
                <span className="text-[11px] text-[#6B6258]">Inclusive of cushioned packaging</span>
              </div>
              <div className="text-2xl font-serif font-bold text-[#30272A] tabular-nums">
                <span>{BRAND_CONFIG.currencySymbol}</span>
                {grandTotal}
              </div>
            </div>
          </div>

          <div className="bg-[#EDE1D0] p-3 rounded-xl border border-[#DED1BE] flex items-center gap-2 text-xs text-[#30272A]">
            <Truck className="w-4 h-4 text-[#591D2B] flex-shrink-0" />
            <span>Dispatched in tamper-proof cushioned flacon boxes within 24h.</span>
          </div>
        </div>

        {/* RIGHT COLUMN: CUSTOMER DETAILS & PAYMENT METHOD (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Customer Information Card */}
          <div className="bg-white border border-[#DED1BE] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#DED1BE]/60">
              <div className="w-7 h-7 rounded-full bg-[#591D2B] text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h2 className="font-serif text-lg font-bold text-[#591D2B]">
                Customer Delivery Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-[#591D2B] font-semibold mb-1 text-xs">
                  Full Name <span className="text-[#591D2B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zameer Akhtar"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className={`w-full bg-[#F7F0E5] border ${
                    formErrors.fullName ? 'border-[#591D2B]' : 'border-[#DED1BE]'
                  } rounded-lg py-2.5 px-3.5 text-sm text-[#30272A] focus:outline-none focus:border-[#591D2B]`}
                />
                {formErrors.fullName && (
                  <span className="text-xs text-[#591D2B] font-medium mt-1 block">{formErrors.fullName}</span>
                )}
              </div>

              <div>
                <label className="block text-[#143628] font-semibold mb-1 text-xs">
                  Mobile / Phone Number <span className="text-[#C5A86A]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className={`w-full bg-[#F7F0E5] border ${
                    formErrors.phone ? 'border-[#591D2B]' : 'border-[#DED1BE]'
                  } rounded-lg py-2.5 px-3.5 text-sm text-[#30272A] focus:outline-none focus:border-[#591D2B]`}
                />
                {formErrors.phone && (
                  <span className="text-xs text-[#591D2B] font-medium mt-1 block">{formErrors.phone}</span>
                )}
              </div>

              <div>
                <label className="block text-[#591D2B] font-semibold mb-1 text-xs">
                  Email Address <span className="text-[#6B6258] font-normal">(For Order Bill)</span>
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full bg-[#F7F0E5] border border-[#DED1BE] rounded-lg py-2.5 px-3.5 text-sm text-[#30272A] focus:outline-none focus:border-[#591D2B]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#591D2B] font-semibold mb-1 text-xs">
                  Street Address & House No. <span className="text-[#591D2B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Heritage Residency, MG Road"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className={`w-full bg-[#F7F0E5] border ${
                    formErrors.address ? 'border-[#591D2B]' : 'border-[#DED1BE]'
                  } rounded-lg py-2.5 px-3.5 text-sm text-[#30272A] focus:outline-none focus:border-[#591D2B]`}
                />
                {formErrors.address && (
                  <span className="text-xs text-[#591D2B] font-medium mt-1 block">{formErrors.address}</span>
                )}
              </div>

              <div>
                <label className="block text-[#591D2B] font-semibold mb-1 text-xs">
                  City / Town <span className="text-[#591D2B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="City / Town"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className={`w-full bg-[#F7F0E5] border ${
                    formErrors.city ? 'border-[#591D2B]' : 'border-[#DED1BE]'
                  } rounded-lg py-2.5 px-3.5 text-sm text-[#30272A] focus:outline-none focus:border-[#591D2B]`}
                />
                {formErrors.city && (
                  <span className="text-xs text-[#591D2B] font-medium mt-1 block">{formErrors.city}</span>
                )}
              </div>

              <div>
                <label className="block text-[#591D2B] font-semibold mb-1 text-xs">
                  PIN Code <span className="text-[#591D2B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="6-digit PIN"
                  value={customer.pinCode}
                  onChange={(e) => setCustomer({ ...customer, pinCode: e.target.value })}
                  className={`w-full bg-[#F7F0E5] border ${
                    formErrors.pinCode ? 'border-[#591D2B]' : 'border-[#DED1BE]'
                  } rounded-lg py-2.5 px-3.5 text-sm text-[#30272A] focus:outline-none focus:border-[#591D2B]`}
                />
                {formErrors.pinCode && (
                  <span className="text-xs text-[#591D2B] font-medium mt-1 block">{formErrors.pinCode}</span>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#591D2B] font-semibold mb-1 text-xs">
                  Special Notes or Landmark <span className="text-[#6B6258] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Near landmark, gift note, or preferred delivery timing..."
                  value={customer.orderNotes}
                  onChange={(e) => setCustomer({ ...customer, orderNotes: e.target.value })}
                  className="w-full bg-[#F7F0E5] border border-[#DED1BE] rounded-lg py-2.5 px-3.5 text-sm text-[#30272A] focus:outline-none focus:border-[#591D2B]"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Card */}
          <div className="bg-white border border-[#DED1BE] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#DED1BE]/60">
              <div className="w-7 h-7 rounded-full bg-[#591D2B] text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h2 className="font-serif text-lg font-bold text-[#591D2B]">
                Select Payment Mode
              </h2>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-[#591D2B] bg-[#591D2B] text-white shadow-xs'
                    : 'border-[#DED1BE] bg-[#F7F0E5] text-[#30272A] hover:border-[#591D2B]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <QrCode className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-[#D6B887]' : 'text-[#591D2B]'}`} />
                </div>
                <span className="block font-bold text-xs sm:text-sm">UPI (Instant)</span>
                <span className={`text-xs ${paymentMethod === 'upi' ? 'text-[#F7F0E5]/80' : 'text-[#6B6258]'}`}>
                  GPay / PhonePe / QR
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-[#591D2B] bg-[#591D2B] text-white shadow-xs'
                    : 'border-[#DED1BE] bg-[#F7F0E5] text-[#30272A] hover:border-[#591D2B]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Banknote className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-[#D6B887]' : 'text-[#591D2B]'}`} />
                </div>
                <span className="block font-bold text-xs sm:text-sm">Cash on Delivery</span>
                <span className={`text-xs ${paymentMethod === 'cod' ? 'text-[#F7F0E5]/80' : 'text-[#6B6258]'}`}>
                  Pay at doorstep
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#591D2B] bg-[#591D2B] text-white shadow-xs'
                    : 'border-[#DED1BE] bg-[#F7F0E5] text-[#30272A] hover:border-[#591D2B]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Building className={`w-5 h-5 ${paymentMethod === 'bank_transfer' ? 'text-[#D6B887]' : 'text-[#591D2B]'}`} />
                </div>
                <span className="block font-bold text-xs sm:text-sm">Bank Transfer</span>
                <span className={`text-xs ${paymentMethod === 'bank_transfer' ? 'text-[#F7F0E5]/80' : 'text-[#6B6258]'}`}>
                  NEFT / IMPS
                </span>
              </button>
            </div>

            {/* Dynamic Details */}
            {paymentMethod === 'upi' && (
              <div className="bg-[#F7F0E5] border border-[#DED1BE] rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#765C46] font-semibold block">
                      Pay Directly via UPI
                    </span>
                    <span className="text-xs text-[#6B6258]">
                      Send payment of <strong className="text-[#591D2B]">{BRAND_CONFIG.currencySymbol}{grandTotal}</strong> to:
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#591D2B] bg-white border border-[#DED1BE] px-3 py-1.5 rounded-lg select-all">
                      {BRAND_CONFIG.payments.upi.upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-2 rounded-lg bg-white border border-[#DED1BE] hover:bg-[#EDE1D0] text-[#591D2B] transition-colors"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-4 h-4 text-[#591D2B]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-xs text-[#6B6258] space-y-2">
                  <p>
                    Scan with any UPI application (Google Pay, PhonePe, Paytm, BHIM, CRED).
                  </p>
                  <div>
                    <label className="block text-[11px] text-[#30272A] font-semibold mb-1">
                      UPI Reference / UTR Number (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4289XXXXXXXX"
                      value={upiRefNumber}
                      onChange={(e) => setUpiRefNumber(e.target.value)}
                      className="w-full bg-white border border-[#DED1BE] rounded-lg py-2 px-3 text-xs text-[#30272A] focus:outline-none focus:border-[#591D2B]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="bg-[#F7F0E5] border border-[#DED1BE] rounded-2xl p-4 sm:p-5 space-y-2 text-xs text-[#6B6258]">
                <div className="text-xs font-semibold text-[#591D2B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#591D2B]" />
                  <span>Cash on Delivery Available</span>
                </div>
                <p>
                  You will pay <strong className="text-[#30272A]">{BRAND_CONFIG.currencySymbol}{grandTotal}</strong> in cash or UPI to the courier delivery executive upon arrival at your doorstep.
                </p>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="bg-[#F7F0E5] border border-[#DED1BE] rounded-2xl p-4 sm:p-5 space-y-2 text-xs text-[#30272A]">
                <span className="text-xs uppercase tracking-wider text-[#765C46] font-semibold block">
                  Direct Bank Account Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div>Bank: <strong className="text-[#591D2B]">{BRAND_CONFIG.payments.bankTransfer.bankName}</strong></div>
                  <div>A/C Name: <strong className="text-[#591D2B]">{BRAND_CONFIG.payments.bankTransfer.accountName}</strong></div>
                  <div>Account No: <strong className="text-[#591D2B]">{BRAND_CONFIG.payments.bankTransfer.accountNumber}</strong></div>
                  <div>IFSC Code: <strong className="text-[#591D2B]">{BRAND_CONFIG.payments.bankTransfer.ifscCode}</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl text-xs sm:text-sm font-bold tracking-widest bg-[#591D2B] hover:bg-[#713142] text-white flex items-center justify-center gap-3 shadow-md transition-all duration-200 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <span>LOGGING YOUR ORDER...</span>
              ) : (
                <>
                  <span>CONFIRM & PLACE ORDER ({BRAND_CONFIG.currencySymbol}{grandTotal})</span>
                  <CheckCircle2 className="w-5 h-5 text-current" />
                </>
              )}
            </button>
            <p className="text-xs text-center text-[#6B6258]">
              Orders are immediately saved to the Store Orders Dashboard and ready for dispatch.
            </p>
          </div>

        </div>

      </form>
    </div>
  );
};
