import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  MapPin,
  Compass,
  Phone,
  Mail,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Truck,
  Banknote,
  Sparkles,
  ExternalLink,
  Lock,
  Plus,
  Minus,
  Trash2,
  KeyRound,
  RotateCcw,
  Navigation,
  Info,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_CONFIG } from '../config/config';
import { STORE_LOCATION, calculateDeliveryCharge } from '../utils/storeLocation';
import { getOriginalPrice } from '../utils/pricing';
import { ActivePage, CustomerDetails, Order } from '../types';

interface OrderDetailsPageProps {
  setActivePage: (page: ActivePage) => void;
  onOrderSuccess: (order: Order) => void;
}

export const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({
  setActivePage,
  onOrderSuccess,
}) => {
  const {
    items,
    subtotal,
    totalQuantity,
    updateQuantity,
    removeFromCart,
    clearCart,
    addOrder,
    userDistanceKm,
    locationStatus,
    requestGeolocation,
    triggerNotification,
  } = useCart();

  // Form inputs
  const [form, setForm] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    phoneVerified: false,
    address: '',
    city: 'Chinsurah',
    state: 'West Bengal',
    pinCode: '712101',
    orderNotes: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mobile Verification State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Manual Distance Override / Estimate (fallback if user denies GPS)
  const [manualDistanceKm, setManualDistanceKm] = useState<number | null>(null);

  // Active distance calculation
  const effectiveDistanceKm = userDistanceKm !== null ? userDistanceKm : manualDistanceKm !== null ? manualDistanceKm : 1.5;
  const deliveryCalc = calculateDeliveryCharge(effectiveDistanceKm);
  const shippingFee = deliveryCalc.deliveryFee;
  const grandTotal = subtotal + shippingFee;

  // Auto-request location if not yet detected
  useEffect(() => {
    if (userDistanceKm === null && locationStatus === 'idle') {
      requestGeolocation();
    }
  }, [userDistanceKm, locationStatus, requestGeolocation]);

  // Handle Form Change
  const handleChange = (field: keyof CustomerDetails, value: string) => {
    if (field === 'phone') {
      // If phone number changes, reset verification
      setForm((prev) => ({ ...prev, phone: value, phoneVerified: false }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Trigger Phone Verification Code
  const handleInitiatePhoneVerification = () => {
    const cleanPhone = form.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setFormErrors((prev) => ({ ...prev, phone: 'Please enter a valid 10-digit mobile number' }));
      return;
    }

    // Generate 4-digit verification code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpError('');
    setIsOtpModalOpen(true);
  };

  // Confirm Verification Code
  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() === generatedOtp) {
      setIsVerifyingOtp(true);
      setTimeout(() => {
        setIsVerifyingOtp(false);
        setForm((prev) => ({ ...prev, phoneVerified: true }));
        setIsOtpModalOpen(false);
        triggerNotification('Mobile number verified successfully! ✓');
      }, 500);
    } else {
      setOtpError('Invalid 4-digit code. Please enter the exact verification code displayed.');
    }
  };

  // Form Validation
  const validate = (): boolean => {
    const errs: Partial<Record<keyof CustomerDetails, string>> = {};

    if (!form.fullName.trim()) errs.fullName = 'Full Name is strictly required';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Valid Email Address is required';
    if (!form.address.trim()) errs.address = 'Street Address / House No. is required';
    if (!form.city.trim()) errs.city = 'City / Town is required';
    if (!form.state.trim()) errs.state = 'State is required';
    if (!form.pinCode.trim() || form.pinCode.replace(/\D/g, '').length < 6) {
      errs.pinCode = 'Valid 6-digit PIN code is required';
    }

    const cleanPhone = form.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      errs.phone = 'Valid 10-digit mobile number is required';
    } else if (!form.phoneVerified) {
      errs.phone = 'Mobile number MUST be verified before placing order';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Place Order Action
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      triggerNotification('Your bag is empty! Please select fragrances first.');
      return;
    }

    if (!validate()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const orderId = `FP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newOrder: Order = {
      orderId,
      createdAt: timestamp,
      items: [...items],
      customer: {
        ...form,
        distanceKm: effectiveDistanceKm,
        deliveryFeeExplanation: deliveryCalc.ruleExplanation,
      },
      paymentMethod: 'cod',
      subtotal,
      shippingFee,
      grandTotal,
      status: 'Received',
      distanceKm: effectiveDistanceKm,
    };

    // 1. Add to local Order Management Context & Store Vault
    addOrder(newOrder);

    // 2. Dispatch Email to both nsk79674@gmail.com and nskproject01@gmail.com
    try {
      const itemsListFormatted = items
        .map(
          (it, idx) => {
            const packDesc =
              it.ml === 18
                ? '6 Pcs Master Box (18ml)'
                : it.ml === 36
                ? '12 Pcs Master Box (36ml)'
                : it.ml === 25
                ? '10 Pcs Master Box (25ml)'
                : it.ml === 100
                ? '20 Pcs Master Box (Kosturi Desert)'
                : `${it.ml}ml Single Flacon`;
            return `${idx + 1}. ${it.name} [${packDesc}] x ${it.quantity} = Rs ${it.unitPrice * it.quantity}`;
          }
        )
        .join('\n');

      const siteBaseUrl = window.location.origin + window.location.pathname;
      const dispatchedUrl = `${siteBaseUrl}?action=set_status&orderId=${orderId}&status=Dispatched`;
      const deliveredUrl = `${siteBaseUrl}?action=set_status&orderId=${orderId}&status=Delivered`;

      const emailPayload: Record<string, string> = {
        _subject: `✨ NEW COD ATTAR ORDER #${orderId} - Rs ${grandTotal} - ${form.fullName.trim()}`,
        _replyto: form.email.trim(),
        _captcha: 'false',
        _template: 'table',
        Order_ID: orderId,
        Customer_Name: form.fullName.trim(),
        Mobile_Number: `+91 ${form.phone.trim()} (VERIFIED ✓)`,
        Customer_Email: form.email.trim(),
        Delivery_Address: `${form.address.trim()}, ${form.city.trim()}, ${form.state.trim()} - PIN: ${form.pinCode.trim()}`,
        Customer_Distance: `${effectiveDistanceKm} km from Chinsurah Store`,
        Delivery_Charge_Status: deliveryCalc.ruleExplanation,
        Items_Ordered: itemsListFormatted,
        Total_Pieces: `${totalQuantity} Units`,
        Items_Subtotal: `Rs ${subtotal}`,
        Delivery_Fee: shippingFee === 0 ? 'FREE (Rs 0)' : `Rs ${shippingFee}`,
        Grand_Total_To_Collect_COD: `Rs ${grandTotal}`,
        Payment_Mode: 'CASH ON DELIVERY (COD) ONLY',
        Special_Notes: form.orderNotes?.trim() || 'None',
        Order_Placed_At: timestamp,
        Action_Mark_Dispatched: dispatchedUrl,
        Action_Mark_Delivered: deliveredUrl,
      };

      // Native Hidden Form Submission directly to nskproject01@gmail.com
      const hiddenForm1 = document.getElementById('hidden-order-formsubmit-1') as HTMLFormElement | null;
      if (hiddenForm1) {
        const container1 = document.getElementById('hidden-form-inputs-1');
        if (container1) {
          container1.innerHTML = '';
          Object.entries(emailPayload).forEach(([key, val]) => {
            const inp = document.createElement('input');
            inp.type = 'hidden';
            inp.name = key;
            inp.value = val;
            container1.appendChild(inp);
          });
          hiddenForm1.submit();
        }
      }

      // Background fetch directly to nskproject01@gmail.com with keepalive: true
      fetch('https://formsubmit.co/ajax/nskproject01@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(emailPayload),
        keepalive: true,
      }).catch((err) => console.log('Mail error:', err));
    } catch (e) {
      console.warn('Dispatch note:', e);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      onOrderSuccess(newOrder);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#182920] py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5CEBF] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#7A664F] uppercase tracking-widest mb-1">
              <span>CHECKOUT &amp; DISPATCH</span>
              <span>•</span>
              <span className="text-[#143628]">ORDER DETAILS</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#143628] tracking-tight">
              Order Details &amp; Direct Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-[#7A664F] mt-1">
              Complete your delivery address and contact information to receive authentic non-alcoholic attars.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-xs">
              <Banknote className="w-4 h-4 text-emerald-700" />
              <span>100% CASH ON DELIVERY</span>
            </span>
          </div>
        </div>

        {/* 1. LIGHT-THEMED STORE LOCATION & VISUAL MAP SECTION (No raw link, Clean Name & Map Image) */}
        <section aria-label="Store Location & Delivery Details" className="bg-white text-[#182920] rounded-3xl p-6 sm:p-8 border-2 border-[#C5A86A] shadow-md relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Store Identity & Clear Rates */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#143628]">
                  OFFICIAL CENTRAL ATELIER
                </span>
              </div>

              {/* Full Store Name & Physical Address */}
              <div className="space-y-1.5 bg-[#FDFBF7] p-4 rounded-2xl border border-[#D5CEBF]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-[#C5A86A] flex-shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#143628]">
                      FRAGRANCE PREMIUM Atelier (Main Hub)
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-[#7A664F] mt-0.5">
                      WCP3+C4P Chinsurah, Hooghly District, West Bengal 712101
                    </p>
                    <p className="text-[11px] text-[#7A664F]/90 mt-0.5">
                      Landmark: Near Hooghly Railway Station &amp; GT Road Crossing
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Charge Formula - Highlighted per user requirements */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#C5A86A]/60 text-xs space-y-2">
                <div className="font-bold text-[#143628] flex items-center gap-1.5 text-xs sm:text-sm">
                  <Truck className="w-4 h-4 text-[#C5A86A]" />
                  <span>TRANSPARENT DISTANCE-BASED DELIVERY CHARGES</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-emerald-50/80 border border-emerald-300 p-3 rounded-xl flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      ✓
                    </span>
                    <div>
                      <span className="block text-[11px] font-bold uppercase text-emerald-900">Within 2.0 KM Radius</span>
                      <strong className="text-emerald-700 text-sm">FREE DELIVERY (₹0)</strong>
                    </div>
                  </div>

                  <div className="bg-amber-50/80 border border-amber-300 p-3 rounded-xl flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#C5A86A] text-[#0F281D] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      ★
                    </span>
                    <div>
                      <span className="block text-[11px] font-bold uppercase text-amber-900">Beyond 2.0 KM</span>
                      <strong className="text-[#92400E] text-sm">₹10 per 500 Meters</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Distance Meter */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#D5CEBF]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#C5A86A] flex items-center justify-center text-[#143628] font-bold text-xs shadow-xs">
                    <Navigation className="w-4 h-4 text-[#143628]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7A664F] block">Your Distance to Atelier</span>
                    <span className="text-sm sm:text-base font-bold text-[#143628]">
                      {effectiveDistanceKm} KM away ({deliveryCalc.isFree ? 'Free Delivery' : `₹${shippingFee} Delivery`})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={requestGeolocation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#D5CEBF] text-[#143628] text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  <RotateCcw className={`w-3.5 h-3.5 text-[#C5A86A] ${locationStatus === 'detecting' ? 'animate-spin' : ''}`} />
                  <span>{locationStatus === 'detecting' ? 'Locating...' : 'Refresh GPS'}</span>
                </button>
              </div>

            </div>

            {/* Right: NORMAL MAP IMAGE / VISUAL MAP CARD (No raw link, clean cartographic preview) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full bg-[#FAF7F0] border-2 border-[#D5CEBF] rounded-2xl p-3 shadow-inner space-y-2">
                
                {/* Visual Cartographic Map Canvas */}
                <div className="relative w-full h-[220px] sm:h-[240px] rounded-xl overflow-hidden border border-[#D5CEBF] bg-[#E8EDE6] shadow-xs">
                  {/* Map Grid and River SVG Illustration */}
                  <svg className="w-full h-full" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background terrain */}
                    <rect width="400" height="240" fill="#EBF0E6" />
                    
                    {/* River Hooghly winding through eastern side */}
                    <path
                      d="M320 0 C310 60, 340 120, 310 180 C290 220, 330 240, 320 240 L400 240 L400 0 Z"
                      fill="#BEE3F8"
                      stroke="#90CDF4"
                      strokeWidth="2"
                    />
                    <text x="345" y="110" fill="#2B6CB0" fontSize="10" fontWeight="bold" transform="rotate(75 345,110)">
                      Hooghly River
                    </text>

                    {/* Major Roads (GT Road & State Highways) */}
                    <path d="M0 60 Q150 70 400 50" stroke="#CBD5E0" strokeWidth="8" />
                    <path d="M0 60 Q150 70 400 50" stroke="#FFFFFF" strokeWidth="6" />

                    <path d="M120 0 Q140 120 110 240" stroke="#F6E05E" strokeWidth="7" />
                    <path d="M120 0 Q140 120 110 240" stroke="#FAF089" strokeWidth="4" />
                    <text x="75" y="140" fill="#744210" fontSize="9" fontWeight="bold" transform="rotate(78 75,140)">
                      Grand Trunk Road
                    </text>

                    {/* Secondary roads */}
                    <path d="M60 120 L300 130" stroke="#FFFFFF" strokeWidth="4" />
                    <path d="M180 30 L220 240" stroke="#FFFFFF" strokeWidth="4" />

                    {/* Concentric 2 KM Free Delivery Zone Circle */}
                    <circle cx="180" cy="120" r="75" fill="#48BB78" fillOpacity="0.12" stroke="#38A169" strokeWidth="1.5" strokeDasharray="4 3" />
                    <circle cx="180" cy="120" r="130" fill="#ECC94B" fillOpacity="0.08" stroke="#D69E2E" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Free delivery label */}
                    <rect x="120" y="52" width="120" height="18" rx="9" fill="#143628" />
                    <text x="180" y="65" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                      FREE 2.0 KM ZONE (₹0)
                    </text>

                    {/* Chinsurah Store Location Pin (Pulsing marker) */}
                    <circle cx="180" cy="120" r="16" fill="#C5A86A" fillOpacity="0.3" className="animate-ping" />
                    <circle cx="180" cy="120" r="9" fill="#143628" stroke="#C5A86A" strokeWidth="2.5" />
                    <circle cx="180" cy="120" r="3.5" fill="#FFFFFF" />

                    {/* Atelier Location Pin Label Card */}
                    <g transform="translate(180, 115)">
                      <rect x="-70" y="-36" width="140" height="26" rx="6" fill="#143628" stroke="#C5A86A" strokeWidth="1.5" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" />
                      <text x="0" y="-23" fill="#C5A86A" fontSize="9" fontWeight="bold" textAnchor="middle">
                        ★ CHINSURAH ATELIER
                      </text>
                      <text x="0" y="-13" fill="#FFFFFF" fontSize="8" textAnchor="middle">
                        WCP3+C4P Chinsurah, WB
                      </text>
                    </g>
                  </svg>

                  {/* Corner Map Badges */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs border border-[#D5CEBF] text-[9px] font-bold text-[#143628]">
                    📍 Map Center: Chinsurah, Hooghly
                  </div>
                </div>

                {/* Open in Google Maps Button */}
                <a
                  href={STORE_LOCATION.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#C5A86A] text-[#143628] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C5A86A]" />
                  <span>Open Full Directions in Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-[#7A664F]" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* 2. Main Order Details Form and Cart Review Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Required Customer Details Form (7 Cols) */}
          <section aria-label="Customer Information" className="lg:col-span-7 bg-white border border-[#D5CEBF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#D5CEBF] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#143628] text-[#C5A86A] text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#143628]">
                  Customer &amp; Delivery Information
                </h2>
              </div>
              <p className="text-xs text-[#7A664F] mt-1">
                All fields are mandatory. Mobile number must be verified before placing order.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#143628] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mohammad Rizwan"
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-[#182920] bg-[#FAF7F0] focus:bg-white focus:outline-none transition-all ${
                    formErrors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-[#D5CEBF] focus:border-[#143628]'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#143628] mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. customer@gmail.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-[#182920] bg-[#FAF7F0] focus:bg-white focus:outline-none transition-all ${
                    formErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-[#D5CEBF] focus:border-[#143628]'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Mobile Number with Interactive Verification (Mandatory per User Request) */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#C5A86A]/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#143628]">
                    Mobile Number (Mandatory Verification) <span className="text-red-500">*</span>
                  </label>
                  {form.phoneVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>VERIFIED ✓</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-800 font-bold">
                      Verification Required
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7A664F]">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="8777855462"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm font-semibold tracking-wider bg-white focus:outline-none ${
                        form.phoneVerified
                          ? 'border-emerald-500 text-emerald-900 bg-emerald-50/50'
                          : formErrors.phone
                          ? 'border-red-500'
                          : 'border-[#D5CEBF] focus:border-[#143628]'
                      }`}
                    />
                  </div>

                  {!form.phoneVerified ? (
                    <button
                      type="button"
                      onClick={handleInitiatePhoneVerification}
                      className="px-4 py-2.5 rounded-xl bg-[#143628] hover:bg-[#1F4D3B] text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer whitespace-nowrap shadow-sm transition-all"
                    >
                      Verify Number
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, phoneVerified: false }))}
                      className="px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer whitespace-nowrap"
                      title="Change phone number"
                    >
                      Change
                    </button>
                  )}
                </div>

                {formErrors.phone && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.phone}</span>
                  </p>
                )}
                {!form.phoneVerified && (
                  <p className="text-[11px] text-[#7A664F]">
                    Click &ldquo;Verify Number&rdquo; to test and authenticate your 10-digit mobile number before checkout.
                  </p>
                )}
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#143628] mb-1.5">
                  Complete Street Address / Premises <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="House / Flat No., Building Name, Street / Road, Landmark"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-[#182920] bg-[#FAF7F0] focus:bg-white focus:outline-none transition-all ${
                    formErrors.address ? 'border-red-500 ring-1 ring-red-500' : 'border-[#D5CEBF] focus:border-[#143628]'
                  }`}
                />
                {formErrors.address && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.address}</span>
                  </p>
                )}
              </div>

              {/* City, State, PIN Code in 3-Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* City */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#143628] mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Chinsurah / Kolkata"
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm text-[#182920] bg-[#FAF7F0] focus:bg-white focus:outline-none ${
                      formErrors.city ? 'border-red-500' : 'border-[#D5CEBF] focus:border-[#143628]'
                    }`}
                  />
                  {formErrors.city && <p className="text-xs text-red-600 mt-1">{formErrors.city}</p>}
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#143628] mb-1.5">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D5CEBF] text-sm text-[#182920] bg-[#FAF7F0] focus:bg-white focus:outline-none"
                  />
                </div>

                {/* PIN Code */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#143628] mb-1.5">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="712101"
                    value={form.pinCode}
                    onChange={(e) => handleChange('pinCode', e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm text-[#182920] bg-[#FAF7F0] focus:bg-white focus:outline-none ${
                      formErrors.pinCode ? 'border-red-500' : 'border-[#D5CEBF] focus:border-[#143628]'
                    }`}
                  />
                  {formErrors.pinCode && <p className="text-xs text-red-600 mt-1">{formErrors.pinCode}</p>}
                </div>
              </div>

              {/* Order Delivery Notes (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#143628] mb-1.5">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please call before reaching premises or deliver after 4 PM"
                  value={form.orderNotes || ''}
                  onChange={(e) => handleChange('orderNotes', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEBF] text-sm text-[#182920] bg-[#FAF7F0] focus:bg-white focus:outline-none"
                />
              </div>

              {/* 100% Cash on Delivery Notice */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-3">
                <Banknote className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <strong className="font-bold">100% CASH ON DELIVERY (COD) ONLY:</strong> No online advance payment required. You inspect and pay in cash only when your authentic attars reach your hands.
                </div>
              </div>

              {/* PLACE ORDER Action Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
                    !form.phoneVerified
                      ? 'bg-amber-800 hover:bg-amber-900 text-white'
                      : 'bg-[#143628] hover:bg-[#1B4D39] text-[#FAF7F0] border-2 border-[#C5A86A]'
                  }`}
                >
                  {isSubmitting ? (
                    <span>DISPATCHING ORDER TO ATELIER...</span>
                  ) : !form.phoneVerified ? (
                    <span>VERIFY MOBILE NUMBER TO PLACE ORDER</span>
                  ) : (
                    <>
                      <span>CONFIRM &amp; PLACE ORDER (COD: ₹{grandTotal})</span>
                      <ArrowRight className="w-5 h-5 text-[#C5A86A]" />
                    </>
                  )}
                </button>
              </div>

              {/* Owner Activation Info Notice */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Store Dispatch Note:</strong> All placed orders instantly update into <em>nskproject01@gmail.com</em> and the Store Orders Vault.
                </span>
              </div>
            </form>
          </section>

          {/* Right Column: Ordered Attars Breakdown & Live Calculation (5 Cols) */}
          <aside aria-label="Order Summary" className="lg:col-span-5 space-y-6">
            
            {/* Cart Items List Card */}
            <div className="bg-white border border-[#D5CEBF] rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#D5CEBF] pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#143628] text-[#C5A86A] text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="font-serif text-lg font-bold text-[#143628]">
                    Ordered Fragrances ({totalQuantity})
                  </h2>
                </div>
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-red-600 hover:text-red-700 font-bold"
                  >
                    Clear Bag
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF7F0] text-[#143628] flex items-center justify-center mx-auto border border-[#D5CEBF]">
                    <ShoppingBag className="w-6 h-6 text-[#7A664F]" />
                  </div>
                  <p className="text-xs text-[#7A664F]">
                    No attars currently selected in your order bag.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActivePage('collection')}
                    className="px-4 py-2 rounded-xl bg-[#143628] text-white text-xs font-bold"
                  >
                    Browse Attars
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {items.map((item) => {
                    const originalUnitPrice = getOriginalPrice(item.unitPrice);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F0] border border-[#D5CEBF]/80"
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#D5CEBF] p-0.5 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Title & Price */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-[#143628] truncate">
                              {item.name}
                            </span>
                            <span className="text-xs font-extrabold text-[#143628]">
                              ₹{item.unitPrice * item.quantity}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-[#7A664F] mt-0.5">
                            <span className="font-semibold text-[#143628]">
                              {item.ml === 18
                                ? '6 Pcs Box (18ml)'
                                : item.ml === 36
                                ? '12 Pcs Box (36ml)'
                                : item.ml === 25
                                ? '10 Pcs Box (25ml)'
                                : item.ml === 100
                                ? '20 Pcs Box'
                                : `${item.ml}ml Single Flacon`}
                            </span>
                            <span>•</span>
                            <span className="line-through text-gray-400">₹{originalUnitPrice}</span>
                            <span className="font-bold text-[#143628]">₹{item.unitPrice}</span>
                          </div>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center gap-1 bg-white border border-[#D5CEBF] rounded-lg px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-[#143628] text-gray-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1 text-xs font-bold text-[#143628] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-[#143628] text-gray-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bill Details Calculation */}
              <div className="border-t border-[#D5CEBF] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#7A664F]">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-[#182920]">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center text-[#7A664F]">
                  <div className="flex items-center gap-1">
                    <span>Delivery Charge ({effectiveDistanceKm} km):</span>
                  </div>
                  <span className={`font-bold ${deliveryCalc.isFree ? 'text-emerald-700' : 'text-[#143628]'}`}>
                    {deliveryCalc.isFree ? 'FREE (₹0)' : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="text-[10px] text-[#7A664F] italic bg-[#FAF7F0] p-2 rounded-xl">
                  {deliveryCalc.ruleExplanation}
                </div>

                <div className="border-t border-[#D5CEBF] pt-2 flex justify-between items-center text-sm sm:text-base font-bold text-[#143628]">
                  <span>Grand Total (Cash on Delivery):</span>
                  <span className="font-serif text-lg sm:text-xl font-extrabold text-[#143628]">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* Helpline Assistance */}
            <div className="bg-white border border-[#D5CEBF] rounded-2xl p-4 text-xs space-y-2 shadow-xs">
              <div className="font-bold text-[#143628] flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#C5A86A]" />
                <span>CUSTOMER HELPLINE</span>
              </div>
              <p className="text-[#7A664F]">
                Have a question about your fragrance delivery? Call our master atelier directly:
              </p>
              <div className="font-mono font-bold text-sm text-[#143628]">
                {BRAND_CONFIG.contact.phone}
              </div>
            </div>
          </aside>
        </div>

        {/* 3. PROMINENT BOTTOM LINK: BACK TO MAIN ATTAR COLLECTION */}
        {/* Strictly per user prompt: "KEO JODI ORDER DATILS A JAI SEKHANE NICHE AKTA LINK THAKBE JETA DIRECTLY MAIN ATTAR ER COLLECTION A NIA JABE" */}
        <div className="pt-6 border-t border-[#D5CEBF]">
          <button
            type="button"
            onClick={() => {
              setActivePage('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-[#FAF7F0] border-2 border-[#143628] text-[#143628] font-serif font-extrabold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-5 h-5 text-[#143628] group-hover:-translate-x-1 transition-transform" />
            <span>← BROWSE &amp; ADD MORE ATTARS FROM MAIN COLLECTION</span>
          </button>
        </div>
      </div>

      {/* Interactive Mobile Verification Code Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-[#C5A86A] p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F0] border border-[#C5A86A] text-[#143628] flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6 text-[#C5A86A]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#143628]">
                Verify Mobile Number
              </h3>
              <p className="text-xs text-[#7A664F]">
                Verification code for +91 {form.phone}:
              </p>
            </div>

            {/* Simulated SMS Screen for Instant User Verification */}
            <div className="p-3 rounded-2xl bg-[#0F281D] text-[#FAF7F0] border border-[#C5A86A] text-center space-y-1">
              <span className="text-[10px] text-[#C5A86A] uppercase font-bold tracking-wider">
                SMS VERIFICATION CODE
              </span>
              <div className="font-mono text-2xl font-extrabold tracking-widest text-white">
                {generatedOtp}
              </div>
              <span className="text-[10px] text-[#FAF7F0]/70">
                (Enter these 4 digits below to authenticate your phone)
              </span>
            </div>

            <form onSubmit={handleConfirmOtp} className="space-y-3">
              <div>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Enter 4-digit code"
                  value={enteredOtp}
                  onChange={(e) => {
                    setEnteredOtp(e.target.value);
                    setOtpError('');
                  }}
                  autoFocus
                  className="w-full text-center text-xl font-mono font-bold tracking-widest py-2.5 rounded-xl border border-[#D5CEBF] focus:border-[#143628] focus:outline-none"
                />
                {otpError && (
                  <p className="text-xs text-red-600 mt-1 text-center font-medium">
                    {otpError}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="flex-1 py-2.5 rounded-xl bg-[#143628] hover:bg-[#1F4D3B] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
                >
                  {isVerifyingOtp ? 'Verifying...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invisible background form and iframe for direct FormSubmit delivery to nskproject01@gmail.com */}
      <iframe
        name="hidden_email_iframe_1"
        id="hidden_email_iframe_1"
        title="Email Delivery"
        style={{ display: 'none', width: 0, height: 0, border: 0 }}
      />

      {/* Form: Direct to nskproject01@gmail.com */}
      <form
        id="hidden-order-formsubmit-1"
        action="https://formsubmit.co/nskproject01@gmail.com"
        method="POST"
        target="hidden_email_iframe_1"
        style={{ display: 'none' }}
      >
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_template" value="table" />
        <div id="hidden-form-inputs-1" />
      </form>
    </div>
  );
};
