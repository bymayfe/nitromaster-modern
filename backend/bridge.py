#!/usr/bin/env python3
"""
NitroMaster Bridge - High-Performance Hardware Telemetry & DAMX Socket Bridge
Runs locally on 127.0.0.1:16420 providing zero-latency REST & Telemetry endpoints.
"""

import os
import sys
import glob
import json
import time
import socket
import logging
import threading
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("NitroMasterBridge")

PORT = 16420
DAMX_SOCKET = "/var/run/DAMX.sock"


class DAMXSocketClient:
    """Client for DAMX daemon Unix Domain Socket."""

    @staticmethod
    def send_command(command: str, params: dict = None) -> dict:
        if not os.path.exists(DAMX_SOCKET):
            return {"status": "error", "message": f"DAMX socket not found at {DAMX_SOCKET}"}

        payload = {"command": command, "params": params or {}}
        try:
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as client:
                client.settimeout(0.4)
                client.connect(DAMX_SOCKET)
                client.sendall(json.dumps(payload).encode("utf-8"))
                raw = client.recv(16384).decode("utf-8")
                return json.loads(raw)
        except Exception as e:
            return {"status": "error", "message": str(e)}


class TelemetryCollector:
    """Collects real-time CPU, GPU, and Fan telemetry on Linux."""

    def __init__(self):
        self.last_cpu_times = None
        self.last_cpu_check = 0
        self.cpu_usage = 0.0

    def get_cpu_usage(self) -> float:
        try:
            now = time.time()
            with open("/proc/stat", "r") as f:
                fields = [float(x) for x in f.readline().strip().split()[1:8]]
            
            idle_time = fields[3] + fields[4]
            total_time = sum(fields)
            
            if self.last_cpu_times:
                last_idle, last_total = self.last_cpu_times
                idle_delta = idle_time - last_idle
                total_delta = total_time - last_total
                if total_delta > 0:
                    self.cpu_usage = round(100.0 * (1.0 - idle_delta / total_delta), 1)
            
            self.last_cpu_times = (idle_time, total_time)
            self.last_cpu_check = now
            return self.cpu_usage
        except Exception:
            return 0.0

    def get_cpu_temp(self) -> float:
        # Search hwmon for k10temp or coretemp
        for hwmon in sorted(glob.glob("/sys/class/hwmon/hwmon*")):
            try:
                with open(f"{hwmon}/name", "r") as f:
                    name = f.read().strip()
                if name in ("k10temp", "coretemp", "zenpower", "cpu_thermal"):
                    for temp_file in glob.glob(f"{hwmon}/temp*_input"):
                        with open(temp_file, "r") as tf:
                            val = float(tf.read().strip()) / 1000.0
                            if 20 <= val <= 115:
                                return round(val, 1)
            except Exception:
                continue
        return 0.0

    def get_cpu_freq_mhz(self) -> int:
        freqs = []
        for path in glob.glob("/sys/devices/system/cpu/cpu*/cpufreq/scaling_cur_freq"):
            try:
                with open(path, "r") as f:
                    freqs.append(int(f.read().strip()) // 1000)
            except Exception:
                continue
        return int(sum(freqs) / len(freqs)) if freqs else 0

    def get_gpu_telemetry(self) -> dict:
        """Query NVIDIA RTX GPU telemetry via nvidia-smi."""
        data = {
            "name": "NVIDIA GeForce RTX 4070 Laptop",
            "temp": 0,
            "power_w": 0.0,
            "clock_mhz": 0,
            "mem_clock_mhz": 0,
            "vram_used_mb": 0,
            "vram_total_mb": 8192,
            "usage": 0
        }
        try:
            cmd = [
                "nvidia-smi",
                "--query-gpu=temperature.gpu,power.draw,clocks.current.graphics,clocks.current.memory,memory.used,memory.total,utilization.gpu",
                "--format=csv,noheader,nounits"
            ]
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=0.8)
            if res.returncode == 0 and res.stdout.strip():
                parts = [p.strip() for p in res.stdout.strip().split(",")]
                if len(parts) >= 7:
                    data["temp"] = int(float(parts[0]))
                    data["power_w"] = round(float(parts[1]), 1)
                    data["clock_mhz"] = int(float(parts[2]))
                    data["mem_clock_mhz"] = int(float(parts[3]))
                    data["vram_used_mb"] = int(float(parts[4]))
                    data["vram_total_mb"] = int(float(parts[5]))
                    data["usage"] = int(float(parts[6]))
        except Exception:
            pass
        return data

    def get_fan_speeds(self) -> dict:
        """Read CPU and GPU fan RPMs."""
        fans = {"cpu_rpm": 0, "gpu_rpm": 0}
        # Try linuwu_sense sysfs or hwmon
        nitro_path = "/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/nitro_sense/fan_speed"
        if os.path.exists(nitro_path):
            try:
                with open(nitro_path, "r") as f:
                    # format: cpu_speed gpu_speed
                    parts = f.read().strip().split()
                    if len(parts) >= 2:
                        fans["cpu_rpm"] = int(parts[0])
                        fans["gpu_rpm"] = int(parts[1])
            except Exception:
                pass

        if fans["cpu_rpm"] == 0:
            # Fallback to hwmon fan inputs
            for hwmon in glob.glob("/sys/class/hwmon/hwmon*"):
                fan_inputs = sorted(glob.glob(f"{hwmon}/fan*_input"))
                if len(fan_inputs) >= 2:
                    try:
                        with open(fan_inputs[0], "r") as f1, open(fan_inputs[1], "r") as f2:
                            fans["cpu_rpm"] = int(f1.read().strip())
                            fans["gpu_rpm"] = int(f2.read().strip())
                            break
                    except Exception:
                        pass
        return fans

    def get_power_status(self) -> dict:
        """Check AC adapter and battery status."""
        status = {"on_ac": True, "battery_pct": 100, "battery_status": "Unknown"}
        # AC check
        for path in glob.glob("/sys/class/power_supply/*/online"):
            if any(k in path for k in ("AC", "ADP", "ACAD")):
                try:
                    with open(path, "r") as f:
                        status["on_ac"] = (f.read().strip() == "1")
                except Exception:
                    pass

        # Battery check
        for bat in glob.glob("/sys/class/power_supply/BAT*"):
            try:
                with open(f"{bat}/capacity", "r") as f:
                    status["battery_pct"] = int(f.read().strip())
                with open(f"{bat}/status", "r") as f:
                    status["battery_status"] = f.read().strip()
            except Exception:
                pass
        return status

    def collect_all(self) -> dict:
        return {
            "timestamp": time.time(),
            "cpu": {
                "usage": self.get_cpu_usage(),
                "temp": self.get_cpu_temp(),
                "freq_mhz": self.get_cpu_freq_mhz(),
                "model": "AMD Ryzen 7 8845HS"
            },
            "gpu": self.get_gpu_telemetry(),
            "fans": self.get_fan_speeds(),
            "power": self.get_power_status()
        }


collector = TelemetryCollector()


class NitroMasterHTTPHandler(BaseHTTPRequestHandler):
    """CORS-enabled REST handler for frontend."""

    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path in ("/api/status", "/api/all"):
            # Fetch daemon settings + hardware telemetry
            damx_settings = DAMXSocketClient.send_command("get_all_settings")
            telemetry = collector.collect_all()
            
            # Direct sysfs read for 100% reliable instantaneous platform profile
            current_profile = "balanced"
            if os.path.exists("/sys/firmware/acpi/platform_profile"):
                try:
                    with open("/sys/firmware/acpi/platform_profile", "r") as f:
                        current_profile = f.read().strip()
                except Exception:
                    pass

            available_profiles = ["low-power", "quiet", "balanced", "balanced-performance", "performance"]
            if os.path.exists("/sys/firmware/acpi/platform_profile_choices"):
                try:
                    with open("/sys/firmware/acpi/platform_profile_choices", "r") as f:
                        available_profiles = f.read().strip().split()
                except Exception:
                    pass

            # Merge into settings
            merged_settings = damx_settings.get("data", {})
            if not isinstance(merged_settings, dict):
                merged_settings = {}

            if "thermal_profile" not in merged_settings or not isinstance(merged_settings["thermal_profile"], dict):
                merged_settings["thermal_profile"] = {}

            merged_settings["thermal_profile"]["current"] = current_profile
            merged_settings["thermal_profile"]["available"] = available_profiles

            response = {
                "status": "success",
                "settings": merged_settings,
                "telemetry": telemetry
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(response).encode("utf-8"))

        elif path == "/api/telemetry":
            self._set_headers(200)
            self.wfile.write(json.dumps(collector.collect_all()).encode("utf-8"))

        elif path == "/api/ping":
            self._set_headers(200)
            self.wfile.write(b'{"pong": true}')

        else:
            # Serve static files from dist/
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            dist_dir = os.path.join(base_dir, "dist")
            
            clean_path = path.lstrip("/")
            file_path = os.path.join(dist_dir, clean_path) if clean_path else os.path.join(dist_dir, "index.html")
            
            if not os.path.exists(file_path) or os.path.isdir(file_path):
                file_path = os.path.join(dist_dir, "index.html")

            if os.path.exists(file_path):
                mime_type = "text/html"
                if file_path.endswith(".js"):
                    mime_type = "application/javascript"
                elif file_path.endswith(".css"):
                    mime_type = "text/css"
                elif file_path.endswith(".svg"):
                    mime_type = "image/svg+xml"
                elif file_path.endswith(".png"):
                    mime_type = "image/png"
                elif file_path.endswith(".json"):
                    mime_type = "application/json"

                try:
                    with open(file_path, "rb") as f:
                        content = f.read()
                    self._set_headers(200, content_type=mime_type)
                    self.wfile.write(content)
                    return
                except Exception:
                    pass

            self._set_headers(404)
            self.wfile.write(b'{"error": "Not Found"}')

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        content_len = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_len) if content_len > 0 else b"{}"

        try:
            payload = json.loads(body.decode("utf-8"))
        except Exception:
            payload = {}

        if path == "/api/action":
            command = payload.get("command") or payload.get("action")
            params = payload.get("params", {})
            if not command:
                self._set_headers(400)
                self.wfile.write(b'{"error": "Missing command"}')
                return

            log.info(f"Executing DAMX command: '{command}' with params: {params}")
            res = DAMXSocketClient.send_command(command, params)
            self._set_headers(200)
            self.wfile.write(json.dumps(res).encode("utf-8"))

        elif path == "/api/set_profile":
            profile = payload.get("profile", "balanced")
            log.info(f"Setting thermal profile: {profile}")
            res = DAMXSocketClient.send_command("set_thermal_profile", {"profile": profile})
            self._set_headers(200)
            self.wfile.write(json.dumps(res).encode("utf-8"))

        elif path == "/api/set_fans":
            cpu = int(payload.get("cpu", 0))
            gpu = int(payload.get("gpu", 0))
            log.info(f"Setting fan speeds: CPU={cpu}%, GPU={gpu}%")
            res = DAMXSocketClient.send_command("set_fan_speed", {"cpu": cpu, "gpu": gpu})
            self._set_headers(200)
            self.wfile.write(json.dumps(res).encode("utf-8"))

        elif path == "/api/set_rgb":
            zone = payload.get("zone", "all")
            red = int(payload.get("red", 255))
            green = int(payload.get("green", 0))
            blue = int(payload.get("blue", 77))
            brightness = int(payload.get("brightness", 100))
            effect = payload.get("effect", "static")
            
            # Send to DAMX 4-zone or per-zone
            if zone == "all":
                res = DAMXSocketClient.send_command("set_four_zone_mode", {
                    "zone1": f"{red:02x}{green:02x}{blue:02x}",
                    "zone2": f"{red:02x}{green:02x}{blue:02x}",
                    "zone3": f"{red:02x}{green:02x}{blue:02x}",
                    "zone4": f"{red:02x}{green:02x}{blue:02x}",
                    "brightness": brightness
                })
            else:
                res = DAMXSocketClient.send_command("set_per_zone_mode", {
                    "zone": int(zone),
                    "red": red,
                    "green": green,
                    "blue": blue,
                    "brightness": brightness
                })
            self._set_headers(200)
            self.wfile.write(json.dumps(res).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(b'{"error": "Not Found"}')

    def log_message(self, format, *args):
        # Suppress continuous polling spam
        pass


def run_server():
    server = HTTPServer(("127.0.0.1", PORT), NitroMasterHTTPHandler)
    log.info(f"⚡ NitroMaster Bridge Server listening on http://127.0.0.1:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
        log.info("Bridge server stopped.")


if __name__ == "__main__":
    run_server()
