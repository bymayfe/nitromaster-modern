export interface CpuTelemetry {
  usage: number;
  temp: number;
  freq_mhz: number;
  model: string;
}

export interface GpuTelemetry {
  name: string;
  temp: number;
  power_w: number;
  clock_mhz: number;
  mem_clock_mhz: number;
  vram_used_mb: number;
  vram_total_mb: number;
  usage: number;
}

export interface FansTelemetry {
  cpu_rpm: number;
  gpu_rpm: number;
}

export interface PowerTelemetry {
  on_ac: boolean;
  battery_pct: number;
  battery_status: string;
}

export interface Telemetry {
  timestamp: number;
  cpu: CpuTelemetry;
  gpu: GpuTelemetry;
  fans: FansTelemetry;
  power: PowerTelemetry;
}

export interface DAMXSettings {
  thermal_profile?: {
    current?: string;
    available?: string[];
  };
  fan_speed?: {
    cpu?: number;
    gpu?: number;
  };
  battery_limiter?: string;
  lcd_override?: string;
  usb_charging?: string;
  boot_animation_sound?: string;
  backlight_timeout?: string;
}

export interface SystemStatus {
  status: string;
  settings: DAMXSettings;
  telemetry: Telemetry;
}

const API_BASE = "http://127.0.0.1:16420/api";

export const api = {
  async getStatus(): Promise<SystemStatus | null> {
    try {
      const res = await fetch(`${API_BASE}/status`, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async setProfile(profile: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/set_profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async setFans(cpu: number, gpu: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/set_fans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpu, gpu }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async setRgb(
    zone: string,
    red: number,
    green: number,
    blue: number,
    brightness: number,
    effect: string = "static"
  ): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/set_rgb`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zone, red, green, blue, brightness, effect }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async sendAction(command: string, params: Record<string, any> = {}): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, params }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
