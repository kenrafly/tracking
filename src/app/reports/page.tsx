"use client";

import { useState, useMemo } from "react";
import {
  Download,
  TrendingUp,
  ShoppingCart,
  Users,
  Building,
} from "lucide-react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { mockOrders, mockStores } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [selectedStore, setSelectedStore] = useState("all");

  // Generate reports data
  const reportsData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter orders based on selected period
    let filteredOrders = mockOrders;

    if (selectedPeriod === "thisMonth") {
      filteredOrders = mockOrders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return (
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear
        );
      });
    } else if (selectedPeriod === "lastMonth") {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      filteredOrders = mockOrders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return (
          orderDate.getMonth() === lastMonth &&
          orderDate.getFullYear() === lastMonthYear
        );
      });
    } else if (selectedPeriod === "thisYear") {
      filteredOrders = mockOrders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getFullYear() === currentYear;
      });
    }

    // Filter by store if selected
    if (selectedStore !== "all") {
      filteredOrders = filteredOrders.filter(
        (order) => order.storeId === selectedStore
      );
    }

    // Calculate overall stats
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Status breakdown
    const statusBreakdown = {
      new: filteredOrders.filter((o) => o.status === "new").length,
      "in-process": filteredOrders.filter((o) => o.status === "in-process")
        .length,
      completed: filteredOrders.filter((o) => o.status === "completed").length,
      canceled: filteredOrders.filter((o) => o.status === "canceled").length,
    };

    // Store performance
    const storePerformance = mockStores
      .map((store) => {
        const storeOrders = filteredOrders.filter(
          (order) => order.storeId === store.id
        );
        return {
          store: store.name,
          orders: storeOrders.length,
          revenue: storeOrders.reduce(
            (sum, order) => sum + order.totalAmount,
            0
          ),
          avgOrderValue:
            storeOrders.length > 0
              ? storeOrders.reduce((sum, order) => sum + order.totalAmount, 0) /
                storeOrders.length
              : 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthOrders = mockOrders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return (
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        );
      });

      monthlyTrend.push({
        month: date.toLocaleDateString("id-ID", { month: "short" }),
        orders: monthOrders.length,
        revenue: monthOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      });
    }

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusBreakdown,
      storePerformance,
      monthlyTrend,
    };
  }, [selectedPeriod, selectedStore]);

  const statusChartData = [
    { name: "Baru", value: reportsData.statusBreakdown.new, color: "#0088FE" },
    {
      name: "Dalam Proses",
      value: reportsData.statusBreakdown["in-process"],
      color: "#00C49F",
    },
    {
      name: "Selesai",
      value: reportsData.statusBreakdown.completed,
      color: "#FFBB28",
    },
    {
      name: "Dibatal",
      value: reportsData.statusBreakdown.canceled,
      color: "#FF8042",
    },
  ];

  const handleExportReport = () => {
    // In a real app, this would generate and download a report file
    alert("Laporan akan diunduh dalam format Excel/PDF");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
            <p className="mt-2 text-gray-600">
              Analisis performa penjualan dan order
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={handleExportReport}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Laporan
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Period Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="thisMonth">Bulan Ini</option>
                <option value="lastMonth">Bulan Lalu</option>
                <option value="thisYear">Tahun Ini</option>
                <option value="all">Semua Waktu</option>
              </select>
            </div>

            {/* Store Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toko
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
              >
                <option value="all">Semua Toko</option>
                {mockStores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reportsData.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(reportsData.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Rata-rata Order
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(reportsData.averageOrderValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Trend Bulanan
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportsData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "orders" ? value : formatCurrency(value),
                  name === "orders" ? "Orders" : "Revenue",
                ]}
              />
              <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribusi Status Order
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
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
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Store Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Performa per Toko
          </h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toko
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rata-rata Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportsData.storePerformance.map((store, index) => {
                const percentage =
                  reportsData.totalRevenue > 0
                    ? (store.revenue / reportsData.totalRevenue) * 100
                    : 0;
                return (
                  <tr key={store.store}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Building className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {store.store}
                          </div>
                          <div className="text-sm text-gray-500">
                            Rank #{index + 1}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {store.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(store.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(store.avgOrderValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 font-medium">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
