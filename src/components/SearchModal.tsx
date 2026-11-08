import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchNotes = [
        ...p.notes.top,
        ...p.notes.heart,
        ...p.notes.base,
      ].some((note) => note.toLowerCase().includes(q));

      return matchName || matchCategory || matchDesc || matchNotes;
    });
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#30272A]/70 backdrop-blur-sm flex flex-col p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl mx-auto bg-white border border-[#DED1BE] rounded-2xl overflow-hidden shadow-2xl my-auto p-5 sm:p-7 text-[#30272A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-[#591D2B]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by attar name, olfactory family, notes (e.g. musk, citrus, amber, oud)..."
            className="w-full bg-[#F7F0E5] border border-[#DED1BE] rounded-xl py-3.5 pl-12 pr-12 text-sm text-[#30272A] placeholder-[#6B6258] focus:outline-none focus:border-[#591D2B]"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 text-[#6B6258] hover:text-[#591D2B] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="absolute right-4 text-[#6B6258] hover:text-[#591D2B] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Tags */}
        <div className="mt-3 flex items-center flex-wrap gap-2 text-xs text-[#765C46]">
          <span>Popular searches:</span>
          {['₹60 Rack', 'Denim Black', 'Fawakeh', 'Zam Zam', 'Chocolate Musk', 'Fantasia', 'Signature', 'Freshia'].map(
            (tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag === '₹60 Rack' ? '3ml' : tag)}
                className="px-2.5 py-1 rounded-md bg-[#F7F0E5] hover:bg-[#EDE1D0] text-[#591D2B] border border-[#DED1BE] transition-colors cursor-pointer"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Results Area */}
        <div className="mt-6 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-xs text-[#765C46]">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-[#D6B887]" />
              Type an attar name, notes, or mood to discover your fragrance.
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#6B6258]">
              No artisanal attars matched "{query}". Try searching for Fresh, Musk, Amber, or Citrus.
            </div>
          ) : (
            <div>
              <div className="text-xs text-[#765C46] mb-3">
                Found <strong className="text-[#591D2B]">{searchResults.length}</strong> matching flacons
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={(p) => {
                      onClose();
                      if (onSelectProduct) onSelectProduct(p);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
