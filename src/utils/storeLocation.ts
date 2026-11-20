/**
 * Central Store Location & Distance-Based Delivery Calculator
 * 
 * Official Store Location:
 * Plus Code: WCP3+C4P Chinsurah, West Bengal
 * Coordinates: 22.9038° N, 88.3970° E
 * 
 * Delivery Charge Rule (Strictly per user requirement):
 * - Within 2.0 km in any direction: FREE DELIVERY (₹0)
 * - Beyond 2.0 km range: ₹10 per 500 meters (₹20 per km)
 */

export const STORE_LOCATION = {
  name: 'FRAGRANCE PREMIUM Atelier',
  plusCode: 'WCP3+C4V Sahaganj , Hooghly',
  address: 'WCP3+C4V, Sahaganj, Hooghly District, West Bengal 712104, India',
  lat: 22.93616550890487, 
  lng: 88.40280106369894,
  freeRadiusKm: 2.0,
  ratePer500m: 10,
  googleMapsUrl: 'src="https://maps.app.goo.gl/ZJcCrhc6W77vfKNL7"',
};

/**
 * Calculates straight-line distance in kilometers using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number = STORE_LOCATION.lat,
  lon2: number = STORE_LOCATION.lng
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return parseFloat(dist.toFixed(1));
}

export interface DeliveryCalculation {
  distanceKm: number;
  deliveryFee: number;
  isFree: boolean;
  ruleExplanation: string;
}

/**
 * Calculates the exact delivery fee based on customer distance:
 * - <= 2.0 km: FREE (₹0)
 * - > 2.0 km: ₹10 per 500 meters beyond 2 km
 */
export const calculateDeliveryCharge = (distanceKm: number) => {
  const FREE_RADIUS_KM = 2;
  const RATE_PER_500M = 10;
  const MAX_FEE = 100;

  if (distanceKm <= FREE_RADIUS_KM) {
    return {
      deliveryFee: 0,
      isFree: true,
      ruleExplanation: 'Free delivery within 2 km of our store.',
    };
  }

  const extraKm = distanceKm - FREE_RADIUS_KM;
  const blocksOf500m = Math.ceil(extraKm / 0.5);
  const rawFee = blocksOf500m * RATE_PER_500M;
  const deliveryFee = Math.min(rawFee, MAX_FEE);

  return {
    deliveryFee,
    isFree: false,
    ruleExplanation:
      rawFee > MAX_FEE
        ? 'First 2 km free, then ₹10 per 500 m. Delivery charge is capped at ₹100.'
        : 'First 2 km free, then ₹10 per 500 m.',
  };
};
