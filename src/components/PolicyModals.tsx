import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';
import { BRAND_CONFIG } from '../config/config';

export type PolicyType = 'shipping' | 'returns' | 'privacy' | 'terms' | null;

interface PolicyModalsProps {
  policyType: PolicyType;
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalsProps> = ({ policyType, onClose }) => {
  if (!policyType) return null;

  const contentMap: Record<
    Exclude<PolicyType, null>,
    { title: string; icon: React.ComponentType<{ className?: string }>; content: React.ReactNode }
  > = {
    shipping: {
      title: 'Shipping & Delivery Policy',
      icon: Truck,
      content: (
        <div className="space-y-3.5 text-xs sm:text-sm text-[#30272A] leading-relaxed">
          <p>
            At <strong className="text-[#591D2B] font-semibold">{BRAND_CONFIG.brandName}</strong>, we take extreme care in packaging your artisanal attar flacons in crush-proof, padded packaging to ensure pristine delivery.
          </p>
          <h4 className="font-serif font-bold text-[#591D2B] text-sm">Delivery Timelines:</h4>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#30272A]">
            <li><strong>Metro Cities:</strong> 2 to 4 working days</li>
            <li><strong>Rest of India:</strong> 4 to 6 working days</li>
            <li><strong>Dispatch:</strong> All orders are dispatched within 24 hours of order receipt.</li>
          </ul>
          <h4 className="font-serif font-bold text-[#591D2B] text-sm">Shipping Charges:</h4>
          <p>
            Complimentary Free Delivery on all orders above <strong>{BRAND_CONFIG.currencySymbol}{BRAND_CONFIG.freeShippingThreshold}</strong>. For orders below {BRAND_CONFIG.currencySymbol}{BRAND_CONFIG.freeShippingThreshold}, a flat standard shipping fee of <strong>{BRAND_CONFIG.currencySymbol}{BRAND_CONFIG.standardShippingFee}</strong> applies.
          </p>
        </div>
      ),
    },
    returns: {
      title: 'Return & Exchange Policy',
      icon: RotateCcw,
      content: (
        <div className="space-y-3.5 text-xs sm:text-sm text-[#30272A] leading-relaxed">
          <p>
            Due to the concentrated, personal, and hygienic nature of pure attars and perfume oils, we do not accept returns on bottles that have been unsealed or used.
          </p>
          <h4 className="font-serif font-bold text-[#591D2B] text-sm">Damaged or Incorrect Items:</h4>
          <p>
            If your product arrives damaged in transit or if you received an incorrect flacon, notify our customer care team by calling (<strong className="text-[#143628]">{BRAND_CONFIG.contact.phone}</strong>) or emailing <strong className="text-[#143628]">{BRAND_CONFIG.contact.email}</strong> within 48 hours of delivery with photo proof. We will immediately dispatch a fresh replacement free of charge.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      icon: ShieldCheck,
      content: (
        <div className="space-y-3.5 text-xs sm:text-sm text-[#30272A] leading-relaxed">
          <p>
            We respect your privacy. Any customer information submitted (name, address, telephone number, and payment preference) is strictly used for order processing, logistics delivery, and direct order communication.
          </p>
          <p>
            We never sell, rent, or lease customer records to any third-party marketing brokers.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      content: (
        <div className="space-y-3.5 text-xs sm:text-sm text-[#30272A] leading-relaxed">
          <p>
            By ordering from <strong className="text-[#591D2B] font-semibold">{BRAND_CONFIG.brandName}</strong>, you agree to our terms of service. All prices are listed in Indian Rupees (₹) and include applicable taxes.
          </p>
          <p>
            Attars are concentrated fragrant oils intended solely for external application on skin and clothing. Keep away from eyes and out of reach of children.
          </p>
        </div>
      ),
    },
  };

  const current = contentMap[policyType];
  const Icon = current.icon;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#30272A]/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full border border-[#DED1BE] p-6 sm:p-7 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200 text-[#30272A]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#6B6258] hover:text-[#591D2B] hover:bg-[#F7F0E5] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#DED1BE]/60">
          <div className="w-9 h-9 rounded-xl bg-[#EDE1D0] text-[#591D2B] flex items-center justify-center border border-[#DED1BE]">
            <Icon className="w-5 h-5 text-[#591D2B]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#591D2B]">
            {current.title}
          </h3>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {current.content}
        </div>

        <div className="pt-4 border-t border-[#DED1BE]/60 mt-4 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#591D2B] hover:bg-[#713142] text-white transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
