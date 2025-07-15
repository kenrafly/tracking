"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Package,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { getOrders } from "@/lib/actions/orders";

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("PENDING_CONFIRMATION");
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(
    null
  );

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);

      const params: { status?: string; requiresConfirmation?: boolean } = {};

      if (filter !== "ALL") {
        if (filter === "PENDING_CONFIRMATION") {
          params.requiresConfirmation = true;
          params.status = "PENDING_CONFIRMATION";
        } else {
          params.status = filter;
        }
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
  }, [filter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const confirmOrder = async (
    orderId: string,
    approve: boolean,
    adminNotes?: string
  ) => {
    try {
      setProcessingOrderId(orderId);

      const response = await fetch(`/api/orders/${orderId}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approve,
          adminNotes: adminNotes || null,
          confirmedBy: "Admin", // In real app, this would be the current admin user
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          approve ? "Order berhasil dikonfirmasi!" : "Order berhasil ditolak!"
        );
        loadOrders(); // Reload orders
      } else {
        alert("Gagal memproses order: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Gagal memproses order. Coba lagi nanti.");
    } finally {
      setProcessingOrderId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      NEW: { color: "bg-blue-100 text-blue-800", label: "Baru" },
      PENDING_CONFIRMATION: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Menunggu Konfirmasi",
      },
      IN_PROCESS: {
        color: "bg-orange-100 text-orange-800",
        label: "Dalam Proses",
      },
      COMPLETED: { color: "bg-green-100 text-green-800", label: "Selesai" },
      CANCELED: { color: "bg-red-100 text-red-800", label: "Dibatal" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.NEW;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
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
          Admin - Konfirmasi Orders
        </h1>
        <p className="mt-2 text-gray-600">
          Kelola dan konfirmasi orders yang memerlukan persetujuan admin
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {[
            { value: "PENDING_CONFIRMATION", label: "Menunggu Konfirmasi" },
            { value: "NEW", label: "Baru" },
            { value: "IN_PROCESS", label: "Dalam Proses" },
            { value: "COMPLETED", label: "Selesai" },
            { value: "CANCELED", label: "Dibatal" },
            { value: "ALL", label: "Semua" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Tidak ada orders
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Tidak ada orders dengan filter yang dipilih.
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(-8)}
                    </h3>
                    {getStatusBadge(order.status)}
                    {order.requiresConfirmation && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Perlu Konfirmasi
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      {formatDate(order.orderDate)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Customer
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{order.customer.name}</p>
                      {order.customer.email && <p>{order.customer.email}</p>}
                      {order.customer.phone && <p>{order.customer.phone}</p>}
                    </div>
                  </div>

                  {/* Store Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Toko
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{order.store.name}</p>
                      <p>{order.store.address}</p>
                    </div>
                  </div>

                  {/* Sales Rep Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Sales Rep
                    </h4>
                    <div className="text-sm text-gray-600">
                      {order.salesRep ? (
                        <>
                          <p className="font-medium">{order.salesRep.name}</p>
                          <p>ID: {order.salesRep.employeeId}</p>
                        </>
                      ) : (
                        <p className="text-gray-400">-</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
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
                              {item.quantity} × {formatCurrency(item.price)} ={" "}
                              {formatCurrency(item.total)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {(order.notes || order.adminNotes) && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
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

                {/* Action Buttons for Pending Orders */}
                {order.status === "PENDING_CONFIRMATION" && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        const adminNotes = prompt("Catatan admin (opsional):");
                        confirmOrder(order.id, true, adminNotes || undefined);
                      }}
                      disabled={processingOrderId === order.id}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {processingOrderId === order.id
                        ? "Processing..."
                        : "Setujui"}
                    </button>
                    <button
                      onClick={() => {
                        const adminNotes = prompt("Alasan penolakan:");
                        if (adminNotes) {
                          confirmOrder(order.id, false, adminNotes);
                        }
                      }}
                      disabled={processingOrderId === order.id}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Tolak
                    </button>
                  </div>
                )}

                {/* Confirmation Info */}
                {order.confirmedAt && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
