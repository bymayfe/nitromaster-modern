#!/bin/bash
# ==============================================================================
# ⚡ NitroMaster - Smart Desktop & Terminal Launcher
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PORT=16420
URL="http://127.0.0.1:$PORT"

BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo -e "${CYAN}${BOLD}⚡ NitroMaster — Acer Nitro Hardware Control Center${RESET}"

# 1. Check if installation is needed (dist/ or node_modules missing)
if [ ! -d "$SCRIPT_DIR/dist" ] || [ ! -f "$SCRIPT_DIR/dist/index.html" ] || [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo -e "${YELLOW}[*] Kurulum henüz tamamlanmamış veya derleme dosyaları eksik görünüyor.${RESET}"
    echo -e "${CYAN}[*] Otomatik kurulum (install.sh) başlatılıyor...${RESET}\n"
    bash "$SCRIPT_DIR/install.sh"
    exit 0
fi

# 2. Start Backend Bridge if not running
if ! curl -s "http://127.0.0.1:$PORT/api/ping" >/dev/null 2>&1; then
    echo -e "${YELLOW}[*] Donanım köprüsü (Bridge) başlatılıyor (Port $PORT)...${RESET}"
    nohup python3 "$SCRIPT_DIR/backend/bridge.py" >/tmp/nitromaster_bridge.log 2>&1 &
    sleep 1.0
fi

# 3. Verify Bridge is responsive
if curl -s "http://127.0.0.1:$PORT/api/ping" >/dev/null 2>&1; then
    echo -e "${GREEN}[✓] NitroMaster Donanım Köprüsü Aktif!${RESET}"
else
    echo -e "${YELLOW}[!] Köprü başlatıldı, arayüz açılıyor...${RESET}"
fi

# 4. Launch Standalone Window / Browser
echo -e "${CYAN}[🚀] NitroMaster Arayüzü Açılıyor: ${BOLD}$URL${RESET}\n"

if command -v zen-browser &>/dev/null; then
    nohup zen-browser --new-window "$URL" >/dev/null 2>&1 &
elif command -v brave &>/dev/null; then
    nohup brave --app="$URL" --window-size=1260,860 --class="NitroMaster" >/dev/null 2>&1 &
elif command -v google-chrome &>/dev/null; then
    nohup google-chrome --app="$URL" --window-size=1260,860 --class="NitroMaster" >/dev/null 2>&1 &
elif command -v chromium &>/dev/null; then
    nohup chromium --app="$URL" --window-size=1260,860 --class="NitroMaster" >/dev/null 2>&1 &
elif command -v firefox &>/dev/null; then
    nohup firefox --new-window "$URL" >/dev/null 2>&1 &
else
    nohup xdg-open "$URL" >/dev/null 2>&1 &
fi

echo -e "${GREEN}[✓] NitroMaster başarıyla başlatıldı!${RESET}"
echo -e "${YELLOW}[💡] Tamamen kapatmak istediğinde: ${BOLD}./stop.sh${RESET}\n"
