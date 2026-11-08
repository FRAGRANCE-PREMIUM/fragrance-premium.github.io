import { AttarBrand } from '../types';

/**
 * =========================================================================
 * FRAGRANCE PREMIUM - AUTHENTIC BRAND PARTNERS & CURATIONS
 * =========================================================================
 * Fragrance Premium operates as an authorized boutique retailer and curator.
 * We do not own a manufacturing plant; rather, we source 100% original,
 * factory-sealed roll-ons directly from India's most respected attar houses:
 * - AL NUAIM
 * - ALMAS PERFUMES
 * - ARHAM AROMATICS
 * - BASHA PERFUMERY HOUSE
 * - MASCO FRAGRANCES
 * - NIDA FRAGRANCES
 * - ROOHI PERFUMES
 * =========================================================================
 */

export const BRANDS_CURATION_BANNER = '/assets/aistudio/curated_attar_brands_banner.jpg';

export const ATTAR_BRANDS: AttarBrand[] = [
  {
    id: 'al-nuaim',
    name: 'AL NUAIM',
    tagline: 'Pioneers of Budget-Friendly Luxury Roll-Ons',
    origin: 'Mumbai, Maharashtra',
    established: 'Est. c. 2010',
    description:
      'Al Nuaim is one of India’s most celebrated modern fragrance innovators, renowned for revolutionizing pocket-friendly non-alcoholic roll-on attars. Melding French designer notes with oriental oudh and musk, their formulations deliver clean, radiant sillage for daily wear.',
    specialty: 'French-Oriental fusion, sweet gourmand roll-ons, and legendary white oud formulations.',
    popularScents: ['White Oudh', 'Chocolate Musk', 'Musk Tahara', 'Blue Sapphire', '2000 Flowers', 'Figo Black'],
    formats: ['3ml Pocket Flacon', '6ml Roll-On', '8ml Gold Series'],
    priceRacks: '₹60 Pocket Rack · ₹140 Artisanal Rack',
    purityBadge: '100% Non-Alcoholic Concentrated Perfume Oil',
    accentColor: '#C5A059',
    emblemIcon: 'Crown',
    highlights: [
      'Precision stainless steel ball applicator for effortless glide',
      'Ultra-compact 3ml & 6ml leak-proof flacons for pocket convenience',
      'Gentle on skin and completely permissible for daily prayer (Namaz / Salah)',
      '18 to 22+ hours lingering fragrance memory on clothing fabrics',
    ],
  },
  {
    id: 'almas',
    name: 'ALMAS PERFUMES',
    tagline: 'Heritage Mumbai Attar House Since 1950',
    origin: 'Mumbai, Maharashtra',
    established: 'Est. 1950',
    description:
      'Spanning over seven decades of perfume mastery, Almas Perfumes bridges Kannauj traditional botanical hydrodistillation with contemporary urban sophistication. Famous across India and the Gulf for dense, deeply resinous mukhallats and comforting musk blends.',
    specialty: 'Classical Indian Mukhallats, rich ambery attars, and timeless concentrated bakhoor oils.',
    popularScents: ['Musk Al Oudh', 'White Deeds', 'Majmua 96', 'Yes Sir', 'Ameer Al Oudh', 'Zahra'],
    formats: ['3ml Pocket Flacon', '6ml Classic Glass Flacon', '12ml Velvet Box'],
    priceRacks: '₹60 Pocket Rack · ₹140 Artisanal Rack · ₹200 Masterpieces',
    purityBadge: 'Hydrodistilled Pure Attar Oil · 0% Alcohol',
    accentColor: '#15803D',
    emblemIcon: 'Gem',
    highlights: [
      'Dense oil viscosity creating a protective 24-hour fragrance halo',
      'Natural woods and amber bases that meld intimately with skin temperature',
      'Over 70 years of trusted legacy in Mumbai perfumery bazaars',
      'Rigid luxury presentation boxes protecting pure botanical oils from UV light',
    ],
  },
  {
    id: 'arham',
    name: 'ARHAM AROMATICS',
    tagline: 'Authentic Kannauj Hydrodistillation & Aromatic Excellence',
    origin: 'Kannauj & Jaipur, India',
    established: 'Est. c. 2005',
    description:
      'Rooted in Kannauj—the historic perfume capital of India—Arham Aromatics crafts authentic, deeply calming attars using wood-fired copper degs and deg-bhapka techniques. Known for uncompromised natural botanical purity and serene spiritual musks.',
    specialty: 'Natural sandalwood-infused bases, spiritual prayer attars, and traditional woody florals.',
    popularScents: ['Arabian Nights', 'Kasturi', 'Shamama', 'Pure Sandal', 'Majmua Arham', 'White Musk'],
    formats: ['3ml Pocket Roll-On', '6ml Metallic Canister', '6ml Display Box'],
    priceRacks: '₹60 Pocket Rack · ₹140 Artisanal Rack',
    purityBadge: 'Traditional Copper Deg Distillate · 0% Chemicals',
    accentColor: '#D97706',
    emblemIcon: 'Sun',
    highlights: [
      'Steam-extracted botanical petals blended into aged Indian sandalwood base',
      'Hypoallergenic, alcohol-free formulation safe for sensitive skin',
      'Calming aromatherapeutic benefits for meditation and reflection',
      'Available in airtight cylindrical tin canisters for total travel safety',
    ],
  },
  {
    id: 'basha',
    name: 'BASHA PERFUMERY HOUSE',
    tagline: 'Vintage Fragrance Institution of Eastern India Since 1958',
    origin: 'Kolkata, West Bengal',
    established: 'Est. 1958',
    description:
      'Established in Kolkata in 1958, Basha Perfumery is an iconic fragrance institution celebrated for heavy oriental bases, potent herbal mukhallats, and distinguished barbershop accords. Their intense blends provide unmatched projection and commanding presence.',
    specialty: 'Deep vintage oriental notes, heavy musks, classic barbershop blends, and festive attars.',
    popularScents: ['Majmua Basha', 'Poundse', 'Jinn', 'Fuego Black', 'Best', 'Magnet', 'Zam Zam'],
    formats: ['3ml Precision Roll-On', '6ml Cylindrical Tin Canister'],
    priceRacks: '₹60 Pocket Rack · ₹140 Artisanal Rack',
    purityBadge: 'Heavy-Viscosity Pure Perfume Oil · Uncut & Non-Alcoholic',
    accentColor: '#7F1D1D',
    emblemIcon: 'Shield',
    highlights: [
      'Heritage formulations passed down across three generations of master blenders',
      'Distinctive heavy sillage suited for weddings, festive gatherings, and evenings',
      'Formulated with heavy-gauge cylindrical metallic cans to prevent evaporation',
      'Commanding, assertive masculine and classical unisex bouquets',
    ],
  },
  {
    id: 'masco',
    name: 'MASCO FRAGRANCES',
    tagline: 'Accessible Modern Luxury & Freshness for Everyday Living',
    origin: 'India',
    established: 'Est. c. 2012',
    description:
      'Masco Fragrances specializes in crisp, uplifting, and pocket-friendly attars tailored for the fast-paced modern lifestyle. Combining invigorating marine aquatics with smooth amber and vanilla undertones, their roll-ons keep you energized throughout long working days.',
    specialty: 'Energizing clean aquatics, modern fresh fougères, and sweet chocolate musk roll-ons.',
    popularScents: ['White Firdous', 'Zatax', 'Dark Chocolate', 'White Musk', 'Freshia', 'Signature'],
    formats: ['3ml Pocket Roll-On', '6ml Precision Flacon', '8ml Flacon'],
    priceRacks: '₹60 Pocket Rack · ₹140 Artisanal Rack · ₹200 Masterpieces',
    purityBadge: '100% Skin-Safe Concentrated Oil · 0% Alcohol',
    accentColor: '#0F766E',
    emblemIcon: 'Award',
    highlights: [
      'Ultra-smooth roll-on mechanisms with balanced fragrance release',
      'Refreshing top notes of citrus, mint, and water blossoms that revive the senses',
      'Budget-conscious pricing making luxury fragrance accessible for everyone',
      'Zero burning or skin redness—100% gentle carrier oils',
    ],
  },
  {
    id: 'nida',
    name: 'NIDA FRAGRANCES',
    tagline: 'Contemporary Sweet & Floral Artisanal Distillations',
    origin: 'India',
    established: 'Est. c. 2015',
    description:
      'Nida Fragrances represents the new wave of Indian artisanal perfumery, crafting delicate, graceful, and sweet compositions. From dewy Damascus roses to creamy sweet woods, their blends evoke gentle romance and dignified subtlety.',
    specialty: 'Delicate dewy roses, blooming jasmine, warm creamy sandals, and uplifting feminine/unisex blends.',
    popularScents: ['Hindi Sandal', 'Happy Oud', 'Nida Signature', 'Sweet Rose', 'Jannat-ul-Firdaus'],
    formats: ['3ml Roll-On', '6ml Carton Box Presentation', '9.9ml Royal Flacon'],
    priceRacks: '₹60 Pocket Rack · ₹140 Artisanal Rack',
    purityBadge: 'Botanical Concentrated Oil · 100% Non-Alcoholic',
    accentColor: '#9D174D',
    emblemIcon: 'Flower',
    highlights: [
      'Soft, blooming floral accords that do not overpower enclosed spaces',
      'Artistic rigid paperboard presentation packaging ideal for gifting',
      'Gentle hydrodistilled flower oils that evolve gracefully with skin warmth',
      'Highly popular among connoisseurs who prefer subtle, refined elegance',
    ],
  },
  {
    id: 'roohi',
    name: 'ROOHI PERFUMES',
    tagline: 'Spiritual Elevation & High-Sillage Oriental Mastery',
    origin: 'India',
    established: 'Est. c. 2016',
    description:
      'Roohi Fragrances is acclaimed for producing deep, spiritually elevating attars with exceptional staying power. Utilizing Kashmiri saffron, aged Assam oudh, and natural amber resins, Roohi perfumes are favored by seekers of meditative peace and grand oriental presence.',
    specialty: 'Kashmiri saffron and oud blends, devotional attars, and lingering oriental resin oils.',
    popularScents: ['Kashmiri Oudh', 'Anfasic', 'Darbar', 'Amir', 'Royal Prophecy', 'Jannatul Mawa'],
    formats: ['6ml Cylindrical Tin Canister', '9ml Octagonal Flacon', '20ml Crystal Decanter'],
    priceRacks: '₹140 Artisanal Rack · ₹200 Masterpieces Rack',
    purityBadge: 'Uncut Concentrated Hydrodistillate · 0% Alcohol',
    accentColor: '#854D0E',
    emblemIcon: 'Sparkles',
    highlights: [
      'Uncut concentration that lingers on prayer rugs and clothing for multiple days',
      'Rich amber, saffron, and oudh accords that deepen as the hours pass',
      'Offered in both heavy-duty metallic cans and regal glass flacons',
      '100% permissible for spiritual gatherings, weddings, and sacred moments',
    ],
  },
];

export const getBrandById = (id: string): AttarBrand | undefined => {
  return ATTAR_BRANDS.find((b) => b.id === id);
};
