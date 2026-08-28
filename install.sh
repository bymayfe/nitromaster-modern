#!/usr/bin/env bash
set -e

# ==============================================================================
# ⚡ NitroMaster Modern — Interactive Installer & Dependency Manager
# ==============================================================================

BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
RESET='\033[0m'

echo -e "${CYAN}${BOLD}"
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                  ⚡ NITROMASTER MODERN INSTALLER & SETUP                     ║"
echo "║              Next-Gen Acer Nitro 16 Linux Hardware Control                   ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# 1. LINUWU_SENSE KERNEL MODULE CHECK
echo -e "\n${BOLD}[1/5] Donanım Çekirdek Modülü (linuwu_sense) Kontrol Ediliyor...${RESET}"

LINUWU_ACTIVE=false
if [ -d "/sys/module/linuwu_sense" ] || lsmod | grep -q "linuwu_sense"; then
    LINUWU_ACTIVE=true
    echo -e "${GREEN}[✓] 'linuwu_sense' çekirdek modülü sistemde zaten yüklü ve aktif!${RESET}"
else
    echo -e "${RED}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║  ⚠️  KRİTİK GEREKSİNİM: 'linuwu_sense' KERNEL SÜRÜCÜSÜ BULUNAMADI!            ║"
    echo "║                                                                              ║"
    echo "║  NitroMaster; Acer Nitro 16'nın Fan hızlarını, 4-Bölge RGB aydınlatmasını,  ║"
    echo "║  Termal modlarını (Quiet/Balanced/Perf/Turbo), %80 Pil koruma limitini ve    ║"
    echo "║  165Hz LCD Overdrive özelliklerini doğrudan 'linuwu_sense' çekirdek modülü   ║"
    echo "║  üzerinden kontrol eder.                                                     ║"
    echo "║                                                                              ║"
    echo "║  ❗ BU MODÜL OLMADAN DONANIM KONTROLLERİ ÇALIŞMAZ!                           ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${RESET}"

    read -p "$(echo -e ${YELLOW}"[?] 'linuwu_sense' sürücüsü şimdi indirilip derlensin ve kurulsun mu? [E/h] (Y/n): "${RESET})" INSTALL_LINUWU
    INSTALL_LINUWU=${INSTALL_LINUWU:-E}

    if [[ "$INSTALL_LINUWU" =~ ^[EeYy]$ ]]; then
        echo -e "${CYAN}[*] linuwu_sense DKMS modülü indiriliyor ve derleniyor...${RESET}"
        TEMP_DIR=$(mktemp -d)
        
        # Git clone
        git clone --depth 1 https://github.com/JafarAkhondali/linuwu-sense.git "$TEMP_DIR/linuwu-sense"
        
        echo -e "${YELLOW}[*] DKMS kurulumu için root yetkisi gerekebilir:${RESET}"
        sudo dkms add "$TEMP_DIR/linuwu-sense" || true
        sudo dkms install linuwu-sense/1.0.2 || sudo dkms build linuwu-sense/1.0.2
        sudo modprobe linuwu_sense || true

        rm -rf "$TEMP_DIR"

        if [ -d "/sys/module/linuwu_sense" ] || lsmod | grep -q "linuwu_sense"; then
            echo -e "${GREEN}[✓] linuwu_sense başarıyla kuruldu ve yüklendi!${RESET}"
            LINUWU_ACTIVE=true
        else
            echo -e "${RED}[!] linuwu_sense yüklenirken bir sorun oluştu. Lütfen manuel kontrol edin.${RESET}"
        fi
    else
        echo -e "${YELLOW}[UYARI] linuwu_sense kurulumu atlandı. Donanım kontrolleri aktif olmayacaktır.${RESET}"
    fi
fi

# 2. SYSTEM DEPENDENCIES (Node.js, npm, Python3)
echo -e "\n${BOLD}[2/5] Sistem Bağımlılıkları Kontrol Ediliyor...${RESET}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}[!] Node.js bulunamadı! Lütfen 'nodejs' paketini kurun.${RESET}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}[!] npm bulunamadı! Lütfen 'npm' paketini kurun.${RESET}"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}[!] Python 3 bulunamadı!${RESET}"
    exit 1
fi

echo -e "${GREEN}[✓] Node.js $(node -v), npm $(npm -v) ve Python $(python3 --version | cut -d' ' -f2) hazır.${RESET}"

# 3. BUILD REACT FRONTEND
echo -e "\n${BOLD}[3/5] NitroMaster Modern Arayüzü Derleniyor (Vite + React 19)...${RESET}"
if [ ! -d "node_modules" ]; then
    echo -e "${CYAN}[*] NPM paketleri yükleniyor...${RESET}"
    npm install
fi

npm run build
echo -e "${GREEN}[✓] Frontend başarıyla 'dist/' klasörüne derlendi.${RESET}"

# 4. SYSTEMD USER SERVICE SETUP
echo -e "\n${BOLD}[4/5] NitroMaster Arka Plan Servisi (Systemd User) Yapılandırılıyor...${RESET}"
mkdir -p "$HOME/.config/systemd/user"

cat > "$HOME/.config/systemd/user/nitromaster-bridge.service" << EOF
[Unit]
Description=NitroMaster Modern Hardware Telemetry & Control Bridge
After=network.target DAMM-Daemon.service
Wants=DAMM-Daemon.service

[Service]
Type=simple
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/python3 $PROJECT_DIR/backend/bridge.py
Restart=always
RestartSec=2
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user enable nitromaster-bridge.service
systemctl --user restart nitromaster-bridge.service
echo -e "${GREEN}[✓] 'nitromaster-bridge.service' arka planda aktif edildi ve başlatıldı.${RESET}"

# 5. DESKTOP LAUNCHER & PERMISSIONS
echo -e "\n${BOLD}[5/5] Masaüstü Kısayolu ve Başlatıcı Oluşturuluyor...${RESET}"
chmod +x "$PROJECT_DIR/launch.sh"
chmod +x "$PROJECT_DIR/backend/bridge.py"

mkdir -p "$HOME/.local/share/applications"
cat > "$HOME/.local/share/applications/nitromaster.desktop" << EOF
[Desktop Entry]
Name=NitroMaster Control Center
Comment=Next-Gen Acer Nitro 16 Hardware Control Dashboard
Exec=$PROJECT_DIR/launch.sh
Icon=utilities-system-monitor
Terminal=false
Type=Application
Categories=System;Settings;HardwareSettings;
Keywords=acer;nitro;fans;rgb;hardware;thermal;overdrive;
EOF

chmod +x "$HOME/.local/share/applications/nitromaster.desktop"
echo -e "${GREEN}[✓] Masaüstü kısayolu oluşturuldu: ~/.local/share/applications/nitromaster.desktop${RESET}"

# FINAL SUMMARY
echo -e "\n${GREEN}${BOLD}══════════════════════════════════════════════════════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}             🎉 NITROMASTER MODERN KURULUMU BAŞARIYLA TAMAMLANDI!             ${RESET}"
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════════════════════════════${RESET}"
echo -e "${CYAN}Uygulamayı başlatmak için:${RESET}"
echo -e "  👉 Masaüstü menüsünden: ${BOLD}NitroMaster Control Center${RESET}"
echo -e "  👉 Terminalden:         ${BOLD}./launch.sh${RESET} veya ${BOLD}./run.sh${RESET}"
echo -e "  👉 Tamamen kapatmak:    ${BOLD}./stop.sh${RESET}"
echo -e "  👉 Web Tarayıcısından:  ${BOLD}http://127.0.0.1:16420${RESET}"
echo ""

# Auto-launch immediately
echo -e "${CYAN}[🚀] NitroMaster şimdi açılıyor...${RESET}\n"
"$PROJECT_DIR/launch.sh"
