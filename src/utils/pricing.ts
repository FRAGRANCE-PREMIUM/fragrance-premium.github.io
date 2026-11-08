/**
 * Central Pricing & Discount Calculation Utility
 * 
 * Provides authentic, professional MRP (strikethrough) pricing for all attars.
 * Explicitly fulfills customer requirements:
 * - ₹40 items -> MRP ₹60 (actual ₹40)
 * - ₹60 items -> MRP ₹85 (actual ₹60)
 * - ₹100 items -> MRP ₹140 (actual ₹100)
 * - ₹140 items -> MRP ₹180 (actual ₹140)
 * - ₹200 items -> MRP ₹260 (actual ₹200)
 * - 6-Pcs Box of ₹40 (₹240) -> MRP ₹360 (actual ₹240)
 * - 6-Pcs Box of ₹60 (₹360) -> MRP ₹500 (actual ₹360)
 * - 12-Pcs Box of ₹40 (₹480) -> MRP ₹720 (actual ₹480)
 * - 10-Pcs Box of ₹100 (₹1,000) -> MRP ₹1,400 (actual ₹1,000)
 */

export function getOriginalPrice(sellingPrice: number): number {
  switch (sellingPrice) {
    case 40:
      return 60;
    case 60:
      return 85;
    case 100:
      return 140;
    case 140:
      return 180;
    case 200:
      return 260;
    case 240:
      return 360;
    case 360:
      return 500;
    case 480:
      return 720;
    case 1000:
      return 1400;
    default:
      // Rounded to clean tens
      return Math.round((sellingPrice * 1.35) / 10) * 10;
  }
}
