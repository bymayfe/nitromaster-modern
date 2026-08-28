#!/bin/bash
# ==============================================================================
# NitroMaster - Acer Nitro Control Center Desktop Launcher
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=16420
URL="http://127.0.0.1:$PORT"

# 1. Start Bridge Daemon if not running
if ! curl -s "http://127.0.0.1:$PORT/api/ping" >/dev/null 2>&1; then
    echo "⚡ Starting NitroMaster Bridge on port $PORT..."
    python3 "$SCRIPT_DIR/backend/bridge.py" >/tmp/nitromaster_bridge.log 2>&1 &
    sleep 0.8
fi

# 2. Launch as Standalone Desktop App
echo "🚀 Opening NitroMaster Control Center..."

if command -v brave &>/dev/null; then
    brave --app="$URL" --window-size=1240,840 --class="NitroMaster" &
elif command -v google-chrome &>/dev/null; then
    google-chrome --app="$URL" --window-size=1240,840 --class="NitroMaster" &
elif command -v chromium &>/dev/null; then
    chromium --app="$URL" --window-size=1240,840 --class="NitroMaster" &
elif command -v microsoft-edge &>/dev/null; then
    microsoft-edge --app="$URL" --window-size=1240,840 --class="NitroMaster" &
elif command -v firefox &>/dev/null; then
    firefox --new-window "$URL" &
else
    xdg-open "$URL" &
fi
