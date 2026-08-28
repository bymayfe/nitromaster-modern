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

export interface SystemInfo {
  vendor: string;
  product: string;
  bios: string;
  os_name: string;
  cpu_name: string;
  full_name: string;
}

export interface Telemetry {
  timestamp: number;
  system?: SystemInfo;
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

  async setBrightness(brightness: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/set_brightness`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brightness }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async setRgb(
    zone: string,
    hex: string,
    brightness: number
  ): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/set_rgb`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zone, hex, brightness }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async setEffect(
    effect: string,
    speed: number = 5,
    brightness: number = 100,
    colorHex: string = "ff2e4d",
    direction: number = 1
  ): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/set_effect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ effect, speed, brightness, color: colorHex, direction }),
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
