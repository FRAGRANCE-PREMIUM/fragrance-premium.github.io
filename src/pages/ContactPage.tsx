import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Sparkles,
  MapPin,
  ShieldCheck,
  Building,
  ArrowRight,
  PackageCheck,
  FileText,
  User,
  Compass,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/config';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  orderDetails: string;
}

const INITIAL_FORM: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: 'West Bengal',
  pinCode: '',
  orderDetails: '',
};

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim() || !form.email.includes('@')) newErrors.email = 'Valid email address is required';
    if (!form.phone.trim() || form.phone.replace(/[^0-9]/g, '').length < 10) {
      newErrors.phone = 'Valid 10-digit mobile number is required';
    }
    if (!form.address.trim()) newErrors.address = 'Street address / premises is required';
    if (!form.city.trim()) newErrors.city = 'City name is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.pinCode.trim() || form.pinCode.replace(/[^0-9]/g, '').length < 6) {
      newErrors.pinCode = 'Valid 6-digit PIN code is required';
    }
    if (!form.orderDetails.trim()) {
      newErrors.orderDetails = 'Please specify your requested attars or order details';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSending(true);

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const payload = {
      _subject: `👑 New Order Inquiry & Contact Details: ${form.name} (${form.phone})`,
      _template: 'table',
      Customer_Name: form.name.trim(),
      Customer_Email: form.email.trim(),
      Customer_Phone: form.phone.trim(),
      Delivery_Address: form.address.trim(),
      City: form.city.trim(),
      State: form.state.trim(),
      PIN_Code: form.pinCode.trim(),
      Order_Details: form.orderDetails.trim(),
      Submitted_At: timestamp,
      Boutique: BRAND_CONFIG.brandName,
    };

    // 1. Submit native hidden Form to nskproject01@gmail.com
    const hiddenForm1 = document.getElementById('contact-formsubmit-1') as HTMLFormElement | null;
    if (hiddenForm1) {
      const container1 = document.getElementById('contact-form-inputs-1');
      if (container1) {
        container1.innerHTML = '';
        Object.entries(payload).forEach(([k, v]) => {
          const inp = document.createElement('input');
          inp.type = 'hidden';
          inp.name = k;
          inp.value = v;
          container1.appendChild(inp);
        });
        hiddenForm1.submit();
      }
    }

    // 2. Direct Background Fetch with keepalive
    try {
      await fetch('https://formsubmit.co/ajax/nskproject01@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch {
      // Graceful error handling
    } finally {
      setIsSending(false);
      setSubmitted(true);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 bg-transparent text-[#182920]">
      
      {/* Page Title & Luxury Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#143628]/10 border border-[#C5A86A] text-xs uppercase tracking-[0.25em] text-[#143628] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A86A]" />
          <span>Royal Client Concierge & Order Desk</span>
          <Sparkles className="w-3.5 h-3.5 text-[#C5A86A]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#143628] font-bold tracking-tight">
          Contact Details & Direct Order Desk
        </h1>
        <p className="text-xs sm:text-sm text-[#182920]/80 leading-relaxed">
          Submit your contact coordinates and custom attar specifications below. Your details will be transmitted immediately to our master mailbox at <strong>nskproject01@gmail.com</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Phone Concierge & Heritage Credentials (5 Columns) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Direct Calling Card (Forest Green & Gold) */}
          <div className="bg-gradient-to-br from-[#143628] via-[#1B4634] to-[#0F281D] text-[#FAF7F0] rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#C5A86A] space-y-5 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#C5A86A]/10 pointer-events-none" />
            
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A86A] font-extrabold block">
                Direct Phone Hotline
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                Instant Telephone Assistance
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#FAF7F0]/85 leading-relaxed">
              Connect directly with our master perfumer and dispatch managers for immediate orders, custom decants, or delivery support.
            </p>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-[#C5A86A]/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C5A86A] font-bold block">
                  Official Mobile Number
                </span>
                <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  +91 8777855462
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#C5A86A] text-[#0F281D] flex items-center justify-center font-bold shadow-sm">
                <Phone className="w-5 h-5 text-[#0F281D]" />
              </div>
            </div>

            <a
              href="tel:+918777855462"
              className="w-full py-3.5 rounded-xl text-xs font-extrabold tracking-wider bg-[#C5A86A] hover:bg-white text-[#0F281D] flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#0F281D]" />
              <span>DIAL +91 8777855462</span>
            </a>
          </div>

          {/* Contact Details Directory */}
          <div className="bg-white border border-[#D5CEBF] rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs text-xs">
            
            {/* Primary Order Inbox */}
            <div className="flex items-start gap-3.5 pb-4 border-b border-[#D5CEBF]/60">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] text-[#143628] flex items-center justify-center flex-shrink-0 border border-[#C5A86A]/50">
                <Mail className="w-5 h-5 text-[#143628]" />
              </div>
              <div className="space-y-1">
                <span className="text-[#7A664F] block text-[11px] uppercase font-bold tracking-wider">
                  Official Store Inbox
                </span>
                <a href="mailto:nskproject01@gmail.com" className="text-sm font-bold text-[#143628] hover:underline block">
                  nskproject01@gmail.com
                </a>
                <span className="text-[10px] text-[#143628] bg-[#143628]/10 px-2 py-0.5 rounded-md inline-block font-medium mt-1">
                  Receives all inquiries &amp; order submissions directly
                </span>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start gap-3.5 pb-4 border-b border-[#D5CEBF]/60">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] text-[#143628] flex items-center justify-center flex-shrink-0 border border-[#C5A86A]/50">
                <Clock className="w-5 h-5 text-[#143628]" />
              </div>
              <div>
                <span className="text-[#7A664F] block text-[11px] uppercase font-bold tracking-wider">
                  Dispatch & Desk Schedule
                </span>
                <span className="text-sm font-bold text-[#143628] block">
                  Monday – Saturday: 10:00 AM – 9:00 PM IST
                </span>
                <span className="text-xs text-[#617367] block mt-0.5">
                  Online order submissions open 24 Hours / 7 Days
                </span>
              </div>
            </div>

            {/* Physical Atelier Location */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] text-[#143628] flex items-center justify-center flex-shrink-0 border border-[#C5A86A]/50">
                <Building className="w-5 h-5 text-[#143628]" />
              </div>
              <div>
                <span className="text-[#7A664F] block text-[11px] uppercase font-bold tracking-wider">
                  Heritage Perfumery Studio
                </span>
                <p className="text-xs font-semibold text-[#182920] leading-relaxed">
                  {BRAND_CONFIG.contact.address}
                </p>
                <span className="text-[11px] text-[#7A664F] block mt-0.5">
                  Direct express dispatch throughout India
                </span>
              </div>
            </div>

          </div>

          {/* Luxury Quality Purity Promise */}
          <div className="bg-[#FAF7F0] border border-[#C5A86A] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#143628] text-[#C5A86A] flex items-center justify-center flex-shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#C5A86A]" />
            </div>
            <div className="text-xs space-y-0.5">
              <span className="font-bold uppercase tracking-wider text-[#143628] block">
                100% Authentic Non-Alcoholic Attars
              </span>
              <p className="text-[#7A664F] leading-tight">
                Authentic Kannauj Deg-Bhapka distillation, certified cruelty-free, alcohol-free pure oils.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Full Contact Details & Order Submission Form (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-[#D5CEBF] rounded-3xl p-6 sm:p-10 shadow-lg relative">
          
          {submitted ? (
            <div className="py-8 px-4 text-center space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border-2 border-[#10B981] text-[#10B981] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C5A86A] font-extrabold block">
                  Dispatched Successfully
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#143628]">
                  Order & Contact Details Transmitted
                </h3>
                <p className="text-xs sm:text-sm text-[#182920]/80 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{form.name}</strong>. Your full contact coordinates and attar specifications have been immediately sent to our official administrator mailbox:
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#C5A86A] max-w-md mx-auto text-left text-xs space-y-2 text-[#182920]">
                <div className="flex items-center gap-2 text-[#143628] font-bold">
                  <Mail className="w-4 h-4 text-[#C5A86A]" />
                  <span>nskproject01@gmail.com</span>
                </div>
                <div className="pt-2 border-t border-[#D5CEBF]/80 text-[#7A664F] flex items-center justify-between">
                  <span>Contact Phone:</span>
                  <span className="font-bold text-[#143628]">{form.phone}</span>
                </div>
                <div className="flex items-center justify-between text-[#7A664F]">
                  <span>City / PIN:</span>
                  <span className="font-bold text-[#143628]">{form.city} - {form.pinCode}</span>
                </div>
              </div>

              <p className="text-xs text-[#617367]">
                Our fulfillment concierge will review your order details and reach out to you via telephone at <strong>{form.phone}</strong>.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm(INITIAL_FORM);
                  }}
                  className="px-6 py-3 rounded-xl bg-[#143628] hover:bg-[#1F4D3B] text-[#FAF7F0] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
                <a
                  href="tel:+918777855462"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-[#FAF7F0] text-[#143628] border border-[#C5A86A] font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C5A86A]" />
                  <span>Call +91 8777855462</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Form Title */}
              <div className="space-y-1.5 border-b border-[#D5CEBF] pb-5">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#C5A86A]" />
                  <h2 className="font-serif text-2xl font-bold text-[#143628]">
                    Client Details & Order Form
                  </h2>
                </div>
                <p className="text-xs text-[#182920]/75">
                  Fill in your complete shipping coordinates and desired attars below for instant email dispatch.
                </p>
              </div>

              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#143628] mb-1.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#C5A86A]" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="e.g. Tariq Mansoor"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.name ? 'border-red-500 bg-red-50/50' : 'border-[#D5CEBF] bg-[#FAF7F0]'
                    } focus:bg-white focus:outline-none focus:border-[#143628] text-sm text-[#182920] transition-colors`}
                  />
                  {errors.name && <span className="text-[11px] text-red-600 font-medium mt-1 block">{errors.name}</span>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#143628] mb-1.5 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#C5A86A]" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="e.g. yourname@gmail.com"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email ? 'border-red-500 bg-red-50/50' : 'border-[#D5CEBF] bg-[#FAF7F0]'
                    } focus:bg-white focus:outline-none focus:border-[#143628] text-sm text-[#182920] transition-colors`}
                  />
                  {errors.email && <span className="text-[11px] text-red-600 font-medium mt-1 block">{errors.email}</span>}
                </div>
              </div>

              {/* Row 2: Phone Number & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#143628] mb-1.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#C5A86A]" />
                    <span>Mobile / Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => {
                      setForm({ ...form, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    placeholder="e.g. 8777855462"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.phone ? 'border-red-500 bg-red-50/50' : 'border-[#D5CEBF] bg-[#FAF7F0]'
                    } focus:bg-white focus:outline-none focus:border-[#143628] text-sm text-[#182920] transition-colors`}
                  />
                  {errors.phone && <span className="text-[11px] text-red-600 font-medium mt-1 block">{errors.phone}</span>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#143628] mb-1.5 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#C5A86A]" />
                    <span>City / Town *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => {
                      setForm({ ...form, city: e.target.value });
                      if (errors.city) setErrors({ ...errors, city: undefined });
                    }}
                    placeholder="e.g. Kolkata"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.city ? 'border-red-500 bg-red-50/50' : 'border-[#D5CEBF] bg-[#FAF7F0]'
                    } focus:bg-white focus:outline-none focus:border-[#143628] text-sm text-[#182920] transition-colors`}
                  />
                  {errors.city && <span className="text-[11px] text-red-600 font-medium mt-1 block">{errors.city}</span>}
                </div>
              </div>

              {/* Row 3: Street Address */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#143628] mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C5A86A]" />
                  <span>Street Address / Apartment / Landmark *</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => {
                    setForm({ ...form, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: undefined });
                  }}
                  placeholder="e.g. Flat 3B, Royal Heritage Apartments, Park Street"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.address ? 'border-red-500 bg-red-50/50' : 'border-[#D5CEBF] bg-[#FAF7F0]'
                  } focus:bg-white focus:outline-none focus:border-[#143628] text-sm text-[#182920] transition-colors`}
                />
                {errors.address && <span className="text-[11px] text-red-600 font-medium mt-1 block">{errors.address}</span>}
              </div>

              {/* Row 4: State & PIN Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#143628] mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => {
                      setForm({ ...form, state: e.target.value });
                      if (errors.state) setErrors({ ...errors, state: undefined });
                    }}
                    placeholder="e.g. West Bengal"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.state ? 'border-red-500 bg-red-50/50' : 'border-[#D5CEBF] bg-[#FAF7F0]'
                    } focus:bg-white focus:outline-none focus:border-[#143628] text-sm text-[#182920] transition-colors`}
                  />
                  {errors.state && <span className="text-[11px] text-red-600 font-medium mt-1 block">{errors.state}</span>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#143628] mb-1.5">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.pinCode}
                    onChange={(e) => {
                      setForm({ ...form, pinCode: e.target.value });
                      if (errors.pinCode) setErrors({ ...errors, pinCode: undefined });
                    }}
                    placeholder="e.g. 700016"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.pinCode ? 'border-red-500 bg-red-50/50' : 'border-[#D5CEBF] bg-[#FAF7F0]'
                    } focus:bg-white focus:outline-none focus:border-[#143628] text-sm text-[#182920] transition-colors`}
                  />
                  {errors.pinCode && <span className="text-[11px] text-red-600 font-medium mt-1 block">{errors.pinCode}</span>}
                </div>
              </div>

              {/* Row 5: Order Details / Requested Fragrances */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#143628] mb-1.5 flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5 text-[#C5A86A]" />
                  <span>Order Details / Requested Fragrances & Quantities *</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.orderDetails}
                  onChange={(e) => {
                    setForm({ ...form, orderDetails: e.target.value });
                    if (errors.orderDetails) setErrors({ ...errors, orderDetails: undefined });
                  }}
                  placeholder="e.g. 1 Box (12 pcs) Ruh Gulab 3ml at ₹480, 2 pcs Majmua 96 2.5ml at ₹200, 1 pc Jinn 3ml. Please deliver in gift packaging."
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.orderDetails ? 'border-red-500 bg-red-50/50' : 'border-[#D5CEBF] bg-[#FAF7F0]'
                  } focus:bg-white focus:outline-none focus:border-[#143628] text-sm text-[#182920] transition-colors`}
                />
                {errors.orderDetails && (
                  <span className="text-[11px] text-red-600 font-medium mt-1 block">{errors.orderDetails}</span>
                )}
                <span className="text-[11px] text-[#7A664F] mt-1 block">
                  You can specify multiple attars, box pieces, customized requirements, or delivery instructions.
                </span>
              </div>

              {/* Email Dispatch Notice */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#C5A86A]/60 flex items-center gap-2.5 text-xs text-[#143628]">
                <Mail className="w-4 h-4 text-[#C5A86A] flex-shrink-0" />
                <span>
                  On submit, your contact &amp; order info will be automatically dispatched to <strong>nskproject01@gmail.com</strong>.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-4 rounded-2xl bg-[#143628] hover:bg-[#1F4D3B] text-[#FAF7F0] font-extrabold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-70"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#C5A86A] border-t-transparent rounded-full animate-spin" />
                    <span>DISPATCHING DETAILS TO GMAIL...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#C5A86A]" />
                    <span>SUBMIT ORDER & CONTACT DETAILS</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A86A]" />
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>

      {/* Invisible background form and iframe for direct FormSubmit delivery to nskproject01@gmail.com */}
      <iframe
        name="contact_hidden_iframe_1"
        id="contact_hidden_iframe_1"
        title="Contact Email"
        style={{ display: 'none', width: 0, height: 0, border: 0 }}
      />

      {/* Form: Direct to nskproject01@gmail.com */}
      <form
        id="contact-formsubmit-1"
        action="https://formsubmit.co/nskproject01@gmail.com"
        method="POST"
        target="contact_hidden_iframe_1"
        style={{ display: 'none' }}
      >
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_template" value="table" />
        <div id="contact-form-inputs-1" />
      </form>
    </div>
  );
};
