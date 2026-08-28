# ⚡ NitroMaster — Next-Gen Acer Nitro Control Center

> **Modern, Ultra-Fast & Sleek Hardware Control Dashboard for Acer Nitro 16 (AN16-42) on Linux / CachyOS**  
> Built with **React 19**, **Tailwind CSS**, **Vite**, **Lucide Icons** and **Zero-Latency Linux Hardware Bridge**.

---

## 🌟 Özellikler

* 🎨 **Fütüristik Cyber-Dark Tasarım:** Glassmorphism arayüz, neon LED efektleri, 165Hz akıcı geçişler.
* ⚡ **Canlı Donanım Telemetrisi:**
  * **AMD Ryzen 7 8845HS:** Anlık çekirdek sıcaklığı (°C), saat hızı (GHz), kullanım yüzdesi (%).
  * **NVIDIA GeForce RTX 4070 Laptop:** Sıcaklık (°C), Anlık güç çekimi (Watt / TGP), VRAM kullanımı, Core & Memory frekansları.
  * **AeroBlade 3D Çift Fan Göstergeleri:** CPU ve GPU fanlarının anlık gerçek RPM değerleri ve hız göstergeleri.
* 🔘 **Tek Tıkla Termal Mod Seçimi:**
  * **Quiet:** Sessiz ve serin kullanım.
  * **Balanced:** Günlük dinamik soğutma.
  * **Performance:** %75 fan hızı ve yüksek saat hızları.
  * **Turbo:** 140W RTX 4070 TGP ve %100 fan kilidi.
  * **ECO (Pil):** Pildeyken maksimum pil ömrü sağlayan enerji tasarruf modu.
* 🌈 **4-Bölge RGB Klavye Stüdyosu:**
  * Ekranda gerçek Nitro 16 klavye düzeni üzerinde 4 bölgeye dokunarak renk seçebilme.
  * Hızlı renk paletleri ve canlı Hex renk seçici.
  * Dinamik aydınlatma efektleri (Static, Breathing, Neon Wave, Color Shift) ve LED parlaklık kontrolü.
* 🎛️ **Özel Fan Eğrisi / Manuel Ayar:**
  * CPU ve GPU fan hızlarını senkron veya bağımsız olarak %0-%100 arasında ayarlama.
* 🔋 **Donanım ve Pil Koruma Anahtarları:**
  * %80 Pil Koruma Limiti (Battery Care Mode).
  * 165Hz LCD Panel Overdrive (Ghosting / Motion Blur engelleme).
  * Kapalıyken USB'den Cihaz Şarjı (USB Power-Off Charging).
  * Nitro Açılış Sesi Aç/Kapa.
  * 30sn Klavye Aydınlatması Otomatik Uyku Modu.

---

## 🚀 Çalıştırma

Uygulamayı başlatmak için tek komut:

```bash
cd ~/Desktop/Projects/nitromaster-modern
./launch.sh
```

Veya doğrudan KDE / Masaüstü menüsünden **NitroMaster Control Center** uygulamasını seçebilirsiniz.

---

## 🏗️ Mimari & Teknoloji Yığını

* **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons
* **Backend Bridge:** Python 3.14 REST & Sysfs Telemetry Server (`127.0.0.1:16420`)
* **Kernel & Sürücü:** `/var/run/DAMX.sock` Unix Domain Socket + `linuwu_sense` DKMS
