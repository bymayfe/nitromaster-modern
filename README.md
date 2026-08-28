# ⚡ NitroMaster — Next-Gen Acer Nitro Control Center

> **Modern, Ultra-Fast & Sleek Hardware Control Dashboard for Acer Nitro 16 (AN16-42) on Linux / CachyOS**  
> Built with **React 19**, **Tailwind CSS**, **Vite**, **Lucide Icons** and **Zero-Latency Linux Kernel Bridge**.

---

## ⚠️ Kritik Çekirdek Sürücüsü: `linuwu_sense`

NitroMaster, donanım özelliklerini doğrudan Linux çekirdeği seviyesindeki **`linuwu_sense`** modülü üzerinden kontrol eder.

### ❓ `linuwu_sense` Nedir ve Neden Zorunludur?
Acer Nitro serisi laptopların gömülü denetleyicisi (EC - Embedded Controller) ve WMI arayüzleri standart Linux çekirdeğinde tam olarak yer almaz. **`linuwu_sense`** (DKMS sürücüsü), Linux çekirdeği ile Nitro donanımı arasındaki köprüyü kurar:

* 🌀 **Fan Kontrolü:** `/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/nitro_sense/fan_speed`
* 🌈 **4-Bölge RGB Klavye & 8 Efekt:** `/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/four_zoned_kb/per_zone_mode` ve `four_zone_mode`
* 🔋 **%80 Pil Koruma Limiti:** `/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/nitro_sense/battery_limiter`
* ⚡ **165Hz LCD Panel Overdrive:** `/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/nitro_sense/lcd_override`
* 🔌 **Kapalıyken USB Şarj:** `/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/nitro_sense/usb_charging`
* 🔊 **Açılış Sesi ve Işık Zamanlayıcısı:** `boot_animation_sound` ve `backlight_timeout`

> [!IMPORTANT]
> **`linuwu_sense` ÇEKİRDEK MODÜLÜ OLMADAN NITROMASTER'IN DONANIM KONTROL ÖZELLİKLERİ ÇALIŞMAZ.**  
> Kurulum sırasında `install.sh` betiği bu modülü otomatik kontrol eder; yüklü değilse size sorarak GitHub üzerinden otomatik indirip DKMS ile derler.

---

## 🌟 Özellikler

* 🎨 **Fütüristik Cyber-Dark Tasarım:** Glassmorphism arayüz, neon LED efektleri, 165Hz akıcı geçişler.
* ⚡ **Canlı Donanım Telemetrisi:**
  * **AMD Ryzen 7 8845HS:** Anlık çekirdek sıcaklığı (°C), saat hızı (GHz), kullanım yüzdesi (%).
  * **NVIDIA GeForce RTX 4070 Laptop:** Sıcaklık (°C), Anlık güç çekimi (**Watt / TGP**), VRAM kullanımı, Core & Memory frekansları.
  * **AeroBlade 3D Çift Fan Göstergeleri:** CPU ve GPU fanlarının anlık gerçek RPM değerleri ve hız takometreleri.
* 🔘 **Tek Tıkla Termal Mod Seçimi:**
  * **Quiet:** Sessiz ve serin kullanım.
  * **Balanced:** Günlük dinamik soğutma.
  * **Performance:** %75 fan hızı ve yüksek saat hızları.
  * **Turbo:** 140W RTX 4070 TGP ve %100 fan kilidi.
  * **ECO (Pil):** Pildeyken maksimum pil ömrü sağlayan enerji tasarruf modu.
* 🌈 **4-Bölge RGB Klavye Stüdyosu:**
  * Ekranda gerçek Nitro 16 klavye düzeni üzerinde 4 bölgeye dokunarak renk seçebilme.
  * Hızlı renk paletleri ve canlı Hex renk seçici.
  * **8 Donanım Destekli Dinamik Efekt:**
    1. ✨ *Static (Sabit Renk)*
    2. 🫁 *Breathing (Nefes Alma)*
    3. 🌈 *Neon Spectrum (Neon Döngüsü)*
    4. 🌊 *RGB Wave (Gökkuşağı Dalgası)*
    5. 💫 *Color Shift (Renk Kayması)*
    6. 🎯 *Zoom (Genişleyen Halka)*
    7. ☄️ *Meteor Shower (Kayan Yıldız)*
    8. ⭐ *Twinkling Stars (Yıldız Parıltısı)*
  * Efekt Hız Ayarı (Seviye 1 - 9) ve Dalga Yönü (Sol ➔ Sağ / Sağ ➔ Sol).
  * LED Parlaklık Kaydırıcısı (%0 - %100).
* 🎛️ **Özel Fan Eğrisi / Manuel Ayar:**
  * CPU ve GPU fan hızlarını senkron veya bağımsız olarak %0-%100 arasında anlık ayarlama.
* 🔋 **Donanım ve Pil Koruma Anahtarları:**
  * %80 Pil Koruma Limiti (Battery Care Mode).
  * 165Hz LCD Panel Overdrive (Ghosting / Motion Blur engelleme).
  * Kapalıyken USB'den Cihaz Şarjı (USB Power-Off Charging).
  * Nitro Açılış Sesi Aç/Kapa.
  * 30sn Klavye Aydınlatması Otomatik Uyku Modu.

---

## 🛠️ Kurulum (Otomatik & Etkileşimli)

Kurulum betiğini çalıştırmanız yeterlidir:

```bash
cd ~/Desktop/Projects/nitromaster-modern
./install.sh
```

### `install.sh` Neler Yapar?
1. **`linuwu_sense` Kontrolü:** Modül yüklü mü bakar. Yüklü değilse onayınızı alarak DKMS ile çekirdeğe derler ve yükler.
2. **Sistem Bağımlılıkları:** Node.js, npm, Python3 kontrolü yapar.
3. **React Derlemesi:** Vite ile ultra hızlı production build alır (`dist/`).
4. **Systemd User Servisi:** `nitromaster-bridge.service` servisini kurar ve arka planda başlatır.
5. **Masaüstü Entegrasyonu:** KDE / GNOME menüsüne `NitroMaster Control Center` kısayolunu ekler.

---

## 🚀 Çalıştırma

Kurulumdan sonra:

* **Masaüstü Menüsünden:** Arama çubuğuna `NitroMaster` yazarak açabilirsiniz.
* **Terminalden:**
  ```bash
  cd ~/Desktop/Projects/nitromaster-modern
  ./launch.sh
  ```
* **Web Tarayıcısından:**  
  Doğrudan [http://127.0.0.1:16420](http://127.0.0.1:16420) adresine gidebilirsiniz.

---

## 🏗️ Mimari & Teknoloji Yığını

* **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons
* **Backend Bridge:** Python 3 `ThreadingHTTPServer` REST & Sysfs Telemetry Server (`127.0.0.1:16420`)
* **Kernel & Sürücü:** `linuwu_sense` DKMS Platform Driver + `/var/run/DAMX.sock`
