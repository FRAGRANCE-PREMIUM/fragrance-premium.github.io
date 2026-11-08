import React, { useState } from 'react';
import {
  Phone,
  MapPin,
  Trash2,
  Download,
  ArrowLeft,
  ShoppingBag,
  Search,
  Lock,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  ChevronDown,
  ChevronUp,
  Mail,
  FileText,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_CONFIG } from '../config/config';
import { ActivePage, Order } from '../types';
import { getOriginalPrice } from '../utils/pricing';

interface OrdersDashboardPageProps {
  setActivePage: (page: ActivePage) => void;
}

const AUTHORIZED_GMAILS = ['nskproject01@gmail.com', 'nsk79674@gmail.com'];
const ADMIN_PASSWORD = 'FG_PREMIUM@007';

export const OrdersDashboardPage: React.FC<OrdersDashboardPageProps> = ({ setActivePage }) => {
  const { orders, updateOrderStatus, updateOrderAdminNotes, deleteOrder, clearAllOrders } = useCart();
  const [filterStatus, setFilterStatus] = useState<'all' | 'Received' | 'Processing' | 'Dispatched' | 'Delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion Expand/Collapse State to eliminate negative space
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

  // In-App Deletion Modal State (100% immune to iframe/browser confirm blocks)
  const [orderPendingDelete, setOrderPendingDelete] = useState<Order | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [showVaultActivationModal, setShowVaultActivationModal] = useState(false);

  // 2-Step Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('fg_admin_authenticated') === 'true';
  });
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string>(() => {
    return sessionStorage.getItem('fg_admin_email') || AUTHORIZED_GMAILS[0];
  });
  const [emailInput, setEmailInput] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (AUTHORIZED_GMAILS.includes(cleanEmail)) {
      setIsEmailVerified(true);
      setAuthenticatedEmail(cleanEmail);
      setEmailError('');
      setPasswordError('');
    } else {
      setIsEmailVerified(false);
      setEmailError('ACCESS DENIED: Unauthorized email. Authorized account: nskproject01@gmail.com.');
    }
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('fg_admin_authenticated', 'true');
      sessionStorage.setItem('fg_admin_email', authenticatedEmail);
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('ACCESS DENIED: Invalid administrative passcode. Access rejected.');
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('fg_admin_authenticated');
    sessionStorage.removeItem('fg_admin_email');
    setIsAuthenticated(false);
    setIsEmailVerified(false);
    setEmailInput('');
    setPasswordInput('');
  };

  const filteredOrders = orders
    .filter((o) => {
      if (filterStatus !== 'all' && o.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inId = o.orderId.toLowerCase().includes(q);
        const inName = o.customer.fullName.toLowerCase().includes(q);
        const inPhone = o.customer.phone.toLowerCase().includes(q);
        const inCity = o.customer.city.toLowerCase().includes(q);
        const inAddress = o.customer.address.toLowerCase().includes(q);
        if (!inId && !inName && !inPhone && !inCity && !inAddress) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const pendingCount = orders.filter((o) => o.status === 'Received').length;

  const exportToCSV = () => {
    if (orders.length === 0) return;

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'Address',
      'City',
      'PIN',
      'Items',
      'Total Amount',
      'Payment Method',
      'Status',
    ];

    const rows = orders.map((o) => [
      `"${o.orderId}"`,
      `"${o.createdAt}"`,
      `"${o.customer.fullName.replace(/"/g, '""')}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.email || ''}"`,
      `"${o.customer.address.replace(/"/g, '""')}"`,
      `"${o.customer.city}"`,
      `"${o.customer.pinCode}"`,
      `"${o.items.map((it) => `${it.name} (${it.ml}ml) x${it.quantity}`).join(', ')}"`,
      o.grandTotal,
      `"${o.paymentMethod.toUpperCase()}"`,
      `"${o.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fragrance_premium_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If Not Authenticated: Render High-Security Gate in Ivory & Forest Green
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-transparent">
        <div className="w-full max-w-md bg-white border-2 border-[#C5A86A] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#182920] relative overflow-hidden space-y-6">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#143628] via-[#C5A86A] to-[#143628]" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#143628] text-[#C5A86A] flex items-center justify-center shadow-md border border-[#C5A86A]">
              <Shield className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#7A664F] uppercase block">
              Store Owner Portal
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#143628]">
              Store Orders Vault
            </h2>
            <p className="text-xs text-[#182920]/75 leading-relaxed">
              Confidential administrator dashboard for customer orders. Authorized Gmail verification required.
            </p>
          </div>

          {/* STEP 1: GMAIL VERIFICATION */}
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#143628] mb-1.5">
                Step 1: Administrator Gmail Verification
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  disabled={isEmailVerified}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="Enter administrator Gmail..."
                  className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none transition-all ${
                    isEmailVerified
                      ? 'bg-[#ECFDF5] border-[#10B981] text-[#065F46]'
                      : emailError
                      ? 'bg-[#FEF2F2] border-[#EF4444] text-[#991B1B]'
                      : 'bg-[#FAF7F0] border-[#D5CEBF] text-[#182920] focus:border-[#143628]'
                  }`}
                  required
                />
                {isEmailVerified && (
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>

            {emailError && (
              <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[#DC2626] mt-0.5" />
                <span>{emailError}</span>
              </div>
            )}

            {!isEmailVerified && (
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#143628] hover:bg-[#1F4D3B] text-[#FAF7F0] font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-[#C5A86A]" />
                <span>Verify Admin Gmail</span>
              </button>
            )}
          </form>

          {/* STEP 2: PASSWORD ENTRY */}
          {isEmailVerified ? (
            <form onSubmit={handleVerifyPassword} className="space-y-4 pt-2 border-t border-[#D5CEBF]/60 animate-in fade-in duration-300">
              <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#10B981]/40 flex items-center gap-2 text-xs text-[#065F46]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                <span>Verified Admin: <strong>{authenticatedEmail}</strong></span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#143628] mb-1.5">
                  Step 2: Security Master Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="Enter security passcode..."
                    className={`w-full pl-4 pr-11 py-3 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none transition-all ${
                      passwordError
                        ? 'bg-[#FEF2F2] border-[#EF4444] text-[#991B1B]'
                        : 'bg-[#FAF7F0] border-[#D5CEBF] text-[#182920] focus:border-[#143628]'
                    }`}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A664F] hover:text-[#143628] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#7A664F]" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[#DC2626] mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#143628] hover:bg-[#1F4D3B] text-[#FAF7F0] font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-[#C5A86A]" />
                <span>Unlock Orders Vault</span>
              </button>
            </form>
          ) : (
            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#D5CEBF] text-center text-xs text-[#7A664F]">
              <Lock className="w-4 h-4 mx-auto mb-1 text-[#7A664F]" />
              <span>Passcode entry will unlock once authorized Gmail is validated.</span>
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setActivePage('home')}
              className="text-xs text-[#7A664F] hover:text-[#143628] underline font-medium cursor-pointer"
            >
              ← Return to Boutique Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-transparent text-[#182920]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5CEBF] pb-5">
        <div>
          <button
            onClick={() => setActivePage('home')}
            className="inline-flex items-center gap-1.5 text-xs text-[#7A664F] hover:text-[#143628] transition-colors mb-2 cursor-pointer font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A86A]" />
            <span>Return to Boutique</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#143628] font-bold">
              Store Orders Vault
            </h1>
            <span className="text-xs bg-[#143628] text-[#FAF7F0] px-3 py-1 rounded-full font-bold">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#182920]/75 mt-1">
            Compact executive ledger. Click any order row to inspect full customer specifications and flacons.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#C5A86A] text-xs font-semibold text-[#143628] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{authenticatedEmail}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            title="Lock Orders Vault"
          >
            <Lock className="w-3.5 h-3.5 text-[#991B1B]" />
            <span className="font-bold uppercase tracking-wider text-[11px]">Lock Vault</span>
          </button>

          {orders.length > 0 && (
            <button
              onClick={exportToCSV}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#FAF7F0] text-[#143628] border border-[#C5A86A] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A86A]" />
              <span className="font-bold uppercase tracking-wider text-[11px]">Export CSV</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const testId = `VAULT-${Date.now().toString().slice(-4)}`;
              const ping = {
                _subject: `🔔 [NEW ACTIVATION FORM #${testId}] Store Orders Vault - Fragrance Premium`,
                _captcha: 'false',
                _template: 'table',
                Store: BRAND_CONFIG.brandName,
                Time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                Notice: 'Please click the green Activate Form button to receive all store orders directly in your Gmail (nskproject01@gmail.com)!',
                Recipient: 'nskproject01@gmail.com',
                Verification_Code: testId,
              };

              fetch('https://formsubmit.co/ajax/nskproject01@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ping),
                keepalive: true,
              }).catch(() => {});

              setShowVaultActivationModal(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#10B981] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            title="Send test ping to nskproject01@gmail.com"
          >
            <Mail className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="font-bold uppercase tracking-wider text-[11px]">Send New Form / Ping Gmail</span>
          </button>

          <a
            href={`tel:${BRAND_CONFIG.contact.phone}`}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#143628] hover:bg-[#1F4D3B] text-white flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-[#C5A86A]" />
            <span className="font-bold uppercase tracking-wider text-[11px]">Call {BRAND_CONFIG.contact.phone}</span>
          </a>
        </div>
      </div>

      {/* Metrics Row (Compact & Clean) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#D5CEBF] rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#7A664F] font-bold block">
            Total Orders Logged
          </span>
          <div className="font-serif text-2xl font-bold text-[#143628] tabular-nums mt-0.5">
            {orders.length}
          </div>
          <span className="text-[11px] text-[#617367]">Customer submissions stored</span>
        </div>

        <div className="bg-white border border-[#D5CEBF] rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#7A664F] font-bold block">
            Pending Dispatch
          </span>
          <div className="font-serif text-2xl font-bold text-[#C5A86A] tabular-nums mt-0.5">
            {pendingCount}
          </div>
          <span className="text-[11px] text-[#617367]">Awaiting packaging / courier</span>
        </div>

        <div className="bg-white border border-[#D5CEBF] rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#7A664F] font-bold block">
            Total Order Value
          </span>
          <div className="font-serif text-2xl font-bold text-[#143628] tabular-nums mt-0.5">
            {BRAND_CONFIG.currencySymbol}{totalRevenue}
          </div>
          <span className="text-[11px] text-[#617367]">Net customer volume</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#D5CEBF] shadow-xs">
        {/* Status filters */}
        <div className="flex items-center gap-1 text-xs overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'Received', 'Processing', 'Dispatched', 'Delivered'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl transition-all font-bold text-xs uppercase tracking-wider cursor-pointer whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'text-[#182920] hover:bg-[#FAF7F0]'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#7A664F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, city, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F0] border border-[#D5CEBF] rounded-xl py-1.5 pl-9 pr-3 text-xs text-[#182920] placeholder-[#7A664F] focus:outline-none focus:border-[#143628] focus:bg-white"
          />
        </div>

        {orders.length > 0 && (
          <button
            onClick={() => setShowClearAllModal(true)}
            className="text-[11px] text-red-600 hover:text-red-700 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer self-end sm:self-auto py-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Orders List (Compact, Zero-Negative-Space Design) */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-[#D5CEBF] rounded-3xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] text-[#143628] flex items-center justify-center mx-auto border border-[#C5A86A]">
            <ShoppingBag className="w-7 h-7 text-[#143628]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#143628]">
            No customer orders matching this filter
          </h3>
          <p className="text-xs text-[#7A664F] max-w-sm mx-auto">
            When a customer adds attars to their bag and completes checkout, their order details appear here instantly.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderIds.has(order.orderId);
            const totalItemsCount = order.items.reduce((s, it) => s + it.quantity, 0);

            return (
              <div
                key={order.orderId}
                className="bg-white border border-[#D5CEBF] hover:border-[#143628] rounded-2xl shadow-xs transition-all overflow-hidden"
              >
                {/* COMPACT MAIN ROW: Shows strictly Name, Address summary, Amount, Status & Expand trigger */}
                <div
                  onClick={() => toggleExpandOrder(order.orderId)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-[#FAF7F0]/60 transition-colors"
                >
                  {/* Left: Customer Name & Clean Address */}
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandOrder(order.orderId);
                      }}
                      className="w-8 h-8 rounded-xl bg-[#FAF7F0] border border-[#C5A86A]/50 text-[#143628] flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 hover:bg-[#143628] hover:text-white transition-colors"
                      title={isExpanded ? 'Collapse Details' : 'View Full Details'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-inherit" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-inherit" />
                      )}
                    </button>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-[#143628] truncate">
                          {order.customer.fullName}
                        </span>
                        <span className="text-[10px] font-mono bg-[#FAF7F0] border border-[#D5CEBF] px-2 py-0.5 rounded text-[#7A664F] font-bold">
                          {order.orderId}
                        </span>
                        <span className="text-[10px] text-[#617367]">
                          {order.createdAt}
                        </span>
                      </div>

                      {/* Pure Name and Address Display (Clean without clutter) */}
                      <div className="flex items-center gap-1.5 text-xs text-[#7A664F] truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A86A] flex-shrink-0" />
                        <span className="truncate">
                          {order.customer.address}, {order.customer.city} ({order.customer.pinCode})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount, Status, and Controls */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D5CEBF]/60 flex-shrink-0"
                  >
                    {/* Amount */}
                    <div className="text-right">
                      <span className="text-sm sm:text-base font-serif font-extrabold text-[#143628] block">
                        ₹{order.grandTotal}
                      </span>
                      <span className="text-[10px] text-[#7A664F] block">
                        {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    {/* Status Dropdown */}
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.orderId,
                          e.target.value as 'Received' | 'Processing' | 'Dispatched' | 'Delivered'
                        )
                      }
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-500'
                          : order.status === 'Dispatched'
                          ? 'bg-[#ECFDF5] text-[#065F46] border-[#10B981]'
                          : order.status === 'Processing'
                          ? 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]'
                          : 'bg-[#143628] text-white border-[#143628]'
                      }`}
                    >
                      <option value="Received">Received</option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                    </select>

                    {/* Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleExpandOrder(order.orderId)}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] hover:bg-[#143628] hover:text-white border border-[#C5A86A] text-xs font-bold text-[#143628] transition-colors cursor-pointer hidden md:flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide' : 'Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Delete button (Opens in-app modal) */}
                    <button
                      type="button"
                      onClick={() => setOrderPendingDelete(order)}
                      className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-200"
                      title="Delete order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE SECTION: Full Customer Details + Ordered Flacons Breakdown */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-[#FAF7F0]/80 border-t border-[#D5CEBF] space-y-5 animate-in slide-in-from-top-2 duration-200">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                      
                      {/* Left: Complete Customer Coordinates & Direct Call Action */}
                      <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-[#D5CEBF] space-y-3.5 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#D5CEBF]/60 pb-2.5">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-[#7A664F]">
                            Client Shipping Coordinates
                          </span>
                          <span className="font-mono text-[10px] text-[#143628] font-bold">
                            {order.paymentMethod.toUpperCase()} (COD)
                          </span>
                        </div>

                        {/* Customer Name */}
                        <div>
                          <span className="text-[10px] uppercase text-[#7A664F] block">Recipient Name</span>
                          <span className="font-serif text-base font-bold text-[#143628]">
                            {order.customer.fullName}
                          </span>
                        </div>

                        {/* Phone with Verification Badge and Direct Call */}
                        <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#C5A86A]/40 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase text-[#7A664F] block">Direct Phone</span>
                            {order.customer.phoneVerified ? (
                              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                VERIFIED ✓
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-500 font-semibold">Standard</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-sm text-[#143628]">+91 {order.customer.phone}</span>
                            <a
                              href={`tel:${order.customer.phone}`}
                              className="px-3 py-1.5 rounded-lg bg-[#143628] hover:bg-[#1F4D3B] text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#C5A86A]" />
                              <span>Call Client</span>
                            </a>
                          </div>
                        </div>

                        {/* Distance from Chinsurah Store */}
                        {order.distanceKm !== undefined && (
                          <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#D5CEBF] text-xs">
                            <span className="text-[10px] uppercase text-[#7A664F] block font-bold">Store Distance</span>
                            <div className="font-bold text-[#143628] mt-0.5">
                              {order.distanceKm} KM from Atelier (Chinsurah)
                            </div>
                            <div className="text-[10px] text-[#7A664F] mt-0.5">
                              {order.customer.deliveryFeeExplanation || (order.distanceKm <= 2 ? 'Free Delivery (<2km)' : `₹10 per 500m above 2km`)}
                            </div>
                          </div>
                        )}

                        {/* Full Street Address, City, State, PIN */}
                        <div>
                          <span className="text-[10px] uppercase text-[#7A664F] block">Delivery Address</span>
                          <p className="text-xs font-medium text-[#182920] mt-0.5 leading-relaxed">
                            {order.customer.address}
                          </p>
                          <p className="text-xs font-bold text-[#143628] mt-0.5">
                            {order.customer.city}, {order.customer.state} - {order.customer.pinCode}
                          </p>
                        </div>

                        {/* Email */}
                        {order.customer.email && (
                          <div>
                            <span className="text-[10px] uppercase text-[#7A664F] block">Email</span>
                            <a href={`mailto:${order.customer.email}`} className="text-xs font-semibold text-[#143628] hover:underline">
                              {order.customer.email}
                            </a>
                          </div>
                        )}

                        {/* Customer Notes */}
                        {order.customer.orderNotes && (
                          <div className="pt-2 border-t border-[#D5CEBF]/60">
                            <span className="text-[10px] uppercase text-[#7A664F] block font-bold">Special Instructions</span>
                            <p className="text-xs italic text-[#182920]/80 mt-0.5">
                              &ldquo;{order.customer.orderNotes}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* Store Admin Private Notes */}
                        <div className="pt-2 border-t border-[#D5CEBF]/60 space-y-1">
                          <span className="text-[10px] uppercase text-[#7A664F] block font-bold">Admin Dispatch Notes</span>
                          <input
                            type="text"
                            placeholder="Add dispatch notes (e.g. Sent with delivery boy Sunil)..."
                            value={order.adminNotes || ''}
                            onChange={(e) => updateOrderAdminNotes(order.orderId, e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#D5CEBF] text-xs bg-[#FAF7F0] focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Right: Ordered Flacons Breakdown Table */}
                      <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-[#D5CEBF] space-y-4 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#D5CEBF]/60 pb-2.5">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-[#7A664F]">
                            Flacons In This Order ({totalItemsCount} Total Units)
                          </span>
                          <span className="text-[11px] font-bold text-[#143628]">
                            MRP vs Selling Price
                          </span>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, idx) => {
                            const originalUnitPrice = getOriginalPrice(item.unitPrice);
                            const lineTotal = item.unitPrice * item.quantity;
                            const originalLineTotal = originalUnitPrice * item.quantity;

                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F0] border border-[#D5CEBF]/50 gap-3"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    referrerPolicy="no-referrer"
                                    className="w-12 h-12 object-contain p-1 rounded-lg border border-[#D5CEBF] bg-white flex-shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <h4 className="font-serif font-bold text-[#143628] text-xs truncate">
                                      {item.name}
                                    </h4>
                                    <div className="text-[11px] text-[#7A664F] flex items-center gap-1.5 flex-wrap">
                                      <span>{item.ml === 100 ? '20 Pcs Box' : item.ml === 36 ? '12 Pcs Box' : item.ml === 18 ? '6 Pcs Box' : item.ml === 25 ? '10 Pcs Box' : `${item.ml}ml`}</span>
                                      <span>·</span>
                                      <span className="italic">{item.variant}</span>
                                      <span>·</span>
                                      <span className="line-through text-[#7A664F]/70">₹{originalUnitPrice}</span>
                                      <span className="font-bold text-[#143628]">₹{item.unitPrice} each</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right flex-shrink-0">
                                  <span className="text-[11px] text-[#7A664F] block">
                                    Qty: <strong className="text-[#143628]">{item.quantity}</strong>
                                  </span>
                                  <div className="flex items-center gap-1 justify-end">
                                    <span className="text-[10px] line-through text-[#7A664F]/70">
                                      ₹{originalLineTotal}
                                    </span>
                                    <span className="font-bold text-xs text-[#143628]">
                                      ₹{lineTotal}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Financial Summary */}
                        <div className="pt-3 border-t border-[#D5CEBF]/60 flex items-center justify-between text-xs">
                          <div className="text-[#7A664F]">
                            <span>Delivery: </span>
                            <strong className="text-[#143628]">
                              {order.shippingFee === 0 ? 'FREE Express Delivery' : `₹${order.shippingFee}`}
                            </strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#7A664F]">Grand Total:</span>
                            <span className="font-serif text-lg font-extrabold text-[#143628]">
                              ₹{order.grandTotal}
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Forward to Gmail and Action Controls */}
                    <div className="pt-3 border-t border-[#D5CEBF]/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={`mailto:nskproject01@gmail.com?subject=${encodeURIComponent(
                            `[STORE VAULT] Order #${order.orderId} - Rs ${order.grandTotal} - ${order.customer.fullName}`
                          )}&body=${encodeURIComponent(
                            `STORE ORDER VAULT RECORD #${order.orderId}\n` +
                              `Customer: ${order.customer.fullName}\n` +
                              `Phone: +91 ${order.customer.phone} (Verified: ${order.customer.phoneVerified ? 'YES' : 'NO'})\n` +
                              `Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - PIN: ${order.customer.pinCode}\n` +
                              `Store Distance: ${order.distanceKm} km\n` +
                              `Grand Total: Rs ${order.grandTotal} (COD)\n` +
                              `Current Status: ${order.status}\n\n` +
                              `Items:\n` +
                              order.items
                                .map((it) => `- ${it.name} (${it.ml === 100 ? '20 Pcs Box' : it.ml === 36 ? '12 Pcs Box' : it.ml === 18 ? '6 Pcs Box' : it.ml === 25 ? '10 Pcs Box' : `${it.ml}ml`}) x ${it.quantity} = Rs ${it.unitPrice * it.quantity}`)
                                .join('\n')
                          )}`}
                          className="px-3.5 py-1.5 rounded-xl bg-[#143628] hover:bg-[#1F4D3B] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#C5A86A]" />
                          <span>Forward to nskproject01@gmail.com</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            const payload = {
                              _subject: `[RESEND] Order #${order.orderId} - Rs ${order.grandTotal} - ${order.customer.fullName}`,
                              _captcha: 'false',
                              _template: 'table',
                              Order_ID: order.orderId,
                              Customer: order.customer.fullName,
                              Phone: order.customer.phone,
                              Address: `${order.customer.address}, ${order.customer.city} - ${order.customer.pinCode}`,
                              Amount: `Rs ${order.grandTotal}`,
                              Status: order.status,
                            };
                            fetch('https://formsubmit.co/ajax/nskproject01@gmail.com', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(payload),
                              keepalive: true,
                            });
                            alert(`Order #${order.orderId} dispatched to nskproject01@gmail.com!`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#10B981] text-[#065F46] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Re-post via FormSubmit</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpandOrder(order.orderId)}
                        className="text-xs text-[#7A664F] hover:text-[#143628] underline font-bold uppercase tracking-wider cursor-pointer"
                      >
                        ↑ Collapse Order Details
                      </button>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* IN-APP MODAL: Delete Single Order (Works 100% in iFrames) */}
      {orderPendingDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border-2 border-[#C5A86A] shadow-2xl space-y-5 text-center text-[#182920]">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-bold text-[#143628]">
                Delete Order Record?
              </h3>
              <p className="text-xs text-[#7A664F] leading-relaxed">
                Permanently delete order <strong className="text-[#143628]">{orderPendingDelete.orderId}</strong> for recipient <strong className="text-[#143628]">{orderPendingDelete.customer.fullName}</strong>?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderPendingDelete(null)}
                className="flex-1 py-3 rounded-xl border border-[#D5CEBF] text-xs font-bold uppercase tracking-wider text-[#182920] hover:bg-[#FAF7F0] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteOrder(orderPendingDelete.orderId);
                  setOrderPendingDelete(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP MODAL: Clear All Orders */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border-2 border-[#C5A86A] shadow-2xl space-y-5 text-center text-[#182920]">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-bold text-[#143628]">
                Clear All Orders?
              </h3>
              <p className="text-xs text-[#7A664F] leading-relaxed">
                This will delete all {orders.length} stored orders from this browser. This action cannot be reversed.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#D5CEBF] text-xs font-bold uppercase tracking-wider text-[#182920] hover:bg-[#FAF7F0] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllOrders();
                  setShowClearAllModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP MODAL: Vault Form Activation & Instructions */}
      {showVaultActivationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#C5A86A] shadow-2xl space-y-5 text-[#182920]">
            <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] border border-[#10B981] text-[#065F46] flex items-center justify-center mx-auto shadow-sm">
              <Mail className="w-7 h-7 text-[#10B981]" />
            </div>

            <div className="text-center space-y-1.5">
              <span className="text-[10px] font-bold tracking-widest text-[#7A664F] uppercase">
                GMAIL VERIFICATION &amp; ACTIVATION
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#143628]">
                নতুন ফর্ম জিমেইলে পাঠানো হয়েছে!
              </h3>
              <p className="text-xs text-[#7A664F] leading-relaxed">
                FormSubmit থেকে আপনার জিমেইলে <strong>(nskproject01@gmail.com)</strong> একটি কনফার্মেশন পাঠানো হয়েছে।
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="bg-[#FAF7F0] border border-[#D5CEBF] rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#143628] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  ১
                </span>
                <p className="text-[#182920]">
                  আপনার জিমেইল খুলুন (ইনবক্স চেক করুন, না পেলে <strong>Spam / Promotions</strong> ফোল্ডার দেখুন)।
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#143628] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  ২
                </span>
                <p className="text-[#182920]">
                  <strong>FormSubmit</strong> থেকে আসা ইমেইলের ভেতরে থাকা সবুজ রঙের <strong>&quot;Activate Form&quot;</strong> বাটনে একবার ক্লিক করে দিন।
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#143628] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  ৩
                </span>
                <p className="text-[#182920]">
                  ক্লিক করলেই ফর্ম সাথে সাথে অ্যাক্টিভেট হয়ে যাবে এবং এর পর থেকে প্রতিটি নতুন অর্ডার সরাসরি আপনার জিমেইলে ঢুকবে!
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href="https://mail.google.com/mail/u/0/#inbox"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl bg-[#143628] hover:bg-[#1F4D3B] text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-[#C5A86A]" />
                <span>Open Gmail Inbox</span>
              </a>

              <button
                type="button"
                onClick={() => setShowVaultActivationModal(false)}
                className="flex-1 py-3 rounded-xl bg-[#FAF7F0] hover:bg-[#EFE9DC] text-[#143628] border border-[#D5CEBF] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
