/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AccountModal } from './components/AccountModal';
import { SearchModal } from './components/SearchModal';
import { PolicyModals, PolicyType } from './components/PolicyModals';
import { DownloadZipModal } from './components/DownloadZipModal';

import { HomePage } from './pages/HomePage';
import { AttarGuidePage } from './pages/AttarGuidePage';
import { CollectionPage } from './pages/CollectionPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersDashboardPage } from './pages/OrdersDashboardPage';
import { BrandsPage } from './pages/BrandsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AddToCartTopPopup } from './components/AddToCartTopPopup';

import { ActivePage, Order } from './types';
import { BRAND_CONFIG } from './config/config';
import { ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';

function AppContent() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [collectionCategory, setCollectionCategory] = useState<string>('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [selectedPriceRack, setSelectedPriceRack] = useState<'All' | '40' | '50' | '60' | '100' | '140' | '200'>('All');

  const {
    totalQuantity,
    subtotal,
    selectedProduct,
    closeProductModal,
    openProductModal,
    lastCompletedOrder,
    setLastCompletedOrder,
    feedbackNotification,
  } = useCart();

  const handleFilterCategory = (category: string) => {
    setCollectionCategory(category);
    setActivePage('collection');
  };

  const handleSelectPriceRack = (rack: '40' | '50' | '60' | '100' | '140' | '200') => {
    setSelectedPriceRack(rack);
    if (activePage === 'home') {
      const section = document.getElementById('featured-flacons-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActivePage('collection');
    }
  };

  const handleOrderSuccess = (order: Order) => {
    setLastCompletedOrder(order);
    setActivePage('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#182920] flex flex-col selection:bg-[#143628] selection:text-[#FAF7F0]">
      {/* Instant Add to Bag Top Notification & Direct Order Popup */}
      <AddToCartTopPopup setActivePage={setActivePage} />

      {/* Toast Notification Banner */}
      {feedbackNotification && (
        <div className="fixed top-24 right-4 z-50 bg-[#143628] text-white border border-[#C5A86A]/40 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-250">
          <CheckCircle2 className="w-4 h-4 text-[#C5A86A]" />
          <span>{feedbackNotification}</span>
        </div>
      )}

      {/* Main App Top Navigation Bar */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        openSearch={() => setIsSearchOpen(true)}
        openAccount={() => setIsAccountOpen(true)}
        openDownloadModal={() => setIsDownloadModalOpen(true)}
        onSelectNavCategory={handleFilterCategory}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            onFilterCategory={handleFilterCategory}
            onSelectPriceRack={handleSelectPriceRack}
            initialPriceRack={selectedPriceRack}
          />
        )}

        {activePage === 'guide' && (
          <AttarGuidePage
            setActivePage={setActivePage}
            onFilterCategory={handleFilterCategory}
          />
        )}

        {activePage === 'collection' && (
          <CollectionPage
            initialCategory={collectionCategory}
            initialPriceRack={selectedPriceRack}
            onSelectProduct={openProductModal}
            onSelectPriceRack={handleSelectPriceRack}
          />
        )}

        {(activePage === 'order-details' || activePage === 'checkout' || activePage === 'contact') && (
          <OrderDetailsPage
            setActivePage={setActivePage}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {activePage === 'order-success' && (
          <OrderSuccessPage
            order={lastCompletedOrder}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'orders' && (
          <OrdersDashboardPage
            setActivePage={setActivePage}
          />
        )}

        {(activePage === 'brands' || activePage === 'about') && (
          <BrandsPage
            setActivePage={setActivePage}
            onFilterCategory={handleFilterCategory}
            onSelectPriceRack={handleSelectPriceRack}
          />
        )}

        {activePage === 'reviews' && (
          <ReviewsPage setActivePage={setActivePage} />
        )}
      </main>

      {/* Sticky Mobile Floating Order CTA Bar when Bag has items */}
      {totalQuantity > 0 && activePage !== 'order-details' && activePage !== 'checkout' && activePage !== 'order-success' && (
        <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 px-3 py-2 bg-gradient-to-t from-[#FAF7F0]/95 via-[#FAF7F0]/80 to-transparent pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => setActivePage('order-details')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#143628] hover:bg-[#1B4D39] text-[#FAF7F0] font-semibold text-xs flex items-center justify-between shadow-xl transition-transform active:scale-95 border border-[#C5A86A]/40 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#C5A86A]" />
                <span>{totalQuantity} {totalQuantity === 1 ? 'Attar' : 'Attars'} in Bag</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <span className="tabular-nums">{BRAND_CONFIG.currencySymbol}{subtotal}</span>
                <span className="opacity-60">·</span>
                <span>Place Order</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A86A]" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Footer in Deep Forest Green #0F281D */}
      <Footer
        setActivePage={setActivePage}
        openPolicy={(p) => setActivePolicy(p)}
        openDownloadModal={() => setIsDownloadModalOpen(true)}
      />

      {/* Mobile App Bottom Navigation Bar */}
      <MobileBottomNav
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Global Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={closeProductModal}
        onSelectPriceRack={handleSelectPriceRack}
        onProceedToCheckout={() => {
          closeProductModal();
          setActivePage('order-details');
        }}
      />

      {/* Slide-over Order Bag Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setActivePage('order-details')}
        onExploreCollection={() => setActivePage('collection')}
      />

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer
        onExploreCollection={() => setActivePage('collection')}
      />

      {/* Customer Account / Preferences Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        setActivePage={setActivePage}
      />

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={openProductModal}
      />

      {/* Policy Modals (Shipping, Returns, Privacy, Terms) */}
      <PolicyModals
        policyType={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      {/* Direct Single Files Download & Code Modal */}
      <DownloadZipModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <AppContent />
      </WishlistProvider>
    </CartProvider>
  );
}
