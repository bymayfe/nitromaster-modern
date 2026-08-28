import React, { useState } from "react";
import { Disc, Zap, Sliders, ShieldAlert, Link, Unlink } from "lucide-react";
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

  const handleModeChange = async (newMode: "auto" | "max" | "custom") => {
    setMode(newMode);
    if (newMode === "auto") {
      await api.setFans(0, 0);
    } else if (newMode === "max") {
      await api.setFans(100, 100);
      setCpuPercent(100);
      setGpuPercent(100);
    } else {
      await api.setFans(cpuPercent, gpuPercent);
    }
  };

  const handleCpuChange = async (val: number) => {
    setCpuPercent(val);
    if (syncFans) setGpuPercent(val);
    if (mode === "custom") {
      await api.setFans(val, syncFans ? val : gpuPercent);
    }
  };

  const handleGpuChange = async (val: number) => {
    setGpuPercent(val);
    if (syncFans) setCpuPercent(val);
    if (mode === "custom") {
      await api.setFans(syncFans ? val : cpuPercent, val);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display uppercase text-white flex items-center gap-3">
            <Disc className="w-6 h-6 text-cyan-400" />
            AeroBlade 3D Fan Control
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Independently calibrate CPU and GPU fan speeds or lock to maximum thermal performance.
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
            AUTO (DYNAMIC)
          </button>
          <button
            onClick={() => handleModeChange("custom")}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === "custom"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            CUSTOM (MANUAL)
          </button>
          <button
            onClick={() => handleModeChange("max")}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === "max"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-glow-red"
                : "text-slate-400 hover:text-white"
            }`}
          >
            MAX SPEED (100%)
          </button>
        </div>
      </div>

      {/* Fan Sliders & Tachometers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPU Fan Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Disc className="w-6 h-6 animate-spin" style={{ animationDuration: `${Math.max(0.3, 6000 / (fans.cpu_rpm || 1800))}s` }} />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display uppercase text-white">CPU Fan 1</h3>
                <p className="text-xs font-mono text-cyan-400 glow-text-cyan font-bold">{fans.cpu_rpm} RPM</p>
              </div>
            </div>
            <span className="text-lg font-black font-display text-white">{cpuPercent}%</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Silent (0%)</span>
              <span>Balanced (50%)</span>
              <span>Max (100%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              disabled={mode !== "custom"}
              value={cpuPercent}
              onChange={(e) => handleCpuChange(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-black/40 rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>

        {/* GPU Fan Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Disc className="w-6 h-6 animate-spin" style={{ animationDuration: `${Math.max(0.3, 6000 / (fans.gpu_rpm || 1800))}s` }} />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display uppercase text-white">GPU Fan 2</h3>
                <p className="text-xs font-mono text-purple-400 glow-text-purple font-bold">{fans.gpu_rpm} RPM</p>
              </div>
            </div>
            <span className="text-lg font-black font-display text-white">{gpuPercent}%</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Silent (0%)</span>
              <span>Balanced (50%)</span>
              <span>Max (100%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              disabled={mode !== "custom"}
              value={gpuPercent}
              onChange={(e) => handleGpuChange(Number(e.target.value))}
              className="w-full accent-purple-400 h-2 bg-black/40 rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>
      </div>

      {/* Sync Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setSyncFans(!syncFans)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold border transition-all ${
            syncFans
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-glow-cyan"
              : "glass-panel text-slate-400 border-white/10 hover:text-white"
          }`}
        >
          {syncFans ? <Link className="w-4 h-4 text-cyan-400" /> : <Unlink className="w-4 h-4 text-slate-500" />}
          {syncFans ? "FANS LINKED (SYNCHRONIZED)" : "FANS UNLINKED (INDEPENDENT)"}
        </button>
      </div>
    </div>
  );
};
