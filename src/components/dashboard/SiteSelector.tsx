import { MapPin, Check, AlertTriangle } from "lucide-react";
import { candidateSites, CandidateSite, getSeismicColor } from "@/data/smrData";
import { cn } from "@/lib/utils";

interface SiteSelectorProps {
  selectedSite: CandidateSite | null;
  onSiteSelect: (site: CandidateSite) => void;
}

export function SiteSelector({ selectedSite, onSiteSelect }: SiteSelectorProps) {
  return (
    <div className="p-4 border-b border-border">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <MapPin className="w-3 h-3" />
        Quick Select Site
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        {candidateSites.map((site) => (
          <button
            key={site.id}
            onClick={() => onSiteSelect(site)}
            className={cn(
              "p-3 rounded-lg border text-left transition-all duration-200",
              selectedSite?.id === site.id
                ? "border-primary bg-primary/10 glow-primary"
                : "border-border bg-secondary/50 hover:bg-secondary hover:border-primary/50"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                "text-sm font-medium",
                selectedSite?.id === site.id ? "text-primary" : "text-foreground"
              )}>
                {site.name}
              </span>
              {site.isPreferred && (
                <Check className="w-4 h-4 text-success" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={getSeismicColor(site.seismic)}>
                {site.seismic}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Water: {site.water}/10
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedSite && !selectedSite.isPreferred && (
        <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
          <p className="text-xs text-warning">
            Consider Dawei for low seismic risk and SEZ infrastructure.
          </p>
        </div>
      )}
    </div>
  );
}
