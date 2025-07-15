# Order Management & Field Sales System

A comprehensive Next.js application for managing orders and field sales activities with admin confirmation workflows.

## 🚀 Features

### Order Management

- **Create Orders**: Sales reps can create orders without store visits
- **Admin Confirmation**: Orders requiring approval workflow
- **Order History**: Complete tracking with status updates
- **Auto Store/Customer Creation**: Automatic entity creation when needed

### Field Sales Activities

- **GPS Check-ins**: Location-based store visits with photo uploads
- **Visit History**: Complete tracking of field activities
- **Real-time Updates**: Live status updates and notifications

### Admin Dashboard

- **Order Approval**: Review and confirm pending orders
- **Store Management**: Comprehensive store and customer data
- **Analytics**: Performance tracking and reporting

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: Server Actions (no API routes)

## 📱 Responsive Design

Fully responsive application optimized for:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## � Deployment to Vercel

### Quick Deploy

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Set Environment Variables**:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```
3. **Deploy**: Vercel will automatically build and deploy

### Common Issues & Solutions

#### 1. Prisma Client Issues

Ensure these scripts exist in `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

#### 2. Database Connection Timeout

Update `vercel.json` for longer function timeouts:

```json
{
  "functions": {
    "app/**": {
      "maxDuration": 10
    }
  }
}
```

#### 3. Migration Issues

Run migrations manually:

```bash
npx prisma migrate deploy
```

#### 4. Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

### Build Script

Use the included build script for local testing:

```bash
chmod +x build.sh
./build.sh
```

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── orders/            # Order creation
│   ├── order-history/     # Order tracking
│   ├── admin/             # Admin dashboard
│   └── field-visits/      # GPS check-ins
├── lib/
│   ├── actions/           # Server actions
│   ├── prisma.ts          # Database client
│   └── utils.ts           # Utilities
├── components/            # Reusable UI components
└── types/                 # TypeScript definitions
```

## 🔧 Development

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm/yarn/pnpm

### Setup

1. Clone repository
2. Install dependencies: `npm install`
3. Setup database: `npx prisma migrate dev`
4. Run development server: `npm run dev`

### Key Server Actions

- `/lib/actions/orders.ts` - Order management
- `/lib/actions/field-visits.ts` - GPS tracking
- `/lib/actions/stores.ts` - Store/sales rep data

## 📊 Database Schema

Built with Prisma ORM featuring:

- **Orders**: Customer orders with admin approval
- **FieldVisits**: GPS-tracked store visits
- **Stores**: Store locations and information
- **SalesReps**: Sales representative data
- **Customers**: Customer management

## 🔒 Security Features

- Server-side validation
- CORS protection via middleware
- Input sanitization
- Error boundaries for graceful failures

## 📝 API Documentation

This application uses **Server Actions** instead of API routes for better performance and type safety. All data operations are handled server-side with automatic revalidation.
│ ├── field-activity/ # Aktivitas sales lapangan
│ ├── reports/ # Laporan dan analytics
│ └── profile/ # Profile & target achievements
├── components/ # Reusable components
│ └── Navigation.tsx # Komponen navigasi
├── lib/ # Utilities dan data
│ ├── mockData.ts # Sample data untuk demo
│ └── utils.ts # Helper functions
└── types/ # TypeScript type definitions
└── index.ts # Interface dan types

````

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm atau yarn

### Installation

1. Clone repository ini
2. Install dependencies:

```bash
npm install
````

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
