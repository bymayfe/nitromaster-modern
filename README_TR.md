# ⚡ NitroMaster — Yeni Nesil Acer Nitro Kontrol Merkezi

<div align="center">

[![License: GPL v3](https://img.shields.io/badge/Lisans-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Platform](https://img.shields.io/badge/Platform-Linux%20%2F%20CachyOS-orange.svg)](https://cachyos.org)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript%20%2B%20Vite-61dafb.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tasar%C4%B1m-Tailwind%20CSS%20Glassmorphism-38bdf8.svg)](https://tailwindcss.com/)

**Linux ve CachyOS Üzerinde Acer Nitro Laptoplar İçin Modern, Ultra Hızlı ve Şık Donanım Kontrol Paneli.**

[🇬🇧 Click for English Documentation (README.md)](README.md)

</div>

---

## 📸 Ekran Görüntüleri

### 1. Kontrol Paneli & Canlı Donanım Telemetrisi
> Anlık CPU/GPU yükü, çekirdek sıcaklıkları, 140W RTX 4070 TGP güç takibi, tek tıkla termal mod değişimi ve gerçek RPM hızında dönen AeroBlade 3D takometreleri.

![NitroMaster Dashboard](screenshots/dashboard-telemetry.png)

---

### 2. 4-Bölge RGB Klavye Stüdyosu & 8 Dinamik Efekt
> Etkileşimli 4-bölge klavye haritası, canlı Hex renk seçici, 8 donanım destekli dinamik ışıklandırma modu, hız (1-9), yön ve LED parlaklık ayarı.

![NitroMaster RGB Studio](screenshots/rgb-studio.png)

---

## ⚠️ Kritik Çekirdek Sürücüsü: `linuwu_sense`

NitroMaster, Acer Nitro serisinin donanım özelliklerini doğrudan Linux çekirdeği seviyesindeki **`linuwu_sense`** modülü üzerinden kontrol eder:

* 🌀 **Fan Kontrolü:** `/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/nitro_sense/fan_speed`
* 🌈 **4-Bölge RGB & 8 Efekt:** `/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/four_zoned_kb/per_zone_mode` ve `four_zone_mode`
* 🔋 **%80 Pil Koruma Limiti:** `/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/nitro_sense/battery_limiter`
* ⚡ **165Hz LCD Panel Overdrive:** `/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/nitro_sense/lcd_override`
* 🔌 **Kapalıyken USB Şarj:** `/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/nitro_sense/usb_charging`

> [!IMPORTANT]
> **`linuwu_sense` ÇEKİRDEK MODÜLÜ OLMADAN NITROMASTER'IN DONANIM KONTROL ÖZELLİKLERİ ÇALIŞMAZ.**  
> Kurulum sırasında `./install.sh` betiği bu modülü otomatik kontrol eder; yüklü değilse onayınızı alarak GitHub üzerinden otomatik indirip DKMS ile derler.

---

## 🌟 Öne Çıkan Özellikler

* 🎨 **Fütüristik Cyber-Dark Tasarım:** Glassmorphism arayüz, neon efektleri, 165Hz akıcı geçişler.
* ⚡ **Canlı Donanım Telemetrisi:**
  * **AMD Ryzen 7 8845HS:** Çekirdek sıcaklığı (°C), saat hızı (GHz), kullanım yüzdesi (%).
  * **NVIDIA GeForce RTX 4070 Laptop:** Sıcaklık (°C), Anlık güç çekimi (**Watt / TGP**), VRAM kullanımı, Core & Memory frekansları.
  * **AeroBlade 3D Çift Fan Göstergeleri:** Fanların anlık gerçek dönüş hızına göre dönen SVG türbin animasyonları.
* 🔘 **Tek Tıkla Termal Mod Seçimi:**
  * **Quiet:** Sessiz ve serin kullanım.
  * **Balanced:** Günlük akıllı dinamik soğutma.
  * **Performance:** %75 fan hızı ve yüksek saat hızları.
  * **Turbo:** 140W RTX 4070 TGP ve %100 fan kilidi.
  * **ECO (Pil):** Pildeyken maksimum pil ömrü sağlayan enerji tasarruf modu.
* 🌈 **4-Bölge RGB Klavye Stüdyosu:**
  * 4 bölgeye bağımsız renk atama (WASD, Orta Sol, Orta Sağ, Numpad).
  * Hızlı renk paletleri ve Hex renk seçici.
  * **8 Donanım Destekli Dinamik Efekt:**
    1. ✨ *Static (Sabit Renk)*
    2. 🫁 *Breathing (Nefes Alma)*
    3. 🌈 *Neon Spectrum (Neon Spektrum Döngüsü)*
    4. 🌊 *RGB Wave (Gökkuşağı Dalgası)*
    5. 💫 *Color Shift (Renk Kayması)*
    6. 🎯 *Zoom (Genişleyen Halka)*
    7. ☄️ *Meteor Shower (Kayan Yıldız)*
    8. ⭐ *Twinkling Stars (Yıldız Parıltısı)*
  * Efekt Hız Ayarı (Seviye 1 - 9) ve Dalga Yönü (Sol ➔ Sağ / Sağ ➔ Sol).
  * LED Parlaklık Kaydırıcısı (%0 - %100).
* 🎛️ **Özel Fan Eğrisi / Manuel Ayar:**
  * CPU ve GPU fan hızlarını senkron veya bağımsız olarak %0-%100 arasında ayarlama.
* 🔋 **Donanım ve Pil Koruma Anahtarları:**
  * %80 Pil Koruma Limiti (Battery Care Mode).
  * 165Hz LCD Panel Overdrive (Ghosting engelleme).
  * Kapalıyken USB'den Cihaz Şarjı.
  * Nitro Açılış Sesi Aç/Kapa.
  * 30sn Klavye Aydınlatması Otomatik Uyku Modu.

---

## 🛠️ Kolay Kurulum

Depoyu klonlayıp kurulum betiğini çalıştırmanız yeterlidir:

```bash
git clone https://github.com/bymayfe/nitromaster-modern.git
cd nitromaster-modern
./install.sh
```

### `install.sh` Neler Yapar?
1. **`linuwu_sense` Kontrolü:** Modülün varlığını kontrol eder, eksikse DKMS ile derleyip yükler.
2. **Bağımlılıklar:** Node.js, npm, Python3 kontrolü yapar.
3. **React Derlemesi:** Vite ile ultra hızlı production derlemesi alır (`dist/`).
4. **Systemd Servisi:** `nitromaster-bridge.service` servisini kurar ve başlatır.
5. **Masaüstü Kısayolu:** KDE / GNOME menüsüne `NitroMaster Control Center` simgesini ekler.

---

## 🚀 Çalıştırma

* **Masaüstü Menüsünden:** `NitroMaster` aratarak başlatabilirsiniz.
* **Terminalden:**
  ```bash
  cd ~/Desktop/Projects/nitromaster-modern
  ./launch.sh
  ```
* **Web Tarayıcısından:**  
  [http://127.0.0.1:16420](http://127.0.0.1:16420) adresinden erişebilirsiniz.

---

## 🏗️ Mimari & Teknoloji Yığını

* **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons
* **Backend Bridge:** Python 3 `ThreadingHTTPServer` REST & Sysfs Telemetry Server (`127.0.0.1:16420`)
* **Kernel Sürücüsü:** `linuwu_sense` DKMS Platform Driver + `/var/run/DAMX.sock`

---

## 📄 Lisans

Bu proje **GNU General Public License v3.0 (GPLv3)** lisansı altında açık kaynak olarak dağıtılmaktadır. Detaylar için [LICENSE](LICENSE) dosyasına bakabilirsiniz.

---

<div align="center">
Linux & Acer Nitro Topluluğu İçin ❤️ ile Geliştirilmiştir: <b>Seyfettin (<a href="https://github.com/bymayfe">@bymayfe</a>)</b>
</div>
