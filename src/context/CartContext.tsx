import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product, Order } from '../types';
import { calculateDistanceKm, STORE_LOCATION } from '../utils/storeLocation';

const CART_STORAGE_KEY = 'fragrance_premium_cart_v2';
const ORDERS_STORAGE_KEY = 'fragrance_premium_orders_v2';
const USER_DISTANCE_KEY = 'fragrance_user_distance_km';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    ml: number,
    variant?: 'Pure Attar Oil' | 'Artisan Spray',
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemSize: (itemId: string, newMl: number, product: Product) => void;
  clearCart: () => void;
  subtotal: number;
  totalQuantity: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;
  feedbackNotification: string | null;
  triggerNotification: (msg: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: 'Received' | 'Processing' | 'Dispatched' | 'Delivered') => void;
  updateOrderAdminNotes: (orderId: string, notes: string) => void;
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;
  // Top Notification Popup on Add to Bag
  topPopupItem: CartItem | null;
  isTopPopupVisible: boolean;
  closeTopPopup: () => void;
  // Store Geolocation & Distance from Chinsurah Store
  userDistanceKm: number | null;
  locationStatus: 'detecting' | 'detected' | 'denied' | 'idle';
  requestGeolocation: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      // Default demo order so store owner immediately sees how the manager looks
      return [
        {
          orderId: 'FP-2026-9021',
          createdAt: new Date().toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          items: [
            {
              id: 'freshia-9.9-Pure Attar Oil',
              productId: 'freshia',
              name: 'Freshia',
              image: '/assets/aistudio/freshia_al_nuaim_1a957173.webp',
              category: 'Fresh',
              ml: 9.9,
              variant: 'Pure Attar Oil',
              unitPrice: 200,
              quantity: 1,
            },
            {
              id: 'hajre-aswad-6-Pure Attar Oil',
              productId: 'hajre-aswad',
              name: 'Hajre Aswad',
              image: '/images/al_nuaim_hajre_aswad.jpeg',
              category: 'Amber',
              ml: 6,
              variant: 'Pure Attar Oil',
              unitPrice: 140,
              quantity: 1,
            },
          ],
          customer: {
            fullName: 'Zameer Akhtar',
            phone: '9876543210',
            email: 'zameer@example.com',
            address: '402, Royal Boulevard, Jubilee Hills',
            city: 'Hyderabad',
            state: 'Telangana',
            pinCode: '500033',
            orderNotes: 'Call before delivery please',
          },
          paymentMethod: 'upi',
          subtotal: 340,
          shippingFee: 0,
          grandTotal: 340,
          status: 'Received',
        },
      ];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [feedbackNotification, setFeedbackNotification] = useState<string | null>(null);

  // Top Popup notification on Add to Bag
  const [topPopupItem, setTopPopupItem] = useState<CartItem | null>(null);
  const [isTopPopupVisible, setIsTopPopupVisible] = useState(false);

  // Geolocation & Distance State (WCP3+C4P Chinsurah, West Bengal)
  const [userDistanceKm, setUserDistanceKm] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(USER_DISTANCE_KEY);
      return saved ? parseFloat(saved) : null;
    } catch {
      return null;
    }
  });
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'detected' | 'denied' | 'idle'>('idle');

  // Request browser geolocation and compute distance from Chinsurah store
  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = calculateDistanceKm(latitude, longitude);
        setUserDistanceKm(dist);
        setLocationStatus('detected');
        try {
          localStorage.setItem(USER_DISTANCE_KEY, dist.toString());
        } catch {
          // safe fallback
        }
      },
      (err) => {
        console.warn('Geolocation prompt response:', err.message);
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // Auto-request location immediately when visitor enters website
  useEffect(() => {
    requestGeolocation();
  }, [requestGeolocation]);

  // Handle remote status updates from Gmail one-click action links: ?action=set_status&orderId=...&status=...
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      const orderId = params.get('orderId');
      const statusParam = params.get('status') as Order['status'] | null;

      if (action === 'set_status' && orderId && statusParam) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status: statusParam } : o))
        );
        triggerNotification(`Order #${orderId} marked as ${statusParam}`);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      // safe fallback
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // safe fallback
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // safe fallback
    }
  }, [orders]);

  const triggerNotification = (msg: string) => {
    setFeedbackNotification(msg);
    setTimeout(() => {
      setFeedbackNotification((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const closeTopPopup = () => {
    setIsTopPopupVisible(false);
  };

  const addToCart = (
    product: Product,
    ml: number,
    variant: 'Pure Attar Oil' | 'Artisan Spray' = 'Pure Attar Oil',
    quantity = 1
  ) => {
    const sizeConfig = product.sizes.find((s) => s.ml === ml) || product.sizes[0];
    const unitPrice = sizeConfig ? sizeConfig.price : 80;
    const itemId = `${product.id}-${ml}-${variant}`;

    let addedCartItem: CartItem;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const next = [...prevItems];
        addedCartItem = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        next[existingIndex] = addedCartItem;
        return next;
      }
      addedCartItem = {
        id: itemId,
        productId: product.id,
        name: product.name,
        image: product.image,
        category: product.category,
        ml,
        variant,
        unitPrice,
        quantity,
      };
      return [...prevItems, addedCartItem];
    });

    // Immediate Top Popup showing items in cart, cancel ability, and Place Order button!
    setTopPopupItem({
      id: itemId,
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      ml,
      variant,
      unitPrice,
      quantity,
    });
    setIsTopPopupVisible(true);

    triggerNotification(`Added ${product.name} (${ml}ml) to your Order Bag`);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    if (topPopupItem && topPopupItem.id === itemId) {
      setIsTopPopupVisible(false);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const updateItemSize = (itemId: string, newMl: number, product: Product) => {
    const sizeConfig = product.sizes.find((s) => s.ml === newMl);
    if (!sizeConfig) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newId = `${item.productId}-${newMl}-${item.variant}`;
          return {
            ...item,
            id: newId,
            ml: newMl,
            unitPrice: sizeConfig.price,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setIsTopPopupVisible(false);
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (
    orderId: string,
    status: 'Received' | 'Processing' | 'Dispatched' | 'Delivered'
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );
  };

  const updateOrderAdminNotes = (orderId: string, adminNotes: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, adminNotes } : o))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
  };

  const clearAllOrders = () => {
    setOrders([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const openProductModal = (product: Product) => setSelectedProduct(product);
  const closeProductModal = () => setSelectedProduct(null);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemSize,
        clearCart,
        subtotal,
        totalQuantity,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        openProductModal,
        closeProductModal,
        lastCompletedOrder,
        setLastCompletedOrder,
        feedbackNotification,
        triggerNotification,
        orders,
        addOrder,
        updateOrderStatus,
        updateOrderAdminNotes,
        deleteOrder,
        clearAllOrders,
        topPopupItem,
        isTopPopupVisible,
        closeTopPopup,
        userDistanceKm,
        locationStatus,
        requestGeolocation,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
