import React from "react";
import { Cpu, Activity, Disc, Thermometer } from "lucide-react";
import { SystemStatus } from "../services/api";
import { Language, translations } from "../i18n/translations";

interface TelemetryGaugesProps {
  status: SystemStatus | null;
  lang?: Language;
}

const FanTurbineGauge: React.FC<{
  rpm: number;
  color: "cyan" | "purple";
  label: string;
  subLabel: string;
  t: typeof translations["tr"];
}> = ({ rpm, color, label, subLabel, t }) => {
  const isSpinning = rpm > 0;
  const duration = isSpinning ? Math.max(0.12, Math.min(2.0, 600 / Math.max(rpm, 300))) : 0;
  const pct = Math.min(100, Math.round((rpm / 5500) * 100));

  const colorClass =
    color === "cyan"
      ? "text-cyan-400 border-cyan-500/30 glow-text-cyan"
      : "text-purple-400 border-purple-500/30 glow-text-purple";
  const glowShadow =
    color === "cyan" ? "0 0 25px rgba(0, 229, 255, 0.25)" : "0 0 25px rgba(184, 0, 255, 0.25)";

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border border-white/10 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center ${
              color === "cyan" ? "text-cyan-400" : "text-purple-400"
            }`}
          >
            <Disc
              className="w-5 h-5 animate-spin"
              style={{ animationDuration: isSpinning ? `${duration}s` : "0s" }}
            />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-display text-white">{label}</h3>
            <p className="text-[10px] font-mono text-slate-400">{subLabel}</p>
          </div>
        </div>
        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border font-bold ${colorClass}`}>
          %{pct} {t.speed.toUpperCase()}
        </span>
      </div>

      {/* Turbine Centerpiece */}
      <div className="relative my-3 flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Progress circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="52" stroke="rgba(255,255,255,0.05)" strokeWidth="7" fill="none" />
            <circle
              cx="64"
              cy="64"
              r="52"
              stroke="currentColor"
              strokeWidth="7"
              fill="none"
              strokeDasharray={326}
              strokeDashoffset={326 - (326 * pct) / 100}
              className={`transition-all duration-500 ${color === "cyan" ? "text-cyan-400" : "text-purple-400"}`}
            />
          </svg>

          {/* Spinning AeroBlade Turbine SVG */}
          <div
            className="absolute w-20 h-20 rounded-full flex items-center justify-center"
            style={{ boxShadow: isSpinning ? glowShadow : "none" }}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              style={{
                animation: isSpinning ? `spin ${duration}s linear infinite` : "none",
              }}
            >
              {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => (
                <path
                  key={deg}
                  d="M 50 50 C 44 34, 56 16, 60 10 C 50 20, 48 35, 50 50 Z"
                  fill={color === "cyan" ? "#00e5ff" : "#b800ff"}
                  opacity="0.9"
                  transform={`rotate(${deg} 50 50)`}
                />
              ))}
              <circle
                cx="50"
                cy="50"
                r="13"
                fill="#05070a"
                stroke={color === "cyan" ? "#00e5ff" : "#b800ff"}
                strokeWidth="2.5"
              />
              <circle cx="50" cy="50" r="4.5" fill={color === "cyan" ? "#00e5ff" : "#b800ff"} />
            </svg>
          </div>
        </div>

        {/* Live RPM Number */}
        <div className="mt-1 text-center">
          <span
            className={`text-2xl font-black font-display tracking-tight ${
              color === "cyan" ? "text-cyan-400 glow-text-cyan" : "text-purple-400 glow-text-purple"
            }`}
          >
            {rpm.toLocaleString()} RPM
          </span>
        </div>
      </div>

      {/* Dynamic Status Text */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-500">{t.coolingStatus}:</span>
        <span className="text-slate-300 font-bold">
          {rpm === 0
            ? t.statusPassive
            : rpm < 2600
            ? t.statusWhisper
            : rpm < 4300
            ? t.statusDynamic
            : t.statusTurbo}
        </span>
      </div>
    </div>
  );
};

export const TelemetryGauges: React.FC<TelemetryGaugesProps> = ({ status, lang = "tr" }) => {
  const t = translations[lang];
  const telemetry = status?.telemetry;

  const cpu = telemetry?.cpu || { usage: 0, temp: 45, freq_mhz: 3800, model: "AMD Ryzen 7 8845HS" };
  const systemTemp = telemetry?.system_temp || telemetry?.system?.temp || 48;
  const gpu = telemetry?.gpu || {
    name: "NVIDIA GeForce RTX 4070 Laptop",
    temp: 42,
    power_w: 25,
    clock_mhz: 1980,
    mem_clock_mhz: 8000,
    vram_used_mb: 1800,
    vram_total_mb: 8192,
    usage: 12,
  };
  const fans = telemetry?.fans || { cpu_rpm: 1800, gpu_rpm: 1800 };

  const getTempColor = (temp: number) => {
    if (temp < 60) return "text-emerald-400 border-emerald-500/30";
    if (temp < 80) return "text-amber-400 border-amber-500/30";
    return "text-rose-500 border-rose-500/50 glow-text-red";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. CPU Telemetry Card */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider font-display text-white">{t.cpuTelemetry}</h3>
              <p className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                {cpu.model.replace("w/ Radeon 780M Graphics", "")}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
            {cpu.usage}% {t.load}
          </span>
        </div>

        {/* Circular Temp Center */}
        <div className="flex items-center justify-center my-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="46" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={289}
                strokeDashoffset={289 - (289 * Math.min(cpu.temp, 100)) / 100}
                className={`transition-all duration-500 ${getTempColor(cpu.temp).split(" ")[0]}`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black font-display text-white">{cpu.temp}°C</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">CPU Temp</span>
            </div>
          </div>
        </div>

        {/* Bottom Stats with System Temp */}
        <div className="pt-3 border-t border-white/5 grid grid-cols-3 gap-1.5 text-center text-xs font-mono">
          <div className="bg-black/30 p-2 rounded-lg">
            <p className="text-[10px] text-slate-500 uppercase">{t.load}</p>
            <p className="font-bold text-slate-200">{cpu.usage}%</p>
          </div>
          <div className="bg-black/30 p-2 rounded-lg">
            <p className="text-[10px] text-slate-500 uppercase">{t.freq}</p>
            <p className="font-bold text-slate-200">{(cpu.freq_mhz / 1000).toFixed(2)}G</p>
          </div>
          <div className="bg-black/30 p-2 rounded-lg" title="Motherboard & ACPI System Temperature">
            <p className="text-[10px] text-cyan-400 uppercase font-bold">{lang === "tr" ? "Sistem" : "System"}</p>
            <p className="font-bold text-cyan-300">{systemTemp}°C</p>
          </div>
        </div>
      </div>

      {/* 2. GPU Telemetry Card */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider font-display text-white">{t.gpuTelemetry}</h3>
              <p className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">RTX 4070 Laptop</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            {gpu.power_w} W
          </span>
        </div>

        {/* Circular Temp Center */}
        <div className="flex items-center justify-center my-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="46" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={289}
                strokeDashoffset={289 - (289 * Math.min(gpu.temp, 100)) / 100}
                className={`transition-all duration-500 ${getTempColor(gpu.temp).split(" ")[0]}`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black font-display text-white">{gpu.temp}°C</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">GPU Temp</span>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-center text-xs font-mono">
          <div className="bg-black/30 p-2 rounded-lg">
            <p className="text-[10px] text-slate-500 uppercase">{t.vram}</p>
            <p className="font-bold text-slate-200">
              {(gpu.vram_used_mb / 1024).toFixed(1)} / {(gpu.vram_total_mb / 1024).toFixed(0)} GB
            </p>
          </div>
          <div className="bg-black/30 p-2 rounded-lg">
            <p className="text-[10px] text-slate-500 uppercase">{t.coreClock}</p>
            <p className="font-bold text-slate-200">{gpu.clock_mhz} MHz</p>
          </div>
        </div>
      </div>

      {/* 3. CPU Fan Tachometer with Rotating AeroBlade Turbine */}
      <FanTurbineGauge
        rpm={fans.cpu_rpm}
        color="cyan"
        label={t.cpuFan}
        subLabel={t.aerobladeMetal}
        t={t}
      />

      {/* 4. GPU Fan Tachometer with Rotating AeroBlade Turbine */}
      <FanTurbineGauge
        rpm={fans.gpu_rpm}
        color="purple"
        label={t.gpuFan}
        subLabel={t.coolboostDual}
        t={t}
      />
    </div>
  );
};
