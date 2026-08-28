import React, { useState, useRef } from "react";
import { Palette, Sparkles, Sun, Check, ArrowLeftRight, Wand2 } from "lucide-react";
import { api } from "../services/api";
import { Language, translations } from "../i18n/translations";

interface KeyboardStudioProps {
  lang?: Language;
}

export const KeyboardStudio: React.FC<KeyboardStudioProps> = ({ lang = "tr" }) => {
  const t = translations[lang];

  const [activeZone, setActiveZone] = useState<number | "all">("all");
  const [zoneColors, setZoneColors] = useState<Record<number, string>>({
    1: "#ff2e4d",
    2: "#00e5ff",
    3: "#b800ff",
    4: "#00f59b",
  });
  const [brightness, setBrightness] = useState<number>(100);
  const [speed, setSpeed] = useState<number>(5);
  const [direction, setDirection] = useState<number>(1); // 1 = Left to Right, 2 = Right to Left
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
    { id: "static", name: t.effStatic, desc: t.effStaticDesc, icon: "✨" },
    { id: "breathing", name: t.effBreathing, desc: t.effBreathingDesc, icon: "🫁" },
    { id: "neon", name: t.effNeon, desc: t.effNeonDesc, icon: "🌈" },
    { id: "wave", name: t.effWave, desc: t.effWaveDesc, icon: "🌊" },
    { id: "shifting", name: t.effShifting, desc: t.effShiftingDesc, icon: "💫" },
    { id: "zoom", name: t.effZoom, desc: t.effZoomDesc, icon: "🎯" },
    { id: "meteor", name: t.effMeteor, desc: t.effMeteorDesc, icon: "☄️" },
    { id: "twinkling", name: t.effTwinkling, desc: t.effTwinklingDesc, icon: "⭐" },
  ];

  const rgbDebounceTimer = useRef<any>(null);
  const brightnessDebounceTimer = useRef<any>(null);

  const handleColorChange = (hex: string, immediate: boolean = false) => {
    // 1. Instant 0ms UI update
    if (activeZone === "all") {
      setZoneColors({ 1: hex, 2: hex, 3: hex, 4: hex });
    } else {
      setZoneColors((prev) => ({ ...prev, [activeZone]: hex }));
    }

    // 2. Hardware dispatch
    const send = () => {
      if (selectedEffect === "static") {
        api.setRgb(activeZone === "all" ? "all" : String(activeZone), hex, brightness);
      } else {
        api.setEffect(selectedEffect, speed, brightness, hex, direction);
      }
    };

    if (immediate) {
      if (rgbDebounceTimer.current) clearTimeout(rgbDebounceTimer.current);
      send();
    } else {
      if (rgbDebounceTimer.current) clearTimeout(rgbDebounceTimer.current);
      rgbDebounceTimer.current = setTimeout(send, 50);
    }
  };

  const handleBrightnessChange = (val: number) => {
    setBrightness(val);
    if (brightnessDebounceTimer.current) clearTimeout(brightnessDebounceTimer.current);
    brightnessDebounceTimer.current = setTimeout(() => {
      api.setBrightness(val);
    }, 50);
  };

  const handleSpeedChange = (val: number) => {
    setSpeed(val);
    const primaryHex = activeZone === "all" ? zoneColors[1] : zoneColors[activeZone];
    if (selectedEffect !== "static") {
      api.setEffect(selectedEffect, val, brightness, primaryHex, direction);
    }
  };

  const handleDirectionChange = (dir: number) => {
    setDirection(dir);
    const primaryHex = activeZone === "all" ? zoneColors[1] : zoneColors[activeZone];
    if (selectedEffect !== "static") {
      api.setEffect(selectedEffect, speed, brightness, primaryHex, dir);
    }
  };

  const handleEffectSelect = (effId: string) => {
    setSelectedEffect(effId);
    const primaryHex = activeZone === "all" ? zoneColors[1] : zoneColors[activeZone];
    if (effId === "static") {
      api.setRgb("all", primaryHex, brightness);
    } else {
      api.setEffect(effId, speed, brightness, primaryHex, direction);
    }
  };

  const getZoneLabel = (zoneNum: number) => {
    switch (zoneNum) {
      case 1:
        return t.zone1;
      case 2:
        return t.zone2;
      case 3:
        return t.zone3;
      case 4:
        return t.zone4;
      default:
        return `Zone ${zoneNum}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Keyboard 4-Zone Canvas */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display uppercase text-white flex items-center gap-3">
            <Palette className="w-6 h-6 text-purple-400" />
            {t.rgbTitle}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveZone("all")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeZone === "all"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-purple"
                  : "bg-black/30 text-slate-400 hover:text-white"
              }`}
            >
              {t.allZonesBtn}
            </button>
          </div>
        </div>

        {/* Realistic Interactive 4-Zone Keyboard Map */}
        <div className="bg-[#05070a] p-5 rounded-2xl border border-white/10 shadow-inner">
          <p className="text-[11px] font-mono text-slate-400 mb-3 text-center uppercase tracking-wider">
            {t.keyboardHint}
          </p>

          <div className="grid grid-cols-4 gap-3 h-32">
            {[1, 2, 3, 4].map((zoneNum) => {
              const isSelected = activeZone === "all" || activeZone === zoneNum;
              const color = zoneColors[zoneNum];

              return (
                <button
                  key={zoneNum}
                  onClick={() => setActiveZone(zoneNum)}
                  style={{
                    backgroundColor: `${color}18`,
                    borderColor: isSelected ? color : "rgba(255,255,255,0.08)",
                    boxShadow: isSelected ? `0 0 25px ${color}60` : "none",
                  }}
                  className="relative rounded-xl border-2 p-3 flex flex-col justify-between transition-all duration-300 group hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">Zone {zoneNum}</span>
                    <span
                      className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  </div>

                  <div className="text-left text-[11px] font-mono text-slate-300 truncate">
                    {getZoneLabel(zoneNum)}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                    <span>{color.toUpperCase()}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Color Palette & Custom Hex */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preset Palettes & Custom Hex Picker */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <h3 className="text-sm font-bold font-display uppercase text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            {t.paletteTitle}
          </h3>

          <div className="grid grid-cols-7 gap-2">
            {presetColors.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => handleColorChange(preset.hex, true)}
                style={{ backgroundColor: preset.hex }}
                title={preset.name}
                className="w-full aspect-square rounded-xl transition-all duration-200 hover:scale-110 shadow-md border-2 border-white/20 active:scale-95 flex items-center justify-center"
              />
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>{t.customPicker}</span>
              <span className="font-bold text-slate-200">
                {activeZone === "all" ? zoneColors[1] : zoneColors[activeZone]}
              </span>
            </label>
            <input
              type="color"
              value={activeZone === "all" ? zoneColors[1] : zoneColors[activeZone]}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-11 rounded-xl cursor-pointer bg-black/40 border border-white/10 p-1"
            />
          </div>
        </div>

        {/* LED Brightness & Effect Sliders */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <h3 className="text-sm font-bold font-display uppercase text-slate-200 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            {t.slidersTitle}
          </h3>

          {/* Brightness Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>{t.ledBrightness}</span>
              <span className="font-bold text-amber-400">{brightness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={brightness}
              onChange={(e) => handleBrightnessChange(Number(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-black/40 rounded-lg cursor-pointer"
            />
          </div>

          {/* Speed Slider (for animated effects) */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>{t.animSpeed}</span>
              <span className="font-bold text-purple-400">{t.speedLevel} {speed} / 9</span>
            </div>
            <input
              type="range"
              min="1"
              max="9"
              step="1"
              value={speed}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="w-full accent-purple-400 h-2 bg-black/40 rounded-lg cursor-pointer"
            />
          </div>

          {/* Direction Toggle */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
              {t.waveDirection}
            </span>
            <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 gap-1">
              <button
                onClick={() => handleDirectionChange(1)}
                className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                  direction === 1 ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "text-slate-500"
                }`}
              >
                {t.leftToRight}
              </button>
              <button
                onClick={() => handleDirectionChange(2)}
                className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                  direction === 2 ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "text-slate-500"
                }`}
              >
                {t.rightToLeft}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Full Dynamic Lighting Effects Grid */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-display uppercase text-slate-200 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-rose-400" />
            {t.effectsTitle}
          </h3>
          <span className="text-xs font-mono text-slate-500">{t.hardwareController}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {effects.map((eff) => (
            <button
              key={eff.id}
              onClick={() => handleEffectSelect(eff.id)}
              className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between group ${
                selectedEffect === eff.id
                  ? "bg-rose-500/20 text-white border-rose-500/50 shadow-glow-red scale-[1.02]"
                  : "bg-black/30 border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{eff.icon}</span>
                {selectedEffect === eff.id && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/30 text-rose-300 uppercase">
                    {t.activeEffect}
                  </span>
                )}
              </div>
              <div>
                <div className="font-bold text-sm font-display uppercase tracking-wide text-slate-200">
                  {eff.name}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 leading-snug">{eff.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
