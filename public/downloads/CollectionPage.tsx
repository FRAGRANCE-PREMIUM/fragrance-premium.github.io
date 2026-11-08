import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles, X, ArrowUpDown, Layers } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface CollectionPageProps {
  initialCategory?: string;
  initialPriceRack?: 'All' | '40' | '50' | '60' | '100' | '140' | '200';
  onSelectProduct?: (product: Product) => void;
  onSelectPriceRack?: (rack: '40' | '50' | '60' | '100' | '140' | '200') => void;
}

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export const CollectionPage: React.FC<CollectionPageProps> = ({
  initialCategory = 'All',
  initialPriceRack = 'All',
  onSelectProduct,
  onSelectPriceRack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedPriceRack, setSelectedPriceRack] = useState<'All' | '40' | '50' | '60' | '100' | '140' | '200'>(initialPriceRack);
  const [selectedBoxPieces40, setSelectedBoxPieces40] = useState<'all' | 6 | 12>('all');
  const [selectedPackaging, setSelectedPackaging] = useState<'all' | 'tin' | 'box'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [searchQuery, setSearchQuery] = useState('');

  // Keep selectedCategory & selectedPriceRack synced if changed from outside
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialPriceRack) {
      setSelectedPriceRack(initialPriceRack);
    }
  }, [initialPriceRack]);

  const handlePriceRackChange = (rack: 'All' | '40' | '50' | '60' | '100' | '140' | '200') => {
    setSelectedPriceRack(rack);
    setSelectedBoxPieces40('all');
    setSelectedPackaging('all');
    if (rack !== 'All' && onSelectPriceRack) {
      onSelectPriceRack(rack);
    }
  };

  const rack40Count = PRODUCTS.filter((p) => (p.priceRack || (p.sizes[0]?.price <= 40 ? '40' : '')) === '40').length;
  const rack40Box6Count = PRODUCTS.filter((p) => p.priceRack === '40' && p.boxPieces === 6).length;
  const rack40Box12Count = PRODUCTS.filter((p) => p.priceRack === '40' && p.boxPieces === 12).length;
  const rack50Count = PRODUCTS.filter((p) => p.priceRack === '50').length;
  const rack60Count = PRODUCTS.filter((p) => p.priceRack === '60').length;
  const rack100Count = PRODUCTS.filter((p) => p.priceRack === '100').length;
  const rack140Count = PRODUCTS.filter((p) => p.priceRack === '140').length;
  const rack140TinCount = PRODUCTS.filter((p) => p.priceRack === '140' && p.packagingType === 'tin').length;
  const rack140BoxCount = PRODUCTS.filter((p) => p.priceRack === '140' && p.packagingType === 'box').length;
  const rack200Count = PRODUCTS.filter((p) => p.priceRack === '200').length;

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // 1. Price Rack Filter
      const pRack = p.priceRack || (p.sizes[0]?.price <= 40 ? '40' : p.sizes[0]?.price <= 60 ? '60' : p.sizes[0]?.price <= 100 ? '100' : p.sizes[0]?.price <= 140 ? '140' : '200');
      if (selectedPriceRack !== 'All' && pRack !== selectedPriceRack) {
        return false;
      }

      // Box Pieces Filter for ₹40 Rack
      if (selectedPriceRack === '40' && selectedBoxPieces40 !== 'all') {
        if (p.boxPieces !== selectedBoxPieces40) {
          return false;
        }
      }

      // Packaging Filter for ₹140 Rack
      if (selectedPriceRack === '140' && selectedPackaging !== 'all') {
        if (p.packagingType !== selectedPackaging) {
          return false;
        }
      }

      // 2. Olfactory & Curated Collections Filter
      if (selectedCategory === 'mens') {
        const isMen =
          ['blue-sport', 'figo-black', 'figo-black-3ml', 'figo-red', 'denim-black', 'denim-black-3ml', 'desire-black', 'open-black', 'open-black-3ml', 'royal-black-sport', 'black-mischief', 'magnet-3ml', 'original-xx-3ml', 'signature-20ml', 'hajre-al-aswad-arham-3ml', 'firdaus-gold-3ml', 'jannat-ul-firdaus-arham-3ml', 'jinn-12pcs-3ml', 'royale-propaicy-12pcs-3ml'].includes(p.id) ||
          ['Woody', 'Strong', 'Fresh', 'Amber'].includes(p.category);
        if (!isMen) return false;
      } else if (selectedCategory === 'womens') {
        const isWomen =
          ['freshia', 'white-london', 'swiss-firdaus', 'zam-zam', 'zam-zam-3ml', 'forever', 'fawakeh-3ml', 'best-3ml', 'chocolate-musk-3ml', 'fantasia-20ml', 'salma-3ml', 'hayati-3ml', 'fantasya-arham-3ml', 'ruh-gulab-12pcs-3ml', 'pounds-12pcs-3ml', 'rajnigandha-12pcs-3ml', 'beli-attar-12pcs-3ml', 'fawakeh-12pcs-3ml'].includes(p.id) ||
          ['Floral', 'Sweet', 'Fresh'].includes(p.category);
        if (!isWomen) return false;
      } else if (selectedCategory === 'oud-musk') {
        const isOudMusk =
          ['black-musk', 'hajre-aswad', 'hajre-aswad-3ml', 'makkah', 'forever', 'denim-black-3ml', 'dubai-gold-3ml', 'signature-20ml', 'hajre-al-aswad-arham-3ml', 'firdaus-gold-3ml', 'jannat-ul-firdaus-arham-3ml', 'jinn-12pcs-3ml', 'royale-propaicy-12pcs-3ml'].includes(p.id) ||
          ['Musk', 'Oud', 'Amber'].includes(p.category);
        if (!isOudMusk) return false;
      } else if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = p.name.toLowerCase().includes(q);
        const inCat = p.category.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inNotes = [...p.notes.top, ...p.notes.heart, ...p.notes.base].some((n) =>
          n.toLowerCase().includes(q)
        );
        if (!inName && !inCat && !inDesc && !inNotes) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return (a.sizes[0]?.price ?? 0) - (b.sizes[0]?.price ?? 0);
      }
      if (sortBy === 'price-desc') {
        return (b.sizes[0]?.price ?? 0) - (a.sizes[0]?.price ?? 0);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'newest') {
        return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      }
      return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
    });
  }, [selectedCategory, selectedPriceRack, selectedPackaging, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedPriceRack('All');
    setSelectedPackaging('all');
    setSearchQuery('');
    setSortBy('popular');
  };

  const getPageTitle = () => {
    if (selectedPriceRack === '60') return '₹60 Pocket Flacons Rack (3ml)';
    if (selectedPriceRack === '140') return '₹140 Artisanal Flacons Rack (6ml)';
    if (selectedPriceRack === '200') return '₹200 Masterpieces Rack (20ml & 9.9ml)';
    if (selectedCategory === 'mens') return "Men's Royal Attar Collection";
    if (selectedCategory === 'womens') return "Women's Royal Attar Collection";
    if (selectedCategory === 'oud-musk') return 'Oud & Musk Pure Distillations';
    if (selectedCategory !== 'All') return `${selectedCategory} Attar Collection`;
    return 'Complete Royal Heritage Collection';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-transparent">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#7A664F] font-semibold flex items-center justify-center gap-1.5 mb-1">
          <Sparkles className="w-4 h-4 text-[#C5A86A]" />
          100% Non-Alcoholic Hydrodistillations
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#143628] font-normal">
          {getPageTitle()}
        </h1>
        <p className="text-xs sm:text-sm text-[#182920]/75 mt-2 max-w-lg mx-auto leading-relaxed">
          Explore our range of concentrated roll-on perfume oils divided into accessible price racks. Hand-poured with traditional methods for all-day sillage.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#F5EFE6] border border-[#C5A86A]/50 border-t-4 border-t-[#C5A86A] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A664F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by attar name, olfactory family, or notes..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#FAF7F0] border border-[#D5CEBF] text-xs sm:text-sm text-[#182920] focus:outline-none focus:border-[#143628]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A664F] hover:text-[#143628] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <ArrowUpDown className="w-4 h-4 text-[#7A664F] hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-lg bg-[#FAF7F0] border border-[#D5CEBF] text-xs font-bold text-[#143628] uppercase tracking-wider focus:outline-none focus:border-[#143628] cursor-pointer"
            >
              <option value="popular">SORT: MOST CELEBRATED</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="rating">HIGHEST RATED</option>
              <option value="newest">NEW BATCH ARRIVALS</option>
            </select>
          </div>
        </div>

        {/* Row 2: Price Rack Selection Shelf */}
        <div className="pt-2 border-t border-[#D5CEBF]/60 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-2 flex-nowrap">
            <div className="flex items-center gap-1 text-xs font-bold text-[#7A664F] pr-2 uppercase tracking-wider flex-shrink-0">
              <Layers className="w-3.5 h-3.5 text-[#143628]" />
              <span>PRICE SHELF:</span>
            </div>

            <button
              onClick={() => handlePriceRackChange('All')}
              className={`pill-tab-premium px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                selectedPriceRack === 'All'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#182920] hover:bg-[#F5EFE6] border border-[#D5CEBF]'
              }`}
            >
              ALL RACKS ({PRODUCTS.length})
            </button>

            <button
              onClick={() => handlePriceRackChange('40')}
              className={`pill-tab-premium px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedPriceRack === '40'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#182920] hover:bg-[#F5EFE6] border border-[#D5CEBF]'
              }`}
            >
              <span>🏷️ ₹40 (MRP: ₹60) · 3ML ({rack40Count})</span>
            </button>

            <button
              onClick={() => handlePriceRackChange('50')}
              className={`pill-tab-premium px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedPriceRack === '50'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#182920] hover:bg-[#F5EFE6] border border-[#D5CEBF]'
              }`}
            >
              <span>🏷️ ₹50 (MRP: ₹75) · 20 PCS BOX ({rack50Count})</span>
            </button>

            <button
              onClick={() => handlePriceRackChange('60')}
              className={`pill-tab-premium px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedPriceRack === '60'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#182920] hover:bg-[#F5EFE6] border border-[#D5CEBF]'
              }`}
            >
              <span>🏷️ ₹60 (MRP: ₹85) · 3ML ({rack60Count})</span>
            </button>

            <button
              onClick={() => handlePriceRackChange('100')}
              className={`pill-tab-premium px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedPriceRack === '100'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#182920] hover:bg-[#F5EFE6] border border-[#D5CEBF]'
              }`}
            >
              <span>✨ ₹100 (MRP: ₹140) · 2.5ML ({rack100Count})</span>
            </button>

            <button
              onClick={() => handlePriceRackChange('140')}
              className={`pill-tab-premium px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedPriceRack === '140'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#182920] hover:bg-[#F5EFE6] border border-[#D5CEBF]'
              }`}
            >
              <span>👑 ₹140 (MRP: ₹180) · 6ML & 8ML ({rack140Count})</span>
            </button>

            <button
              onClick={() => handlePriceRackChange('200')}
              className={`pill-tab-premium px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedPriceRack === '200'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#182920] hover:bg-[#F5EFE6] border border-[#D5CEBF]'
              }`}
            >
              <span>💎 ₹200+ (MRP: ₹260) · DECANTERS ({rack200Count})</span>
            </button>
          </div>
        </div>

        {/* Row 2.4: Box Packaging Series Division for ₹40 Rack */}
        {selectedPriceRack === '40' && (
          <div className="pt-2 border-t border-[#D5CEBF]/60 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-1 bg-gradient-to-b from-[#FFFFFF] to-[#F5EFE6] border-t-2 border-t-[#C5A86A] p-2 rounded-xl">
            <div className="flex items-center gap-2 flex-nowrap">
              <span className="text-[11px] font-bold text-[#143628] uppercase tracking-wider pr-1 flex-shrink-0">
                BOX PACKAGING:
              </span>
              <button
                onClick={() => setSelectedBoxPieces40('all')}
                className={`pill-tab-premium px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                  selectedBoxPieces40 === 'all'
                    ? 'bg-[#143628] text-white shadow-xs'
                    : 'bg-white text-[#182920] hover:bg-[#FAF7F0] border border-[#D5CEBF]'
                }`}
              >
                ALL ₹40 ATTARS ({rack40Count})
              </button>
              <button
                onClick={() => setSelectedBoxPieces40(6)}
                className={`pill-tab-premium px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedBoxPieces40 === 6
                    ? 'bg-[#047857] text-white shadow-xs'
                    : 'bg-[#ECFDF5] text-[#065F46] hover:bg-[#D1FAE5] border border-[#10B981]/30'
                }`}
              >
                <span>📦 6-PCS BOX SERIES ({rack40Box6Count})</span>
              </button>
              <button
                onClick={() => setSelectedBoxPieces40(12)}
                className={`pill-tab-premium px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedBoxPieces40 === 12
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'bg-[#EFF6FF] text-[#1E3A8A] hover:bg-[#DBEAFE] border border-[#3B82F6]/30'
                }`}
              >
                <span>✨ 12-PCS BOX SERIES ({rack40Box12Count})</span>
              </button>
            </div>

            <span className="text-[11px] text-[#047857] font-bold uppercase tracking-wider hidden sm:inline whitespace-nowrap">
              ₹40 PER 3ML FLACON · SPECIAL LOWEST PRICE
            </span>
          </div>
        )}

        {/* Row 2.5: Packaging Style Division for ₹140 Rack */}
        {selectedPriceRack === '140' && (
          <div className="pt-2 border-t border-[#D5CEBF]/60 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-1 bg-gradient-to-b from-[#FFFFFF] to-[#F5EFE6] border-t-2 border-t-[#C5A86A] p-2 rounded-xl">
            <div className="flex items-center gap-2 flex-nowrap">
              <span className="text-[11px] font-bold text-[#143628] uppercase tracking-wider pr-1 flex-shrink-0">
                PACKAGING STYLE:
              </span>
              <button
                onClick={() => setSelectedPackaging('all')}
                className={`pill-tab-premium px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                  selectedPackaging === 'all'
                    ? 'bg-[#143628] text-white shadow-xs'
                    : 'bg-white text-[#182920] hover:bg-[#FAF7F0] border border-[#D5CEBF]'
                }`}
              >
                BOTH SHELVES (SEPARATED) ({rack140Count})
              </button>
              <button
                onClick={() => setSelectedPackaging('tin')}
                className={`pill-tab-premium px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedPackaging === 'tin'
                    ? 'bg-[#B45309] text-white shadow-xs'
                    : 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A] border border-[#F59E0B]/30'
                }`}
              >
                <span>🥫 TIN CANISTERS ONLY ({rack140TinCount})</span>
              </button>
              <button
                onClick={() => setSelectedPackaging('box')}
                className={`pill-tab-premium px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedPackaging === 'box'
                    ? 'bg-[#831843] text-white shadow-xs'
                    : 'bg-[#FCE7F3] text-[#831843] hover:bg-[#FBCFE8] border border-[#F472B6]/30'
                }`}
              >
                <span>📦 CARTON BOXES ONLY ({rack140BoxCount})</span>
              </button>
            </div>

            <span className="text-[11px] text-[#7A664F] font-bold uppercase tracking-wider hidden sm:inline whitespace-nowrap">
              ₹140 PER EACH · 6ML & 8ML
            </span>
          </div>
        )}

        {/* Row 3: Olfactory Category Filter Tabs */}
        <div className="pt-2 border-t border-[#D5CEBF]/60 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-1.5 flex-nowrap">
            <span className="text-[11px] font-bold text-[#7A664F] uppercase tracking-wider pr-1 flex-shrink-0">
              SENSORY:
            </span>
            {[
              { label: 'ALL NOTES', value: 'All' },
              { label: "MEN'S", value: 'mens' },
              { label: "WOMEN'S", value: 'womens' },
              { label: 'OUD & MUSK', value: 'oud-musk' },
              { label: 'FRESH', value: 'Fresh' },
              { label: 'WOODY', value: 'Woody' },
              { label: 'FLORAL', value: 'Floral' },
              { label: 'AMBER', value: 'Amber' },
              { label: 'SWEET', value: 'Sweet' },
              { label: 'STRONG', value: 'Strong' },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`pill-tab-premium px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#143628] text-white shadow-xs'
                      : 'bg-[#FAF7F0] text-[#182920] hover:bg-[#F5EFE6] border border-[#D5CEBF]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {(selectedCategory !== 'All' || selectedPriceRack !== 'All' || searchQuery) && (
            <button
              onClick={resetFilters}
              className="pill-tab-premium text-xs text-[#143628] hover:text-[#7A664F] font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0 cursor-pointer underline"
            >
              RESET FILTERS
            </button>
          )}
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div>
        <div className="flex items-center justify-between text-xs text-[#7A664F] mb-4">
          <span>Showing <strong className="text-[#143628]">{filteredProducts.length}</strong> artisanal attars</span>
          <span>Pan-India express delivery on all orders</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#D5CEBF] rounded-2xl p-12 text-center space-y-4">
            <h3 className="font-serif text-xl text-[#143628]">No Attars Found</h3>
            <p className="text-xs text-[#7A664F] max-w-sm mx-auto">
              We couldn't find any flacons matching your specific price rack and filter combination.
            </p>
            <button
              onClick={resetFilters}
              className="pill-tab-premium px-5 py-2.5 rounded-lg bg-[#143628] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
            >
              SHOW ALL ATTARS
            </button>
          </div>
        ) : selectedPriceRack === 'All' ? (
          /* ALL RACKS VIEW: 4 SEQUENTIAL TIERS SEPARATED BY SPACING & CLEAR HEADERS */
          <div className="space-y-16">
            {/* TIER 0: ₹40 ECONOMY POCKET & MASTER BOX RACK (3ML) */}
            {filteredProducts.filter((p) => (p.priceRack || '40') === '40').length > 0 && (
              <div className="space-y-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#ECFDF5] via-[#F0FDF4] to-[#FFFFFF] border border-[#10B981]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#10B981] text-white flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                      🏷️
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981] text-white uppercase tracking-wider">
                          Tier 0 · Lowest Price Slot
                        </span>
                        <span className="text-xs font-semibold text-[#047857]">
                          3ml Pure Attar Roll-On · ₹40 Each
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#065F46] mt-0.5">
                        ₹40 Pocket & Box Rack ({filteredProducts.filter((p) => (p.priceRack || '40') === '40').length} Fragrances · 6-Pcs & 12-Pcs Editions)
                      </h3>
                      <p className="text-xs text-[#182920]/75 mt-0.5">
                        Special value collection! Compact 3ml roll-ons at ₹40 each or complete master presentation boxes.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePriceRackChange('40')}
                    className="pill-tab-premium text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg bg-[#047857] text-white hover:bg-[#065F46] transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>FOCUS ON ₹40 RACK</span>
                    <span className="text-white">→</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts
                    .filter((p) => (p.priceRack || '40') === '40')
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectProduct={onSelectProduct}
                        onSelectPriceRack={handlePriceRackChange}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* GENEROUS SHELF DIVIDER WITH LABEL */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-2 border-dashed border-[#D5CEBF]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#FAF7F0] px-6 py-1.5 text-xs font-bold text-[#7A664F] uppercase tracking-widest border border-[#D5CEBF] rounded-full shadow-xs flex items-center gap-2">
                  <span>↓</span>
                  <span>Proceeding to ₹60 Pocket Flacons Rack (3ml Shelf)</span>
                  <span>↓</span>
                </span>
              </div>
            </div>

            {/* TIER 1: ₹60 POCKET FLACONS RACK (3ML) */}
            {filteredProducts.filter((p) => (p.priceRack || '60') === '60').length > 0 && (
              <div className="space-y-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F5EFE6] via-[#FAF7F0] to-[#FFFFFF] border border-[#D5CEBF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#143628] text-white flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                      🏷️
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#143628] text-[#C5A86A] uppercase tracking-wider">
                          Tier 1 · Pocket Flacons
                        </span>
                        <span className="text-xs font-semibold text-[#7A664F]">
                          3ml Pure Attar Roll-On
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#143628] mt-0.5">
                        ₹60 Pocket Flacons Rack ({filteredProducts.filter((p) => (p.priceRack || '60') === '60').length} Fragrances)
                      </h3>
                      <p className="text-xs text-[#182920]/75 mt-0.5">
                        Compact 3ml roll-ons with smooth stainless steel roller balls. ₹60 per flacon.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePriceRackChange('60')}
                    className="pill-tab-premium text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg bg-[#143628] text-white hover:bg-[#1F4D3B] transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>FOCUS ON ₹60 RACK</span>
                    <span className="text-[#C5A86A]">→</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts
                    .filter((p) => (p.priceRack || '60') === '60')
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectProduct={onSelectProduct}
                        onSelectPriceRack={handlePriceRackChange}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* TIER 1.5: ₹100 TRADITIONAL HERITAGE RACK (2.5ML · 10 PCS BOX) */}
            {filteredProducts.filter((p) => p.priceRack === '100').length > 0 && (
              <div className="space-y-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FEF3C7] via-[#FFFBEB] to-[#FFFFFF] border border-[#C5A86A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#D97706] text-white flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                      ✨
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D97706] text-white uppercase tracking-wider">
                          Tier 1.5 · Heritage Flacons
                        </span>
                        <span className="text-xs font-semibold text-[#7A664F]">
                          2.5ml Traditional Flacon · 10 Pcs Master Box
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#143628] mt-0.5">
                        ₹100 Traditional Heritage Rack ({filteredProducts.filter((p) => p.priceRack === '100').length} Fragrance · Nemat Enterprises)
                      </h3>
                      <p className="text-xs text-[#182920]/75 mt-0.5">
                        Time-honored classical Indian attar formulations in acrylic display flacons. Each flacon ₹100 or full 10-piece master presentation box at ₹1,000.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePriceRackChange('100')}
                    className="pill-tab-premium text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg bg-[#143628] text-white hover:bg-[#1F4D3B] transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>FOCUS ON ₹100 RACK</span>
                    <span className="text-[#C5A86A]">→</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts
                    .filter((p) => p.priceRack === '100')
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectProduct={onSelectProduct}
                        onSelectPriceRack={handlePriceRackChange}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* GENEROUS SHELF DIVIDER WITH LABEL */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-2 border-dashed border-[#D5CEBF]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#FAF7F0] px-6 py-1.5 text-xs font-bold text-[#7A664F] uppercase tracking-widest border border-[#D5CEBF] rounded-full shadow-xs flex items-center gap-2">
                  <span>↓</span>
                  <span>Proceeding to ₹140 Artisanal Rack (Tin Canister Shelf)</span>
                  <span>↓</span>
                </span>
              </div>
            </div>

            {/* TIER 2A: ₹140 CYLINDRICAL METALLIC TIN CANISTERS (6ML) */}
            {filteredProducts.filter((p) => p.priceRack === '140' && p.packagingType === 'tin').length > 0 && (
              <div className="space-y-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FEF3C7] via-[#FFFBEB] to-[#FFFFFF] border border-[#F59E0B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#B45309] text-white flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                      🥫
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B45309] text-white uppercase tracking-wider">
                          Tier 2A · Metallic Tin Canisters
                        </span>
                        <span className="text-xs font-semibold text-[#78350F]">
                          6ml Airtight Metal Container
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#92400E] mt-0.5">
                        ₹140 Cylindrical Tin Canister Collection ({filteredProducts.filter((p) => p.priceRack === '140' && p.packagingType === 'tin').length} Fragrances)
                      </h3>
                      <p className="text-xs text-[#78350F] mt-0.5">
                        Protective heavy-gauge metal canisters with press-fit caps. 100% pure attar oil · ₹140 per flacon.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handlePriceRackChange('140');
                      setSelectedPackaging('tin');
                    }}
                    className="pill-tab-premium text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg bg-[#B45309] text-white hover:bg-[#92400E] transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>FOCUS ON TIN CANISTERS</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts
                    .filter((p) => p.priceRack === '140' && p.packagingType === 'tin')
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectProduct={onSelectProduct}
                        onSelectPriceRack={handlePriceRackChange}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* GENEROUS SHELF DIVIDER WITH LABEL */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-2 border-dashed border-[#D5CEBF]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#FAF7F0] px-6 py-1.5 text-xs font-bold text-[#7A664F] uppercase tracking-widest border border-[#D5CEBF] rounded-full shadow-xs flex items-center gap-2">
                  <span>↓</span>
                  <span>Proceeding to ₹140 Artisanal Rack (Carton Box Shelf)</span>
                  <span>↓</span>
                </span>
              </div>
            </div>

            {/* TIER 2B: ₹140 LUXURY PAPERBOARD CARTON BOXES (6ML) */}
            {filteredProducts.filter((p) => p.priceRack === '140' && p.packagingType === 'box').length > 0 && (
              <div className="space-y-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FCE7F3] via-[#FDF2F8] to-[#FFFFFF] border border-[#F472B6]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#831843] text-white flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                      📦
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#831843] text-white uppercase tracking-wider">
                          Tier 2B · Paperboard Carton Boxes
                        </span>
                        <span className="text-xs font-semibold text-[#701A75]">
                          6ml Rigid Presentation Box
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#831843] mt-0.5">
                        ₹140 Luxury Paperboard Carton Box Collection ({filteredProducts.filter((p) => p.priceRack === '140' && p.packagingType === 'box').length} Fragrances)
                      </h3>
                      <p className="text-xs text-[#701A75] mt-0.5">
                        Rigid carton boxes with form-fitting inner protective cradles. 100% pure attar oil · ₹140 per flacon.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handlePriceRackChange('140');
                      setSelectedPackaging('box');
                    }}
                    className="pill-tab-premium text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg bg-[#831843] text-white hover:bg-[#701A75] transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>FOCUS ON CARTON BOXES</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts
                    .filter((p) => p.priceRack === '140' && p.packagingType === 'box')
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectProduct={onSelectProduct}
                        onSelectPriceRack={handlePriceRackChange}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* GENEROUS SHELF DIVIDER WITH LABEL */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-2 border-dashed border-[#D5CEBF]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#FAF7F0] px-6 py-1.5 text-xs font-bold text-[#7A664F] uppercase tracking-widest border border-[#D5CEBF] rounded-full shadow-xs flex items-center gap-2">
                  <span>↓</span>
                  <span>Proceeding to ₹200 Masterpieces Rack</span>
                  <span>↓</span>
                </span>
              </div>
            </div>

            {/* TIER 3: ₹200 MASTERPIECES RACK (20ML & 9.9ML) */}
            {filteredProducts.filter((p) => p.priceRack === '200').length > 0 && (
              <div className="space-y-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F5EFE6] via-[#FAF7F0] to-[#FFFFFF] border border-[#D5CEBF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#143628] text-white flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                      💎
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#143628] text-[#C5A86A] uppercase tracking-wider">
                          Tier 3 · Masterpieces
                        </span>
                        <span className="text-xs font-semibold text-[#7A664F]">
                          20ml Decanters & 9.9ml Pure Attar
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#143628] mt-0.5">
                        ₹200 Masterpieces Rack ({filteredProducts.filter((p) => p.priceRack === '200').length} Fragrances)
                      </h3>
                      <p className="text-xs text-[#182920]/75 mt-0.5">
                        Prestige crystal decanters and rare flacons with unmatched staying power. ₹200 per flacon.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePriceRackChange('200')}
                    className="pill-tab-premium text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg bg-[#143628] text-white hover:bg-[#1F4D3B] transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>FOCUS ON ₹200 RACK</span>
                    <span className="text-[#C5A86A]">→</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts
                    .filter((p) => p.priceRack === '200')
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectProduct={onSelectProduct}
                        onSelectPriceRack={handlePriceRackChange}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : selectedPriceRack === '40' && selectedBoxPieces40 === 'all' ? (
          <div className="space-y-12">
            {/* SECTION 1: 6-PCS BOX SERIES */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#ECFDF5] to-[#F0FDF4] border border-[#10B981]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#047857] text-white flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                    📦
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#065F46]">
                      6-Pcs Box Edition Collection ({filteredProducts.filter(p => p.boxPieces === 6).length} Fragrances)
                    </h3>
                    <p className="text-xs text-[#047857]">
                      Salma, Firdaus Gold, Hajre Al-Aswad, Hayati, Fantasya, Jannat-Ul Firdaus · 3ml Roll-On @ ₹40 Each or 6-Pcs Display Box @ ₹240
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#047857] text-white self-start sm:self-auto">
                  6-Pcs Box Series
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts
                  .filter((p) => p.boxPieces === 6)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={onSelectProduct}
                      onSelectPriceRack={handlePriceRackChange}
                    />
                  ))}
              </div>
            </div>

            {/* SEPARATOR */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-2 border-dashed border-[#D5CEBF]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#FAF7F0] px-5 py-1 text-xs font-semibold text-[#7A664F] uppercase tracking-widest border border-[#D5CEBF] rounded-full shadow-xs">
                  12-Pcs Master Display Box Series Division
                </span>
              </div>
            </div>

            {/* SECTION 2: 12-PCS MASTER BOX SERIES */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#EFF6FF] to-[#F8FAFC] border border-[#3B82F6]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                    ✨
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1E3A8A]">
                      12-Pcs Master Display Box Collection ({filteredProducts.filter(p => p.boxPieces === 12).length} Fragrances)
                    </h3>
                    <p className="text-xs text-[#1D4ED8]">
                      Ruh Gulab, Jinn, Pounds, Rajnigandha, Beli Attar, Fawakeh, Royale Propaicy · 3ml Roll-On @ ₹40 Each or 12-Pcs Master Box @ ₹480
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1E40AF] text-white self-start sm:self-auto">
                  12-Pcs Master Box Series
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts
                  .filter((p) => p.boxPieces === 12)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={onSelectProduct}
                      onSelectPriceRack={handlePriceRackChange}
                    />
                  ))}
              </div>
            </div>
          </div>
        ) : selectedPriceRack === '140' && selectedPackaging === 'all' ? (
          <div className="space-y-12">
            {/* SECTION 1: TIN CANISTERS */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#FEF3C7] to-[#FFFBEB] border border-[#F59E0B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B45309] text-white flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                    🥫
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#92400E]">
                      Cylindrical Metallic Tin Canister Collection ({filteredProducts.filter(p => p.packagingType === 'tin').length} Fragrances)
                    </h3>
                    <p className="text-xs text-[#78350F]">
                      Heavy-gauge metal canister packaging · 6ml Concentrated Roll-On Attar · ₹140 each
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#B45309] text-white self-start sm:self-auto">
                  Tin Canisters Shelf
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts
                  .filter((p) => p.packagingType === 'tin')
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={onSelectProduct}
                      onSelectPriceRack={handlePriceRackChange}
                    />
                  ))}
              </div>
            </div>

            {/* SEPARATOR */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-2 border-dashed border-[#D5CEBF]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#FAF7F0] px-5 py-1 text-xs font-semibold text-[#7A664F] uppercase tracking-widest border border-[#D5CEBF] rounded-full shadow-xs">
                  Distinct Packaging Shelf Division
                </span>
              </div>
            </div>

            {/* SECTION 2: CARTON BOXES */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#FCE7F3] to-[#FDF2F8] border border-[#F472B6]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#831843] text-white flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                    📦
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#831843]">
                      Luxury Paperboard Carton Box Collection ({filteredProducts.filter(p => p.packagingType === 'box').length} Fragrances)
                    </h3>
                    <p className="text-xs text-[#701A75]">
                      Rigid presentation carton box packaging · 6ml Concentrated Roll-On Attar · ₹140 each
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#831843] text-white self-start sm:self-auto">
                  Carton Boxes Shelf
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts
                  .filter((p) => p.packagingType === 'box')
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={onSelectProduct}
                      onSelectPriceRack={handlePriceRackChange}
                    />
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onSelectPriceRack={handlePriceRackChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
