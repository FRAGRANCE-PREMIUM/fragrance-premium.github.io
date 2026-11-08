import React, { useState } from 'react';
import { X, User, Package, Check, ShieldCheck, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ActivePage } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActivePage: (page: ActivePage) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, setActivePage }) => {
  const { orders } = useCart();
  const [userName, setUserName] = useState(() => localStorage.getItem('fp_customer_name') || 'Honored Guest');
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('fp_customer_phone') || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('fp_customer_name', userName);
    localStorage.setItem('fp_customer_phone', userPhone);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#30272A]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#F7F0E5] rounded-2xl max-w-md w-full border border-[#DED1BE] shadow-2xl overflow-hidden z-10 text-[#30272A]">
        {/* Modal Header */}
        <div className="bg-[#591D2B] p-5 text-white flex items-center justify-between border-b border-[#713142]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D6B887]/20 border border-[#D6B887]/40 flex items-center justify-center text-[#D6B887]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg tracking-wide text-white">Fragrance Connoisseur Profile</h3>
              <p className="text-xs text-[#F7F0E5]/80">Manage your orders and express checkout info</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#F7F0E5] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Quick Order Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-xl border border-[#DED1BE]">
              <div className="flex items-center gap-2 text-xs text-[#6B6258] mb-1">
                <Package className="w-4 h-4 text-[#591D2B]" />
                <span>Total Orders</span>
              </div>
              <span className="text-xl font-bold font-serif text-[#591D2B] tabular-nums">
                {orders.length}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#DED1BE]">
              <div className="flex items-center gap-2 text-xs text-[#6B6258] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#591D2B]" />
                <span>Member Tier</span>
              </div>
              <span className="text-sm font-semibold text-[#591D2B]">
                Royal Circle
              </span>
            </div>
          </div>

          {/* Express Profile Info Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#591D2B] mb-1.5">
                Full Name / Title
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Tariq Mansoor"
                className="w-full bg-white border border-[#DED1BE] rounded-lg px-3.5 py-2 text-sm text-[#30272A] focus:outline-none focus:border-[#591D2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#143628] mb-1.5">
                Phone / Mobile Number
              </label>
              <input
                type="tel"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="e.g. 8777855462"
                className="w-full bg-white border border-[#C5A86A]/40 rounded-lg px-3.5 py-2 text-sm text-[#143628] focus:outline-none focus:border-[#143628]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#143628] hover:bg-[#1F4D3B] text-white text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-[#D6B887]" />
                  <span>PREFERENCES SAVED</span>
                </>
              ) : (
                <span>SAVE PROFILE PREFERENCES</span>
              )}
            </button>
          </form>

          {/* Store Orders Manager Link */}
          <div className="pt-2 border-t border-[#DED1BE] flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                setActivePage('orders');
              }}
              className="text-xs font-medium text-[#591D2B] hover:text-[#713142] flex items-center gap-1.5 underline decoration-[#DED1BE]"
            >
              <ClipboardList className="w-4 h-4 text-[#591D2B]" />
              <span>Open Store Orders Management Console</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
