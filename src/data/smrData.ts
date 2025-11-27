// Global Constants
export const SMR_CAPACITY_MW = 300;
export const DAILY_GENERATION_TARGET = 7200; // 300MW * 24h

// Candidate Sites (Supply Side)
export interface EconomicFactor {
  title: string;
  description: string;
  icon: "MapPin" | "Handshake" | "Factory" | "Zap" | "Shield";
  color: "accent" | "primary" | "success" | "warning";
}

export interface CandidateSite {
  id: string;
  name: string;
  lat: number;
  lng: number;
  water: number; // 1-10 scale
  seismic: "Low" | "Moderate" | "Moderate-High" | "High";
  partnership?: string;
  description: string;
  isPreferred?: boolean;
  economicFactors?: EconomicFactor[];
}

export const candidateSites: CandidateSite[] = [
  {
    id: "dawei",
    name: "Dawei",
    lat: 14.08,
    lng: 98.20,
    water: 10,
    seismic: "Low",
    partnership: "Russia-Myanmar G2G",
    description: "Strategic SEZ & Deep Sea Port. High cooling capacity. Ideal for industrial baseload.",
    isPreferred: true,
    economicFactors: [
      {
        title: "Dawei Special Economic Zone (SEZ)",
        description: "Strategic deep-sea port with industrial infrastructure",
        icon: "MapPin",
        color: "accent",
      },
      {
        title: "Russian Technology Partnership",
        description: "G2G agreement for SMR technology transfer",
        icon: "Handshake",
        color: "primary",
      },
      {
        title: "Regional Power Export Hub",
        description: "Potential to export excess power to neighboring countries via grid connections",
        icon: "Zap",
        color: "success",
      },
      {
        title: "Government Investment Priority",
        description: "High-level government support and priority for infrastructure development",
        icon: "Shield",
        color: "accent",
      },
    ],
  },
  {
    id: "ye",
    name: "Ye",
    lat: 15.25,
    lng: 97.85,
    water: 8,
    seismic: "Moderate",
    description: "Good coastal access but lacks Dawei's SEZ infrastructure.",
    economicFactors: [
      {
        title: "Coastal Access",
        description: "Direct access to Andaman Sea for cooling and logistics",
        icon: "MapPin",
        color: "primary",
      },
      {
        title: "Lower Land Costs",
        description: "More affordable land acquisition compared to major cities",
        icon: "Factory",
        color: "success",
      },
      {
        title: "Growing Port Infrastructure",
        description: "Developing port facilities for industrial development",
        icon: "Zap",
        color: "accent",
      },
    ],
  },
  {
    id: "naypyidaw-site",
    name: "Naypyidaw",
    lat: 19.76,
    lng: 96.07,
    water: 4,
    seismic: "Moderate-High",
    description: "Central location but limited cooling water and higher seismic risk.",
    economicFactors: [
      {
        title: "Central Location",
        description: "Strategic position for power distribution to multiple regions",
        icon: "MapPin",
        color: "primary",
      },
      {
        title: "Government Proximity",
        description: "Close to administrative capital for regulatory oversight",
        icon: "Shield",
        color: "accent",
      },
      {
        title: "Existing Infrastructure",
        description: "Well-developed road and utility networks",
        icon: "Factory",
        color: "success",
      },
    ],
  },
  {
    id: "mawlamyine-site",
    name: "Mawlamyine",
    lat: 16.49,
    lng: 97.63,
    water: 7,
    seismic: "Moderate",
    description: "Existing grid node, but higher population density limits expansion.",
    economicFactors: [
      {
        title: "Existing Grid Connection",
        description: "Already integrated into national power transmission network",
        icon: "Zap",
        color: "primary",
      },
      {
        title: "Established Industrial Base",
        description: "Proven industrial zone with supporting infrastructure",
        icon: "Factory",
        color: "success",
      },
      {
        title: "Proximity to Major Markets",
        description: "Close to Yangon and regional demand centers",
        icon: "MapPin",
        color: "accent",
      },
    ],
  },
];

// Load Centers (Demand Side)
export interface LoadCenter {
  id: string;
  name: string;
  lat: number;
  lng: number;
  demandMWh: number;
  priority: number;
}

export const loadCenters: LoadCenter[] = [
  { id: "yangon", name: "Yangon (Thilawa)", lat: 16.63, lng: 96.27, demandMWh: 3200, priority: 1 },
  { id: "mandalay", name: "Mandalay", lat: 21.98, lng: 96.08, demandMWh: 2035.2, priority: 2 },
  { id: "naypyidaw", name: "Naypyidaw", lat: 19.76, lng: 96.07, demandMWh: 550, priority: 3 },
  { id: "mawlamyine", name: "Mawlamyine", lat: 16.49, lng: 97.63, demandMWh: 120, priority: 4 },
  { id: "bago", name: "Bago", lat: 17.32, lng: 96.47, demandMWh: 100, priority: 5 },
  { id: "pathein", name: "Pathein", lat: 16.78, lng: 94.74, demandMWh: 70, priority: 6 },
  { id: "dawei", name: "Dawei", lat: 14.08, lng: 98.20, demandMWh: 55, priority: 7 },
  { id: "taunggyi", name: "Taunggyi", lat: 20.78, lng: 97.03, demandMWh: 24.167, priority: 8 },
];

// Yangon Hub (primary destination)
export const yangonHub = loadCenters.find(lc => lc.id === "yangon")!;

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate transmission and distribution (T&D) efficiency
// Typical T&D losses: 5-8% depending on distance
// Shorter distances have lower losses (~5%), longer distances have higher losses (~8%)
export function calculateTransmissionEfficiency(distanceKm: number): number {
  // Base loss of 5% for short distances, scaling up to 8% for longer distances
  // Formula: 5% + (distance/1000) * 3% with a cap at 8%
  const baseLoss = 5;
  const distanceFactor = Math.min((distanceKm / 1000) * 3, 3); // Max additional 3% for very long distances
  const totalLossPercentage = Math.min(baseLoss + distanceFactor, 8); // Cap at 8%
  return Math.max(92, 100 - totalLossPercentage); // Efficiency between 92% and 95%
}

// Calculate effective power delivered to Yangon
export function calculateEffectivePower(site: CandidateSite): {
  distanceKm: number;
  efficiency: number;
  deliveredMWh: number;
  absorbedByYangon: number;
  surplus: number;
} {
  const distanceKm = calculateDistance(site.lat, site.lng, yangonHub.lat, yangonHub.lng);
  const efficiency = calculateTransmissionEfficiency(distanceKm);
  const deliveredMWh = DAILY_GENERATION_TARGET * (efficiency / 100);
  
  // Calculate how much power Yangon can absorb (limited by its demand)
  const absorbedByYangon = Math.min(deliveredMWh, yangonHub.demandMWh);
  const surplus = Math.max(0, deliveredMWh - yangonHub.demandMWh);

  return {
    distanceKm: Math.round(distanceKm),
    efficiency: Math.round(efficiency * 10) / 10,
    deliveredMWh: Math.round(deliveredMWh),
    absorbedByYangon: Math.round(absorbedByYangon),
    surplus: Math.round(surplus),
  };
}

// Get seismic risk color
export function getSeismicColor(seismic: CandidateSite["seismic"]): string {
  switch (seismic) {
    case "Low": return "text-success";
    case "Moderate": return "text-warning";
    case "Moderate-High": return "text-energy-amber";
    case "High": return "text-destructive";
    default: return "text-muted-foreground";
  }
}

// Get water availability level
export function getWaterLevel(water: number): { label: string; color: string } {
  if (water >= 9) return { label: "Excellent", color: "text-success" };
  if (water >= 7) return { label: "Good", color: "text-primary" };
  if (water >= 5) return { label: "Moderate", color: "text-warning" };
  return { label: "Limited", color: "text-destructive" };
}
