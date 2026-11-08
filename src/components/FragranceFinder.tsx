import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface FragranceFinderProps {
  onSelectProduct?: (product: Product) => void;
  onExploreFullCollection: () => void;
}

type PreferenceType = 'Fresh' | 'Sweet' | 'Woody' | 'Floral' | 'Strong' | 'Daily Use';

export const FragranceFinder: React.FC<FragranceFinderProps> = ({
  onSelectProduct,
  onExploreFullCollection,
}) => {
  const [selectedPreference, setSelectedPreference] = useState<PreferenceType>('Daily Use');

  const preferenceOptions: {
    type: PreferenceType;
    label: string;
    description: string;
  }[] = [
    { type: 'Daily Use', label: 'Daily Use', description: 'Clean, comforting & versatile' },
    { type: 'Woody', label: 'Woody', description: 'Cedarwood & rich resins' },
    { type: 'Floral', label: 'Floral', description: 'Rose, lily & fresh petals' },
    { type: 'Fresh', label: 'Fresh', description: 'Aquatic, citrus & mint breeze' },
    { type: 'Sweet', label: 'Sweet', description: 'Velvety vanilla & subtle amber' },
    { type: 'Strong', label: 'Strong', description: 'Leather, dark musk & smoke' },
  ];

  const filteredProducts = PRODUCTS.filter((product) => {
    switch (selectedPreference) {
      case 'Daily Use':
        return product.category === 'Musk' || product.category === 'Fresh';
      case 'Woody':
        return product.category === 'Woody' || product.category === 'Oud';
      case 'Floral':
        return product.category === 'Floral';
      case 'Fresh':
        return product.category === 'Fresh';
      case 'Sweet':
        return product.category === 'Sweet';
      case 'Strong':
        return product.category === 'Strong' || product.category === 'Oud';
      default:
        return true;
    }
  }).slice(0, 3);

  return (
    <section className="py-14 sm:py-20 bg-[#F5EFE6] border-y border-[#D5CEBF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#7A664F] font-semibold flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-[#C5A86A]" />
            Personal Scent Diagnostic
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#143628] leading-tight font-normal">
            Find Your Signature Attar
          </h2>
          <p className="text-sm text-[#182920]/75 mt-2">
            Select your preferred fragrance profile below and discover matching pure artisanal attars tailored to your taste.
          </p>
        </div>

        {/* Preference Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 max-w-5xl mx-auto mb-10">
          {preferenceOptions.map((opt) => {
            const isSelected = selectedPreference === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => setSelectedPreference(opt.type)}
                className={`p-3.5 rounded-xl text-center border transition-all duration-200 flex flex-col justify-center items-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#143628] text-white border-[#143628] shadow-md font-semibold'
                    : 'bg-white border-[#D5CEBF] text-[#182920] hover:border-[#143628]'
                }`}
              >
                <span className="text-xs sm:text-sm font-semibold block">{opt.label}</span>
                <span className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-[#FAF7F0]' : 'text-[#7A664F]'}`}>
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Matched Products Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>

        {/* Bottom CTA to explore all */}
        <div className="text-center mt-10">
          <button
            onClick={onExploreFullCollection}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#143628] hover:text-[#1F4D3B] transition-colors border-b border-[#143628] pb-0.5"
          >
            <span>EXPLORE ALL FRAGRANCES IN COLLECTION</span>
            <ArrowRight className="w-4 h-4 text-[#C5A86A]" />
          </button>
        </div>
      </div>
    </section>
  );
};
