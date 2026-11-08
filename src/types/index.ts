export type FragranceFamily =
  | 'Oud'
  | 'Floral'
  | 'Woody'
  | 'Musk'
  | 'Amber'
  | 'Fresh'
  | 'Sweet'
  | 'Strong';

export interface SizeOption {
  ml: number;
  label?: string; // e.g. "5ml Pocket Flacon", "10ml Pure Flacon", "30ml Royal Crystal"
  price: number;
  inStock?: boolean;
}

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: FragranceFamily;
  tagline: string;
  description: string;
  longDescription?: string;
  image: string;
  secondaryImage?: string;
  sizes: SizeOption[];
  notes: FragranceNotes;
  longevity: string; // e.g. "12-18 Hours"
  sillage: string;   // e.g. "Intense" | "Moderate" | "Radiant"
  intensity: number; // 1-5
  alcoholFree: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  rating: number;
  reviewCount: number;
  defaultMl?: number;
  variantType?: 'Pure Attar Oil' | 'Artisan Spray';
  priceRack?: '40' | '50' | '60' | '100' | '140' | '200';
  boxPackNotice?: string;
  specialBadge?: string;
  packagingType?: 'tin' | 'box';
  packagingLabel?: string;
  boxPieces?: 6 | 10 | 12 | 20;
  brandId?: string;
  brandName?: string;
}

export interface AttarBrand {
  id: string;
  name: string;
  tagline: string;
  origin: string;
  established: string;
  description: string;
  specialty: string;
  popularScents: string[];
  formats: string[];
  priceRacks: string;
  purityBadge: string;
  accentColor: string;
  emblemIcon: string;
  highlights: string[];
}

export interface CartItem {
  id: string; // unique item id: `${productId}-${ml}-${variant}`
  productId: string;
  name: string;
  image: string;
  category: FragranceFamily;
  ml: number;
  variant: 'Pure Attar Oil' | 'Artisan Spray';
  unitPrice: number;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  phoneVerified?: boolean;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  orderNotes?: string;
  distanceKm?: number;
  deliveryFeeExplanation?: string;
}

export type PaymentMethod = 'cod' | 'upi' | 'bank_transfer';

export interface Order {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  status: 'Received' | 'Processing' | 'Dispatched' | 'Delivered';
  distanceKm?: number;
  adminNotes?: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  city?: string;
  productName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
}

export type ActivePage =
  | 'home'
  | 'guide'
  | 'collection'
  | 'checkout'
  | 'about'
  | 'reviews'
  | 'contact'
  | 'order-details'
  | 'order-success'
  | 'orders'
  | 'brands';
