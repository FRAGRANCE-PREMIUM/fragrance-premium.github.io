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
  plusCode: 'WCP3+C4P Chinsurah, West Bengal',
  address: 'WCP3+C4P, Chinsurah, Hooghly District, West Bengal 712101, India',
  lat: 22.9038,
  lng: 88.3970,
  freeRadiusKm: 2.0,
  ratePer500m: 10,
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=WCP3%2BC4P+Chinsurah%2C+West+Bengal',
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
export function calculateDeliveryCharge(distanceKm: number): DeliveryCalculation {
  if (distanceKm <= STORE_LOCATION.freeRadiusKm) {
    return {
      distanceKm,
      deliveryFee: 0,
      isFree: true,
      ruleExplanation: `Within 2.0 km radius from Chinsurah Store: FREE Delivery (₹0)`,
    };
  }

  const excessKm = distanceKm - STORE_LOCATION.freeRadiusKm;
  const blocksOf500m = Math.ceil((excessKm * 1000) / 500);
  const deliveryFee = blocksOf500m * STORE_LOCATION.ratePer500m;

  return {
    distanceKm,
    deliveryFee,
    isFree: false,
    ruleExplanation: `${distanceKm} km from store (${excessKm.toFixed(1)} km beyond 2 km free radius · ₹10 per 500m = ₹${deliveryFee})`,
  };
}
