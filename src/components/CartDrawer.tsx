import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_CONFIG } from '../config/config';
import { getOriginalPrice } from '../utils/pricing';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreCollection: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreCollection,
}) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalQuantity,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = BRAND_CONFIG.freeShippingThreshold;
  const distanceToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onProceedToCheckout();
  };

  const handleExploreClick = () => {
    setIsCartOpen(false);
    onExploreCollection();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-[#0F281D]/75 backdrop-blur-sm flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#FAF7F0] border-l border-[#D5CEBF] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 text-[#182920]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header (#143628 Forest Green) */}
        <div className="p-5 border-b border-[#0F281D] flex items-center justify-between bg-[#143628] text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C5A86A]" />
            <h2 className="font-serif text-lg tracking-wide text-white">
              Your Shopping Cart
            </h2>
            <span className="text-xs bg-[#C5A86A] text-[#0F281D] px-2 py-0.5 rounded-full font-bold">
              {totalQuantity}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-[#FAF7F0] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-[#F5EFE6] border-b border-[#D5CEBF] text-xs">
          {distanceToFreeShipping > 0 ? (
            <div className="space-y-1.5">
              <div className="text-[#182920] flex justify-between font-medium">
                <span>Add <strong className="text-[#143628]">{BRAND_CONFIG.currencySymbol}{distanceToFreeShipping}</strong> for Free Delivery</span>
                <span className="text-[#7A664F]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#D5CEBF] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#C5A86A] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-[#7A664F] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#143628]" />
              <span>Complimentary Pan-India Delivery Unlocked!</span>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FAF7F0]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#143628]">
                <ShoppingBag className="w-8 h-8 opacity-70" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#143628]">
                  Your cart is currently empty
                </h3>
                <p className="text-xs text-[#7A664F] mt-1 max-w-xs leading-relaxed">
                  Explore our pure handcrafted attar collection and select your signature scent.
                </p>
              </div>
              <button
                onClick={handleExploreClick}
                className="px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wider bg-[#143628] hover:bg-[#1F4D3B] text-white shadow-md transition-all cursor-pointer"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#D5CEBF] rounded-xl p-3.5 flex gap-3 relative group shadow-xs"
              >
                {/* Product Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-[#FAF7F0] overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif text-sm font-bold text-[#143628] truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#7A664F] hover:text-[#143628] p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs text-[#7A664F]">
                      <span className="font-medium text-[#143628]">
                        {item.ml === 18
                          ? '6 Pcs Master Box Pack (18ml)'
                          : item.ml === 36
                          ? '12 Pcs Master Box Pack (36ml)'
                          : item.ml === 25
                          ? '10 Pcs Master Box Pack (25ml)'
                          : item.ml === 100
                          ? '20 Pcs Master Box Pack'
                          : `${item.ml}ml Single Flacon`}
                      </span>
                      <span className="mx-1">·</span>
                      <span className="text-[#143628]">{item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#D5CEBF] rounded-md bg-[#FAF7F0]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-[#7A664F] hover:text-[#143628] hover:bg-[#F5EFE6] rounded-l-md transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold tabular-nums text-[#182920]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-[#7A664F] hover:text-[#143628] hover:bg-[#F5EFE6] rounded-r-md transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 tabular-nums">
                      <span className="text-xs text-[#7A664F]/65 line-through">
                        {BRAND_CONFIG.currencySymbol}{getOriginalPrice(item.unitPrice) * item.quantity}
                      </span>
                      <span className="font-bold text-sm text-[#143628]">
                        {BRAND_CONFIG.currencySymbol}{item.unitPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#D5CEBF] bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-[#7A664F]">
              <div className="flex justify-between">
                <span>Subtotal ({totalQuantity} items):</span>
                <span className="font-semibold text-sm text-[#182920] tabular-nums">
                  {BRAND_CONFIG.currencySymbol}{subtotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-medium text-[#143628]">
                  {subtotal >= freeShippingThreshold ? 'FREE' : `${BRAND_CONFIG.currencySymbol}${BRAND_CONFIG.standardShippingFee}`}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold tracking-widest bg-[#143628] hover:bg-[#1F4D3B] text-white flex items-center justify-center gap-2 shadow-md transition-all duration-200 cursor-pointer"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 text-[#C5A86A]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
