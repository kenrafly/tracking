"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Plus, Eye, Edit, MoreHorizontal } from "lucide-react";
import { mockOrders, getCustomerById, getStoreById } from "@/lib/mockData";
import {
  formatCurrency,
  formatDate,
  getOrderStatusColor,
  getOrderStatusText,
} from "@/lib/utils";
import { OrderStatus } from "@/types";

type FilterStatus = "all" | OrderStatus;

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Enhanced orders with customer and store data
  const enhancedOrders = useMemo(() => {
    return mockOrders.map((order) => ({
      ...order,
      customer: getCustomerById(order.customerId),
      store: getStoreById(order.storeId),
    }));
  }, []);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    const filtered = enhancedOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.store?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.orderDate).getTime();
          bValue = new Date(b.orderDate).getTime();
          break;
        case "amount":
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.orderDate).getTime();
          bValue = new Date(b.orderDate).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [enhancedOrders, searchTerm, statusFilter, sortBy, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manajemen Order
            </h1>
            <p className="mt-2 text-gray-600">
              Kelola dan pantau semua pesanan pelanggan
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Order
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cari order, customer, atau store..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as FilterStatus)
                }
              >
                <option value="all">Semua Status</option>
                <option value="new">Baru</option>
                <option value="in-process">Dalam Proses</option>
                <option value="completed">Selesai</option>
                <option value="canceled">Dibatal</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split("-");
                  setSortBy(newSortBy as "date" | "amount" | "status");
                  setSortOrder(newSortOrder as "asc" | "desc");
                }}
              >
                <option value="date-desc">Tanggal Terbaru</option>
                <option value="date-asc">Tanggal Terlama</option>
                <option value="amount-desc">Nilai Tertinggi</option>
                <option value="amount-asc">Nilai Terendah</option>
                <option value="status-asc">Status A-Z</option>
                <option value="status-desc">Status Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredOrders.length === 0 ? (
            <li className="p-8 text-center">
              <div className="text-gray-500">
                <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Tidak ada order ditemukan
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Coba ubah filter atau kata kunci pencarian.
                </p>
              </div>
            </li>
          ) : (
            filteredOrders.map((order) => (
              <li key={order.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-900">
                            #{order.id.slice(-3)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            Order #{order.id}
                          </p>
                          <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(
                              order.status
                            )}`}
                          >
                            {getOrderStatusText(order.status)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">
                            {order.customer?.name} • {order.store?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.orderDate)} • {order.items.length}{" "}
                            item(s)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          title="Lihat Detail"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          title="Edit Order"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          title="Opsi Lainnya"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mt-4 ml-14">
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Item Pesanan
                      </p>
                      <div className="mt-2 space-y-1">
                        {order.items.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              {item.quantity}x {item.productName}
                            </span>
                            <span className="text-gray-900 font-medium">
                              {formatCurrency(item.total)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{order.items.length - 2} item lainnya
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Pagination would go here */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Menampilkan {filteredOrders.length} dari {enhancedOrders.length}{" "}
            order
          </p>
        </div>
      )}
    </div>
  );
}
