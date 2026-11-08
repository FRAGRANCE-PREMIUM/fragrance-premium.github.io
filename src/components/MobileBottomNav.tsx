import React from 'react';
import { Home, Compass, Sparkles, ShoppingBag, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ActivePage } from '../types';

interface MobileBottomNavProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activePage, setActivePage }) => {
  const { totalQuantity, setIsCartOpen, orders } = useCart();

  const navItems = [
    { label: 'HOME', page: 'home' as ActivePage, icon: Home },
    { label: 'GUIDE', page: 'guide' as ActivePage, icon: Compass },
    { label: 'ATTARS', page: 'collection' as ActivePage, icon: Sparkles },
    { label: 'BAG', isBag: true, icon: ShoppingBag },
    { label: 'VAULT', page: 'orders' as ActivePage, icon: Shield, badge: orders.length },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#D5CEBF] px-2 py-1.5 shadow-lg safe-area-pb text-[#182920]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          if (item.isBag) {
            return (
              <button
                key={idx}
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center justify-center py-1 text-[#182920] hover:text-[#143628] active:scale-95 transition-all duration-200 focus:outline-none cursor-pointer"
              >
                <div className="relative">
                  <Icon className="w-5 h-5 text-[#143628] transition-transform group-hover:scale-110" />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#143628] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {totalQuantity}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-bold tracking-wider uppercase mt-1 text-[#182920]">
                  BAG
                </span>
              </button>
            );
          }

          const isActive = activePage === item.page;
          return (
            <button
              key={idx}
              onClick={() => {
                setActivePage(item.page!);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95 focus:outline-none relative cursor-pointer ${
                isActive ? 'text-[#143628]' : 'text-[#7A664F] hover:text-[#143628]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-[#143628] scale-110' : 'text-[#7A664F]'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-[#143628] text-white text-[8px] font-bold px-1 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[9px] font-bold tracking-wider uppercase mt-1 ${isActive ? 'text-[#143628]' : 'text-[#7A664F]'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#143628] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
