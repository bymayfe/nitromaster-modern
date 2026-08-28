import React from "react";
import { Cpu, Activity, Disc, Zap, Flame } from "lucide-react";
import { SystemStatus } from "../services/api";

interface TelemetryGaugesProps {
  status: SystemStatus | null;
}

export const TelemetryGauges: React.FC<TelemetryGaugesProps> = ({ status }) => {
  const cpu = status?.telemetry.cpu || { usage: 0, temp: 45, freq_mhz: 2800, model: "AMD Ryzen 7 8845HS" };
  const gpu = status?.telemetry.gpu || {
    name: "NVIDIA GeForce RTX 4070",
    temp: 42,
    power_w: 12,
    clock_mhz: 210,
    mem_clock_mhz: 405,
    vram_used_mb: 1200,
    vram_total_mb: 8192,
    usage: 0,
  };
  const fans = status?.telemetry.fans || { cpu_rpm: 1800, gpu_rpm: 1800 };

  const getTempColor = (temp: number) => {
    if (temp < 55) return "text-emerald-400 border-emerald-500/40 shadow-glow-green";
    if (temp < 75) return "text-amber-400 border-amber-500/40";
    return "text-rose-500 border-rose-500/50 shadow-glow-red";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. CPU Telemetry Card */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider font-display text-white">CPU Telemetry</h3>
              <p className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">{cpu.model}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
            {cpu.freq_mhz} MHz
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
              <span className="text-[10px] font-mono text-slate-400 uppercase">Core Temp</span>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-center text-xs font-mono">
          <div className="bg-black/30 p-2 rounded-lg">
            <p className="text-[10px] text-slate-500 uppercase">Load</p>
            <p className="font-bold text-slate-200">{cpu.usage}%</p>
          </div>
          <div className="bg-black/30 p-2 rounded-lg">
            <p className="text-[10px] text-slate-500 uppercase">Clock</p>
            <p className="font-bold text-slate-200">{(cpu.freq_mhz / 1000).toFixed(2)} GHz</p>
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
              <h3 className="text-xs font-bold uppercase tracking-wider font-display text-white">GPU Telemetry</h3>
              <p className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">RTX 4070 Laptop</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
            <p className="text-[10px] text-slate-500 uppercase">VRAM</p>
            <p className="font-bold text-slate-200">
              {(gpu.vram_used_mb / 1024).toFixed(1)} / {(gpu.vram_total_mb / 1024).toFixed(0)} GB
            </p>
          </div>
          <div className="bg-black/30 p-2 rounded-lg">
            <p className="text-[10px] text-slate-500 uppercase">Core Clock</p>
            <p className="font-bold text-slate-200">{gpu.clock_mhz} MHz</p>
          </div>
        </div>
      </div>

      {/* 3. CPU Fan Tachometer */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Disc className="w-5 h-5 animate-spin" style={{ animationDuration: `${Math.max(0.4, 6000 / (fans.cpu_rpm || 1800))}s` }} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider font-display text-white">CPU Fan 1</h3>
              <p className="text-[10px] font-mono text-slate-400">AeroBlade 3D</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {Math.round((fans.cpu_rpm / 5500) * 100)}% Speed
          </span>
        </div>

        <div className="flex flex-col items-center justify-center my-4">
          <span className="text-3xl font-black font-display text-cyan-400 glow-text-cyan">
            {fans.cpu_rpm}
          </span>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-1">
            RPM TACHOMETER
          </span>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Max Limit:</span>
          <span className="text-slate-300 font-bold">5,500 RPM</span>
        </div>
      </div>

      {/* 4. GPU Fan Tachometer */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Disc className="w-5 h-5 animate-spin" style={{ animationDuration: `${Math.max(0.4, 6000 / (fans.gpu_rpm || 1800))}s` }} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider font-display text-white">GPU Fan 2</h3>
              <p className="text-[10px] font-mono text-slate-400">CoolBoost Dual</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {Math.round((fans.gpu_rpm / 5500) * 100)}% Speed
          </span>
        </div>

        <div className="flex flex-col items-center justify-center my-4">
          <span className="text-3xl font-black font-display text-purple-400 glow-text-purple">
            {fans.gpu_rpm}
          </span>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-1">
            RPM TACHOMETER
          </span>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Max Limit:</span>
          <span className="text-slate-300 font-bold">5,500 RPM</span>
        </div>
      </div>
    </div>
  );
};
