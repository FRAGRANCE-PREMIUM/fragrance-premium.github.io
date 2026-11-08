import React from 'react';
import { X, Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { BRAND_CONFIG } from '../config/config';

interface WishlistDrawerProps {
  onExploreCollection: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ onExploreCollection }) => {
  const { wishlistProducts, wishlistCount, toggleWishlist, isWishlistOpen, setIsWishlistOpen } = useWishlist();
  const { addToCart, openProductModal } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#30272A]/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F0E5] text-[#30272A] shadow-2xl flex flex-col border-l border-[#DED1BE]">
          {/* Header (#591D2B) */}
          <div className="p-5 bg-[#591D2B] text-white flex items-center justify-between border-b border-[#713142]">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-[#D6B887] fill-[#D6B887]" />
              <div>
                <h3 className="font-serif text-lg tracking-wide text-white">My Saved Attars</h3>
                <span className="text-xs text-[#F7F0E5]/80">{wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved</span>
              </div>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-lg text-[#F7F0E5] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EDE1D0] flex items-center justify-center text-[#591D2B]">
                  <Heart className="w-8 h-8 stroke-1" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#591D2B] mb-1">Your Wishlist is Empty</h4>
                  <p className="text-xs text-[#765C46] max-w-xs leading-relaxed">
                    Explore our pure artisanal attars and click the heart icon on any flacon to save your favorites for later.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    onExploreCollection();
                  }}
                  className="px-6 py-2.5 text-xs font-semibold tracking-wider rounded-lg bg-[#591D2B] hover:bg-[#713142] text-white transition-colors"
                >
                  DISCOVER ATTARS
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlistProducts.map((product) => {
                  const defaultSize = product.sizes[0];
                  const price = defaultSize ? defaultSize.price : 140;
                  return (
                    <div
                      key={product.id}
                      className="p-3 bg-white border border-[#DED1BE] rounded-xl flex gap-3 items-center group transition-all hover:shadow-sm"
                    >
                      <div
                        onClick={() => {
                          setIsWishlistOpen(false);
                          openProductModal(product);
                        }}
                        className="w-16 h-16 rounded-lg bg-[#F1E8DA] overflow-hidden flex-shrink-0 cursor-pointer p-1"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            onClick={() => {
                              setIsWishlistOpen(false);
                              openProductModal(product);
                            }}
                            className="font-serif text-sm font-bold text-[#591D2B] hover:text-[#713142] transition-colors cursor-pointer truncate"
                          >
                            {product.name}
                          </h4>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="text-[#6B6258] hover:text-[#591D2B] p-1 transition-colors"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-[#765C46] mt-0.5">
                          <span>{defaultSize?.ml || 6}ml Flacon</span>
                          <span className="mx-1">·</span>
                          <span className="text-[#591D2B] font-medium">{product.category}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-semibold text-sm text-[#30272A] tabular-nums">
                            {BRAND_CONFIG.currencySymbol}{price}
                          </span>
                          <button
                            onClick={() => {
                              addToCart(product, defaultSize?.ml || 6, 'Pure Attar Oil', 1);
                              setIsWishlistOpen(false);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-[#591D2B] hover:bg-[#713142] text-white flex items-center gap-1.5 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-4 bg-white border-t border-[#DED1BE] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  wishlistProducts.forEach((p) => {
                    addToCart(p, p.sizes[0]?.ml || 6, 'Pure Attar Oil', 1);
                  });
                  setIsWishlistOpen(false);
                }}
                className="flex-1 py-2.5 px-4 text-xs font-semibold tracking-wider rounded-lg bg-[#D6B887] hover:bg-[#E4CAA0] text-[#30272A] flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>MOVE ALL TO CART</span>
              </button>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  onExploreCollection();
                }}
                className="py-2.5 px-4 text-xs font-medium text-[#30272A] hover:text-[#591D2B] border border-[#DED1BE] rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Browse</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
