import React from "react";
import { VolumeX, Gauge, Flame, Rocket, Leaf } from "lucide-react";
import { api, SystemStatus } from "../services/api";

interface ThermalModesProps {
  status: SystemStatus | null;
  onProfileChange?: (profile: string) => void;
}

export const ThermalModes: React.FC<ThermalModesProps> = ({ status, onProfileChange }) => {
  const serverProfile = (status?.settings.thermal_profile?.current || "balanced").toLowerCase();
  const [selectedProfile, setSelectedProfile] = React.useState<string>(serverProfile);
  const onAc = status?.telemetry.power.on_ac ?? true;

  React.useEffect(() => {
    if (serverProfile) {
      setSelectedProfile(serverProfile);
    }
  }, [serverProfile]);

  const modes = [
    {
      id: "quiet",
      name: "Quiet",
      subtitle: "Silent Cooling",
      desc: "Minimizes noise, prioritizes battery and cool temperatures.",
      icon: VolumeX,
      color: "blue",
      glow: "border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-blue-500/10 text-blue-400",
      showOnBattery: false,
      showOnAc: true,
      fanSpeed: "Auto / Silent",
      powerProfile: "Low TDP",
    },
    {
      id: "balanced",
      name: "Balanced",
      subtitle: "Optimal Everyday",
      desc: "Perfect equilibrium of system speed and smart dynamic cooling.",
      icon: Gauge,
      color: "cyan",
      glow: "border-cyan-500/40 shadow-[0_0_20px_rgba(0,229,255,0.3)] bg-cyan-500/10 text-cyan-400",
      showOnBattery: true,
      showOnAc: true,
      fanSpeed: "Dynamic",
      powerProfile: "Balanced",
    },
    {
      id: "balanced-performance",
      name: "Performance",
      subtitle: "High FPS Gaming",
      desc: "Boosts CPU/GPU clocks and engages aggressive 75% fan cooling.",
      icon: Flame,
      color: "amber",
      glow: "border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-amber-500/10 text-amber-400",
      showOnBattery: false,
      showOnAc: true,
      fanSpeed: "75% Target",
      powerProfile: "High TDP",
    },
    {
      id: "performance",
      name: "Turbo",
      subtitle: "Maximum Power",
      desc: "Unleashes full 140W RTX 4070 TGP and locks fans to 100% max speed.",
      icon: Rocket,
      color: "rose",
      glow: "border-rose-500/50 shadow-[0_0_25px_rgba(255,46,77,0.4)] bg-rose-500/10 text-rose-400",
      showOnBattery: false,
      showOnAc: true,
      fanSpeed: "100% Max",
      powerProfile: "Extreme TDP",
    },
    {
      id: "low-power",
      name: "ECO Mode",
      subtitle: "Battery Saver",
      desc: "Reduces background power consumption to maximize runtime on battery.",
      icon: Leaf,
      color: "emerald",
      glow: "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500/10 text-emerald-400",
      showOnBattery: true,
      showOnAc: false,
      fanSpeed: "Silent / Off",
      powerProfile: "Eco Power",
    },
  ];

  const handleSelect = async (profileId: string) => {
    setSelectedProfile(profileId);
    await api.setProfile(profileId);
    if (onProfileChange) onProfileChange(profileId);
  };

  const visibleModes = modes.filter((m) => (onAc ? m.showOnAc : m.showOnBattery));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wider font-display uppercase text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          Thermal & Power Profiles
        </h2>
        <span className="text-xs font-mono text-slate-500">
          Hardware Switch: <strong className="text-slate-300">Physical Mode Button</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {visibleModes.map((mode) => {
          const isActive = selectedProfile === mode.id;
          const Icon = mode.icon;

          return (
            <button
              key={mode.id}
              onClick={() => handleSelect(mode.id)}
              className={`relative p-5 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                isActive
                  ? `${mode.glow} border-2 scale-[1.02]`
                  : "glass-panel hover:bg-white/5 border border-white/5 hover:border-white/20 text-slate-400"
              }`}
            >
              {/* Background Glow accent */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity ${
                  isActive ? "opacity-30 bg-current" : "opacity-0 group-hover:opacity-10 bg-white"
                }`}
              />

              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? "bg-white/10 shadow-lg text-white" : "bg-black/30 text-slate-400 group-hover:text-white"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                {isActive && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 uppercase tracking-widest">
                    ACTIVE
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className={`text-lg font-bold font-display uppercase ${isActive ? "text-white" : "text-slate-200"}`}>
                    {mode.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">{mode.subtitle}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">{mode.desc}</p>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Fan: <strong className="text-slate-300">{mode.fanSpeed}</strong></span>
                  <span className="text-slate-500">TDP: <strong className="text-slate-300">{mode.powerProfile}</strong></span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
