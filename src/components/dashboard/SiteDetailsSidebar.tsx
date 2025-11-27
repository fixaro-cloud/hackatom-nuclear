import { 
  MapPin, 
  Droplets, 
  Activity, 
  Handshake, 
  Zap, 
  Shield,
  Factory,
  X,
  LucideIcon
} from "lucide-react";
import { 
  CandidateSite, 
  calculateEffectivePower, 
  getSeismicColor, 
  getWaterLevel,
  SMR_CAPACITY_MW,
  DAILY_GENERATION_TARGET
} from "@/data/smrData";

interface SiteDetailsSidebarProps {
  site: CandidateSite | null;
  onClose: () => void;
}

export function SiteDetailsSidebar({ site, onClose }: SiteDetailsSidebarProps) {
  if (!site) return null;

  const powerCalc = calculateEffectivePower(site);
  const waterLevel = getWaterLevel(site.water);

  return (
    <div className="w-96 bg-sidebar border-l border-border h-full overflow-y-auto slide-in-right">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-energy-red shadow-glow-primary" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Candidate Site
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">{site.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {site.lat.toFixed(2)}°N, {site.lng.toFixed(2)}°E
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Strategic Badge */}
        {site.isPreferred && (
          <div className="mt-4">
            <span className="badge-optimal glow-success">
              <Shield className="w-3 h-3 mr-1" />
              Optimal Strategic Choice
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="p-6 border-b border-border">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {site.description}
        </p>
      </div>

      {/* Nuclear Factors */}
      <div className="p-6 border-b border-border">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Nuclear Factors
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Seismic Risk</span>
            <span className={`text-sm font-semibold ${getSeismicColor(site.seismic)}`}>
              {site.seismic}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cooling Source</span>
            <span className="text-sm font-semibold text-primary">
              {site.water >= 8 ? "Andaman Sea" : site.water >= 6 ? "River System" : "Limited"}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Water Availability
              </span>
              <span className={`text-sm font-semibold ${waterLevel.color}`}>
                {waterLevel.label}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${site.water * 10}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Economic Factors */}
      <div className="p-6 border-b border-border">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <Factory className="w-4 h-4" />
          Economic Factors
        </h3>
        
        <div className="space-y-3">
          {site.economicFactors && site.economicFactors.map((factor, index) => {
            const IconComponent: LucideIcon = 
              factor.icon === "MapPin" ? MapPin :
              factor.icon === "Handshake" ? Handshake :
              factor.icon === "Factory" ? Factory :
              factor.icon === "Zap" ? Zap :
              Shield;
            
            const colorClass = 
              factor.color === "accent" ? "text-accent" :
              factor.color === "primary" ? "text-primary" :
              factor.color === "success" ? "text-success" :
              "text-warning";
            
            return (
              <div key={index} className="dashboard-card p-3">
                <div className={`flex items-center gap-2 ${colorClass}`}>
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{factor.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {factor.description}
                </p>
              </div>
            );
          })}
          
          {site.partnership && !site.economicFactors?.some(f => f.title.includes("Partnership")) && (
            <div className="flex items-center gap-2 text-sm">
              <Handshake className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Partnership:</span>
              <span className="font-medium text-foreground">{site.partnership}</span>
            </div>
          )}
        </div>
      </div>

      {/* Transmission Analysis */}
      <div className="p-6">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Transmission to Yangon
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="dashboard-card p-4 text-center">
            <div className="stat-value text-primary">{powerCalc.distanceKm}</div>
            <div className="stat-label">Distance (km)</div>
          </div>
          
          <div className="dashboard-card p-4 text-center">
            <div className="stat-value text-success">{powerCalc.efficiency}%</div>
            <div className="stat-label">T&D Efficiency</div>
          </div>
        </div>

        <div className="mt-4 dashboard-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Generated Power</span>
            <span className="text-sm font-mono text-foreground">{DAILY_GENERATION_TARGET.toLocaleString()} MWh</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">T&D Losses</span>
            <span className="text-sm font-mono text-warning">
              {(DAILY_GENERATION_TARGET - powerCalc.deliveredMWh).toLocaleString()} MWh ({(100 - powerCalc.efficiency).toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Delivered Power</span>
            <span className="text-sm font-mono text-primary">{powerCalc.deliveredMWh.toLocaleString()} MWh</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-primary mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground font-medium">Transmission & Distribution Losses:</span>{" "}
              Approximately {(100 - powerCalc.efficiency).toFixed(1)}% of generated power is lost during transmission 
              and distribution due to electrical resistance in power lines and equipment. Losses increase with distance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
