import React, { useState } from "react";
import { ShieldCheck, Monitor, Usb, Volume2, Moon, Cpu, CheckCircle, AlertTriangle } from "lucide-react";
import { api, SystemStatus } from "../services/api";

interface HardwareSettingsProps {
  status: SystemStatus | null;
}

export const HardwareSettings: React.FC<HardwareSettingsProps> = ({ status }) => {
  const settings = status?.settings || {};

  const [batteryLimiter, setBatteryLimiter] = useState<boolean>(settings.battery_limiter === "1" || settings.battery_limiter === "true");
  const [lcdOverdrive, setLcdOverdrive] = useState<boolean>(settings.lcd_override === "1" || settings.lcd_override === "true");
  const [usbCharging, setUsbCharging] = useState<boolean>(settings.usb_charging === "1" || settings.usb_charging === "true");
  const [bootSound, setBootSound] = useState<boolean>(settings.boot_animation_sound === "1" || settings.boot_animation_sound === "true");
  const [backlightTimeout, setBacklightTimeout] = useState<boolean>(settings.backlight_timeout === "1" || settings.backlight_timeout === "true");

  const handleToggle = async (key: string, current: boolean, setter: (v: boolean) => void) => {
    const nextVal = !current;
    setter(nextVal);
    await api.sendAction(`set_${key}`, { enabled: nextVal });
  };

  const hardwareToggles = [
    {
      id: "battery_limiter",
      title: "80% Battery Care Mode (Limiter)",
      desc: "Caps charging at 80% to significantly extend lithium-ion battery health and cycle life.",
      icon: ShieldCheck,
      color: "emerald",
      active: batteryLimiter,
      toggle: () => handleToggle("battery_limiter", batteryLimiter, setBatteryLimiter),
    },
    {
      id: "lcd_override",
      title: "165Hz LCD Overdrive (Response Time Boost)",
      desc: "Minimizes panel pixel response time to eliminate ghosting and motion blur in fast gaming.",
      icon: Monitor,
      color: "cyan",
      active: lcdOverdrive,
      toggle: () => handleToggle("lcd_override", lcdOverdrive, setLcdOverdrive),
    },
    {
      id: "usb_charging",
      title: "USB Power-Off Charging",
      desc: "Allows charging external devices (phones, mice) via designated USB ports while laptop is off.",
      icon: Usb,
      color: "amber",
      active: usbCharging,
      toggle: () => handleToggle("usb_charging", usbCharging, setUsbCharging),
    },
    {
      id: "boot_animation_sound",
      title: "Nitro Boot Chime Sound",
      desc: "Enables or mutes the dramatic Acer Nitro sound and logo animation during system POST startup.",
      icon: Volume2,
      color: "rose",
      active: bootSound,
      toggle: () => handleToggle("boot_animation_sound", bootSound, setBootSound),
    },
    {
      id: "backlight_timeout",
      title: "Keyboard Backlight Sleep (30s Idle)",
      desc: "Automatically turns off RGB LEDs after 30 seconds of inactivity to save battery energy.",
      icon: Moon,
      color: "purple",
      active: backlightTimeout,
      toggle: () => handleToggle("backlight_timeout", backlightTimeout, setBacklightTimeout),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold font-display uppercase text-white flex items-center gap-3">
          <Cpu className="w-6 h-6 text-emerald-400" />
          Hardware Features & Battery Optimization
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Direct kernel-level hardware control switches configured for your Acer Nitro 16 motherboard.
        </p>
      </div>

      {/* Switch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hardwareToggles.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="glass-panel p-5 rounded-2xl border border-white/10 flex items-start justify-between gap-4 transition-all hover:bg-white/5"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    item.active ? "bg-emerald-500/20 text-emerald-400 shadow-glow-green" : "bg-black/30 text-slate-500"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>

              {/* Custom Toggle Switch */}
              <button
                onClick={item.toggle}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                  item.active ? "bg-emerald-500 shadow-glow-green" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    item.active ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
