import {
  Store,
  Customer,
  Order,
  SalesRepresentative,
  FieldVisit,
  OrderStatus,
} from "@/types";

// Mock stores data
export const mockStores: Store[] = [
  {
    id: "1",
    name: "Toko Maju Jaya",
    address: "Jl. Sudirman No. 123, Jakarta",
    phone: "+62 21 123 4567",
    latitude: -6.2088,
    longitude: 106.8456,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Warung Berkah",
    address: "Jl. Kebon Jeruk No. 45, Jakarta",
    phone: "+62 21 234 5678",
    latitude: -6.1944,
    longitude: 106.7708,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    name: "Mini Market Sejahtera",
    address: "Jl. Gatot Subroto No. 78, Jakarta",
    phone: "+62 21 345 6789",
    latitude: -6.2297,
    longitude: 106.8345,
    createdAt: new Date("2024-01-20"),
  },
];

// Mock customers data
export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Budi Santoso",
    email: "budi@tokoberkah.com",
    phone: "+62 812 345 6789",
    storeId: "1",
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    email: "siti@warungberkah.com",
    phone: "+62 813 456 7890",
    storeId: "2",
  },
  {
    id: "3",
    name: "Ahmad Rahman",
    email: "ahmad@minimarket.com",
    phone: "+62 814 567 8901",
    storeId: "3",
  },
];

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: "1",
    customerId: "1",
    storeId: "1",
    items: [
      {
        id: "1",
        productName: "Indomie Goreng",
        quantity: 50,
        price: 3500,
        total: 175000,
      },
      {
        id: "2",
        productName: "Aqua 600ml",
        quantity: 24,
        price: 4000,
        total: 96000,
      },
    ],
    totalAmount: 271000,
    status: "completed" as OrderStatus,
    orderDate: new Date("2024-07-10"),
    completedAt: new Date("2024-07-11"),
  },
  {
    id: "2",
    customerId: "2",
    storeId: "2",
    items: [
      {
        id: "3",
        productName: "Mie Sedaap",
        quantity: 30,
        price: 3200,
        total: 96000,
      },
      {
        id: "4",
        productName: "Teh Botol",
        quantity: 20,
        price: 4500,
        total: 90000,
      },
    ],
    totalAmount: 186000,
    status: "in-process" as OrderStatus,
    orderDate: new Date("2024-07-09"),
  },
  {
    id: "3",
    customerId: "3",
    storeId: "3",
    items: [
      {
        id: "5",
        productName: "Beras Premium 5kg",
        quantity: 10,
        price: 75000,
        total: 750000,
      },
    ],
    totalAmount: 750000,
    status: "new" as OrderStatus,
    orderDate: new Date("2024-07-11"),
  },
  {
    id: "4",
    customerId: "1",
    storeId: "1",
    items: [
      {
        id: "6",
        productName: "Gula Pasir 1kg",
        quantity: 20,
        price: 15000,
        total: 300000,
      },
    ],
    totalAmount: 300000,
    status: "canceled" as OrderStatus,
    orderDate: new Date("2024-07-08"),
    canceledAt: new Date("2024-07-09"),
  },
];

// Mock sales representatives
export const mockSalesReps: SalesRepresentative[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+62 815 123 4567",
    employeeId: "EMP001",
    territory: ["Jakarta Pusat", "Jakarta Selatan"],
    target: 10000000,
    achieved: 7500000,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    phone: "+62 816 234 5678",
    employeeId: "EMP002",
    territory: ["Jakarta Barat", "Jakarta Utara"],
    target: 8000000,
    achieved: 8200000,
  },
];

// Mock field visits
export const mockFieldVisits: FieldVisit[] = [
  {
    id: "1",
    salesRepId: "1",
    storeId: "1",
    visitDate: new Date("2024-07-11"),
    checkInTime: new Date("2024-07-11T09:00:00"),
    checkOutTime: new Date("2024-07-11T10:30:00"),
    latitude: -6.2088,
    longitude: 106.8456,
    photos: ["/api/photos/visit1-1.jpg", "/api/photos/visit1-2.jpg"],
    notes: "Discussed new product lines and promotional offers",
    visitPurpose: "Sales Visit",
    result: "Order placed for Rp 500,000",
  },
  {
    id: "2",
    salesRepId: "2",
    storeId: "2",
    visitDate: new Date("2024-07-10"),
    checkInTime: new Date("2024-07-10T14:00:00"),
    checkOutTime: new Date("2024-07-10T15:15:00"),
    latitude: -6.1944,
    longitude: 106.7708,
    photos: ["/api/photos/visit2-1.jpg"],
    notes: "Customer feedback collection and inventory check",
    visitPurpose: "Follow-up Visit",
    result: "Positive feedback, planning next order",
  },
  {
    id: "3",
    salesRepId: "1",
    storeId: "3",
    visitDate: new Date("2024-07-11"),
    checkInTime: new Date("2024-07-11T11:00:00"),
    latitude: -6.2297,
    longitude: 106.8345,
    photos: ["/api/photos/visit3-1.jpg"],
    notes: "New customer onboarding and product demonstration",
    visitPurpose: "New Customer Visit",
  },
];

// Helper functions to get related data
export const getStoreById = (id: string): Store | undefined => {
  return mockStores.find((store) => store.id === id);
};

export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find((customer) => customer.id === id);
};

export const getSalesRepById = (
  id: string
): SalesRepresentative | undefined => {
  return mockSalesReps.find((rep) => rep.id === id);
};

export const getOrdersByStoreId = (storeId: string): Order[] => {
  return mockOrders.filter((order) => order.storeId === storeId);
};

export const getVisitsBySalesRepId = (salesRepId: string): FieldVisit[] => {
  return mockFieldVisits.filter((visit) => visit.salesRepId === salesRepId);
};

export const getVisitsByStoreId = (storeId: string): FieldVisit[] => {
  return mockFieldVisits.filter((visit) => visit.storeId === storeId);
};
