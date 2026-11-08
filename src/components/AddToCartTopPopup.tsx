import React, { useEffect } from 'react';
import { ShoppingBag, ArrowRight, X, Trash2, CheckCircle2, Plus, Minus, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_CONFIG } from '../config/config';
import { getOriginalPrice } from '../utils/pricing';
import { ActivePage } from '../types';

interface AddToCartTopPopupProps {
  setActivePage: (page: ActivePage) => void;
}

export const AddToCartTopPopup: React.FC<AddToCartTopPopupProps> = ({ setActivePage }) => {
  const {
    topPopupItem,
    isTopPopupVisible,
    closeTopPopup,
    items,
    totalQuantity,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  // Auto-dismiss after 12 seconds
  useEffect(() => {
    if (!isTopPopupVisible) return;
    const timer = setTimeout(() => {
      closeTopPopup();
    }, 12000);
    return () => clearTimeout(timer);
  }, [isTopPopupVisible, closeTopPopup, topPopupItem]);

  if (!isTopPopupVisible || !topPopupItem) {
    return null;
  }

  // Find latest state of this item in the cart
  const currentItemInCart = items.find((it) => it.id === topPopupItem.id);
  const currentQty = currentItemInCart ? currentItemInCart.quantity : topPopupItem.quantity;
  const originalPrice = getOriginalPrice(topPopupItem.unitPrice);

  const handlePlaceOrderClick = () => {
    closeTopPopup();
    setActivePage('order-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveOrCancel = () => {
    removeFromCart(topPopupItem.id);
    closeTopPopup();
  };

  return (
    <aside aria-label="Add to Bag Notification" className="fixed top-2 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto bg-[#0F281D] text-[#FAF7F0] border-2 border-[#C5A86A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] p-3 sm:p-4 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
        
        {/* Top Mini Header */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#C5A86A]/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A86A] animate-ping" />
            <CheckCircle2 className="w-4 h-4 text-[#C5A86A]" />
            <span className="font-extrabold uppercase tracking-wider text-[#C5A86A] text-[11px] sm:text-xs">
              Attar Added to Bag Successfully
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#FAF7F0]/80 hidden sm:inline">
              Total in Bag: <strong className="text-white font-bold">{totalQuantity} Attars</strong> (₹{subtotal})
            </span>
            <button
              onClick={closeTopPopup}
              className="p-1 rounded-lg text-[#FAF7F0]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Item Details */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white/10 p-0.5 border border-[#C5A86A]/50 flex-shrink-0">
              <img
                src={topPopupItem.image}
                alt={topPopupItem.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif font-bold text-sm sm:text-base text-white truncate">
                  {topPopupItem.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#143628] text-[#C5A86A] border border-[#C5A86A]/40 uppercase tracking-wider">
                  {topPopupItem.ml === 18
                    ? '6 Pcs Master Box (18ml)'
                    : topPopupItem.ml === 36
                    ? '12 Pcs Master Box (36ml)'
                    : topPopupItem.ml === 25
                    ? '10 Pcs Master Box (25ml)'
                    : topPopupItem.ml === 100
                    ? '20 Pcs Master Box'
                    : `${topPopupItem.ml}ml Single Flacon`}
                </span>
              </div>

              {/* Price with strikethrough original price */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[11px] text-white/50 line-through">
                  ₹{originalPrice}
                </span>
                <span className="font-extrabold text-[#C5A86A] text-sm">
                  ₹{topPopupItem.unitPrice}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  (Save ₹{originalPrice - topPopupItem.unitPrice})
                </span>
              </div>
            </div>
          </div>

          {/* Quantity and Cancel / Remove Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#C5A86A]/20">
            
            {/* Quantity Stepper */}
            <div className="flex items-center bg-[#143628] border border-[#C5A86A]/50 rounded-xl px-1 py-0.5">
              <button
                type="button"
                onClick={() => updateQuantity(topPopupItem.id, currentQty - 1)}
                className="p-1 hover:text-[#C5A86A] transition-colors cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 text-xs font-bold text-white tabular-nums">
                {currentQty}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(topPopupItem.id, currentQty + 1)}
                className="p-1 hover:text-[#C5A86A] transition-colors cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cancel / Remove Button */}
            <button
              type="button"
              onClick={handleRemoveOrCancel}
              className="px-2.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/50 text-red-200 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Cancel / remove this attar"
            >
              <Trash2 className="w-3 h-3" />
              <span>Cancel</span>
            </button>

            {/* PLACE ORDER Button (Direct to ORDER DETAILS page) */}
            <button
              type="button"
              onClick={handlePlaceOrderClick}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#C5A86A] via-[#E2CB96] to-[#C5A86A] hover:brightness-110 text-[#0F281D] font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>PLACE ORDER</span>
              <ArrowRight className="w-4 h-4 text-[#0F281D]" />
            </button>
          </div>
        </div>

        {/* Mobile Subtotal bar */}
        <div className="sm:hidden mt-2 pt-2 border-t border-[#C5A86A]/20 flex items-center justify-between text-[11px] text-[#FAF7F0]/90">
          <span>Bag Total: <strong>{totalQuantity} Attars</strong></span>
          <span className="font-extrabold text-[#C5A86A]">Grand Total: ₹{subtotal}</span>
        </div>
      </div>
    </aside>
  );
};
