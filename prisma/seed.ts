import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sales representatives
  const salesReps = await Promise.all([
    prisma.salesRepresentative.upsert({
      where: { employeeId: "EMP001" },
      update: {},
      create: {
        name: "Ahmad Rizki",
        email: "ahmad.rizki@company.com",
        phone: "+62812345678",
        employeeId: "EMP001",
        territory: ["Jakarta Utara", "Jakarta Pusat"],
        target: 50000000,
        achieved: 35000000,
      },
    }),
    prisma.salesRepresentative.upsert({
      where: { employeeId: "EMP002" },
      update: {},
      create: {
        name: "Sari Dewi",
        email: "sari.dewi@company.com",
        phone: "+62812345679",
        employeeId: "EMP002",
        territory: ["Jakarta Selatan", "Jakarta Timur"],
        target: 45000000,
        achieved: 32000000,
      },
    }),
  ]);

  // Create stores
  const stores = await Promise.all([
    prisma.store.upsert({
      where: { id: "store-1" },
      update: {},
      create: {
        id: "store-1",
        name: "Toko Maju Jaya",
        address: "Jl. Raya Kemayoran No. 45, Jakarta Pusat",
        phone: "+62215551234",
        latitude: -6.1744,
        longitude: 106.8294,
      },
    }),
    prisma.store.upsert({
      where: { id: "store-2" },
      update: {},
      create: {
        id: "store-2",
        name: "Warung Berkah",
        address: "Jl. Mangga Besar No. 23, Jakarta Barat",
        phone: "+62215551235",
        latitude: -6.1516,
        longitude: 106.8217,
      },
    }),
    prisma.store.upsert({
      where: { id: "store-3" },
      update: {},
      create: {
        id: "store-3",
        name: "Mini Market Sejahtera",
        address: "Jl. Sudirman No. 89, Jakarta Selatan",
        phone: "+62215551236",
        latitude: -6.2088,
        longitude: 106.8456,
      },
    }),
    prisma.store.upsert({
      where: { id: "store-4" },
      update: {},
      create: {
        id: "store-4",
        name: "Toko Serba Ada",
        address: "Jl. Gatot Subroto No. 12, Jakarta Timur",
        phone: "+62215551237",
        latitude: -6.2297,
        longitude: 106.8397,
      },
    }),
    prisma.store.upsert({
      where: { id: "store-5" },
      update: {},
      create: {
        id: "store-5",
        name: "Warung Pak Haji",
        address: "Jl. Kebon Jeruk No. 67, Jakarta Barat",
        phone: "+62215551238",
        latitude: -6.1951,
        longitude: 106.7845,
      },
    }),
  ]);

  console.log("✅ Seeding completed!");
  console.log(`Created ${salesReps.length} sales representatives`);
  console.log(`Created ${stores.length} stores`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
