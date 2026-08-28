import React, { useState } from "react";
import { Palette, Sparkles, Sun, Flame, Check } from "lucide-react";
import { api } from "../services/api";

export const KeyboardStudio: React.FC = () => {
  const [activeZone, setActiveZone] = useState<number | "all">("all");
  const [zoneColors, setZoneColors] = useState<Record<number, string>>({
    1: "#ff2e4d",
    2: "#00e5ff",
    3: "#b800ff",
    4: "#00f59b",
  });
  const [brightness, setBrightness] = useState<number>(100);
  const [selectedEffect, setSelectedEffect] = useState<string>("static");

  const presetColors = [
    { name: "Nitro Red", hex: "#ff2e4d" },
    { name: "Cyan Ice", hex: "#00e5ff" },
    { name: "Neon Purple", hex: "#b800ff" },
    { name: "Cyber Green", hex: "#00f59b" },
    { name: "Solar Gold", hex: "#ffb703" },
    { name: "Electric Blue", hex: "#3a86ff" },
    { name: "Pure White", hex: "#ffffff" },
  ];

  const effects = [
    { id: "static", name: "Static (Solid)", desc: "Fixed steady color illumination" },
    { id: "breathing", name: "Breathing", desc: "Smooth pulsing brightness glow" },
    { id: "wave", name: "Neon Wave", desc: "Dynamic color transition spectrum" },
    { id: "shifting", name: "Color Shift", desc: "Rhythmic alternating color cycle" },
  ];

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) || 255;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 77;
    return { r, g, b };
  };

  const handleColorChange = async (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    if (activeZone === "all") {
      setZoneColors({ 1: hex, 2: hex, 3: hex, 4: hex });
      await api.setRgb("all", r, g, b, brightness, selectedEffect);
    } else {
      setZoneColors((prev) => ({ ...prev, [activeZone]: hex }));
      await api.setRgb(String(activeZone), r, g, b, brightness, selectedEffect);
    }
  };

  const handleBrightnessChange = async (val: number) => {
    setBrightness(val);
    const primaryHex = activeZone === "all" ? zoneColors[1] : zoneColors[activeZone];
    const { r, g, b } = hexToRgb(primaryHex);
    await api.setRgb(activeZone === "all" ? "all" : String(activeZone), r, g, b, val, selectedEffect);
  };

  return (
    <div className="space-y-6">
      {/* Visual Keyboard 4-Zone Canvas */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display uppercase text-white flex items-center gap-3">
            <Palette className="w-6 h-6 text-purple-400" />
            4-Zone RGB Keyboard Lighting Studio
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveZone("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeZone === "all"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-purple"
                  : "bg-black/30 text-slate-400 hover:text-white"
              }`}
            >
              ALL ZONES
            </button>
          </div>
        </div>

        {/* Realistic Interactive 4-Zone Keyboard Map */}
        <div className="bg-[#05070a] p-4 rounded-2xl border border-white/10 shadow-inner">
          <p className="text-[10px] font-mono text-slate-500 mb-3 text-center uppercase tracking-widest">
            Click a zone on the keyboard to customize individual color
          </p>

          <div className="grid grid-cols-4 gap-2.5 h-32">
            {[1, 2, 3, 4].map((zoneNum) => {
              const isSelected = activeZone === "all" || activeZone === zoneNum;
              const color = zoneColors[zoneNum];

              return (
                <button
                  key={zoneNum}
                  onClick={() => setActiveZone(zoneNum)}
                  style={{
                    backgroundColor: `${color}15`,
                    borderColor: isSelected ? color : "rgba(255,255,255,0.08)",
                    boxShadow: isSelected ? `0 0 20px ${color}50` : "none",
                  }}
                  className={`relative rounded-xl border-2 p-3 flex flex-col justify-between transition-all duration-300 group hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">Zone {zoneNum}</span>
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  </div>

                  <div className="text-left text-[11px] font-mono text-slate-400">
                    {zoneNum === 1 && "WASD / QWER"}
                    {zoneNum === 2 && "Center Left"}
                    {zoneNum === 3 && "Center Right"}
                    {zoneNum === 4 && "Numpad / Enter"}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/5">
                    <span>{color.toUpperCase()}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Color Palette & Effects Studio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preset Palettes & Custom Hex Picker */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <h3 className="text-sm font-bold font-display uppercase text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Color Palette & Hex Studio
          </h3>

          <div className="grid grid-cols-7 gap-2">
            {presetColors.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => handleColorChange(preset.hex)}
                style={{ backgroundColor: preset.hex }}
                title={preset.name}
                className="w-full aspect-square rounded-xl transition-all duration-200 hover:scale-110 shadow-md border-2 border-white/20 active:scale-95 flex items-center justify-center"
              />
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Custom Color Picker:</span>
              <span className="font-bold text-slate-200">
                {activeZone === "all" ? zoneColors[1] : zoneColors[activeZone]}
              </span>
            </label>
            <input
              type="color"
              value={activeZone === "all" ? zoneColors[1] : zoneColors[activeZone]}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer bg-black/40 border border-white/10 p-1"
            />
          </div>
        </div>

        {/* Lighting Effects & Brightness */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <h3 className="text-sm font-bold font-display uppercase text-slate-200 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            Brightness & Effects
          </h3>

          {/* Brightness Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>LED Brightness</span>
              <span className="font-bold text-amber-400">{brightness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={brightness}
              onChange={(e) => handleBrightnessChange(Number(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-black/40 rounded-lg cursor-pointer"
            />
          </div>

          {/* Effect Selector */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
            {effects.map((eff) => (
              <button
                key={eff.id}
                onClick={() => setSelectedEffect(eff.id)}
                className={`p-3 rounded-xl text-left border text-xs font-mono transition-all ${
                  selectedEffect === eff.id
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-glow-purple"
                    : "bg-black/30 border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <div className="font-bold">{eff.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{eff.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
