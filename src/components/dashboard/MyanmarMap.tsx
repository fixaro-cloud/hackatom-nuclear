import { useEffect, type CSSProperties } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { candidateSites, loadCenters, CandidateSite, yangonHub } from "@/data/smrData";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom site marker (red)
const createSiteIcon = (isSelected: boolean, isPreferred: boolean) => L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      width: ${isSelected ? '24px' : '20px'};
      height: ${isSelected ? '24px' : '20px'};
      background: ${isPreferred ? '#f59e0b' : '#ef4444'};
      border: 3px solid ${isSelected ? '#f59e0b' : 'rgba(255,255,255,0.8)'};
      border-radius: 50%;
      box-shadow: 0 0 ${isSelected ? '25px' : '15px'} ${isSelected ? 'rgba(245,158,11,0.8)' : (isPreferred ? 'rgba(245,158,11,0.6)' : 'rgba(239,68,68,0.6)')};
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [isSelected ? 24 : 20, isSelected ? 24 : 20],
  iconAnchor: [isSelected ? 12 : 10, isSelected ? 12 : 10],
});

// Custom city marker (blue)
const createCityIcon = (isPrimary: boolean) => L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      width: ${isPrimary ? '22px' : '16px'};
      height: ${isPrimary ? '22px' : '16px'};
      background: ${isPrimary ? '#3b82f6' : '#60a5fa'};
      border: 2px solid rgba(255,255,255,0.7);
      border-radius: 50%;
      box-shadow: 0 0 ${isPrimary ? '20px' : '10px'} ${isPrimary ? 'rgba(59,130,246,0.7)' : 'rgba(96,165,250,0.5)'};
    "></div>
  `,
  iconSize: [isPrimary ? 22 : 16, isPrimary ? 22 : 16],
  iconAnchor: [isPrimary ? 11 : 8, isPrimary ? 11 : 8],
});

// Map bounds handler
function MapController({ selectedSite }: { selectedSite: CandidateSite | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedSite) {
      map.flyTo([selectedSite.lat, selectedSite.lng], 8, { duration: 1 });
    }
  }, [selectedSite, map]);
  
  return null;
}

const getCityLabelStyle = (priority: number) => {
  const palette = [
    "#f59e0b", // default fallback
    "#f59e0b", // priority 1 (Yangon) - amber
    "#3b82f6", // priority 2
    "#10b981", // priority 3
    "#8b5cf6", // priority 4
    "#ec4899", // priority 5
    "#14b8a6", // priority 6
    "#f97316", // priority 7
  ];

  const color = palette[priority] || palette[0];

  return {
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "0.75rem",
    color: "#0f172a",
    background: `${color}E6`, // add alpha for subtle transparency
    border: "1px solid rgba(15,23,42,0.2)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
  } as CSSProperties;
};

const getSiteLabelStyle = (isPreferred?: boolean): CSSProperties => ({
  display: "inline-block",
  padding: "2px 6px",
  borderRadius: "999px",
  fontWeight: 600,
  fontSize: "0.75rem",
  color: "#fff",
  background: isPreferred ? "rgba(245, 158, 11, 0.9)" : "rgba(239, 68, 68, 0.9)",
  border: "1px solid rgba(15,23,42,0.35)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.45)",
});

interface MyanmarMapProps {
  selectedSite: CandidateSite | null;
  onSiteSelect: (site: CandidateSite) => void;
}

export function MyanmarMap({ selectedSite, onSiteSelect }: MyanmarMapProps) {
  const center: [number, number] = [18.5, 96.5];

  const sagaingFault: [number, number][] = [
    [26.0, 96.3],
    [25.2, 96.0],
    [24.4, 95.8],
    [23.5, 95.6],
    [22.7, 95.6],
    [21.8, 95.6],
    [20.9, 95.7],
    [20.1, 96.0],
    [19.2, 96.3],
    [18.5, 96.6],
    [17.6, 96.9],
    [16.9, 97.2],
    [16.2, 97.5],
  ];

  const kyaukkyanFault: [number, number][] = [
    [24.0, 97.2],
    [23.2, 97.1],
    [22.3, 97.0],
    [21.4, 96.9],
    [20.6, 96.8],
    [19.9, 96.7],
    [19.2, 96.8],
    [18.6, 97.0],
    [18.0, 97.3],
    [17.4, 97.6],
  ];

  const floodZones = [
    {
      id: "delta",
      name: "Ayeyarwady Delta Floodplain",
      coordinates: [
        [17.6, 95.0],
        [17.3, 96.0],
        [16.7, 96.5],
        [16.2, 96.2],
        [16.1, 95.2],
        [16.8, 94.5],
      ] as [number, number][],
    },
    {
      id: "mon",
      name: "Mon State Flood Risk",
      coordinates: [
        [16.9, 97.1],
        [17.4, 97.7],
        [16.8, 98.2],
        [15.9, 98.0],
        [15.7, 97.3],
        [16.4, 96.9],
      ] as [number, number][],
    },
  ];

  // Transmission line from selected site to Yangon
  const transmissionLine = selectedSite ? [
    [selectedSite.lat, selectedSite.lng] as [number, number],
    [yangonHub.lat, yangonHub.lng] as [number, number],
  ] : [];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={6}
        className="w-full h-full rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        
        <MapController selectedSite={selectedSite} />

        {[{ id: "sagaing", name: "Sagaing Fault", coordinates: sagaingFault }, { id: "kyaukkyan", name: "Kyaukkyan Fault", coordinates: kyaukkyanFault }].map(
          (fault) => (
            <Polyline
              key={fault.id}
              positions={fault.coordinates}
              pathOptions={{
                color: fault.id === "sagaing" ? "#f43f5e" : "#f97316",
                weight: 3,
                dashArray: "6, 6",
                opacity: 0.9,
              }}
            >
              <Tooltip
                direction="right"
                offset={[10, 0]}
                opacity={0.95}
                sticky
                permanent
                className="map-label map-label--fault"
              >
                <span className="text-xs font-semibold">
                  {fault.name}
                </span>
              </Tooltip>
            </Polyline>
          )
        )}

        {/* Flood Risk Zones */}
        {floodZones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.coordinates}
            pathOptions={{
              color: "#0ea5e9",
              weight: 1,
              fillColor: "#38bdf8",
              fillOpacity: 0.25,
            }}
          >
            <Tooltip direction="top" opacity={0.95} sticky className="map-label map-label--flood">
              <span className="text-xs font-semibold text-sky-50">{zone.name}</span>
            </Tooltip>
          </Polygon>
        ))}

        {/* Transmission Line */}
        {selectedSite && (
          <Polyline
            positions={transmissionLine}
            pathOptions={{
              color: "#f59e0b",
              weight: 4,
              opacity: 0.8,
              dashArray: "10, 10",
              className: "transmission-pulse",
            }}
          />
        )}

        {/* Load Centers (Cities) */}
        {loadCenters.map((city) => (
          <Marker
            key={city.id}
            position={[city.lat, city.lng]}
            icon={createCityIcon(city.priority === 1)}
          >
            <Tooltip
              direction="top"
              offset={[0, -12]}
              permanent
              opacity={1}
              className="map-label map-label--transparent"
            >
              <span style={getCityLabelStyle(city.priority)}>
                ~{city.name}
              </span>
            </Tooltip>
            <Popup>
              <div className="text-sm">
                <strong className="text-foreground">~{city.name}</strong>
                <br />
                <span className="text-muted-foreground">
                  Demand: {city.demandMWh.toLocaleString()} ± {city.deviationMWh.toLocaleString()} MWh/day
                </span>
                <br />
                <span className="text-muted-foreground">
                  Priority: #{city.priority}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Candidate Sites */}
        {candidateSites.map((site) => (
          <Marker
            key={site.id}
            position={[site.lat, site.lng]}
            icon={createSiteIcon(selectedSite?.id === site.id, site.isPreferred || false)}
            eventHandlers={{
              click: () => onSiteSelect(site),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -12]}
              permanent
              opacity={1}
              className="map-label map-label--transparent"
            >
              <span style={getSiteLabelStyle(site.isPreferred)}>
                {site.name}
              </span>
            </Tooltip>
            <Popup>
              <div className="text-sm">
                <strong className="text-foreground">{site.name}</strong>
                {site.isPreferred && (
                  <span className="ml-2 px-2 py-0.5 bg-success/20 text-success text-xs rounded-full">
                    Preferred
                  </span>
                )}
                <br />
                <span className="text-muted-foreground">
                  Water: {site.water}/10 | Seismic: {site.seismic}
                </span>
                <br />
                <span className="text-xs text-primary cursor-pointer">
                  Click to view details →
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 dashboard-card p-3 z-[1000]">
        <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-energy-amber border-2 border-foreground/50" />
            <span className="text-muted-foreground">Preferred Site</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-energy-red border-2 border-foreground/50" />
            <span className="text-muted-foreground">Candidate Site</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-energy-blue border-2 border-foreground/50" />
            <span className="text-muted-foreground">Load Center</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-energy-amber" style={{ borderStyle: 'dashed' }} />
            <span className="text-muted-foreground">Transmission</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5" style={{ background: '#f43f5e', borderStyle: 'dashed' }} />
            <span className="text-muted-foreground">Sagaing Fault</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5" style={{ background: '#f97316', borderStyle: 'dashed' }} />
            <span className="text-muted-foreground">Kyaukkyan Fault</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded bg-sky-400/50 border border-sky-500" />
            <span className="text-muted-foreground">Flood Risk Zone</span>
          </div>
        </div>
      </div>

      {/* Site Selection Prompt */}
      {!selectedSite && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 dashboard-card px-4 py-2 z-[1000]">
          <p className="text-sm text-muted-foreground">
            Click on a <span className="text-energy-red font-medium">red marker</span> to analyze a candidate site
          </p>
        </div>
      )}
    </div>
  );
}
