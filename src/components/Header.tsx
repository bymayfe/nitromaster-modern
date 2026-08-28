import React from "react";
import { Zap, BatteryCharging, Battery, Plug, Cpu, Disc, Palette, Sliders, ShieldCheck } from "lucide-react";
import { SystemStatus } from "../services/api";

interface HeaderProps {
  status: SystemStatus | null;
  activeTab: "dashboard" | "fans" | "rgb" | "settings";
  setActiveTab: (tab: "dashboard" | "fans" | "rgb" | "settings") => void;
}

export const Header: React.FC<HeaderProps> = ({ status, activeTab, setActiveTab }) => {
  const onAc = status?.telemetry.power.on_ac ?? true;
  const batteryPct = status?.telemetry.power.battery_pct ?? 100;
  const currentProfile = status?.settings.thermal_profile?.current || "balanced";

  const getProfileBadge = (profile: string) => {
    switch (profile.toLowerCase()) {
      case "performance":
        return { label: "TURBO", color: "bg-rose-500/20 text-rose-400 border-rose-500/40 glow-text-red" };
      case "balanced-performance":
        return { label: "PERFORMANCE", color: "bg-amber-500/20 text-amber-400 border-amber-500/40" };
      case "balanced":
        return { label: "BALANCED", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 glow-text-cyan" };
      case "quiet":
        return { label: "QUIET", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" };
      case "low-power":
        return { label: "ECO (SAVER)", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 glow-text-green" };
      default:
        return { label: profile.toUpperCase(), color: "bg-slate-500/20 text-slate-300 border-slate-500/40" };
    }
  };

  const badge = getProfileBadge(currentProfile);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Model */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-glow-red">
          <Zap className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-wider font-display uppercase text-white glow-text-red">
              Nitro<span className="text-rose-500">Master</span>
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400">
            {status?.telemetry.system?.full_name || "Acer Nitro"} • {status?.telemetry.system?.os_name || "Linux"}
            {status?.telemetry.system?.bios ? ` (BIOS ${status.telemetry.system.bios})` : ""}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center bg-black/40 p-1.5 rounded-xl border border-white/5 gap-1">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "dashboard"
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-glow-red"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Cpu className="w-4 h-4" />
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab("fans")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "fans"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-glow-cyan"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Disc className="w-4 h-4" />
          Fan Tuning
        </button>

        <button
          onClick={() => setActiveTab("rgb")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "rgb"
              ? "bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-glow-purple"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Palette className="w-4 h-4" />
          RGB Studio
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "settings"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glow-green"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Hardware
        </button>
      </nav>

      {/* System Status Badges */}
      <div className="flex items-center gap-3">
        {/* Active Thermal Badge */}
        <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold ${badge.color}`}>
          {badge.label}
        </div>

        {/* Power Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono">
          {onAc ? (
            <>
              <Plug className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">AC 330W</span>
            </>
          ) : (
            <>
              <Battery className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400">{batteryPct}%</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
