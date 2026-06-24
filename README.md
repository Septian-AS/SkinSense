# SkinSense - AI Skin Type Analyzer 🌟

Aplikasi berbasis web yang menggunakan Artificial Intelligence untuk menganalisis jenis kulit wajah dan memberikan rekomendasi perawatan kulit yang dipersonalisasi.

![Version](https://img.shields.io/badge/version-1.1.0-purple)
![License](https://img.shields.io/badge/license-MIT-pink)
![Status](https://img.shields.io/badge/status-Production%20Ready-green)

## ✨ Fitur Utama

- 🤖 **Analisis Real-time**: Deteksi jenis kulit menggunakan AI (Normal, Berminyak, Kering, Berjerawat)
- 💡 **Feedback Langsung**: Indikator kualitas foto real-time (pencahayaan, posisi wajah)
- 📊 **Analytics Dashboard**: Grafik tren analisis dan statistik
- 💬 **Rekomendasi Personal**: Skincare routine yang disesuaikan per jenis kulit
- 📱 **Responsive Design**: Kompatibel dengan desktop, tablet, dan mobile
- 🎨 **Modern UI**: Design minimalis dengan tema purple & pink
- 💾 **Local Storage**: Semua data disimpan lokal (privacy-first)
- 🌐 **Offline Ready**: Berfungsi setelah model dimuat pertama kali

## 🎯 Akurasi Model

| Jenis Kulit | Akurasi |
|------------|---------|
| Normal | ~87% |
| Berminyak | ~84% |
| Kering | ~82% |
| Berjerawat | ~87% |
| **Overall** | **~85%** |

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/skinsense.git
cd skinsense
```

### 2. Run Lokal Server
```bash
# Python 3
python3 -m http.server 8000

# Atau Node.js
npx http-server

# Atau gunakan Live Server di VS Code
```

### 3. Buka di Browser
```
http://localhost:8000/public/
```

## 📁 Struktur Project

```
SkinSense/
├── public/
│   └── index.html              # Main entry point
├── assets/
│   ├── images/                 # Icons & illustrations
│   └── styles/
│       └── main.css            # Styling (Purple & Pink theme)
├── js/
│   ├── config.js               # Konfigurasi & data rules
│   ├── main.js                 # Entry point & event handlers
│   └── modules/
│       ├── storage.js          # LocalStorage management
│       ├── model.js            # ML model loading
│       ├── webcam.js           # Webcam management
│       ├── analyzer.js         # Analysis logic
│       ├── ui.js               # UI rendering
│       └── recommendations.js  # Skincare recommendations
├── model/
│   ├── model.json              # Model architecture
│   ├── metadata.json           # Model metadata
│   └── weights.bin             # Neural network weights (2.1MB)
├── docs/                       # Documentation
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: #A855F7 (Purple) - Main CTA buttons
- **Secondary**: #EC4899 (Pink) - Accents
- **Success**: #10B981 (Emerald) - Positive states
- **Warning**: #F59E0B (Amber) - Warnings
- **Danger**: #EF4444 (Red) - Errors

### Components
- Buttons (primary, secondary, danger, ghost variants)
- Cards & elevation
- Real-time indicators
- Progress rings & bars
- Toast notifications
- Modals & overlays

## 💻 Teknologi

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS (Minimalist design)
- **ML Framework**: TensorFlow.js + Teachable Machine
- **Storage**: LocalStorage API
- **Charting**: Chart.js
- **Icons**: Emoji (simple & accessible)

## 📖 Cara Penggunaan

### 1. Aktifkan Kamera
Klik tombol "📷 Aktifkan Kamera" untuk memberikan akses webcam

### 2. Posisikan Wajah
- Hadapkan wajah ke kamera
- Pastikan wajah menempati 60-80% dari frame
- Perhatikan indikator pencahayaan (hijau = optimal)

### 3. Ambil Foto
Klik "✓ Capture & Analyze" saat indicator menunjukkan siap

### 4. Dapatkan Hasil
AI akan menganalisis dan menampilkan:
- Jenis kulit Anda
- Confidence score
- Rekomendasi skincare routine

## 🎯 Tips untuk Hasil Terbaik

✅ **DO:**
- Gunakan pencahayaan alami dari depan
- Posisikan wajah di tengah frame
- Buat ekspresi wajah netral
- Pastikan wajah jelas (tidak blur)

❌ **DON'T:**
- Gunakan kamera dengan sudut ekstrem
- Pakai kacamata atau aksesori wajah
- Jepretan dalam kondisi backlit
- Pakai makeup tebal yang menyembunyikan tekstur kulit

## 📊 Analytics

Dashboard menampilkan:
- **Grafik Tren**: Analisis 7 hari terakhir
- **Statistik**: Total scans, yang paling umum, hari ini
- **History**: Riwayat lengkap dengan timestamp & confidence

## 🔒 Privacy & Security

- ✅ Semua proses dilakukan di browser (local)
- ✅ Webcam feed TIDAK dikirim ke server
- ✅ Data history disimpan lokal (localStorage)
- ✅ Tidak ada tracking atau analytics eksternal
- ⚠️ HTTPS required untuk webcam access di production

## ⚠️ Disclaimer

**SkinSense adalah PROTOTYPE untuk tujuan edukasi dan tidak menggantikan konsultasi profesional dermatolog.**

- Sistem ini memberikan analisis umum berdasarkan aturan baku
- Hasil bukan diagnosis medis resmi
- Untuk kondisi kulit serius, konsultasikan dengan dokter kulit profesional
- Model dilatih pada dataset terbatas dan mungkin kurang akurat untuk kondisi ekstrem

## 🔧 Maintenance

### Update Model
1. Kumpulkan data training baru
2. Retrain di Teachable Machine
3. Download model files (model.json, metadata.json, weights.bin)
4. Gantikan files di folder `model/`

### Performance Tips
- Model cache otomatis di browser
- Chart.js dipanggil on-demand (lazy load)
- Images dioptimasi (SVG icons)
- CSS minified untuk production

## 📝 Changelog

### v1.1.0 (Current)
- ✨ Redesigned UI dengan Purple & Pink theme
- ✨ Real-time camera quality feedback
- ✨ Analytics dashboard dengan grafik
- ✨ Tips carousel
- ✨ Share functionality
- 🔧 Modularized JavaScript architecture
- 📱 Improved responsive design

### v1.0.0
- Initial prototype
- Basic skin type detection
- Skincare recommendations

## 🤝 Kontribusi

Kontribusi untuk improvement sangat diterima!

1. Fork repository
2. Buat branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add improvement'`)
4. Push ke branch (`git push origin feature/improvement`)
5. Buat Pull Request

## 📞 Support

- 📧 Email: [contact email]
- 🐛 Report bugs via GitHub Issues
- 💡 Feature requests welcome

## 📄 Lisensi

Direlease di bawah MIT License. Lihat `LICENSE` file untuk detail.

---

**Made with 💜 by Kelompok 11**

Terima kasih telah menggunakan SkinSense! 🌟
