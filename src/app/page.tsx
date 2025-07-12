"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  TrendingUp,
  MapPin,
  DollarSign,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { mockOrders, mockStores, mockFieldVisits } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { DashboardStats } from "@/types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // Calculate dashboard statistics
    const totalOrders = mockOrders.length;
    const totalRevenue = mockOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const ordersThisMonth = mockOrders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    }).length;

    const revenueThisMonth = mockOrders
      .filter((order) => {
        const orderDate = new Date(order.orderDate);
        return (
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const pendingOrders = mockOrders.filter(
      (order) => order.status === "new" || order.status === "in-process"
    ).length;

    const completedOrders = mockOrders.filter(
      (order) => order.status === "completed"
    ).length;
    const canceledOrders = mockOrders.filter(
      (order) => order.status === "canceled"
    ).length;

    // Calculate top stores
    const storeStats = mockStores
      .map((store) => {
        const storeOrders = mockOrders.filter(
          (order) => order.storeId === store.id
        );
        return {
          store,
          orderCount: storeOrders.length,
          revenue: storeOrders.reduce(
            (sum, order) => sum + order.totalAmount,
            0
          ),
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    setStats({
      totalOrders,
      totalRevenue,
      ordersThisMonth,
      revenueThisMonth,
      pendingOrders,
      completedOrders,
      canceledOrders,
      topStores: storeStats,
    });
  }, []);

  // Chart data
  const orderStatusData = [
    { name: "Baru", value: stats?.pendingOrders || 0, status: "new" },
    {
      name: "Dalam Proses",
      value: mockOrders.filter((o) => o.status === "in-process").length,
      status: "in-process",
    },
    {
      name: "Selesai",
      value: stats?.completedOrders || 0,
      status: "completed",
    },
    { name: "Dibatal", value: stats?.canceledOrders || 0, status: "canceled" },
  ];

  const monthlyOrdersData = [
    { month: "Jan", orders: 45, revenue: 12500000 },
    { month: "Feb", orders: 52, revenue: 14200000 },
    { month: "Mar", orders: 48, revenue: 13100000 },
    { month: "Apr", orders: 61, revenue: 16800000 },
    { month: "May", orders: 55, revenue: 15300000 },
    { month: "Jun", orders: 67, revenue: 18200000 },
    {
      month: "Jul",
      orders: stats?.ordersThisMonth || 0,
      revenue: stats?.revenueThisMonth || 0,
    },
  ];

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Ringkasan aktivitas order dan sales lapangan
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Orders Bulan Ini
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.ordersThisMonth}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Kunjungan Lapangan
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockFieldVisits.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Order Status Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status Orders
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Orders Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Orders per Bulan
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyOrdersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "orders" ? value : formatCurrency(value),
                  name === "orders" ? "Orders" : "Revenue",
                ]}
              />
              <Bar dataKey="orders" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Stores */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Performing Stores
          </h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Order Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.topStores.slice(0, 5).map((storeData) => (
                <tr key={storeData.store.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {storeData.store.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {storeData.store.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {storeData.orderCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(storeData.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(
                      storeData.orderCount > 0
                        ? storeData.revenue / storeData.orderCount
                        : 0
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
