import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ThermalModes } from "./components/ThermalModes";
import { TelemetryGauges } from "./components/TelemetryGauges";
import { FanControl } from "./components/FanControl";
import { KeyboardStudio } from "./components/KeyboardStudio";
import { HardwareSettings } from "./components/HardwareSettings";
import { api, SystemStatus } from "./services/api";
import { ShieldCheck, Activity, CheckCircle2, AlertCircle } from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "fans" | "rgb" | "settings">("dashboard");
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);

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
      {/* Top Header */}
      <Header status={status} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto p-6 space-y-6 flex-1">
        {/* Connection Alert if Daemon is offline */}
        {!isConnected && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-3 shadow-glow-red text-xs font-mono">
            <AlertCircle className="w-5 h-5 shrink-0 animate-pulse" />
            <span>
              Connecting to NitroMaster Bridge... Ensure the background daemon is active on <code>127.0.0.1:16420</code>.
            </span>
          </div>
        )}

        {/* Tab 1: Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <ThermalModes status={status} />
            <TelemetryGauges status={status} />
          </div>
        )}

        {/* Tab 2: Fan Tuning */}
        {activeTab === "fans" && <FanControl status={status} />}

        {/* Tab 3: RGB Studio */}
        {activeTab === "rgb" && <KeyboardStudio />}

        {/* Tab 4: Hardware Settings */}
        {activeTab === "settings" && <HardwareSettings status={status} />}
      </main>

      {/* Bottom Status Footer */}
      <footer className="glass-panel border-t border-white/5 px-6 py-3 text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
          <span>DAMX Kernel Bridge: {isConnected ? "ONLINE (Active)" : "OFFLINE"}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>GPU: {status?.telemetry.gpu.name || "NVIDIA GeForce RTX 4070"}</span>
          <span>CPU: {status?.telemetry.system?.cpu_name || "AMD Ryzen"}</span>
          <span>OS: {status?.telemetry.system?.os_name || "Linux"}</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
