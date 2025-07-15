"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  Calendar,
  Search,
  Filter,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { getOrders } from "@/lib/actions/orders";
import { getSalesReps } from "@/lib/actions/stores";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  orderDate: Date;
  notes: string | null;
  adminNotes: string | null;
  requiresConfirmation: boolean;
  confirmedAt: Date | null;
  confirmedBy: string | null;
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
  store: {
    id: string;
    name: string;
    address: string;
  };
  salesRep: {
    id: string;
    name: string;
    employeeId: string;
  } | null;
  items: {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }[];
}

interface SalesRep {
  id: string;
  name: string;
  employeeId: string;
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSalesRep, setSelectedSalesRep] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const loadSalesReps = useCallback(async () => {
    try {
      const result = await getSalesReps();
      if (result.success) {
        setSalesReps(result.data);
      }
    } catch (error) {
      console.error("Error loading sales reps:", error);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);

      const params: {
        salesRepId?: string;
        status?: string;
        requiresConfirmation?: boolean;
      } = {};

      if (selectedSalesRep !== "ALL") {
        params.salesRepId = selectedSalesRep;
      }

      if (selectedStatus !== "ALL") {
        params.status = selectedStatus;
      }

      const result = await getOrders(params);

      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedSalesRep, selectedStatus]);

  useEffect(() => {
    loadSalesReps();
  }, [loadSalesReps]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      NEW: {
        color: "bg-blue-100 text-blue-800",
        label: "Baru",
        icon: <Package className="w-3 h-3" />,
      },
      PENDING_CONFIRMATION: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Menunggu Konfirmasi",
        icon: <Clock className="w-3 h-3" />,
      },
      IN_PROCESS: {
        color: "bg-orange-100 text-orange-800",
        label: "Dalam Proses",
        icon: <ShoppingCart className="w-3 h-3" />,
      },
      COMPLETED: {
        color: "bg-green-100 text-green-800",
        label: "Selesai",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      CANCELED: {
        color: "bg-red-100 text-red-800",
        label: "Dibatal",
        icon: <XCircle className="w-3 h-3" />,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.NEW;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${config.color}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.customer.name.toLowerCase().includes(searchLower) ||
      order.store.name.toLowerCase().includes(searchLower) ||
      (order.salesRep?.name || "").toLowerCase().includes(searchLower) ||
      order.items.some((item) =>
        item.productName.toLowerCase().includes(searchLower)
      )
    );
  });

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getOrderProgress = (status: string) => {
    const steps = ["NEW", "PENDING_CONFIRMATION", "IN_PROCESS", "COMPLETED"];
    const currentStep = steps.indexOf(status);
    const totalSteps = steps.length - 1;

    if (status === "CANCELED") return { percent: 0, color: "bg-red-500" };

    const percent = ((currentStep + 1) / totalSteps) * 100;
    const color = status === "COMPLETED" ? "bg-green-500" : "bg-blue-500";

    return { percent, color };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Riwayat & Status Order
        </h1>
        <p className="mt-2 text-gray-600">
          Pantau progress dan riwayat semua order yang telah dibuat
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Cari order, customer, toko, atau produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Sales Rep Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={selectedSalesRep}
              onChange={(e) => setSelectedSalesRep(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="ALL">Semua Sales Rep</option>
              {salesReps.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.name} ({rep.employeeId})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="ALL">Semua Status</option>
              <option value="NEW">Baru</option>
              <option value="PENDING_CONFIRMATION">Menunggu Konfirmasi</option>
              <option value="IN_PROCESS">Dalam Proses</option>
              <option value="COMPLETED">Selesai</option>
              <option value="CANCELED">Dibatal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Tidak ada orders
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Tidak ada orders yang cocok dengan filter yang dipilih.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const progress = getOrderProgress(order.status);
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id.slice(-8)}
                      </h3>
                      {getStatusBadge(order.status)}
                      {order.requiresConfirmation &&
                        order.status === "PENDING_CONFIRMATION" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Perlu Konfirmasi Admin
                          </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(order.orderDate)}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress Order</span>
                      <span>{progress.percent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${progress.color}`}
                        style={{ width: `${progress.percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Customer</p>
                        <p className="font-medium">{order.customer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Toko</p>
                        <p className="font-medium">{order.store.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Sales Rep</p>
                        <p className="font-medium">
                          {order.salesRep ? order.salesRep.name : "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      {/* Order Items */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Items Order
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center"
                              >
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-gray-900">
                                    {index + 1}. {item.productName}
                                  </span>
                                </div>
                                <div className="text-right text-sm text-gray-600">
                                  <span>
                                    {item.quantity} ×{" "}
                                    {formatCurrency(item.price)} ={" "}
                                    {formatCurrency(item.total)}
                                  </span>
                                </div>
                              </div>
                            ))}
                            <div className="pt-2 border-t border-gray-200">
                              <div className="flex justify-between items-center font-semibold">
                                <span>Total:</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Detail Customer
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-3 text-sm">
                            <p>
                              <strong>Nama:</strong> {order.customer.name}
                            </p>
                            {order.customer.email && (
                              <p>
                                <strong>Email:</strong> {order.customer.email}
                              </p>
                            )}
                            {order.customer.phone && (
                              <p>
                                <strong>Telepon:</strong> {order.customer.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Detail Toko
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-3 text-sm">
                            <p>
                              <strong>Nama:</strong> {order.store.name}
                            </p>
                            <p>
                              <strong>Alamat:</strong> {order.store.address}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {(order.notes || order.adminNotes) && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Catatan
                          </h4>
                          {order.notes && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-2">
                              <p className="text-sm text-blue-900">
                                <strong>Sales:</strong> {order.notes}
                              </p>
                            </div>
                          )}
                          {order.adminNotes && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-900">
                                <strong>Admin:</strong> {order.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Confirmation Details */}
                      {order.confirmedAt && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm text-green-800">
                            <strong>Dikonfirmasi pada:</strong>{" "}
                            {formatDate(order.confirmedAt)}
                            {order.confirmedBy && (
                              <span> oleh {order.confirmedBy}</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      {filteredOrders.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ringkasan
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {[
              "NEW",
              "PENDING_CONFIRMATION",
              "IN_PROCESS",
              "COMPLETED",
              "CANCELED",
            ].map((status) => {
              const count = filteredOrders.filter(
                (order) => order.status === status
              ).length;
              const total = filteredOrders.reduce(
                (sum, order) =>
                  order.status === status ? sum + order.totalAmount : sum,
                0
              );

              return (
                <div key={status} className="border rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {count}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    {status.replace("_", " ").toLowerCase()}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatCurrency(total)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
