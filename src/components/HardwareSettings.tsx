import React, { useState } from "react";
import { ShieldCheck, Monitor, Usb, Volume2, Moon, Cpu, CheckCircle } from "lucide-react";
import { api, SystemStatus } from "../services/api";
import { Language, translations } from "../i18n/translations";

interface HardwareSettingsProps {
  status: SystemStatus | null;
  lang?: Language;
}

export const HardwareSettings: React.FC<HardwareSettingsProps> = ({
  status,
  lang = "tr",
}) => {
  const t = translations[lang];
  const settings = status?.settings || {};

  const [batteryLimiter, setBatteryLimiter] = useState<boolean>(
    settings.battery_limiter === "1" || settings.battery_limiter === "true"
  );
  const [lcdOverdrive, setLcdOverdrive] = useState<boolean>(
    settings.lcd_override === "1" || settings.lcd_override === "true"
  );
  const [usbCharging, setUsbCharging] = useState<boolean>(
    settings.usb_charging === "1" || settings.usb_charging === "true"
  );
  const [bootSound, setBootSound] = useState<boolean>(
    settings.boot_animation_sound === "1" || settings.boot_animation_sound === "true"
  );
  const [backlightTimeout, setBacklightTimeout] = useState<boolean>(
    settings.backlight_timeout === "1" || settings.backlight_timeout === "true"
  );

  const handleToggle = async (key: string, current: boolean, setter: (v: boolean) => void) => {
    const nextVal = !current;
    setter(nextVal);
    await api.sendAction(`set_${key}`, { enabled: nextVal });
  };

  const hardwareToggles = [
    {
      id: "battery_limiter",
      title: t.batteryLimiterTitle,
      desc: t.batteryLimiterDesc,
      icon: ShieldCheck,
      color: "emerald",
      active: batteryLimiter,
      toggle: () => handleToggle("battery_limiter", batteryLimiter, setBatteryLimiter),
    },
    {
      id: "lcd_override",
      title: t.lcdOverdriveTitle,
      desc: t.lcdOverdriveDesc,
      icon: Monitor,
      color: "cyan",
      active: lcdOverdrive,
      toggle: () => handleToggle("lcd_override", lcdOverdrive, setLcdOverdrive),
    },
    {
      id: "usb_charging",
      title: t.usbChargingTitle,
      desc: t.usbChargingDesc,
      icon: Usb,
      color: "amber",
      active: usbCharging,
      toggle: () => handleToggle("usb_charging", usbCharging, setUsbCharging),
    },
    {
      id: "boot_animation_sound",
      title: t.bootSoundTitle,
      desc: t.bootSoundDesc,
      icon: Volume2,
      color: "rose",
      active: bootSound,
      toggle: () => handleToggle("boot_animation_sound", bootSound, setBootSound),
    },
    {
      id: "backlight_timeout",
      title: t.backlightTimeoutTitle,
      desc: t.backlightTimeoutDesc,
      icon: Moon,
      color: "purple",
      active: backlightTimeout,
      toggle: () => handleToggle("backlight_timeout", backlightTimeout, setBacklightTimeout),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold font-display uppercase text-white flex items-center gap-3">
          <Cpu className="w-6 h-6 text-amber-400" />
          {t.hwSettingsTitle}
        </h2>
        <p className="text-xs text-slate-400 mt-1">{t.hwSettingsDesc}</p>
      </div>

      {/* Toggles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hardwareToggles.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between gap-4 transition-all hover:border-white/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.active
                        ? `bg-${item.color}-500/20 text-${item.color}-400 border border-${item.color}-500/40`
                        : "bg-black/40 text-slate-500 border border-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-display text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* Switch Button */}
                <button
                  onClick={item.toggle}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative shrink-0 ${
                    item.active ? "bg-rose-500 shadow-glow-red" : "bg-black/60 border border-white/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                      item.active ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-3 border-t border-white/5 text-slate-500">
                <span>{lang === "tr" ? "Durum:" : "State:"}</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    item.active ? "text-emerald-400" : "text-slate-500"
                  }`}
                >
                  {item.active && <CheckCircle className="w-3 h-3" />}
                  {item.active ? (lang === "tr" ? "ETKİN" : "ENABLED") : lang === "tr" ? "KAPALI" : "DISABLED"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
