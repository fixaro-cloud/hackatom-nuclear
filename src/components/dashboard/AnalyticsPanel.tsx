import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Zap, AlertTriangle, Battery } from "lucide-react";
import { 
  CandidateSite, 
  calculateEffectivePower,
  DAILY_GENERATION_TARGET,
  yangonHub,
  loadCenters
} from "@/data/smrData";

interface AnalyticsPanelProps {
  selectedSite: CandidateSite | null;
}

export function AnalyticsPanel({ selectedSite }: AnalyticsPanelProps) {
  const powerCalc = selectedSite ? calculateEffectivePower(selectedSite) : null;

  const supplyDemandData = [
    {
      name: "SMR Output",
      value: powerCalc?.deliveredMWh || DAILY_GENERATION_TARGET,
      fill: "hsl(174, 72%, 46%)",
    },
    {
      name: "Yangon Demand",
      value: yangonHub.demandMWh,
      fill: "hsl(45, 93%, 58%)",
    },
  ];

  // Top load centers for comparison
  const topLoadCenters = loadCenters.slice(0, 5).map(lc => ({
    name: lc.name.split(" ")[0],
    demand: lc.demandMWh,
  }));

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="dashboard-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Battery className="w-4 h-4 text-primary" />
            <span className="stat-label">SMR Capacity</span>
          </div>
          <div className="stat-value text-primary">300</div>
          <div className="text-xs text-muted-foreground">MW</div>
        </div>
        
        <div className="dashboard-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="stat-label">Daily Output</span>
          </div>
          <div className="stat-value text-accent">7,200</div>
          <div className="text-xs text-muted-foreground">MWh</div>
        </div>
      </div>

      {/* Supply vs Demand Chart */}
      <div className="dashboard-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Supply vs Yangon Demand
        </h3>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={supplyDemandData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis 
                type="number" 
                tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(222, 47%, 10%)",
                  border: "1px solid hsl(222, 30%, 18%)",
                  borderRadius: "8px",
                  color: "hsl(210, 40%, 96%)",
                }}
                formatter={(value: number) => [`${value.toLocaleString()} MWh`, "Value"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {supplyDemandData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Regional Demand Distribution */}
      <div className="dashboard-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Regional Daily Demand (Top 5)
        </h3>
        
        <div className="space-y-3">
          {topLoadCenters.map((lc, index) => (
            <div key={lc.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">{lc.name}</span>
                <span className="text-sm font-mono text-foreground">
                  {lc.demand.toLocaleString()} MWh
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(lc.demand / yangonHub.demandMWh) * 100}%`,
                    background: index === 0 ? "hsl(45, 93%, 58%)" : "hsl(210, 100%, 50%)"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Summary */}
      {selectedSite && (
        <div className="dashboard-card p-4 border-primary/30">
          <h3 className="text-sm font-semibold text-primary mb-3">
            Strategic Summary
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The <span className="text-foreground font-medium">300MW Russian-designed SMR</span> at{" "}
            <span className="text-accent font-medium">{selectedSite.name}</span> will provide 
            critical baseload power to the <span className="text-primary">Thilawa industrial hub</span>, 
            covering approximately{" "}
            <span className="text-success font-medium">
              {((powerCalc?.deliveredMWh || 0) / yangonHub.demandMWh * 100).toFixed(1)}%
            </span>{" "}
            of Yangon's daily demand.
          </p>
        </div>
      )}
    </div>
  );
}
