import React, { useState, useRef, useCallback } from "react";
import { Disc, Zap, Sliders, ShieldAlert, Link, Unlink, Wind, Gauge } from "lucide-react";
import { api, SystemStatus } from "../services/api";

interface FanControlProps {
  status: SystemStatus | null;
}

export const FanControl: React.FC<FanControlProps> = ({ status }) => {
  const [mode, setMode] = useState<"auto" | "max" | "custom">("auto");
  const [cpuPercent, setCpuPercent] = useState<number>(50);
  const [gpuPercent, setGpuPercent] = useState<number>(50);
  const [syncFans, setSyncFans] = useState<boolean>(true);

  const fans = status?.telemetry.fans || { cpu_rpm: 1800, gpu_rpm: 1800 };
  const debounceTimerRef = useRef<any>(null);

  const sendFanSpeed = useCallback((cpu: number, gpu: number) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      api.setFans(cpu, gpu);
    }, 60);
  }, []);

  const handleModeChange = (newMode: "auto" | "max" | "custom") => {
    setMode(newMode);
    if (newMode === "auto") {
      api.setFans(0, 0);
    } else if (newMode === "max") {
      setCpuPercent(100);
      setGpuPercent(100);
      api.setFans(100, 100);
    } else {
      api.setFans(cpuPercent, gpuPercent);
    }
  };

  const handleCpuChange = (val: number) => {
    setCpuPercent(val);
    const targetGpu = syncFans ? val : gpuPercent;
    if (syncFans) setGpuPercent(val);
    if (mode === "custom") {
      sendFanSpeed(val, targetGpu);
    }
  };

  const handleGpuChange = (val: number) => {
    setGpuPercent(val);
    const targetCpu = syncFans ? val : cpuPercent;
    if (syncFans) setCpuPercent(val);
    if (mode === "custom") {
      sendFanSpeed(targetCpu, val);
    }
  };

  const getSpinDuration = (rpm: number) => {
    if (rpm <= 0) return "0s";
    const dur = Math.max(0.12, Math.min(2.0, 600 / Math.max(rpm, 300)));
    return `${dur}s`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display uppercase text-white flex items-center gap-3">
            <Disc className="w-6 h-6 text-cyan-400" />
            AeroBlade 3D Çift Fan Kalibrasyonu
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            İşlemci (CPU) ve Ekran Kartı (GPU) fan hızlarını gerçek zamanlı kalibre edin veya tam güç kilitleyin.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center bg-black/40 p-1.5 rounded-xl border border-white/5 gap-2">
          <button
            onClick={() => handleModeChange("auto")}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === "auto"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-glow-cyan"
                : "text-slate-400 hover:text-white"
            }`}
          >
            AUTO (Otomatik)
          </button>
          <button
            onClick={() => handleModeChange("max")}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === "max"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-glow-red"
                : "text-slate-400 hover:text-white"
            }`}
          >
            MAX (%100 Turbo)
          </button>
          <button
            onClick={() => handleModeChange("custom")}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === "custom"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-glow-amber"
                : "text-slate-400 hover:text-white"
            }`}
          >
            CUSTOM (Manuel)
          </button>
        </div>
      </div>

      {/* Visual Rotating Dual Turbine Cockpit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPU Turbine Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-glow-cyan">
                <Disc
                  className="w-6 h-6 animate-spin"
                  style={{ animationDuration: getSpinDuration(fans.cpu_rpm) }}
                />
              </div>
              <div>
                <h3 className="text-base font-bold font-display uppercase text-white">CPU Soğutma Fanı</h3>
                <p className="text-xs font-mono text-cyan-400 glow-text-cyan font-bold">
                  {fans.cpu_rpm.toLocaleString()} RPM ({Math.round((fans.cpu_rpm / 5500) * 100)}% Hız)
                </p>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-black/40 text-slate-300 border border-white/10">
              Maks: 5,500 RPM
            </span>
          </div>

          {/* Turbine Visualization Box */}
          <div className="bg-[#05070a] p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center relative shadow-inner">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Progress Outer Ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="68" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="#00e5ff"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={427}
                  strokeDashoffset={427 - (427 * Math.min(100, Math.round((fans.cpu_rpm / 5500) * 100))) / 100}
                  className="transition-all duration-500"
                />
              </svg>

              {/* Animated AeroBlade Turbine Blades */}
              <div
                className="absolute w-28 h-28 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: fans.cpu_rpm > 0 ? "0 0 35px rgba(0, 229, 255, 0.3)" : "none",
                }}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  style={{
                    animation: fans.cpu_rpm > 0 ? `spin ${getSpinDuration(fans.cpu_rpm)} linear infinite` : "none",
                  }}
                >
                  {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => (
                    <path
                      key={deg}
                      d="M 50 50 C 44 34, 56 16, 60 10 C 50 20, 48 35, 50 50 Z"
                      fill="#00e5ff"
                      opacity="0.9"
                      transform={`rotate(${deg} 50 50)`}
                    />
                  ))}
                  <circle cx="50" cy="50" r="14" fill="#05070a" stroke="#00e5ff" strokeWidth="2.5" />
                  <circle cx="50" cy="50" r="5" fill="#00e5ff" />
                </svg>
              </div>
            </div>

            {/* Dynamic Status Readout */}
            <div className="mt-3 text-center">
              <span className="text-2xl font-black font-display text-cyan-400 glow-text-cyan">
                {fans.cpu_rpm.toLocaleString()} RPM
              </span>
              <span className="text-[11px] font-mono text-slate-400 block tracking-widest uppercase mt-0.5">
                {fans.cpu_rpm === 0 ? "0 dB PASİF MOD" : fans.cpu_rpm < 2600 ? "SESSİZ FISILTI MODU" : fans.cpu_rpm < 4300 ? "DİNAMİK SOĞUTMA" : "AERO TURBO GÜÇ"}
              </span>
            </div>
          </div>

          {/* Slider Control */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Manuel CPU Fan Hızı
              </span>
              <span className="font-bold text-cyan-400">%{mode === "custom" ? cpuPercent : mode === "max" ? 100 : Math.round((fans.cpu_rpm / 5500) * 100)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={mode === "custom" ? cpuPercent : mode === "max" ? 100 : Math.round((fans.cpu_rpm / 5500) * 100)}
              onChange={(e) => handleCpuChange(Number(e.target.value))}
              disabled={mode !== "custom"}
              className="w-full accent-cyan-400 h-2 bg-black/40 rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>

        {/* GPU Turbine Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shadow-glow-purple">
                <Disc
                  className="w-6 h-6 animate-spin"
                  style={{ animationDuration: getSpinDuration(fans.gpu_rpm) }}
                />
              </div>
              <div>
                <h3 className="text-base font-bold font-display uppercase text-white">GPU Soğutma Fanı</h3>
                <p className="text-xs font-mono text-purple-400 glow-text-purple font-bold">
                  {fans.gpu_rpm.toLocaleString()} RPM ({Math.round((fans.gpu_rpm / 5500) * 100)}% Hız)
                </p>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-black/40 text-slate-300 border border-white/10">
              Maks: 5,500 RPM
            </span>
          </div>

          {/* Turbine Visualization Box */}
          <div className="bg-[#05070a] p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center relative shadow-inner">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Progress Outer Ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="68" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="#b800ff"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={427}
                  strokeDashoffset={427 - (427 * Math.min(100, Math.round((fans.gpu_rpm / 5500) * 100))) / 100}
                  className="transition-all duration-500"
                />
              </svg>

              {/* Animated AeroBlade Turbine Blades */}
              <div
                className="absolute w-28 h-28 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: fans.gpu_rpm > 0 ? "0 0 35px rgba(184, 0, 255, 0.3)" : "none",
                }}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  style={{
                    animation: fans.gpu_rpm > 0 ? `spin ${getSpinDuration(fans.gpu_rpm)} linear infinite` : "none",
                  }}
                >
                  {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => (
                    <path
                      key={deg}
                      d="M 50 50 C 44 34, 56 16, 60 10 C 50 20, 48 35, 50 50 Z"
                      fill="#b800ff"
                      opacity="0.9"
                      transform={`rotate(${deg} 50 50)`}
                    />
                  ))}
                  <circle cx="50" cy="50" r="14" fill="#05070a" stroke="#b800ff" strokeWidth="2.5" />
                  <circle cx="50" cy="50" r="5" fill="#b800ff" />
                </svg>
              </div>
            </div>

            {/* Dynamic Status Readout */}
            <div className="mt-3 text-center">
              <span className="text-2xl font-black font-display text-purple-400 glow-text-purple">
                {fans.gpu_rpm.toLocaleString()} RPM
              </span>
              <span className="text-[11px] font-mono text-slate-400 block tracking-widest uppercase mt-0.5">
                {fans.gpu_rpm === 0 ? "0 dB PASİF MOD" : fans.gpu_rpm < 2600 ? "SESSİZ FISILTI MODU" : fans.gpu_rpm < 4300 ? "DİNAMİK SOĞUTMA" : "AERO TURBO GÜÇ"}
              </span>
            </div>
          </div>

          {/* Slider Control */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Manuel GPU Fan Hızı
              </span>
              <span className="font-bold text-purple-400">%{mode === "custom" ? gpuPercent : mode === "max" ? 100 : Math.round((fans.gpu_rpm / 5500) * 100)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={mode === "custom" ? gpuPercent : mode === "max" ? 100 : Math.round((fans.gpu_rpm / 5500) * 100)}
              onChange={(e) => handleGpuChange(Number(e.target.value))}
              disabled={mode !== "custom"}
              className="w-full accent-purple-400 h-2 bg-black/40 rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>
      </div>

      {/* Sync Fans Toggle */}
      <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {syncFans ? <Link className="w-5 h-5 text-emerald-400" /> : <Unlink className="w-5 h-5 text-slate-500" />}
          <div>
            <h4 className="text-xs font-bold font-mono text-white">Çift Fanı Senkronize Et (Sync CPU & GPU)</h4>
            <p className="text-[11px] text-slate-400">CPU ve GPU fan hızlarını tek bir kaydırıcıyla kilitli kontrol edin.</p>
          </div>
        </div>
        <button
          onClick={() => setSyncFans(!syncFans)}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            syncFans ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-black/40 text-slate-500"
          }`}
        >
          {syncFans ? "KİLİTLİ (AÇIK)" : "BAĞIMSIZ"}
        </button>
      </div>
    </div>
  );
};
