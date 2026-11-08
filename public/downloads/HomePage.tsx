import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  Truck,
  Droplet,
  Star,
  Quote,
  ChevronDown,
  ChevronUp,
  Layers,
  Crown,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Tag,
  Phone,
  Mail,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/config';
import { PRODUCTS, FRAGRANCE_FAMILIES, PRICE_RACKS } from '../data/products';
import { REVIEWS_DATA } from '../data/reviews';
import { ATTAR_BRANDS } from '../data/brands';
import { ProductCard } from '../components/ProductCard';
import { ActivePage, Product } from '../types';

interface HomePageProps {
  setActivePage: (page: ActivePage) => void;
  onFilterCategory?: (category: string) => void;
  onSelectPriceRack?: (rack: '40' | '50' | '60' | '100' | '140' | '200') => void;
  initialPriceRack?: 'All' | '40' | '50' | '60' | '100' | '140' | '200';
}

export const HomePage: React.FC<HomePageProps> = ({
  setActivePage,
  onFilterCategory,
  onSelectPriceRack,
  initialPriceRack = 'All',
}) => {
  const [activePriceRack, setActivePriceRack] = useState<'All' | '40' | '50' | '60' | '100' | '140' | '200'>(initialPriceRack);
  const [activeBoxPieces40, setActiveBoxPieces40] = useState<'all' | 6 | 12>('all');
  const [activePackaging140, setActivePackaging140] = useState<'all' | 'tin' | 'box'>('all');
  const [activeCuratedTab, setActiveCuratedTab] = useState<'all' | 'bestsellers' | 'mens' | 'womens'>('all');

  useEffect(() => {
    if (initialPriceRack) {
      setActivePriceRack(initialPriceRack);
    }
  }, [initialPriceRack]);

  const handleSelectPriceRack = (rack: '40' | '50' | '60' | '100' | '140' | '200') => {
    setActivePriceRack(rack);
    if (onSelectPriceRack) {
      onSelectPriceRack(rack);
    }
    const section = document.getElementById('featured-flacons-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter products cleanly without unnecessary overhead
  const displayedFlacons = PRODUCTS.filter((p) => {
    const pRack = p.priceRack || (p.sizes[0]?.price <= 40 ? '40' : p.sizes[0]?.price <= 60 ? '60' : p.sizes[0]?.price <= 100 ? '100' : p.sizes[0]?.price <= 140 ? '140' : '200');
    
    // Price Rack Filter
    if (activePriceRack !== 'All' && pRack !== activePriceRack) {
      return false;
    }

    // Box pieces filter for ₹40 Rack
    if (activePriceRack === '40' && activeBoxPieces40 !== 'all') {
      if (p.boxPieces !== activeBoxPieces40) {
        return false;
      }
    }

    // Packaging Filter for ₹140 Rack
    if (activePriceRack === '140' && activePackaging140 !== 'all') {
      if (p.packagingType !== activePackaging140) {
        return false;
      }
    }

    // Curated sub-filter
    if (activeCuratedTab === 'bestsellers') {
      return p.bestSeller;
    }
    if (activeCuratedTab === 'mens') {
      return (
        ['blue-sport', 'figo-black', 'denim-black', 'srf-red-zx-6ml', 'jinn-12pcs-3ml', 'royale-propaicy-12pcs-3ml', 'attar-96-majmua-2-5ml'].includes(p.id) ||
        ['Woody', 'Strong', 'Fresh', 'Amber'].includes(p.category)
      );
    }
    if (activeCuratedTab === 'womens') {
      return (
        ['al-nuaim-sabaya-6ml', 'danish-salma-8ml', 'salma-3ml', 'ruh-gulab-12pcs-3ml', 'pounds-12pcs-3ml', 'rajnigandha-12pcs-3ml', 'beli-attar-12pcs-3ml', 'fawakeh-12pcs-3ml'].includes(p.id) ||
        ['Floral', 'Sweet', 'Fresh'].includes(p.category)
      );
    }

    return true;
  });

  const rack40Count = PRODUCTS.filter((p) => (p.priceRack || '') === '40').length;
  const rack50Count = PRODUCTS.filter((p) => (p.priceRack || '') === '50').length;
  const rack60Count = PRODUCTS.filter((p) => (p.priceRack || '') === '60').length;
  const rack100Count = PRODUCTS.filter((p) => (p.priceRack || '') === '100').length;
  const rack140Count = PRODUCTS.filter((p) => (p.priceRack || '') === '140').length;
  const rack200Count = PRODUCTS.filter((p) => (p.priceRack || '') === '200').length;

  const homeReviews = REVIEWS_DATA.slice(0, 3);

  return (
    <div className="space-y-14 sm:space-y-20 pb-16 text-[#182920]">
      
      {/* 1. ROYAL HERO SECTION (Clean, Spacious, Uncrowded) */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#F5EFE6] pt-8 pb-14 border-b border-[#D5CEBF]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#143628] uppercase px-3.5 py-1.5 bg-white rounded-full border border-[#C5A86A]/60 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A86A]" />
                <span>100% Pure Non-Alcoholic Artisanal Attars</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#143628] leading-[1.12]">
                A Legacy in Every Drop
              </h1>

              <p className="text-base sm:text-lg text-[#182920]/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Pure alcohol-free concentrated perfume oils hydrodistilled from rare blossoms and precious woods. Authentic long-lasting sillage from ₹40.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <button
                  onClick={() => {
                    const section = document.getElementById('featured-flacons-section');
                    if (section) section.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold tracking-widest text-white bg-[#143628] hover:bg-[#1F4D3B] border border-[#C5A86A] transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>EXPLORE FLACONS</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A86A]" />
                </button>

                <button
                  onClick={() => setActivePage('contact')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold tracking-widest text-[#143628] bg-white border border-[#C5A86A] hover:bg-[#FAF7F0] transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#143628]" />
                  <span>CONTACT & ORDER DESK</span>
                </button>
              </div>

              {/* Minimal Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#143628] font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A86A]" />
                  <span>3ml Flacons from ₹40</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A86A]" />
                  <span>0% Alcohol · Pure Oil</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A86A]" />
                  <span>18–24h Lingering Sillage</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <div className="relative w-full max-w-md h-[400px] sm:h-[460px] rounded-3xl overflow-hidden border-2 border-[#C5A86A] shadow-xl group bg-[#0F281D]">
                <img
                  src={BRAND_CONFIG.heroImage}
                  alt="Royal Artisanal Attar Flacon Showcase"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F281D]/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-[#0F281D]/90 border border-[#C5A86A]/60 backdrop-blur-md flex items-center justify-between text-[#FAF7F0] shadow-lg">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A86A] font-bold block">
                      Authentic Pure Attar
                    </span>
                    <span className="font-serif text-sm font-bold text-white">
                      Heritage Flacons from ₹40
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs line-through text-[#FAF7F0]/60 mr-1.5 font-normal">₹60</span>
                    <span className="text-base font-bold text-[#C5A86A]">₹40</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST HIGHLIGHTS STRIP (Sleek, 1-Line Clean Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-[#D5CEBF] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#C5A86A]/40 flex items-center justify-center text-[#143628] flex-shrink-0">
              <Droplet className="w-5 h-5 text-[#143628]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#143628]">100% Pure Attar</h4>
              <p className="text-[11px] text-[#7A664F]">Zero alcohol or fillers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#C5A86A]/40 flex items-center justify-center text-[#143628] flex-shrink-0">
              <Clock className="w-5 h-5 text-[#143628]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#143628]">24h Sillage</h4>
              <p className="text-[11px] text-[#7A664F]">Long-lasting botanical aroma</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#C5A86A]/40 flex items-center justify-center text-[#143628] flex-shrink-0">
              <Award className="w-5 h-5 text-[#143628]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#143628]">Royal Heritage</h4>
              <p className="text-[11px] text-[#7A664F]">Authentic master distillers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#C5A86A]/40 flex items-center justify-center text-[#143628] flex-shrink-0">
              <Truck className="w-5 h-5 text-[#143628]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#143628]">Fast Dispatch</h4>
              <p className="text-[11px] text-[#7A664F]">Pan-India express delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EDITORIAL FEATURE: THE SACRED ATTAR RITUAL (Gentleman Applying Attar · Spacious & Elegant) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#D5CEBF] rounded-3xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Visual Photography of Gentleman Applying Attar (Full-Frame Display) */}
            <div className="lg:col-span-6 relative min-h-[380px] sm:min-h-[440px] bg-[#0F281D] overflow-hidden group">
              <img
                src="/assets/man_applying_attar.jpg"
                alt="Distinguished gentleman applying luxury pure attar to pulse point wrist"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F281D]/70 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#0F281D]/90 border border-[#C5A86A]/60 backdrop-blur-md text-[#FAF7F0] shadow-md">
                <span className="text-[11px] font-bold text-[#C5A86A] uppercase tracking-wider block">
                  ✦ Pulse Point Application ✦
                </span>
                <p className="text-xs text-[#FAF7F0]/90 mt-0.5">
                  Body warmth gradually diffuses the pure fragrance oil for unbroken 24-hour presence.
                </p>
              </div>
            </div>

            {/* Editorial Narrative with Breathing Room */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#C5A86A]/40 text-[#143628] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A86A]" />
                <span>The Art of Wearing Pure Attar</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl text-[#143628] font-bold leading-tight">
                The Sacred Application Ritual for 24-Hour Longevity
              </h2>

              <p className="text-xs sm:text-sm text-[#182920]/80 leading-relaxed">
                Unlike synthetic alcohol sprays that evaporate rapidly, authentic attar is 100% concentrated botanical oil. A gentle stroke of the roller ball onto warm pulse points—inner wrists, throat, and behind ears—activates an enduring aromatic aura that blossoms throughout the day.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#D5CEBF] space-y-1">
                  <span className="font-serif font-bold text-sm text-[#143628] block">Pulse Point Heat</span>
                  <p className="text-xs text-[#7A664F] leading-relaxed">
                    Natural body temperature steadily diffuses the rich aromatic layers.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#D5CEBF] space-y-1">
                  <span className="font-serif font-bold text-sm text-[#143628] block">0% Alcohol Purity</span>
                  <p className="text-xs text-[#7A664F] leading-relaxed">
                    Gentle on skin, non-staining, and hydrodistilled with natural sandalwood base.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const section = document.getElementById('featured-flacons-section');
                    if (section) section.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xl bg-[#143628] hover:bg-[#1F4D3B] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <span>DISCOVER FLACONS</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A86A]" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PRICE RACKS NAVIGATION HUB (Clean 5 Shelf Cards with Strikethrough Pricing) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="text-xs uppercase tracking-[0.25em] text-[#7A664F] font-bold">
            Catalog Divisions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#143628] font-bold">
            Explore by Price Shelf
          </h2>
          <p className="text-xs sm:text-sm text-[#182920]/75">
            Organized into clear tiers with authentic discount pricing across all flacons.
          </p>
        </div>

        {/* 6 Clean Shelf Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Shelf 1: ₹40 */}
          <div
            onClick={() => handleSelectPriceRack('40')}
            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
              activePriceRack === '40'
                ? 'bg-[#143628] text-white border-[#143628] shadow-lg'
                : 'bg-white text-[#182920] border-[#D5CEBF] hover:border-[#143628] hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activePriceRack === '40' ? 'bg-[#C5A86A] text-[#0F281D]' : 'bg-[#10B981] text-white'}`}>
                Lowest Price
              </span>
              <span className="text-xs opacity-75">{rack40Count} Flacons</span>
            </div>
            <div className="text-2xl font-serif font-bold mb-1 flex items-baseline gap-1.5 tabular-nums">
              <span className="text-sm line-through opacity-60 font-normal">₹60</span>
              <span>₹40</span>
            </div>
            <h3 className={`font-serif text-base font-bold mb-1 ${activePriceRack === '40' ? 'text-[#C5A86A]' : 'text-[#143628]'}`}>
              ₹40 Pocket & Box Rack
            </h3>
            <p className="text-[11px] opacity-80 leading-relaxed">
              3ml oils. Single at ₹40 or in 6 & 12 Pcs Master Boxes.
            </p>
          </div>

          {/* Shelf 1.5: ₹50 Kosturi Desert Rack */}
          <div
            onClick={() => handleSelectPriceRack('50')}
            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
              activePriceRack === '50'
                ? 'bg-[#143628] text-white border-[#143628] shadow-lg'
                : 'bg-white text-[#182920] border-[#D5CEBF] hover:border-[#143628] hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activePriceRack === '50' ? 'bg-[#C5A86A] text-[#0F281D]' : 'bg-[#D97706] text-white'}`}>
                Desert Solid Balm
              </span>
              <span className="text-xs opacity-75">{rack50Count} Item</span>
            </div>
            <div className="text-2xl font-serif font-bold mb-1 flex items-baseline gap-1.5 tabular-nums">
              <span className="text-sm line-through opacity-60 font-normal">₹75</span>
              <span>₹50</span>
            </div>
            <h3 className={`font-serif text-base font-bold mb-1 ${activePriceRack === '50' ? 'text-[#C5A86A]' : 'text-[#143628]'}`}>
              ₹50 Kosturi Desert Rack
            </h3>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Solid deer musk balm (Not roll-on/spray). Single ₹50 or 20 Pcs Box ₹1,000.
            </p>
          </div>

          {/* Shelf 2: ₹60 */}
          <div
            onClick={() => handleSelectPriceRack('60')}
            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
              activePriceRack === '60'
                ? 'bg-[#143628] text-white border-[#143628] shadow-lg'
                : 'bg-white text-[#182920] border-[#D5CEBF] hover:border-[#143628] hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activePriceRack === '60' ? 'bg-[#C5A86A] text-[#0F281D]' : 'bg-[#FAF7F0] text-[#143628] border border-[#D5CEBF]'}`}>
                Daily Pocket
              </span>
              <span className="text-xs opacity-75">{rack60Count} Flacons</span>
            </div>
            <div className="text-2xl font-serif font-bold mb-1 flex items-baseline gap-1.5 tabular-nums">
              <span className="text-sm line-through opacity-60 font-normal">₹85</span>
              <span>₹60</span>
            </div>
            <h3 className={`font-serif text-base font-bold mb-1 ${activePriceRack === '60' ? 'text-[#C5A86A]' : 'text-[#143628]'}`}>
              ₹60 Pocket Flacons
            </h3>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Pocket 3ml roll-ons for daily freshness on the go.
            </p>
          </div>

          {/* Shelf 3: ₹100 */}
          <div
            onClick={() => handleSelectPriceRack('100')}
            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
              activePriceRack === '100'
                ? 'bg-[#143628] text-white border-[#143628] shadow-lg'
                : 'bg-white text-[#182920] border-[#D5CEBF] hover:border-[#143628] hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activePriceRack === '100' ? 'bg-[#C5A86A] text-[#0F281D]' : 'bg-[#D97706] text-white'}`}>
                Heritage 2.5ml
              </span>
              <span className="text-xs opacity-75">{rack100Count} Flacons</span>
            </div>
            <div className="text-2xl font-serif font-bold mb-1 flex items-baseline gap-1.5 tabular-nums">
              <span className="text-sm line-through opacity-60 font-normal">₹140</span>
              <span>₹100</span>
            </div>
            <h3 className={`font-serif text-base font-bold mb-1 ${activePriceRack === '100' ? 'text-[#C5A86A]' : 'text-[#143628]'}`}>
              ₹100 Traditional Rack
            </h3>
            <p className="text-[11px] opacity-80 leading-relaxed">
              2.5ml flacons. Single ₹100 or 10-piece master box.
            </p>
          </div>

          {/* Shelf 4: ₹140 */}
          <div
            onClick={() => handleSelectPriceRack('140')}
            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
              activePriceRack === '140'
                ? 'bg-[#143628] text-white border-[#143628] shadow-lg'
                : 'bg-white text-[#182920] border-[#D5CEBF] hover:border-[#143628] hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activePriceRack === '140' ? 'bg-[#C5A86A] text-[#0F281D]' : 'bg-[#7A664F] text-white'}`}>
                Artisanal 6ml & 8ml
              </span>
              <span className="text-xs opacity-75">{rack140Count} Flacons</span>
            </div>
            <div className="text-2xl font-serif font-bold mb-1 flex items-baseline gap-1.5 tabular-nums">
              <span className="text-sm line-through opacity-60 font-normal">₹180</span>
              <span>₹140</span>
            </div>
            <h3 className={`font-serif text-base font-bold mb-1 ${activePriceRack === '140' ? 'text-[#C5A86A]' : 'text-[#143628]'}`}>
              ₹140 Artisanal Rack
            </h3>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Tin Canisters & Carton Box editions with Red ZX & Sabaya.
            </p>
          </div>

          {/* Shelf 5: ₹200+ */}
          <div
            onClick={() => handleSelectPriceRack('200')}
            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
              activePriceRack === '200'
                ? 'bg-[#143628] text-white border-[#143628] shadow-lg'
                : 'bg-white text-[#182920] border-[#D5CEBF] hover:border-[#143628] hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activePriceRack === '200' ? 'bg-[#C5A86A] text-[#0F281D]' : 'bg-[#143628] text-[#C5A86A]'}`}>
                Masterpieces
              </span>
              <span className="text-xs opacity-75">{rack200Count} Flacons</span>
            </div>
            <div className="text-2xl font-serif font-bold mb-1 flex items-baseline gap-1.5 tabular-nums">
              <span className="text-sm line-through opacity-60 font-normal">₹260</span>
              <span>₹200+</span>
            </div>
            <h3 className={`font-serif text-base font-bold mb-1 ${activePriceRack === '200' ? 'text-[#C5A86A]' : 'text-[#143628]'}`}>
              ₹200 Masterpieces Rack
            </h3>
            <p className="text-[11px] opacity-80 leading-relaxed">
              20ml luxury crystal decanters and 9.9ml flagship oils.
            </p>
          </div>

        </div>
      </section>

      {/* 5. MAIN FLACONS CATALOG SECTION (Clean, Airy & Uncluttered) */}
      <section id="featured-flacons-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-6">
        
        {/* Clean Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D5CEBF]/60 pb-5">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143628]">
              Curated Attar Collections
            </h2>
            <p className="text-xs text-[#7A664F] mt-0.5">
              Showing {displayedFlacons.length} {displayedFlacons.length === 1 ? 'attar' : 'attars'} {activePriceRack !== 'All' ? `in the ₹${activePriceRack} Shelf` : 'across all price racks'}
            </p>
          </div>

          {/* Curated Sub-filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#D5CEBF] overflow-x-auto">
            {(['all', 'bestsellers', 'mens', 'womens'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCuratedTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeCuratedTab === tab
                    ? 'bg-[#143628] text-white shadow-xs'
                    : 'text-[#182920] hover:bg-[#FAF7F0]'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'mens' ? "Men's" : tab === 'womens' ? "Women's" : 'Bestsellers'}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Price Shelf Switcher Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['All', '40', '50', '60', '100', '140', '200'] as const).map((rack) => (
            <button
              key={rack}
              onClick={() => {
                setActivePriceRack(rack);
                setActiveBoxPieces40('all');
                setActivePackaging140('all');
              }}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
                activePriceRack === rack
                  ? 'bg-[#143628] text-white border-[#143628] shadow-xs'
                  : 'bg-white text-[#182920] border-[#D5CEBF] hover:bg-[#FAF7F0]'
              }`}
            >
              {rack === 'All' ? `All Racks (${PRODUCTS.length})` : `₹${rack} Rack`}
            </button>
          ))}
        </div>

        {/* Clean Sub-filter Pills when ₹40 Rack is active (No Clutter, Zero Essays) */}
        {activePriceRack === '40' && (
          <div className="flex items-center gap-2 p-2 bg-[#FAF7F0] rounded-xl border border-[#C5A86A]/40 flex-wrap">
            <span className="text-xs font-bold text-[#143628] px-2 uppercase tracking-wider">
              Box Packaging:
            </span>
            <button
              type="button"
              onClick={() => setActiveBoxPieces40('all')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activeBoxPieces40 === 'all' ? 'bg-[#143628] text-white' : 'bg-white text-[#182920] border border-[#D5CEBF]'
              }`}
            >
              All 3ml ({rack40Count})
            </button>
            <button
              type="button"
              onClick={() => setActiveBoxPieces40(6)}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activeBoxPieces40 === 6 ? 'bg-[#143628] text-white' : 'bg-white text-[#182920] border border-[#D5CEBF]'
              }`}
            >
              6-Pcs Box Range
            </button>
            <button
              type="button"
              onClick={() => setActiveBoxPieces40(12)}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activeBoxPieces40 === 12 ? 'bg-[#143628] text-white' : 'bg-white text-[#182920] border border-[#D5CEBF]'
              }`}
            >
              12-Pcs Master Box Range
            </button>
          </div>
        )}

        {/* Clean Sub-filter Pills when ₹140 Rack is active (No Clutter, Zero Essays) */}
        {activePriceRack === '140' && (
          <div className="flex items-center gap-2 p-2 bg-[#FAF7F0] rounded-xl border border-[#C5A86A]/40 flex-wrap">
            <span className="text-xs font-bold text-[#143628] px-2 uppercase tracking-wider">
              Packaging Format:
            </span>
            <button
              type="button"
              onClick={() => setActivePackaging140('all')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activePackaging140 === 'all' ? 'bg-[#143628] text-white' : 'bg-white text-[#182920] border border-[#D5CEBF]'
              }`}
            >
              All Formats ({rack140Count})
            </button>
            <button
              type="button"
              onClick={() => setActivePackaging140('tin')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activePackaging140 === 'tin' ? 'bg-[#143628] text-white' : 'bg-white text-[#182920] border border-[#D5CEBF]'
              }`}
            >
              Tin Canisters Only
            </button>
            <button
              type="button"
              onClick={() => setActivePackaging140('box')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activePackaging140 === 'box' ? 'bg-[#143628] text-white' : 'bg-white text-[#182920] border border-[#D5CEBF]'
              }`}
            >
              Carton Boxes Only (Red ZX, Sabaya, Salma)
            </button>
          </div>
        )}

        {/* Product Display: Beautifully Separated Price Rack Shelves */}
        {displayedFlacons.length > 0 ? (
          activePriceRack === 'All' ? (
            /* ALL RACKS VIEW: STRICTLY ORGANIZED INTO DEDICATED SEPARATE SHELVES */
            <div className="space-y-16 pt-2">
              
              {/* SHELF 1: ₹40 ECONOMY POCKET & MASTER BOX RACK (3ML) */}
              {displayedFlacons.filter((p) => (p.priceRack || '40') === '40').length > 0 && (
                <div className="space-y-5">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D5CEBF] border-l-4 border-l-[#10B981] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981] text-white uppercase tracking-wider">
                          Lowest Price Slot
                        </span>
                        <span className="text-xs font-semibold text-[#7A664F]">
                          3ml Flacons · 6-Pcs & 12-Pcs Master Boxes
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143628]">
                        ₹40 Pocket & Box Rack ({displayedFlacons.filter((p) => (p.priceRack || '40') === '40').length} Flacons)
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs line-through text-[#7A664F]/70 font-normal">₹60</span>
                        <span className="text-base font-bold text-[#143628]">₹40 each</span>
                        <span className="text-xs text-[#7A664F]">(Master Box of 6 at ₹240 · Master Box of 12 at ₹480)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPriceRack('40')}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#143628] hover:bg-[#1F4D3B] text-white self-start sm:self-auto cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>Focus on ₹40 Shelf</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A86A]" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {displayedFlacons
                      .filter((p) => (p.priceRack || '40') === '40')
                      .map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelectPriceRack={handleSelectPriceRack}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* SHELF 1.5: ₹50 KOSTURI DESERT SOLID BALM RACK */}
              {displayedFlacons.filter((p) => (p.priceRack || '') === '50').length > 0 && (
                <div className="space-y-5">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D5CEBF] border-l-4 border-l-[#D97706] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D97706] text-white uppercase tracking-wider">
                          🏜️ Desert Solid Balm (Not Roll-on / Spray)
                        </span>
                        <span className="text-xs font-semibold text-[#7A664F]">
                          Maeea Perfumery · Authentic Deer Musk Compact · 20 Pcs Master Box
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143628]">
                        ₹50 Kosturi Desert Rack ({displayedFlacons.filter((p) => (p.priceRack || '') === '50').length} Item)
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs line-through text-[#7A664F]/70 font-normal">₹75</span>
                        <span className="text-base font-bold text-[#143628]">₹50 each</span>
                        <span className="text-xs text-[#7A664F]">(Single Tin Compact at ₹50 · Complete 20 Pcs Master Box Case at ₹1,000)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPriceRack('50')}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#143628] hover:bg-[#1F4D3B] text-white self-start sm:self-auto cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>Focus on ₹50 Shelf</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A86A]" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {displayedFlacons
                      .filter((p) => (p.priceRack || '') === '50')
                      .map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelectPriceRack={handleSelectPriceRack}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* SHELF 2: ₹60 POCKET FLACONS RACK (3ML) */}
              {displayedFlacons.filter((p) => (p.priceRack || '60') === '60').length > 0 && (
                <div className="space-y-5">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D5CEBF] border-l-4 border-l-[#C5A86A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#C5A86A] text-[#143628] uppercase tracking-wider">
                          Daily Pocket Shelf
                        </span>
                        <span className="text-xs font-semibold text-[#7A664F]">
                          3ml Pure Attar Roll-Ons with Stainless Steel Ball
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143628]">
                        ₹60 Pocket Flacons Rack ({displayedFlacons.filter((p) => (p.priceRack || '60') === '60').length} Flacons)
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs line-through text-[#7A664F]/70 font-normal">₹85</span>
                        <span className="text-base font-bold text-[#143628]">₹60 each</span>
                        <span className="text-xs text-[#7A664F]">(Compact daily pocket convenience)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPriceRack('60')}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#143628] hover:bg-[#1F4D3B] text-white self-start sm:self-auto cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>Focus on ₹60 Shelf</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A86A]" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {displayedFlacons
                      .filter((p) => (p.priceRack || '60') === '60')
                      .map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelectPriceRack={handleSelectPriceRack}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* SHELF 3: ₹100 TRADITIONAL HERITAGE RACK (2.5ML) */}
              {displayedFlacons.filter((p) => p.priceRack === '100').length > 0 && (
                <div className="space-y-5">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D5CEBF] border-l-4 border-l-[#D97706] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D97706] text-white uppercase tracking-wider">
                          Heritage 2.5ml Edition
                        </span>
                        <span className="text-xs font-semibold text-[#7A664F]">
                          Nemat Enterprises · 10 Pcs Master Box Edition
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143628]">
                        ₹100 Traditional Heritage Rack ({displayedFlacons.filter((p) => p.priceRack === '100').length} Flacon)
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs line-through text-[#7A664F]/70 font-normal">₹140</span>
                        <span className="text-base font-bold text-[#143628]">₹100 each</span>
                        <span className="text-xs text-[#7A664F]">(10-Piece Master Presentation Box at ₹1,000)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPriceRack('100')}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#143628] hover:bg-[#1F4D3B] text-white self-start sm:self-auto cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>Focus on ₹100 Shelf</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A86A]" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {displayedFlacons
                      .filter((p) => p.priceRack === '100')
                      .map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelectPriceRack={handleSelectPriceRack}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* SHELF 4: ₹140 ARTISANAL FLACONS RACK (6ML & 8ML) */}
              {displayedFlacons.filter((p) => p.priceRack === '140').length > 0 && (
                <div className="space-y-6">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D5CEBF] border-l-4 border-l-[#143628] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#143628] text-[#C5A86A] uppercase tracking-wider">
                          Artisanal 6ml & 8ml Shelf
                        </span>
                        <span className="text-xs font-semibold text-[#7A664F]">
                          Luxury Rigid Carton Boxes & Cylindrical Tin Canisters
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143628]">
                        ₹140 Artisanal Flacons Rack ({displayedFlacons.filter((p) => p.priceRack === '140').length} Flacons)
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs line-through text-[#7A664F]/70 font-normal">₹180</span>
                        <span className="text-base font-bold text-[#143628]">₹140 each</span>
                        <span className="text-xs text-[#7A664F]">(Individual Packaging with Premium Roll-On Tips)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPriceRack('140')}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#143628] hover:bg-[#1F4D3B] text-white self-start sm:self-auto cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>Focus on ₹140 Shelf</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A86A]" />
                    </button>
                  </div>

                  {/* Sub-Shelf 4A: Carton Box Edition (Red ZX, Sabaya, Salma, etc.) */}
                  {displayedFlacons.filter((p) => p.priceRack === '140' && p.packagingType === 'box').length > 0 && (
                    <div className="space-y-3.5 pl-2 border-l-2 border-[#C5A86A]/40">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#143628]">
                          📦 Carton Box Edition (6ml & 8ml)
                        </span>
                        <span className="text-[10px] font-semibold text-[#7A664F]">
                          Including Red ZX, Sabaya & Salma ({displayedFlacons.filter((p) => p.priceRack === '140' && p.packagingType === 'box').length} Flacons)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {displayedFlacons
                          .filter((p) => p.priceRack === '140' && p.packagingType === 'box')
                          .map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              onSelectPriceRack={handleSelectPriceRack}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Sub-Shelf 4B: Metallic Tin Canister Edition */}
                  {displayedFlacons.filter((p) => p.priceRack === '140' && p.packagingType === 'tin').length > 0 && (
                    <div className="space-y-3.5 pl-2 border-l-2 border-[#7A664F]/40 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#143628]">
                          🥫 Metallic Tin Canister Edition (6ml)
                        </span>
                        <span className="text-[10px] font-semibold text-[#7A664F]">
                          Protective Cylindrical Metal Cans ({displayedFlacons.filter((p) => p.priceRack === '140' && p.packagingType === 'tin').length} Flacons)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {displayedFlacons
                          .filter((p) => p.priceRack === '140' && p.packagingType === 'tin')
                          .map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              onSelectPriceRack={handleSelectPriceRack}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* SHELF 5: ₹200+ MASTERPIECES RACK */}
              {displayedFlacons.filter((p) => p.priceRack === '200').length > 0 && (
                <div className="space-y-5">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D5CEBF] border-l-4 border-l-[#143628] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#143628] text-[#C5A86A] uppercase tracking-wider">
                          Flagship Connoisseur Shelf
                        </span>
                        <span className="text-xs font-semibold text-[#7A664F]">
                          20ml Octagonal Crystal Decanters & 9.9ml Duo Formulations
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143628]">
                        ₹200+ Masterpieces Rack ({displayedFlacons.filter((p) => p.priceRack === '200').length} Flacons)
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs line-through text-[#7A664F]/70 font-normal">₹260</span>
                        <span className="text-base font-bold text-[#143628]">₹200+</span>
                        <span className="text-xs text-[#7A664F]">(Ultra-Intense Rare Botanicals)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPriceRack('200')}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#143628] hover:bg-[#1F4D3B] text-white self-start sm:self-auto cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>Focus on ₹200 Shelf</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A86A]" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {displayedFlacons
                      .filter((p) => p.priceRack === '200')
                      .map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelectPriceRack={handleSelectPriceRack}
                        />
                      ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* FOCUSED SINGLE RACK VIEW */
            <div className="space-y-6 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#C5A86A]/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#143628]">
                    Currently Focusing on: ₹{activePriceRack} Shelf
                  </span>
                  <span className="text-xs text-[#7A664F] block mt-0.5">
                    Showing {displayedFlacons.length} matching flacons
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePriceRack('All')}
                  className="text-xs font-bold text-[#143628] hover:underline cursor-pointer"
                >
                  View All Shelves
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayedFlacons.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectPriceRack={handleSelectPriceRack}
                  />
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="bg-white border border-[#D5CEBF] rounded-2xl p-12 text-center text-[#7A664F]">
            <p className="text-sm">No flacons match the selected filter combination.</p>
          </div>
        )}

      </section>

      {/* 6. AUTHENTIC PERFUMERY HOUSES (Sleek, Compact Brand Strip) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#D5CEBF] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D5CEBF]/60 pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A86A] uppercase block">
                Direct Curation
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143628]">
                Authentic Sealed Perfumery Houses
              </h3>
            </div>
            <button
              onClick={() => {
                setActivePage('brands');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#143628] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>View All Brands</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A86A]" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {ATTAR_BRANDS.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setActivePage('brands');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#143628] hover:text-white border border-[#D5CEBF] transition-all text-center group cursor-pointer"
              >
                <span className="font-serif font-bold text-xs block group-hover:text-white text-[#143628]">
                  {b.name}
                </span>
                <span className="text-[10px] text-[#7A664F] group-hover:text-[#FAF7F0]/80 block mt-0.5">
                  Est. {b.established}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PATRON REVIEWS (Clean, Roomy 3 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#7A664F] font-bold block">
              Customer Feedback
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143628]">
              Words from Attar Enthusiasts
            </h2>
          </div>
          <button
            onClick={() => {
              setActivePage('reviews');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#143628] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Reviews</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A86A]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {homeReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#D5CEBF] rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-[#C5A86A]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#C5A86A]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#7A664F]">{rev.date}</span>
                </div>
                <p className="text-xs text-[#182920]/80 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#D5CEBF]/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#143628] block">{rev.name}</span>
                  <span className="text-[11px] text-[#7A664F]">{rev.productName}</span>
                </div>
                <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. DIRECT TELEPHONE & CONCIERGE ASSISTANCE (Clean Call-To-Action) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#143628] to-[#1F4D3B] text-[#FAF7F0] border-2 border-[#C5A86A] p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A86A] font-extrabold block">
              Direct Attar Assistance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Need Help Selecting or Ordering Your Flacons?
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF7F0]/85 max-w-xl leading-relaxed">
              Speak directly with our team at <strong>+91 8777855462</strong> or submit your exact shipping coordinates through our dedicated Order Desk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-shrink-0">
            <a
              href="tel:+918777855462"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#C5A86A] hover:bg-white text-[#0F281D] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-[#0F281D]" />
              <span>CALL 8777855462</span>
            </a>
            <button
              onClick={() => {
                setActivePage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-[#C5A86A] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
            >
              <span>CONTACT & ORDER DESK</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
