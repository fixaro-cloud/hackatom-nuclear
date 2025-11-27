// Global Constants
export const SMR_CAPACITY_MW = 300;
export const DAILY_GENERATION_TARGET = 7200; // 300MW * 24h

// Candidate Sites (Supply Side)
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
  },
  {
    id: "ye",
    name: "Ye",
    lat: 15.25,
    lng: 97.85,
    water: 8,
    seismic: "Moderate",
    description: "Good coastal access but lacks Dawei's SEZ infrastructure.",
  },
  {
    id: "naypyidaw-site",
    name: "Naypyidaw",
    lat: 19.76,
    lng: 96.07,
    water: 4,
    seismic: "Moderate-High",
    description: "Central location but limited cooling water and higher seismic risk.",
  },
  {
    id: "mawlamyine-site",
    name: "Mawlamyine",
    lat: 16.49,
    lng: 97.63,
    water: 7,
    seismic: "Moderate",
    description: "Existing grid node, but higher population density limits expansion.",
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
  { id: "yangon", name: "Yangon (Thilawa)", lat: 16.63, lng: 96.27, demandMWh: 2062, priority: 1 },
  { id: "mandalay", name: "Mandalay", lat: 21.98, lng: 96.08, demandMWh: 2035.2, priority: 2 },
  { id: "naypyidaw", name: "Naypyidaw", lat: 19.76, lng: 96.07, demandMWh: 120.9, priority: 3 },
  { id: "mawlamyine", name: "Mawlamyine", lat: 16.49, lng: 97.63, demandMWh: 77.5, priority: 4 },
  { id: "bago", name: "Bago", lat: 17.32, lng: 96.47, demandMWh: 62.5, priority: 5 },
  { id: "pathein", name: "Pathein", lat: 16.78, lng: 94.74, demandMWh: 10.66, priority: 6 },
  { id: "taunggyi", name: "Taunggyi", lat: 20.78, lng: 97.03, demandMWh: 24.167, priority: 7 },
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

// Calculate transmission efficiency (3% loss per 100km)
export function calculateTransmissionEfficiency(distanceKm: number): number {
  const lossPercentage = (distanceKm / 100) * 3;
  return Math.max(0, 100 - lossPercentage);
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
  
  // Since Yangon demand (49,511) >> SMR output (7,200), 100% is absorbed
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
