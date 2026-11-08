/**
 * =========================================================================
 * FRAGRANCE PREMIUM - CENTRAL CONFIGURATION SYSTEM
 * =========================================================================
 * You can edit all business information, contact details, payment info,
 * and order dispatch settings here in ONE place.
 */

export const BRAND_CONFIG = {
  // Brand Identity
  brandName: 'FRAGRANCE PREMIUM',
  brandTagline: 'Pure Scents. Eternal Elegance.',
  brandSubtext: 'Premium Attars & Timeless Fragrance',
  establishedYear: '2024',

  // Official Logo & Visual Assets
  logoImage: '/assets/aistudio/LOGO_aa6bfcf3.png',
  heroImage: '/images/hero_attar_showcase_1790950416319.jpg',
  craftImage: '/images/attar_art_deg_craft_1790950451330.jpg',

  // Currency & Pricing Symbol
  currencySymbol: '₹',

  // Free shipping threshold (in INR)
  freeShippingThreshold: 299,
  standardShippingFee: 40,

  // Contact Information
  contact: {
    phone: '+91 8777855462',              // Official Phone / Order Helpline
    mobileNumber: '8777855462',           // 10-digit mobile number
    email: 'nskproject01@gmail.com',      // Dedicated Official Order Gmail
    secondaryEmail: 'nskproject01@gmail.com',
    adminEmails: ['nskproject01@gmail.com'],
    address: 'Artisan Perfumery Arcade, Heritage Boulevard, Mumbai / Kannauj, India',
    businessHours: 'Monday – Saturday: 10:00 AM – 8:00 PM IST',
    supportResponseTime: 'Direct Phone & Instant Gmail Notification',
  },

  // Social Media Links (No WhatsApp)
  socialLinks: {
    instagram: 'https://instagram.com/fragrancepremium',
    facebook: 'https://facebook.com/fragrancepremium',
    youtube: 'https://youtube.com/@fragrancepremium',
  },

  // Payment Configuration
  payments: {
    // 1. UPI Payment details
    upi: {
      upiId: '8777855462@oksbi', // Owner's UPI ID (GPay / PhonePe / Paytm / BHIM)
      payeeName: 'FRAGRANCE PREMIUM',
      qrCodeNote: 'Scan with GPay, PhonePe, Paytm, or any UPI app',
    },

    // 2. Direct Bank Transfer details
    bankTransfer: {
      bankName: 'HDFC Bank',
      accountName: 'FRAGRANCE PREMIUM ENTERPRISES',
      accountNumber: '50200088991122',
      ifscCode: 'HDFC0001234',
      branch: 'Heritage Fragrance Branch',
    },

    // 3. Cash on Delivery (COD) availability
    cashOnDelivery: {
      enabled: true,
      description: 'Pay cash upon delivery at your doorstep.',
    },
  },

  /**
   * =========================================================================
   * ORDER DISPATCH & GMAIL NOTIFICATION INTEGRATION
   * =========================================================================
   * Orders are automatically sent to:
   * - nskproject01@gmail.com (Dedicated Official Inbox)
   */
  orders: {
    autoSendToWhatsApp: false, // WhatsApp disabled per user requirement
    notifyEmails: ['nskproject01@gmail.com'],
  },

  googleForm: {
    // Optional: Only enter if you create a Google Form later
    formUrl: '',
    entryIds: {
      fullName: 'entry.1000001',
      contactNumber: 'entry.1000002',
      deliveryAddress: 'entry.1000003',
      email: 'entry.1000004',
      productsList: 'entry.1000005',
      totalQuantity: 'entry.1000006',
      subtotalPrice: 'entry.1000007',
      grandTotal: 'entry.1000008',
      paymentMethod: 'entry.1000009',
      orderNotes: 'entry.1000010',
    },
  },
};
