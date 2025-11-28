import { Atom, MapPin, BarChart3 } from "lucide-react";
import { loadCenters } from "@/data/smrData";

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
            <Atom className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              SMR Site Selection
            </h1>
            <p className="text-xs text-muted-foreground">
              Myanmar Strategic Analysis Dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">4 Candidate Sites</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BarChart3 className="w-4 h-4 text-accent" />
          <span className="text-muted-foreground">{loadCenters.length} Load Centers</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <span className="text-sm font-semibold text-primary">200 MW</span>
          <span className="text-xs text-muted-foreground ml-1">Fixed Capacity</span>
        </div>
      </div>
    </header>
  );
}
