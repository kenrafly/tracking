# Order Management & Field Sales System

Sistem manajemen order dan aktivitas sales lapangan yang komprehensif, dibangun dengan Next.js 15, TypeScript, dan Tailwind CSS.

## 🚀 Fitur Utama

### Manajemen Order

- **List Detail Order Pelanggan**: Daftar lengkap orderan dengan informasi customer dan toko
- **Status Pesanan**: Tracking status (baru, dalam proses, selesai, batal)
- **Pelacakan Riwayat**: Riwayat pesanan per toko dengan filter dan pencarian
- **Laporan Order**: Total order per toko dan secara keseluruhan

### Aktivitas Sales Lapangan

- **Bukti Kunjungan**: Upload foto dan lokasi GPS (geotagging) untuk setiap kunjungan
- **Riwayat Kunjungan**: Tracking kunjungan setiap sales ke toko
- **Check-in System**: Sistem check-in real-time dengan GPS tracking

### Dashboard & Analytics

- **Dashboard Visual**: Pencapaian target dengan grafik dan visualisasi
- **Profile User**: Dashboard personal dengan target achievements
- **Laporan Performa**: Analytics mendalam untuk setiap toko dan sales

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Headless UI
- **Progress Indicators**: React Circular Progressbar

## 📱 Responsive Design

Aplikasi ini fully responsive dan optimized untuk:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🗂️ Struktur Project

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard utama
│   ├── orders/            # Manajemen order
│   ├── field-activity/    # Aktivitas sales lapangan
│   ├── reports/           # Laporan dan analytics
│   └── profile/           # Profile & target achievements
├── components/            # Reusable components
│   └── Navigation.tsx     # Komponen navigasi
├── lib/                   # Utilities dan data
│   ├── mockData.ts       # Sample data untuk demo
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript type definitions
    └── index.ts          # Interface dan types
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm atau yarn

### Installation

1. Clone repository ini
2. Install dependencies:

```bash
npm install
```

3. Jalankan development server:

```bash
npm run dev
```

4. Buka [http://localhost:3000](http://localhost:3000) di browser

## 📊 Fitur Dashboard

### Dashboard Utama

- Statistik total orders dan revenue
- Chart status orders (pie chart)
- Trend orders bulanan (bar chart)
- Top performing stores

### Manajemen Order

- Filter dan search orders
- Status tracking dengan color coding
- Detail items per order
- Sort berdasarkan tanggal, amount, atau status

### Field Activity

- Riwayat kunjungan lengkap dengan foto
- Check-in system dengan GPS
- Upload multiple photos
- Catatan kunjungan

### Reports

- Filter berdasarkan periode dan toko
- Chart trend bulanan
- Distribusi status orders
- Performa per toko dengan ranking

### Profile & Achievements

- Circular progress bar untuk target
- Chart target vs pencapaian bulanan
- Badge dan achievements
- Aktivitas terbaru

## 🔧 Customization

### Menambah Data

Untuk menambah data sample, edit file `src/lib/mockData.ts`

### Menambah Fitur

1. Tambah types di `src/types/index.ts`
2. Tambah page di `src/app/`
3. Update navigation di `src/components/Navigation.tsx`

### Styling

Aplikasi menggunakan Tailwind CSS. Kustomisasi warna dan styling di `tailwind.config.ts`

## 📱 Mobile Features

- Bottom navigation untuk mobile
- Touch-friendly interfaces
- Responsive tables dan charts
- Mobile-optimized forms

## 🗺️ GPS & Location Features

- Browser geolocation API
- Coordinate validation untuk Indonesia
- Distance calculation between coordinates
- Location-based check-ins

## 📸 Photo Upload Features

- Multiple file upload
- Image preview
- Base64 encoding untuk storage
- Mobile camera integration

## 🎯 Business Logic

### Order Status Flow

1. **New** (Baru) - Order baru dibuat
2. **In Process** (Dalam Proses) - Order sedang diproses
3. **Completed** (Selesai) - Order telah selesai
4. **Canceled** (Dibatal) - Order dibatalkan

### Sales Target Tracking

- Annual targets per sales representative
- Monthly achievement tracking
- Performance percentage calculations
- Achievement badges dan rewards

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Integration dengan payment gateway
- [ ] Export laporan ke PDF/Excel
- [ ] Advanced analytics dengan machine learning
- [ ] Multi-tenant support
- [ ] Offline mode untuk mobile
- [ ] Push notifications untuk updates

## 👥 Kontribusi

Silakan berkontribusi dengan membuat pull request atau melaporkan issues.

## 📄 License

MIT License - lihat file LICENSE untuk detail lengkap.
