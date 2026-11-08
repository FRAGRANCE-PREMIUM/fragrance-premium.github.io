import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Crown,
  Gem,
  Sun,
  Shield,
  Award,
  Flower2,
  Flame,
  Layers,
  ShoppingBag,
  Building2,
  MapPin,
  Calendar,
  PackageCheck,
} from 'lucide-react';
import { ATTAR_BRANDS, BRANDS_CURATION_BANNER } from '../data/brands';
import { PRODUCTS } from '../data/products';
import { ActivePage, AttarBrand } from '../types';
import { BRAND_CONFIG } from '../config/config';

interface BrandsPageProps {
  setActivePage: (page: ActivePage) => void;
  onFilterCategory?: (category: string) => void;
  onSelectPriceRack?: (rack: '60' | '140' | '200') => void;
}

export const BrandsPage: React.FC<BrandsPageProps> = ({
  setActivePage,
  onSelectPriceRack,
}) => {
  const [selectedBrandId, setSelectedBrandId] = useState<string>('all');

  const brandIcons: Record<string, React.ReactNode> = {
    Crown: <Crown className="w-6 h-6 text-[#D4AF37]" />,
    Gem: <Gem className="w-6 h-6 text-[#15803D]" />,
    Sun: <Sun className="w-6 h-6 text-[#D97706]" />,
    Shield: <Shield className="w-6 h-6 text-[#7F1D1D]" />,
    Award: <Award className="w-6 h-6 text-[#0F766E]" />,
    Flower: <Flower2 className="w-6 h-6 text-[#9D174D]" />,
    Sparkles: <Sparkles className="w-6 h-6 text-[#854D0E]" />,
  };

  const filteredBrands =
    selectedBrandId === 'all'
      ? ATTAR_BRANDS
      : ATTAR_BRANDS.filter((b) => b.id === selectedBrandId);

  return (
    <div className="space-y-12 sm:space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent text-[#182920]">
      {/* 1. Header Hero Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#7A664F] font-semibold flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#C5A86A]" />
          100% Genuine Branded Curation
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#143628] leading-tight font-normal">
          Our Curated Attar Houses
        </h1>
        <p className="text-sm sm:text-base text-[#182920]/80 leading-relaxed max-w-2xl mx-auto">
          We bring you authentic, factory-sealed roll-ons from India's most respected perfume institutions: <strong>Al Nuaim, Almas, Arham, Basha, Masco, Nida, and Roohi</strong>.
        </p>
      </section>

      {/* 2. Visual Brand Heritage Showcase Banner */}
      <section className="relative rounded-3xl overflow-hidden border-2 border-[#C5A86A] shadow-xl bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#F5EFE6] p-2 sm:p-3">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-inner">
          <img
            src={BRANDS_CURATION_BANNER}
            alt="Curated Collection of Luxury Indian Attar Brands - Al Nuaim, Almas, Arham, Basha, Masco, Nida, Roohi"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F281D]/80 via-transparent to-transparent flex items-end p-4 sm:p-8">
            <div className="text-white space-y-1 max-w-xl">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#C5A86A] uppercase block">
                ✦ 100% Original Sealed Stockist ✦
              </span>
              <h2 className="font-serif text-lg sm:text-2xl lg:text-3xl font-bold">
                Seven Prestigious Houses · One Unified Boutique
              </h2>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed hidden sm:block">
                Procured directly from verified manufacturing distributors to ensure unmatched longevity, 0% alcohol, and authentic formulation purity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Business Curation & Sourcing Transparency Statement */}
      <section className="rounded-3xl bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#F5EFE6] border border-[#C5A86A]/50 border-t-4 border-t-[#C5A86A] p-6 sm:p-10 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C5A86A]/50 text-xs font-bold text-[#143628] uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-[#C5A86A]" />
              <span>Authentic Retailer & Curator Model</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#143628] font-bold">
              Pure Products · Zero Counterfeit · Direct Procurements
            </h3>
            <p className="text-xs sm:text-sm text-[#182920]/85 leading-relaxed">
              <strong>Fragrance Premium</strong> operates strictly as an authentic retail curator. We do not manufacture perfume oils in a personal chemical factory. Instead, our expert team procures 100% authentic, factory-sealed stock directly from original manufacturing houses and certified distributors across Mumbai, Kolkata, Kannauj, and Jaipur.
            </p>
            <p className="text-xs sm:text-sm text-[#182920]/80 leading-relaxed">
              Every single roll-on in our ₹40 Economy Rack, ₹60 Pocket Rack, ₹140 Artisanal Rack, and ₹200 Masterpiece Rack is guaranteed to be 100% non-alcoholic, skin-friendly, and packaged in factory-fresh flacons with stainless steel roller balls.
            </p>
          </div>

          <div className="md:col-span-4 bg-white/90 rounded-2xl p-5 border border-[#C5A86A]/40 shadow-xs space-y-3.5">
            <h4 className="text-xs font-extrabold text-[#143628] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A86A]" />
              <span>Our Sourcing Guarantee</span>
            </h4>
            <ul className="text-xs space-y-2 text-[#182920]/85">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A86A] mt-0.5 flex-shrink-0" />
                <span>100% Original Brand Packaging & Seal</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A86A] mt-0.5 flex-shrink-0" />
                <span>No diluted mixtures, synthetic fillers, or alcohol</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A86A] mt-0.5 flex-shrink-0" />
                <span>Fair pricing directly retailed from ₹40 to ₹200</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A86A] mt-0.5 flex-shrink-0" />
                <span>Full transit insurance and replacement guarantee</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Brand Navigation Switcher Tabs */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#7A664F] uppercase tracking-wider block">
              EXPLORE OUR 7 PARTNER BRANDS
            </span>
            <h3 className="font-serif text-2xl text-[#143628] font-bold mt-0.5">
              Select a Brand to View Details
            </h3>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedBrandId('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedBrandId === 'all'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-white text-[#182920] border border-[#D5CEBF] hover:bg-[#FAF7F0]'
              }`}
            >
              ALL 7 HOUSES ({ATTAR_BRANDS.length})
            </button>
            {ATTAR_BRANDS.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setSelectedBrandId(brand.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedBrandId === brand.id
                    ? 'bg-[#143628] text-white shadow-xs'
                    : 'bg-white text-[#182920] border border-[#D5CEBF] hover:bg-[#FAF7F0]'
                }`}
              >
                <span>{brand.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Detailed Brand Profile Cards */}
        <div className="space-y-8">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              id={`brand-${brand.id}`}
              className="rounded-3xl bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#F5EFE6] border border-[#C5A86A]/50 border-t-4 border-t-[#C5A86A] p-6 sm:p-9 shadow-md transition-all duration-200"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Brand Emblem & Quick Metrics */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center gap-4">
                    {/* Royal Gold Brand Insignia Crest */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#FFFFFF] via-[#FAF7F0] to-[#F5EFE6] border-2 border-[#C5A86A] ring-4 ring-[#C5A86A]/20 shadow-md flex items-center justify-center flex-shrink-0">
                      {brandIcons[brand.emblemIcon] || <Sparkles className="w-7 h-7 text-[#C5A86A]" />}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#143628] text-[#FAF7F0] uppercase tracking-wider">
                        Genuine Brand Partner
                      </span>
                      <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#143628] mt-1">
                        {brand.name}
                      </h4>
                      <span className="text-xs text-[#7A664F] font-medium block">
                        {brand.tagline}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/90 border border-[#D5CEBF] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#182920]/80">
                      <span className="flex items-center gap-1.5 font-medium text-[#7A664F]">
                        <MapPin className="w-3.5 h-3.5 text-[#143628]" />
                        <span>Origin Base:</span>
                      </span>
                      <span className="font-bold text-[#182920]">{brand.origin}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#182920]/80">
                      <span className="flex items-center gap-1.5 font-medium text-[#7A664F]">
                        <Calendar className="w-3.5 h-3.5 text-[#143628]" />
                        <span>Legacy:</span>
                      </span>
                      <span className="font-bold text-[#182920]">{brand.established}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#182920]/80">
                      <span className="flex items-center gap-1.5 font-medium text-[#7A664F]">
                        <Layers className="w-3.5 h-3.5 text-[#143628]" />
                        <span>In Boutique Racks:</span>
                      </span>
                      <span className="font-bold text-[#143628]">{brand.priceRacks}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#182920]/80">
                      <span className="flex items-center gap-1.5 font-medium text-[#7A664F]">
                        <PackageCheck className="w-3.5 h-3.5 text-[#143628]" />
                        <span>Packaging:</span>
                      </span>
                      <span className="font-bold text-[#182920]">{brand.formats.join(', ')}</span>
                    </div>
                  </div>

                  {/* Sourcing Purity Tag */}
                  <div className="p-3 rounded-xl bg-white/80 border border-[#C5A86A]/50 flex items-center gap-2 text-xs text-[#143628] font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#C5A86A] flex-shrink-0" />
                    <span>{brand.purityBadge}</span>
                  </div>
                </div>

                {/* Brand Deep Information & Signature Fragrances */}
                <div className="lg:col-span-8 space-y-5">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#7A664F] mb-1">
                      ABOUT THE BRAND & FORMULATION STYLE
                    </h5>
                    <p className="text-sm text-[#182920]/85 leading-relaxed">
                      {brand.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/90 border border-[#D5CEBF] space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#143628] block">
                        OLFACTORY SPECIALTY
                      </span>
                      <p className="text-xs text-[#182920]/80 leading-relaxed">
                        {brand.specialty}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/90 border border-[#D5CEBF] space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#143628] block">
                        MOST CELEBRATED FLACONS
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {brand.popularScents.map((scent, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#143628] border border-[#C5A86A]/40"
                          >
                            {scent}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#7A664F] mb-2">
                      KEY BRAND ADVANTAGES
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#182920]/85">
                      {brand.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 bg-white/60 p-2.5 rounded-lg border border-[#C5A86A]/30">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A86A] mt-0.5 flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button: Jump to Collection */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setActivePage('collection');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase bg-[#143628] hover:bg-[#1F4D3B] text-white transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-[#C5A86A]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C5A86A]" />
                      <span>Shop {brand.name} Flacons in Boutique</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A86A]" />
                    </button>

                    <button
                      onClick={() => {
                        if (onSelectPriceRack) onSelectPriceRack('60');
                        setActivePage('collection');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase bg-white/90 hover:bg-white text-[#143628] border border-[#C5A86A] transition-all cursor-pointer"
                    >
                      <span>Explore ₹60 Pocket Racks</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Direct Assurance Call to Action */}
      <section className="rounded-3xl bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#F5EFE6] border border-[#C5A86A] border-t-4 border-t-[#C5A86A] p-8 sm:p-12 text-center shadow-lg">
        <div className="max-w-xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#7A664F] font-bold">
            Guaranteed Authentic Inventory
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#143628] font-bold">
            Looking for a Specific Brand or Signature Flacon?
          </h3>
          <p className="text-xs sm:text-sm text-[#182920]/85 leading-relaxed">
            All our inventory is genuine, direct, and non-alcoholic. Order roll-ons from Al Nuaim, Almas, Arham, Basha, Masco, Nida, and Roohi today with swift Pan-India delivery.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setActivePage('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3 rounded-lg text-xs font-bold tracking-widest bg-[#143628] hover:bg-[#1F4D3B] text-white border border-[#C5A86A] transition-all inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>EXPLORE ALL BRANDS COLLECTION</span>
              <ArrowRight className="w-4 h-4 text-[#C5A86A]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
