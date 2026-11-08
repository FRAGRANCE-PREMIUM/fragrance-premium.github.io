import React, { useState } from 'react';
import {
  Droplet,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { FRAGRANCE_FAMILIES } from '../data/products';
import { BRAND_CONFIG } from '../config/config';
import { ActivePage, FragranceFamily } from '../types';

interface AttarGuidePageProps {
  setActivePage: (page: ActivePage) => void;
  onFilterCategory?: (category: FragranceFamily) => void;
}

export const AttarGuidePage: React.FC<AttarGuidePageProps> = ({
  setActivePage,
}) => {
  const [activeQuizAnswer, setActiveQuizAnswer] = useState<string | null>(null);

  const quizScenarios = [
    {
      id: 'subtle-office',
      question: 'Looking for a clean, comforting scent for the office or daily prayers?',
      recommendation: 'Forever or Hajre Aswad',
      family: 'Floral' as FragranceFamily,
      reason: 'Alcohol-free smooth roll-on florals and serene musks create a comforting clean aura without overpowering enclosed rooms.',
    },
    {
      id: 'evening-majestic',
      question: 'Attending an evening wedding, gala, or special gathering?',
      recommendation: 'Black Mischief or Figo Red',
      family: 'Strong' as FragranceFamily,
      reason: 'Dark woods, smoky accords, and golden amber project authority, luxury, and last on clothing for over 20 hours.',
    },
    {
      id: 'romantic-fresh',
      question: 'Want a cooling, high-energy freshness for hot weather or daily active wear?',
      recommendation: 'Freshia or Blue Sport',
      family: 'Fresh' as FragranceFamily,
      reason: 'Crisp aquatic notes, iced citrus, and refreshing marine accords keep you invigorated all day long.',
    },
    {
      id: 'meditative-grounded',
      question: 'Seeking modern masculine elegance and ambery woody depth?',
      recommendation: 'Figo Black',
      family: 'Woody' as FragranceFamily,
      reason: 'Sharp citrus-green facets balanced with rich amber and dark cedarwood provide a polished, magnetic presence.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-8 bg-transparent text-[#30272A]">
      {/* 1. GUIDE HERO BANNER */}
      <section className="relative text-center max-w-4xl mx-auto px-4 sm:px-6">
        <span className="text-xs uppercase tracking-[0.25em] text-[#765C46] font-semibold flex items-center justify-center gap-1.5 mb-2">
          <Compass className="w-4 h-4 text-[#D6B887]" />
          The Connoisseur’s Compendium
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#591D2B] leading-tight font-normal">
          The Art of Attar
        </h1>
        <p className="text-sm sm:text-base text-[#30272A]/80 mt-4 max-w-2xl mx-auto leading-relaxed">
          Unveil centuries of oriental perfumery heritage. Discover how true alcohol-free attars interact with skin chemistry, why they outlast commercial perfumes, and how to master their application.
        </p>
      </section>

      {/* 2. WHAT IS ATTAR & HOW IS IT MADE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-5 bg-white border border-[#DED1BE] p-7 sm:p-9 rounded-3xl shadow-xs">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#765C46] uppercase tracking-wider">
              <Droplet className="w-4 h-4 text-[#591D2B]" />
              Living Heritage
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#591D2B] font-normal">
              What is True Attar?
            </h2>
            <p className="text-sm text-[#30272A]/85 leading-relaxed">
              Derived from the Persian and Arabic word <em>‘Itr’</em> (meaning fragrance), Attar is the purest form of natural perfume known to humanity. Unlike modern commercial perfumes that are 80% to 90% synthetic denatured alcohol, authentic attar is <strong className="text-[#591D2B] font-semibold">100% pure concentrated oil</strong>.
            </p>
            <p className="text-sm text-[#30272A]/85 leading-relaxed">
              Precious botanicals—such as Damascus roses, jasmine flowers, aged agarwood, and vetiver roots—are hydrodistilled over weeks into a cooling receiver containing pure Mysore sandalwood oil or pure botanical carrier bases.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F7F0E5] p-3 rounded-xl border border-[#DED1BE]">
                <span className="text-[#591D2B] font-bold block text-sm">0% Alcohol</span>
                <span className="text-xs text-[#6B6258]">Safe for sensitive skin & prayer</span>
              </div>
              <div className="bg-[#F7F0E5] p-3 rounded-xl border border-[#DED1BE]">
                <span className="text-[#591D2B] font-bold block text-sm">24+ Hours</span>
                <span className="text-xs text-[#6B6258]">Warm, intimate sillage</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#DED1BE] shadow-sm bg-[#30272A]">
            <img
              src={BRAND_CONFIG.craftImage}
              alt="Traditional copper hydrodistillation still"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* 3. COMPARISON TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-[0.2em] text-[#765C46] font-semibold">
            Comparative Analysis
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#591D2B] mt-1 font-normal">
            Pure Attar vs. Commercial Alcohol Sprays
          </h2>
        </div>

        <div className="bg-white border border-[#DED1BE] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#591D2B] text-white border-b border-[#591D2B]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Criterion</th>
                  <th className="py-3.5 px-4 font-semibold text-[#D6B887]">{BRAND_CONFIG.brandName} Pure Attar</th>
                  <th className="py-3.5 px-4 font-semibold text-[#F7F0E5]/70">Commercial Alcohol Sprays</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED1BE]/60 text-[#30272A]">
                <tr>
                  <td className="py-3 px-4 font-medium text-[#591D2B]">Solvent Base</td>
                  <td className="py-3 px-4 text-[#591D2B] font-semibold">Zero Alcohol · 100% Pure Essential Oils</td>
                  <td className="py-3 px-4 text-[#6B6258]">80% – 90% Industrial Denatured Alcohol</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#591D2B]">Skin Longevity</td>
                  <td className="py-3 px-4 text-[#591D2B] font-semibold">16 to 24+ Hours (Continues on clothing)</td>
                  <td className="py-3 px-4 text-[#6B6258]">2 to 5 Hours (Evaporates rapidly)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#591D2B]">Skin Tolerance</td>
                  <td className="py-3 px-4 text-[#591D2B] font-semibold">Nourishing, gentle on sensitive skin</td>
                  <td className="py-3 px-4 text-[#6B6258]">Often dries dermis & causes tingling</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#591D2B]">Religious / Prayer Suitability</td>
                  <td className="py-3 px-4 text-[#591D2B] font-semibold">100% Halal / Tahir for daily prayers</td>
                  <td className="py-3 px-4 text-[#6B6258]">Questionable due to synthetic alcohol solvents</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#591D2B]">Value Per Milliliter</td>
                  <td className="py-3 px-4 text-[#591D2B] font-semibold">Every drop is pure scent active</td>
                  <td className="py-3 px-4 text-[#6B6258]">Paying heavily for alcohol carrier & aerosol gas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. SCENT QUIZ SELECTOR */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#EDE1D0] border border-[#DED1BE] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#765C46] font-semibold">
              Personal Recommendation Engine
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#591D2B] font-normal">
              What Is Your Primary Occasion?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {quizScenarios.map((sc) => {
              const isSelected = activeQuizAnswer === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => setActiveQuizAnswer(sc.id)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#591D2B] text-white border-[#591D2B] shadow-md'
                      : 'bg-white border-[#DED1BE] text-[#30272A] hover:border-[#591D2B]'
                  }`}
                >
                  <span className="text-xs font-semibold block mb-1">{sc.question}</span>
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-[#D6B887]/40 text-xs space-y-1">
                      <div className="text-[#D6B887] font-bold">Recommended: {sc.recommendation}</div>
                      <p className="text-xs text-[#F7F0E5]/80">{sc.reason}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setActivePage('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 rounded-lg bg-[#591D2B] hover:bg-[#713142] text-white text-xs font-semibold tracking-wider transition-colors inline-flex items-center gap-2"
            >
              <span>EXPLORE ALL {FRAGRANCE_FAMILIES.length} FAMILIES</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
