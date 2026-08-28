import React from "react";
import { VolumeX, Gauge, Flame, Rocket, Leaf } from "lucide-react";
import { api, SystemStatus } from "../services/api";
import { Language, translations } from "../i18n/translations";

interface ThermalModesProps {
  status: SystemStatus | null;
  lang?: Language;
  onProfileChange?: (profile: string) => void;
}

export const ThermalModes: React.FC<ThermalModesProps> = ({
  status,
  lang = "tr",
  onProfileChange,
}) => {
  const t = translations[lang];
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
      name: t.modeQuiet,
      subtitle: lang === "tr" ? "Sessiz Soğutma" : "Silent Cooling",
      desc: t.modeQuietDesc,
      icon: VolumeX,
      color: "blue",
      glow: "border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-blue-500/10 text-blue-400",
      showOnBattery: false,
      showOnAc: true,
      fanSpeed: lang === "tr" ? "Oto / Sessiz" : "Auto / Silent",
      powerProfile: lang === "tr" ? "Düşük TDP" : "Low TDP",
    },
    {
      id: "balanced",
      name: t.modeBalanced,
      subtitle: lang === "tr" ? "Günlük Optimum" : "Optimal Everyday",
      desc: t.modeBalancedDesc,
      icon: Gauge,
      color: "cyan",
      glow: "border-cyan-500/40 shadow-[0_0_20px_rgba(0,229,255,0.3)] bg-cyan-500/10 text-cyan-400",
      showOnBattery: true,
      showOnAc: true,
      fanSpeed: lang === "tr" ? "Dinamik" : "Dynamic",
      powerProfile: lang === "tr" ? "Dengeli" : "Balanced",
    },
    {
      id: "balanced-performance",
      name: t.modePerformance,
      subtitle: lang === "tr" ? "Yüksek FPS Oyun" : "High FPS Gaming",
      desc: t.modePerformanceDesc,
      icon: Flame,
      color: "amber",
      glow: "border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-amber-500/10 text-amber-400",
      showOnBattery: false,
      showOnAc: true,
      fanSpeed: lang === "tr" ? "%75 Hedef" : "75% Target",
      powerProfile: lang === "tr" ? "Yüksek TDP" : "High TDP",
    },
    {
      id: "performance",
      name: t.modeTurbo,
      subtitle: lang === "tr" ? "Maksimum Güç" : "Maximum Power",
      desc: t.modeTurboDesc,
      icon: Rocket,
      color: "rose",
      glow: "border-rose-500/50 shadow-glow-red bg-rose-500/10 text-rose-400",
      showOnBattery: false,
      showOnAc: true,
      fanSpeed: lang === "tr" ? "%100 Maks" : "100% Max",
      powerProfile: lang === "tr" ? "Ekstrem TDP" : "Extreme TDP",
    },
    {
      id: "low-power",
      name: t.modeEco,
      subtitle: lang === "tr" ? "Pil Koruyucu" : "Battery Saver",
      desc: t.modeEcoDesc,
      icon: Leaf,
      color: "emerald",
      glow: "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500/10 text-emerald-400",
      showOnBattery: true,
      showOnAc: false,
      fanSpeed: lang === "tr" ? "Ultra Sessiz" : "Ultra Silent",
      powerProfile: lang === "tr" ? "ECO Güç" : "ECO Power",
    },
  ];

  const handleProfileClick = async (profileId: string) => {
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
          {t.thermalTitle}
        </h2>
        <span className="text-xs font-mono text-slate-400">
          {t.hardwareSwitch}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {visibleModes.map((mode) => {
          const Icon = mode.icon;
          const isActive =
            selectedProfile === mode.id ||
            (mode.id === "performance" && selectedProfile === "turbo") ||
            (mode.id === "low-power" && selectedProfile === "eco");

          return (
            <button
              key={mode.id}
              onClick={() => handleProfileClick(mode.id)}
              className={`p-4 rounded-xl text-left border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
                isActive
                  ? `${mode.glow} scale-[1.02]`
                  : "bg-black/30 border-white/5 hover:border-white/20 text-slate-400 hover:text-white"
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? "bg-white/10" : "bg-black/40 text-slate-400 group-hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/20 text-white">
                      {t.activeBadge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm font-display tracking-wider uppercase text-white">
                  {mode.name}
                </h3>
                <p className="text-[10px] font-mono text-slate-400 mb-2">{mode.subtitle}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">{mode.desc}</p>
              </div>

              {/* Bottom Specs */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>{t.fanTarget}: <strong className="text-slate-300">{mode.fanSpeed}</strong></span>
                <span>{t.tdpTarget}: <strong className="text-slate-300">{mode.powerProfile}</strong></span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
