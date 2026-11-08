import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, Sparkles, Heart, User, ClipboardList, Shield, Lock, Download, FileCode } from 'lucide-react';
import { BRAND_CONFIG } from '../config/config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ActivePage } from '../types';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  openSearch: () => void;
  openAccount: () => void;
  openDownloadModal?: () => void;
  onSelectNavCategory: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  openSearch,
  openAccount,
  openDownloadModal,
  onSelectNavCategory,
}) => {
  const { totalQuantity, setIsCartOpen, orders } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'HOME', type: 'page', page: 'home' as ActivePage },
    { label: 'COLLECTIONS', type: 'collection', filter: 'All' },
    { label: "MEN'S ATTAR", type: 'collection', filter: 'mens' },
    { label: "WOMEN'S ATTAR", type: 'collection', filter: 'womens' },
    { label: 'ORDER DETAILS', type: 'page', page: 'order-details' as ActivePage },
    { label: 'PRICE RACKS', type: 'collection', filter: 'All' },
    { label: 'BRANDS', type: 'page', page: 'brands' as ActivePage },
    { label: 'ORDERS VAULT', type: 'page', page: 'orders' as ActivePage },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.type === 'page' && item.page) {
      setActivePage(item.page);
    } else {
      onSelectNavCategory(item.filter || 'All');
      setActivePage('collection');
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Slim Forest Green & Ivory Announcement Bar with Prominent Store Orders Vault Button */}
      <aside aria-label="Announcement" className="bg-[#0F281D] border-t-2 border-[#C5A86A] border-b border-[#C5A86A]/40 text-[#FAF7F0] text-[11px] sm:text-xs py-2 px-4 tracking-wider font-semibold shadow-xs z-50 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A86A] flex-shrink-0" />
            <span className="leading-tight text-[#FAF7F0]/95">
              100% Pure Non-Alcoholic Artisanal Attars · Lowest Price 3ml Flacons from {BRAND_CONFIG.currencySymbol}40 · Free Express Delivery Over {BRAND_CONFIG.currencySymbol}{BRAND_CONFIG.freeShippingThreshold}
            </span>
          </div>

          {/* Store Orders Vault Direct Access & Code Downloads */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {openDownloadModal && (
              <button
                onClick={openDownloadModal}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A86A] text-[#0F281D] hover:bg-white text-[10px] sm:text-[11px] font-extrabold tracking-wider cursor-pointer shadow-sm active:scale-95 transition-all flex-shrink-0"
                title="Download Individual Main Files (.tsx, .ts, .json, .html)"
              >
                <Download className="w-3.5 h-3.5 text-[#0F281D]" />
                <span>DOWNLOAD MAIN FILES</span>
              </button>
            )}

            <button
              onClick={() => {
                setActivePage('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#143628] text-[#FAF7F0] hover:bg-[#1F4D3B] hover:text-white border border-[#C5A86A] text-[10px] sm:text-[11px] font-bold tracking-wider cursor-pointer shadow-sm whitespace-nowrap active:scale-95 transition-all flex-shrink-0"
              title="Administrator Protected Orders Vault"
            >
              <Shield className="w-3.5 h-3.5 text-[#C5A86A]" />
              <span className="text-[#C5A86A]">STORE ORDERS VAULT</span>
              <span className="text-[9px] bg-[#C5A86A] text-[#0F281D] px-1.5 py-0.2 rounded-full font-extrabold ml-0.5">
                {orders.length}
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Premium Royal Header with Ivory & Forest Green Palette */}
      <header className="sticky top-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#D5CEBF] text-[#182920] transition-all duration-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[96px] sm:min-h-[112px] py-2 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Zone 1: Royal Brand Logo (100px Size) & Typography (Protected against clipping & shrinkage) */}
          <button
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 sm:gap-4 group text-left focus:outline-none flex-shrink-0 cursor-pointer"
            aria-label="Fragrance Premium Home"
          >
            {/* Royal Brand Logo Emblem (Preserving 100% of the authentic artwork) */}
            <div className="relative w-[84px] h-[84px] sm:w-[98px] sm:h-[98px] rounded-2xl p-1 bg-gradient-to-tr from-[#143628] via-[#C5A86A] to-[#143628] shadow-md ring-2 ring-[#C5A86A] group-hover:ring-[#143628] transition-all duration-300 flex-shrink-0">
              <div className="w-full h-full rounded-[12px] overflow-hidden bg-white flex items-center justify-center shadow-xs">
                <img
                  src={BRAND_CONFIG.logoImage}
                  alt={BRAND_CONFIG.brandName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Brand Title & Royal Badge - Strictly non-wrapping and protected */}
            <div className="flex flex-col justify-center flex-shrink-0">
              <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-[0.04em] text-[#143628] group-hover:text-[#1F4D3B] transition-colors leading-tight whitespace-nowrap drop-shadow-xs">
                {BRAND_CONFIG.brandName}
              </span>
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] tracking-[0.24em] text-[#7A664F] uppercase font-bold whitespace-nowrap mt-1 flex items-center gap-1">
                <span className="text-[#C5A86A]">✦</span>
                <span>ROYAL HERITAGE PERFUMERY</span>
                <span className="text-[#C5A86A]">✦</span>
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Menu - Uppercase with Premium Micro-Interactions */}
          {/* For ultra-wide screens (xl: 1280px+), show all 7 tabs */}
          <nav className="hidden xl:flex items-center gap-3 2xl:gap-5 text-xs font-bold tracking-[0.11em] text-[#182920] flex-shrink-0">
            {navItems.map((item, index) => {
              const isActive = (item.type === 'page' && activePage === item.page) || (item.type === 'collection' && activePage === 'collection' && item.label === 'COLLECTIONS');
              return (
                <button
                  key={`${item.label}-${index}`}
                  onClick={() => handleNavClick(item)}
                  className={`py-2 px-1 relative tab-premium font-bold text-xs tracking-[0.11em] uppercase whitespace-nowrap cursor-pointer transition-all duration-300 ${
                    isActive ? 'text-[#143628] font-extrabold after:!w-full after:!opacity-100' : 'text-[#182920] hover:text-[#143628]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* For intermediate desktop screens (lg: 1024px-1279px), show top 4 primary tabs to prevent collision */}
          <nav className="hidden lg:flex xl:hidden items-center gap-3 text-xs font-bold tracking-[0.1em] text-[#182920] flex-shrink-0">
            {[
              navItems[0], // HOME
              navItems[1], // COLLECTIONS
              navItems[4], // CONTACT DETAILS
              navItems[5], // PRICE RACKS
              navItems[6], // BRANDS
            ].map((item, index) => {
              const isActive = (item.type === 'page' && activePage === item.page) || (item.type === 'collection' && activePage === 'collection' && item.label === 'COLLECTIONS');
              return (
                <button
                  key={`med-${item.label}-${index}`}
                  onClick={() => handleNavClick(item)}
                  className={`py-2 px-1 relative tab-premium font-bold text-xs tracking-[0.1em] uppercase whitespace-nowrap cursor-pointer transition-all duration-300 ${
                    isActive ? 'text-[#143628] font-extrabold after:!w-full after:!opacity-100' : 'text-[#182920] hover:text-[#143628]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Store Orders Vault, Search, Account, Wishlist, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Highly Prominent Store Orders Vault Button */}
            <button
              onClick={() => {
                setActivePage('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-sm cursor-pointer border ${
                activePage === 'orders'
                  ? 'bg-[#143628] text-white border-[#C5A86A] ring-2 ring-[#C5A86A]/40 shadow-md scale-105'
                  : 'bg-[#143628] hover:bg-[#1F4D3B] text-[#FAF7F0] border-[#C5A86A] hover:shadow-md'
              }`}
              title="Store Orders Vault (Protected Administrator Portal)"
              aria-label="Open Store Orders Vault"
            >
              <div className="w-5 h-5 rounded-md bg-[#C5A86A] text-[#0F281D] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-[11px] sm:text-xs tracking-wider whitespace-nowrap text-[#FAF7F0]">
                ORDERS VAULT
              </span>
              {orders.length > 0 ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-extrabold bg-[#C5A86A] text-[#0F281D] shadow-xs">
                  {orders.length}
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-white/20 text-white/90">
                  🔒
                </span>
              )}
            </button>



            {/* Search Icon */}
            <button
              onClick={openSearch}
              className="p-2 sm:p-2.5 rounded-lg text-[#182920] hover:text-[#143628] hover:bg-[#E8F0EC] transition-colors cursor-pointer"
              aria-label="Search Fragrances"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account Icon */}
            <button
              onClick={openAccount}
              className="p-2 sm:p-2.5 rounded-lg text-[#182920] hover:text-[#143628] hover:bg-[#E8F0EC] transition-colors cursor-pointer"
              aria-label="Customer Account Profile"
              title="Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-lg text-[#182920] hover:text-[#143628] hover:bg-[#E8F0EC] transition-colors cursor-pointer"
              aria-label={`Wishlist, ${wishlistCount} items`}
              title="Saved Attars"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#143628] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon with Item Count */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-lg text-[#182920] hover:text-[#143628] hover:bg-[#E8F0EC] transition-colors cursor-pointer"
              aria-label={`View Shopping Cart, ${totalQuantity} items`}
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C5A86A] text-[#0F281D] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Mobile / Split-View Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-[#182920] hover:text-[#143628] hover:bg-[#E8F0EC] transition-colors ml-1 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile / Responsive Navigation Drawer with Ivory & Forest Green Palette */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#FAF7F0] border-t border-[#D5CEBF] px-6 py-5 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
            {/* Drawer Brand Header with Logo */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#D5CEBF]">
              <div className="w-[72px] h-[72px] sm:w-[90px] sm:h-[90px] rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-[#143628] via-[#C5A86A] to-[#143628] ring-2 ring-[#C5A86A] shadow-md flex-shrink-0 bg-white">
                <img src={BRAND_CONFIG.logoImage} alt={BRAND_CONFIG.brandName} className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-[#143628] block leading-tight">
                  {BRAND_CONFIG.brandName}
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#7A664F] font-bold uppercase block mt-0.5">
                  ✦ Royal Heritage Perfumery ✦
                </span>
              </div>
            </div>

            {navItems.map((item, index) => (
              <button
                key={`mobile-${item.label}-${index}`}
                onClick={() => handleNavClick(item)}
                className="block w-full text-left py-2.5 text-xs font-bold uppercase tracking-wider text-[#182920] hover:text-[#143628] transition-colors border-b border-[#D5CEBF]/60 cursor-pointer"
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => {
                setActivePage('orders');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 text-xs font-bold uppercase tracking-wider text-[#143628] transition-colors flex items-center justify-between cursor-pointer border-b border-[#D5CEBF]/60"
            >
              <span>STORE ORDERS DASHBOARD</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#143628] text-[#FAF7F0] font-bold">
                {orders.length}
              </span>
            </button>



            <div className="pt-3">
              <button
                onClick={() => {
                  onSelectNavCategory('All');
                  setActivePage('collection');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 text-xs font-bold tracking-widest uppercase rounded-lg bg-[#143628] text-[#FAF7F0] hover:bg-[#1F4D3B] transition-colors text-center shadow-sm cursor-pointer"
              >
                EXPLORE ALL ATTARS
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
