// Types for Order Management and Field Sales system

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeId: string;
  store?: Store;
}

export type OrderStatus = "new" | "in-process" | "completed" | "canceled";

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  customer?: Customer;
  storeId: string;
  store?: Store;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: Date;
  completedAt?: Date;
  canceledAt?: Date;
  notes?: string;
}

export interface SalesRepresentative {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  territory: string[];
  target: number;
  achieved: number;
}

export interface FieldVisit {
  id: string;
  salesRepId: string;
  salesRep?: SalesRepresentative;
  storeId: string;
  store?: Store;
  visitDate: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  latitude: number;
  longitude: number;
  photos: string[];
  notes?: string;
  visitPurpose: string;
  result?: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  pendingOrders: number;
  completedOrders: number;
  canceledOrders: number;
  topStores: Array<{
    store: Store;
    orderCount: number;
    revenue: number;
  }>;
}

export interface OrderReport {
  period: string;
  storeId?: string;
  storeName?: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusBreakdown: Record<OrderStatus, number>;
}

export interface SalesTarget {
  id: string;
  salesRepId: string;
  period: string;
  target: number;
  achieved: number;
  percentage: number;
}
