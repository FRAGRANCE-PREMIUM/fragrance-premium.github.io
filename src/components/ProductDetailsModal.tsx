import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, Droplet, Clock, Wind, Plus, Minus, Check, ArrowRight, Heart, Layers } from 'lucide-react';
import { Product } from '../types';
import { BRAND_CONFIG } from '../config/config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getOriginalPrice } from '../utils/pricing';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onProceedToCheckout?: () => void;
  onSelectPriceRack?: (rack: '40' | '50' | '60' | '100' | '140' | '200') => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onProceedToCheckout,
  onSelectPriceRack,
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedMl, setSelectedMl] = useState<number>(6);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedMl(product.defaultMl || (product.sizes[0] ? product.sizes[0].ml : 6));
      setQuantity(1);
      setIsAdded(false);
      setIsZoomed(false);
    }
  }, [product]);

  if (!product) return null;

  const currentSize = product.sizes.find((s) => s.ml === selectedMl) || product.sizes[0];
  const unitPrice = currentSize ? currentSize.price : 40;
  const totalPrice = unitPrice * quantity;
  const isWished = isInWishlist(product.id);

  // Single vs Box detection - ONLY for products with defined boxPieces
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

  const priceRack = product.priceRack || (unitPrice <= 40 ? '40' : unitPrice <= 50 ? '50' : unitPrice <= 60 ? '60' : unitPrice <= 100 ? '100' : unitPrice <= 140 ? '140' : '200');

  const rackTitles: Record<'40' | '50' | '60' | '100' | '140' | '200', { title: string; subtitle: string; countLabel: string }> = {
    '40': {
      title: '₹40 Economy Pocket & Master Box Rack',
      subtitle: '3ml Pure Concentrated Roll-On · Lowest Price Tier',
      countLabel: '13 Fragrances available at ₹40 (6-Pcs & 12-Pcs Box Editions)',
    },
    '50': {
      title: '₹50 Traditional Kasturi Rack',
      subtitle: '5g / 6ml Authentic Deer Musk Formula · 20 Pcs Box Edition',
      countLabel: 'Kasturi No. 1 available at ₹50 (20 Pcs Master Box Pack ₹1,000)',
    },
    '60': {
      title: '₹60 Pocket Flacons Rack',
      subtitle: '3ml Pure Concentrated Roll-On',
      countLabel: '11 Fragrances available at ₹60',
    },
    '100': {
      title: '₹100 Traditional Heritage Rack',
      subtitle: '2.5ml Traditional Flacon · 10 Pcs Master Box Edition',
      countLabel: 'Nemat Enterprises Heritage Formula at ₹100',
    },
    '140': {
      title: '₹140 Artisanal Flacons Rack',
      subtitle: '6ml Pure Attar Roll-On',
      countLabel: '31 Fragrances available at ₹140 (14 Tin Canisters · 17 Carton Boxes)',
    },
    '200': {
      title: '₹200 Masterpieces Rack',
      subtitle: '20ml Luxury Decanters & 9ml / 9.9ml Pure Attar',
      countLabel: '4 Masterpieces available at ₹200',
    },
  };

  const currentRackInfo = rackTitles[priceRack] || rackTitles['40'];

  const handleAdd = () => {
    addToCart(product, selectedMl, 'Pure Attar Oil', quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedMl, 'Pure Attar Oil', quantity);
    onClose();
    if (onProceedToCheckout) {
      onProceedToCheckout();
    } else {
      setIsCartOpen(true);
    }
  };

  const handleGoToRack = (rack: '40' | '50' | '60' | '100' | '140' | '200') => {
    onClose();
    if (onSelectPriceRack) {
      onSelectPriceRack(rack);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0F281D]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FFFFFF] border border-[#D5CEBF] rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 text-[#182920]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#FAF7F0] text-[#182920] hover:text-[#143628] hover:bg-[#EFE9DC] border border-[#D5CEBF] transition-colors cursor-pointer"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Visual Showcase on Ivory */}
          <div className="relative bg-[#FAF7F0] flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#D5CEBF] overflow-hidden">
            {(() => {
              const isHeroCrystal = ['fantasia-20ml', 'signature-20ml'].includes(product.id);
              return (
                <div
                  className={`relative w-full aspect-square max-h-[420px] rounded-2xl overflow-hidden cursor-zoom-in bg-[#FAF7F0] border border-[#D5CEBF] flex items-center justify-center ${
                    isZoomed ? 'cursor-zoom-out' : ''
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  {/* Layer 1: Seamless natural background maintaining the photo's own ambient scenery */}
                  <img
                    src={product.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-[10px] opacity-90 pointer-events-none"
                  />

                  {/* Layer 2: Main product image uncropped with gentle zoom */}
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className={`relative z-10 w-full h-full object-contain transition-transform duration-500 transform-gpu drop-shadow-md ${
                      isZoomed ? 'scale-150' : 'scale-[1.04] hover:scale-[1.08]'
                    }`}
                  />

                  {/* Packaging Badge on Modal Image */}
                  {product.id === 'kosturi-no1-50rs' ? (
                    <div className="absolute top-3 left-3 z-20 text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-xs border bg-[#D97706] text-white border-[#B45309]">
                      🏜️ Desert Solid Balm (Not Roll-On / Spray)
                    </div>
                  ) : product.packagingType ? (
                    <div className={`absolute top-3 left-3 z-20 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs border ${
                      product.packagingType === 'tin'
                        ? 'bg-[#B45309] text-white border-[#92400E]'
                        : 'bg-[#143628] text-white border-[#0F281D]'
                    }`}>
                      {product.packagingType === 'tin' ? '🥫 Tin Canister' : '📦 Carton Box'}
                    </div>
                  ) : null}

                <div className="absolute bottom-3 left-3 text-[11px] text-[#182920] bg-white/95 px-2.5 py-1 rounded backdrop-blur-xs border border-[#D5CEBF] shadow-xs">
                  {isZoomed ? 'Click to reset' : 'Click to inspect'}
                </div>
              </div>
            );
          })()}

            {/* Quick Scent Stats Bar */}
            <div className="w-full mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-[#D5CEBF]">
                <Clock className="w-4 h-4 mx-auto text-[#143628] mb-1" />
                <span className="text-[10px] text-[#617367] block">Longevity</span>
                <span className="font-semibold text-[#143628]">{product.longevity}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#D5CEBF]">
                <Wind className="w-4 h-4 mx-auto text-[#143628] mb-1" />
                <span className="text-[10px] text-[#617367] block">Sillage</span>
                <span className="font-semibold text-[#143628]">{product.sillage}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#D5CEBF]">
                <Droplet className="w-4 h-4 mx-auto text-[#143628] mb-1" />
                <span className="text-[10px] text-[#617367] block">Purity</span>
                <span className="font-semibold text-[#143628]">0% Alcohol</span>
              </div>
            </div>
          </div>

          {/* Right Column: Scent Narrative & Purchasing Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-[#FFFFFF]">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-[#7A664F] uppercase">
                    {product.category} Attar
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#7A664F]">
                    <Star className="w-3.5 h-3.5 fill-[#C5A86A] text-[#C5A86A]" />
                    <span className="font-bold tabular-nums text-xs text-[#182920]">{product.rating.toFixed(1)}</span>
                    <span className="text-[#617367]">({product.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-1">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#143628]">
                    {product.name}
                  </h2>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 rounded-full border border-[#D5CEBF] transition-colors cursor-pointer ${
                      isWished ? 'bg-[#143628] text-[#C5A86A]' : 'text-[#7A664F] hover:text-[#143628]'
                    }`}
                    title={isWished ? 'Saved in wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWished ? 'fill-[#C5A86A]' : ''}`} />
                  </button>
                </div>

                <p className="text-xs text-[#7A664F] mt-1 font-medium">
                  {product.subtitle || '100% Pure Non-Alcoholic Concentrated Perfume Oil'}
                </p>
              </div>

              {/* Price & Stock Display */}
              <div className="p-3 bg-[#FAF7F0] border border-[#D5CEBF] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#7A664F] block font-medium">Price</span>
                  <div className="flex items-baseline gap-2 tabular-nums">
                    <span className="text-sm text-[#7A664F]/65 line-through">
                      {BRAND_CONFIG.currencySymbol}{getOriginalPrice(unitPrice)}
                    </span>
                    <span className="text-2xl font-bold text-[#143628]">
                      {BRAND_CONFIG.currencySymbol}{unitPrice}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-[#7A664F] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#143628]" />
                  <span>In Stock · Fast Dispatch</span>
                </div>
              </div>

              {/* Special Packaging Type Detail Callout (Tin vs Box) */}
              {product.packagingType && (
                <div className={`p-3 rounded-xl border space-y-1.5 shadow-xs ${
                  product.packagingType === 'tin'
                    ? 'bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border-[#F59E0B]/50 text-[#92400E]'
                    : 'bg-[#E8F0EC] border-[#143628]/30 text-[#143628]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                      <span className="text-base">{product.packagingType === 'tin' ? '🥫' : '📦'}</span>
                      <span>
                        {product.packagingType === 'tin'
                          ? 'Cylindrical Metallic Tin Canister'
                          : 'Paperboard Luxury Carton Box'}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      product.packagingType === 'tin'
                        ? 'bg-[#B45309] text-white'
                        : 'bg-[#143628] text-white'
                    }`}>
                      {product.packagingType === 'tin' ? 'Tin Canister' : 'Carton Box'}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-95">
                    {product.packagingType === 'tin'
                      ? 'Air-tight protective cylindrical metal can with secure top cap. Shields the pure fragrance oil against UV degradation, heat, and leakage. Highly durable for pockets & daily carry.'
                      : 'Rigid luxury paperboard carton box housing an internal flacon protective cradle. Elegant presentation with full olfactory branding and factory-seal assurance.'}
                  </p>
                </div>
              )}

              {/* Special Box Pack Notice Callout & Dual Price Summary */}
              {boxSize && (
                <div className="p-3.5 bg-gradient-to-r from-[#FAF7F0] via-[#FDFBF7] to-[#EFE9DC] border-2 border-[#C5A86A] rounded-xl text-[#143628] space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                      <span className="text-base">📦</span>
                      <span>Official {boxPieces} Pcs Master Box Edition</span>
                    </div>
                    <span className="bg-[#143628] text-[#C5A86A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ₹{singlePrice} per flacon
                    </span>
                  </div>
                  <p className="text-[11px] text-[#182920]/85 leading-relaxed">
                    This authentic attar is presented in an official sealed display box containing <strong>{boxPieces} individual flacons</strong>. You can purchase a single flacon for <strong>₹{singlePrice}</strong>, or acquire the complete {boxPieces}-piece master box pack for <strong>₹{boxPrice}</strong>.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedMl(singleSize.ml)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        selectedMl === singleSize.ml
                          ? 'bg-[#143628] text-white border-[#143628] shadow-xs'
                          : 'bg-white text-[#182920] border-[#D5CEBF] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-bold opacity-80">1 Flacon (Single)</span>
                      <div className="flex items-center justify-center gap-1 tabular-nums">
                        <span className={`text-[10px] line-through ${selectedMl === singleSize.ml ? 'opacity-60 text-white' : 'text-[#7A664F]/65'}`}>
                          ₹{singleOriginalPrice}
                        </span>
                        <strong className="text-sm">₹{singlePrice}</strong>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMl(boxSize.ml)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        selectedMl === boxSize.ml
                          ? 'bg-[#143628] text-white border-[#143628] shadow-xs'
                          : 'bg-white text-[#182920] border-[#D5CEBF] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-bold opacity-80">Full {boxPieces} Pcs Box</span>
                      <div className="flex items-center justify-center gap-1 tabular-nums">
                        <span className={`text-[10px] line-through ${selectedMl === boxSize.ml ? 'opacity-60 text-white' : 'text-[#7A664F]/65'}`}>
                          ₹{boxOriginalPrice}
                        </span>
                        <strong className="text-sm">₹{boxPrice}</strong>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* INTERACTIVE PRICE RACK SHELF BOX */}
              <div className="p-3.5 bg-[#EFE9DC] border border-[#D5CEBF] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#143628] text-white">
                      <Layers className="w-4 h-4 text-[#C5A86A]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7A664F] font-bold block">
                        Assigned Price Shelf
                      </span>
                      <span className="text-xs sm:text-sm font-serif font-bold text-[#143628]">
                        {currentRackInfo.title}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#143628] bg-white px-2 py-0.5 rounded border border-[#D5CEBF]">
                    {currentSize.ml}ml
                  </span>
                </div>

                <p className="text-[11px] text-[#182920]/80 leading-relaxed">
                  {currentRackInfo.countLabel}. Explore all fragrances in this price rack or check other tiers.
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleGoToRack(priceRack)}
                    className="pill-tab-premium flex-1 py-1.5 px-3 bg-[#143628] hover:bg-[#1F4D3B] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>EXPLORE THIS {priceRack === '40' ? '₹40' : priceRack === '50' ? '₹50' : priceRack === '60' ? '₹60' : priceRack === '100' ? '₹100' : priceRack === '140' ? '₹140' : '₹200+'} RACK</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A86A]" />
                  </button>

                  {priceRack !== '40' && (
                    <button
                      type="button"
                      onClick={() => handleGoToRack('40')}
                      className="pill-tab-premium py-1.5 px-2.5 bg-white hover:bg-[#FAF7F0] text-[#047857] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#D5CEBF] transition-colors cursor-pointer"
                    >
                      ₹40 RACK (3ML)
                    </button>
                  )}

                  {priceRack !== '60' && (
                    <button
                      type="button"
                      onClick={() => handleGoToRack('60')}
                      className="pill-tab-premium py-1.5 px-2.5 bg-white hover:bg-[#FAF7F0] text-[#143628] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#D5CEBF] transition-colors cursor-pointer"
                    >
                      ₹60 RACK (3ML)
                    </button>
                  )}

                  {priceRack !== '100' && (
                    <button
                      type="button"
                      onClick={() => handleGoToRack('100')}
                      className="pill-tab-premium py-1.5 px-2.5 bg-white hover:bg-[#FAF7F0] text-[#B45309] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#D5CEBF] transition-colors cursor-pointer"
                    >
                      ₹100 RACK (2.5ML)
                    </button>
                  )}

                  {priceRack !== '140' && (
                    <button
                      type="button"
                      onClick={() => handleGoToRack('140')}
                      className="pill-tab-premium py-1.5 px-2.5 bg-white hover:bg-[#FAF7F0] text-[#143628] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#D5CEBF] transition-colors cursor-pointer"
                    >
                      ₹140 RACK (6ML)
                    </button>
                  )}

                  {priceRack !== '200' && (
                    <button
                      type="button"
                      onClick={() => handleGoToRack('200')}
                      className="pill-tab-premium py-1.5 px-2.5 bg-white hover:bg-[#FAF7F0] text-[#143628] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#D5CEBF] transition-colors cursor-pointer"
                    >
                      ₹200+ RACK
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#182920]/85 leading-relaxed">
                {product.longDescription || product.description}
              </p>

              {/* Olfactory Notes Architecture */}
              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#D5CEBF] space-y-2 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#7A664F] font-semibold block">
                  Olfactory Notes Architecture
                </span>
                <div className="grid grid-cols-3 gap-2 text-[#182920]">
                  <div>
                    <strong className="block text-[#143628] font-medium">Top Notes</strong>
                    <span className="text-[#617367] text-[11px]">{product.notes.top.join(', ')}</span>
                  </div>
                  <div>
                    <strong className="block text-[#143628] font-medium">Heart</strong>
                    <span className="text-[#617367] text-[11px]">{product.notes.heart.join(', ')}</span>
                  </div>
                  <div>
                    <strong className="block text-[#143628] font-medium">Base Notes</strong>
                    <span className="text-[#617367] text-[11px]">{product.notes.base.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Available Options: Single vs Complete Box Pack */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#143628] block mb-2">
                  SELECT OPTION:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.sizes.map((s) => {
                    const sOrig = getOriginalPrice(s.price);
                    const isSelected = selectedMl === s.ml;
                    const isBox = boxSize && s.ml === boxSize.ml;
                    return (
                      <button
                        key={s.ml}
                        type="button"
                        onClick={() => setSelectedMl(s.ml)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#143628] text-white border-[#143628] shadow-md ring-1 ring-[#C5A86A]'
                            : 'bg-[#FAF7F0] text-[#182920] border-[#D5CEBF] hover:bg-[#F5EFE6]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-[#C5A86A] text-[#0F281D]'
                                : 'bg-[#EFE9DC] text-[#143628]'
                            }`}
                          >
                            {isBox ? `📦 ${boxPieces} Pcs Master Box` : 'Single Flacon'}
                          </span>
                          <span
                            className={`text-xs font-normal line-through tabular-nums ${
                              isSelected ? 'text-white/60' : 'text-[#7A664F]/65'
                            }`}
                          >
                            ₹{sOrig}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="font-serif font-extrabold text-lg tabular-nums">
                            ₹{s.price}
                          </span>
                          <span
                            className={`text-[11px] font-medium ${
                              isSelected ? 'text-emerald-300' : 'text-emerald-700 font-semibold'
                            }`}
                          >
                            Save ₹{sOrig - s.price}
                          </span>
                        </div>
                        <span
                          className={`block text-[11px] mt-1 ${
                            isSelected ? 'text-white/80' : 'text-[#7A664F]'
                          }`}
                        >
                          {s.label || (isBox ? `${boxPieces} Pcs Display Pack` : `${s.ml}ml Single Roll-On`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity stepper */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-[#182920]">Quantity:</span>
                <div className="flex items-center border border-[#D5CEBF] rounded-lg bg-[#FAF7F0]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-[#617367] hover:text-[#143628] hover:bg-[#EFE9DC] rounded-l-lg transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold tabular-nums text-[#182920]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-[#617367] hover:text-[#143628] hover:bg-[#EFE9DC] rounded-r-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#D5CEBF] flex gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-[#7A664F] text-white'
                    : 'bg-[#FAF7F0] border border-[#143628] text-[#143628] hover:bg-[#EFE9DC]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>ADD TO BAG · {BRAND_CONFIG.currencySymbol}{totalPrice}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold tracking-wider bg-[#143628] hover:bg-[#1F4D3B] text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>ORDER NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
