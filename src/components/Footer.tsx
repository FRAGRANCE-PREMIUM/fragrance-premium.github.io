import React, { useState } from 'react';
import { Send, Check, Heart, ShieldCheck, Sparkles, Phone, Mail, ClipboardList, Download, FileCode } from 'lucide-react';
import { BRAND_CONFIG } from '../config/config';
import { ActivePage } from '../types';
import { PolicyType } from './PolicyModals';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  openPolicy: (policy: PolicyType) => void;
  openDownloadModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, openPolicy, openDownloadModal }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  const navLinks: { label: string; page?: ActivePage }[] = [
    { label: 'Shop All Attars', page: 'collection' },
    { label: 'The Art of Attar Guide', page: 'guide' },
    { label: '🛡️ Store Orders Vault (Admin)', page: 'orders' },
    { label: 'Curated Brands (Al Nuaim, Almas, etc.)', page: 'brands' },
    { label: 'Customer Reviews', page: 'reviews' },
    { label: 'Contact & Support', page: 'contact' },
  ];

  return (
    <footer className="bg-[#0F281D] border-t-2 border-[#C5A86A] text-[#FAF7F0]/85 pt-14 pb-20 md:pb-12 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#C5A86A]/20">
          
          {/* Column 1: Brand Logo & Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-[84px] h-[84px] sm:w-[98px] sm:h-[98px] rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-[#143628] via-[#C5A86A] to-[#143628] shadow-xl ring-2 ring-[#C5A86A] flex-shrink-0 bg-white">
                <img
                  src={BRAND_CONFIG.logoImage}
                  alt={BRAND_CONFIG.brandName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-xl p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#FAF7F0] tracking-wide block leading-tight">
                  {BRAND_CONFIG.brandName}
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#C5A86A] font-bold mt-1">
                  ✦ Royal Heritage Perfumery ✦
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#FAF7F0]/75 leading-relaxed">
              Authorized boutique retailer curating 100% original, factory-sealed attars from India's premier houses: Al Nuaim, Almas, Arham, Basha, Masco, Nida & Roohi.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-[#FAF7F0]">
              <ShieldCheck className="w-4 h-4 text-[#C5A86A]" />
              <span className="font-medium text-[#FAF7F0]/90">100% Genuine Sealed Stock · 0% Alcohol</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs uppercase tracking-widest text-[#C5A86A] font-semibold">
              Explore Fragrances
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F0]/80">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      if (link.page) {
                        setActivePage(link.page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-[#C5A86A] transition-colors text-left cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              {openDownloadModal && (
                <li>
                  <button
                    onClick={openDownloadModal}
                    className="text-[#C5A86A] font-bold hover:underline transition-colors text-left cursor-pointer flex items-center gap-1.5 pt-1"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C5A86A]" />
                    <span>Download Main Code Files (Single Files)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Customer Care & Direct WhatsApp */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs uppercase tracking-widest text-[#C5A86A] font-semibold">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F0]/80">
              <li>
                <button
                  onClick={() => openPolicy('shipping')}
                  className="hover:text-[#C5A86A] transition-colors"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('returns')}
                  className="hover:text-[#C5A86A] transition-colors"
                >
                  Return & Exchange Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('privacy')}
                  className="hover:text-[#C5A86A] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('terms')}
                  className="hover:text-[#C5A86A] transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>

            <div className="pt-2 space-y-1.5">
              <a
                href="tel:+918777855462"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0F281D] bg-[#C5A86A] hover:bg-white px-3.5 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#0F281D]" />
                <span>Call: +91 8777855462</span>
              </a>
              <div className="text-[11px] text-[#FAF7F0]/70 pt-0.5">
                <span>Orders: </span>
                <a href="mailto:nskproject01@gmail.com" className="hover:text-[#C5A86A] underline">nskproject01@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs uppercase tracking-widest text-[#C5A86A] font-semibold">
              Newsletter
            </h4>
            <p className="text-xs text-[#FAF7F0]/75 leading-relaxed">
              Subscribe for notice of rare new batch arrivals and special courtesies.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="w-full bg-[#143628] border border-[#C5A86A]/30 rounded-lg py-2 pl-3 pr-10 text-xs text-[#FAF7F0] placeholder-[#FAF7F0]/50 focus:outline-none focus:border-[#C5A86A]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-2.5 rounded bg-[#C5A86A] text-[#0F281D] flex items-center justify-center hover:bg-[#D4AF37] transition-all cursor-pointer font-bold"
                  aria-label="Subscribe to newsletter"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-[#C5A86A] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Welcome to the Royal Fragrance circle.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Store Orders Dashboard link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF7F0]/60 gap-4">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.brandName}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActivePage('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#FAF7F0] hover:text-[#C5A86A] flex items-center gap-1.5 underline decoration-[#C5A86A]/40"
            >
              <ClipboardList className="w-3.5 h-3.5 text-[#C5A86A]" />
              <span>Store Orders Console</span>
            </button>
            <span>·</span>
            <div className="flex items-center gap-1 text-[11px]">
              <span>Royal artisanal heritage</span>
              <Heart className="w-3 h-3 text-[#C5A86A] inline fill-[#C5A86A]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
