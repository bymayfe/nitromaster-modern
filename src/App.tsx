import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ThermalModes } from "./components/ThermalModes";
import { TelemetryGauges } from "./components/TelemetryGauges";
import { FanControl } from "./components/FanControl";
import { KeyboardStudio } from "./components/KeyboardStudio";
import { HardwareSettings } from "./components/HardwareSettings";
import { api, SystemStatus } from "./services/api";
import { AlertCircle } from "lucide-react";
import { Language, translations } from "./i18n/translations";

export function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "fans" | "rgb" | "settings">("dashboard");
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem("nitro_lang") as Language) || "tr";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("nitro_lang", newLang);
  };

  const t = translations[lang];

  // Poll status and telemetry every 1000ms
  useEffect(() => {
    let isMounted = true;

    const poll = async () => {
      const data = await api.getStatus();
      if (isMounted) {
        if (data) {
          setStatus(data);
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      }
    };

    poll();
    const interval = setInterval(poll, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      {/* Top Header with Custom Emblem Logo & Language Switcher */}
      <Header
        status={status}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto p-6 space-y-6 flex-1">
        {/* Connection Alert if Daemon is offline */}
        {!isConnected && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-3 shadow-glow-red text-xs font-mono">
            <AlertCircle className="w-5 h-5 shrink-0 animate-pulse" />
            <span>
              {lang === "tr"
                ? "NitroMaster Köprüsüne bağlanılıyor... Arka plan servisinin 127.0.0.1:16420 üzerinde çalıştığından emin olun."
                : "Connecting to NitroMaster Bridge... Ensure the background daemon is active on 127.0.0.1:16420."}
            </span>
          </div>
        )}

        {/* Tab 1: Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <ThermalModes status={status} lang={lang} />
            <TelemetryGauges status={status} lang={lang} />
          </div>
        )}

        {/* Tab 2: Fan Tuning */}
        {activeTab === "fans" && <FanControl status={status} lang={lang} />}

        {/* Tab 3: RGB Studio */}
        {activeTab === "rgb" && <KeyboardStudio lang={lang} />}

        {/* Tab 4: Hardware Settings */}
        {activeTab === "settings" && <HardwareSettings status={status} lang={lang} />}
      </main>

      {/* Bottom Status Footer */}
      <footer className="glass-panel border-t border-white/5 px-6 py-3 text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
            }`}
          />
          <span>{isConnected ? t.bridgeOnline : t.bridgeOffline}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>GPU: {status?.telemetry.gpu.name || "NVIDIA GeForce RTX 4070"}</span>
          <span>CPU: {status?.telemetry.system?.cpu_name?.replace("w/ Radeon 780M Graphics", "") || "AMD Ryzen 7 8845HS"}</span>
          <span>OS: {status?.telemetry.system?.os_name || "Linux"}</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
