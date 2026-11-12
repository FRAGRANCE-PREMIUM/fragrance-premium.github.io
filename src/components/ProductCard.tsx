import React, { useState } from 'react';
import { Star, Plus, Check, Heart, Package } from 'lucide-react';
import { Product } from '../types';
import { BRAND_CONFIG } from '../config/config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getOriginalPrice } from '../utils/pricing';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  onSelectPriceRack?: (rack: '40' | '50' | '60' | '100' | '140' | '200') => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onSelectPriceRack,
}) => {
  const { addToCart, openProductModal } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedMl, setSelectedMl] = useState<number>(
    product.defaultMl || (product.sizes[0] ? product.sizes[0].ml : 6)
  );
  const [justAdded, setJustAdded] = useState(false);

  // Single vs Box size detection - ONLY for products with defined boxPieces
  const hasBox = Boolean(product.boxPieces && product.sizes.length > 1);
  const singleSize = product.sizes[0] || { ml: 3, price: 40 };
  const boxSize = hasBox
    ? product.sizes.find((s) => s.ml > singleSize.ml) || product.sizes[1]
    : undefined;
  const boxPieces = product.boxPieces || 6;

  const singlePrice = singleSize.price;
  const singleOriginalPrice = getOriginalPrice(singlePrice);
  const boxPrice = boxSize ? boxSize.price : 0;
  const boxOriginalPrice = boxSize ? getOriginalPrice(boxPrice) : 0;

  const currentSize = product.sizes.find((s) => s.ml === selectedMl) || singleSize;
  const price = currentSize ? currentSize.price : 40;
  const originalPrice = getOriginalPrice(price);
  const isBoxActive = Boolean(boxSize && selectedMl === boxSize.ml);
  const isWished = isInWishlist(product.id);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('select')) return;

    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      openProductModal(product);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedMl, 'Pure Attar Oil', 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white border border-[#D5CEBF] hover:border-[#143628] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col cursor-pointer"
    >
      {/* Fixed 16:9 image frame, single image, no blur, no layers */}
<div className="relative aspect-video w-full overflow-hidden bg-[#FAF7F0] border-b border-[#D5CEBF]/60">
  <img
    src={product.image}
    alt={product.name}
    referrerPolicy="no-referrer"
    loading="lazy"
    className="absolute inset-0 w-full h-full object-contain object-center bg-[#FAF7F0] transition-transform duration-500 group-hover:scale-[1.03]"
  />

        {/* Minimal Subtle Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap items-center gap-1.5 max-w-[88%]">
          {product.id === 'kosturi-no1-50rs' ? (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#D97706] text-white shadow-xs uppercase tracking-wider">
              🏜️ Desert Solid Balm
            </span>
          ) : boxSize ? (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider transition-colors ${
                isBoxActive
                  ? 'bg-[#C5A86A] text-[#0F281D]'
                  : 'bg-white/95 text-[#143628] border border-[#D5CEBF]'
              }`}
            >
              {isBoxActive ? `📦 ${boxPieces} Pcs Box (₹${boxPrice})` : `1 Pc (₹${singlePrice}) + Box`}
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-[#143628] border border-[#D5CEBF] shadow-xs uppercase tracking-wider">
              {currentSize.ml}ml
            </span>
          )}

          {product.packagingType && product.id !== 'kosturi-no1-50rs' && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#143628] text-[#FAF7F0] shadow-xs">
              {product.packagingType === 'tin' ? 'Tin Can' : 'Box Pack'}
            </span>
          )}
        </div>

        {/* Wishlist Icon (Top Right) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all z-20 cursor-pointer ${
            isWished
              ? 'bg-[#143628] text-[#C5A86A] shadow-xs'
              : 'bg-white/80 text-[#7A664F] hover:text-[#143628] hover:bg-white shadow-xs'
          }`}
          aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-[#C5A86A]' : ''}`} />
        </button>
      </div>

      {/* Clean Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Title and Rating */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#143628] group-hover:text-[#1F4D3B] transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-[#7A664F] flex-shrink-0 mt-0.5">
              <Star className="w-3 h-3 fill-[#C5A86A] text-[#C5A86A]" />
              <span className="font-bold text-[#182920]">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Clean 1-Line Tagline / Category */}
          <p className="text-xs text-[#7A664F] line-clamp-1">
            {product.subtitle || `${product.category} · 0% Alcohol Pure Attar`}
          </p>
        </div>

        {/* Professional Pack Selector Toggle for Products with Box Option */}
        {boxSize && (
          <div
            className="bg-[#FAF7F0] border border-[#D5CEBF] p-1 rounded-xl flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMl(singleSize.ml)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                !isBoxActive
                  ? 'bg-[#143628] text-white shadow-xs font-bold'
                  : 'text-[#182920] hover:bg-white/80 font-medium'
              }`}
            >
              <span className="block text-[9px] uppercase tracking-wider opacity-85">Single Pc</span>
              <div className="flex items-center justify-center gap-1 tabular-nums">
                <span className={`text-[10px] line-through font-normal ${!isBoxActive ? 'opacity-70 text-white' : 'text-[#7A664F]/65'}`}>
                  ₹{singleOriginalPrice}
                </span>
                <span className="text-xs font-bold font-serif">₹{singlePrice}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMl(boxSize.ml)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                isBoxActive
                  ? 'bg-[#143628] text-white shadow-xs font-bold'
                  : 'text-[#182920] hover:bg-white/80 font-medium'
              }`}
            >
              <span className="block text-[9px] uppercase tracking-wider opacity-85">{boxPieces} Pcs Box</span>
              <div className="flex items-center justify-center gap-1 tabular-nums">
                <span className={`text-[10px] line-through font-normal ${isBoxActive ? 'opacity-70 text-white' : 'text-[#7A664F]/65'}`}>
                  ₹{boxOriginalPrice}
                </span>
                <span className="text-xs font-bold font-serif">₹{boxPrice}</span>
              </div>
            </button>
          </div>
        )}

        {/* Pricing and Add to Bag */}
        <div className="pt-2 border-t border-[#D5CEBF]/60 flex items-center justify-between gap-2">
          {/* Minimal Strikethrough Pricing */}
          <div>
            <div className="flex items-baseline gap-1.5 tabular-nums">
              <span className="text-xs line-through text-[#7A664F]/65 font-normal">
                ₹{originalPrice}
              </span>
              <span className="text-base sm:text-lg font-serif font-extrabold text-[#143628]">
                ₹{price}
              </span>
            </div>
            <span className="text-[10px] text-[#7A664F] block font-medium">
              {isBoxActive
                ? `Complete ${boxPieces} Pcs Box Pack`
                : boxSize
                ? `1 Pc Single (${currentSize.ml}ml)`
                : `${currentSize.ml}ml Single Flacon`}
            </span>
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
              justAdded
                ? 'bg-[#10B981] text-white'
                : 'bg-[#143628] hover:bg-[#1F4D3B] text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-[#C5A86A]" />
                <span>ADD {isBoxActive ? 'BOX' : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
