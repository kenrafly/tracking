"use client";

import { useState, useEffect, useTransition } from "react";
import { ShoppingCart, Plus, Trash2, Users } from "lucide-react";
import { createOrder } from "@/lib/actions/orders";
import { getStores, getSalesReps } from "@/lib/actions/stores";

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string | null;
}

interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  employeeId: string;
  territory: string[];
  target: number;
  achieved: number;
}

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export default function OrdersPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [currentSalesRep, setCurrentSalesRep] = useState<SalesRep | null>(null);
  const [, startTransition] = useTransition();

  // Form states
  const [selectedStore, setSelectedStore] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [useExistingStore, setUseExistingStore] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([
    { productName: "", quantity: 1, price: 0 },
  ]);

  // Load data on component mount
  useEffect(() => {
    loadStores();
    loadSalesReps();
  }, []);

  const loadStores = async () => {
    try {
      const result = await getStores();
      if (result.success) {
        setStores(result.data);
      }
    } catch (error) {
      console.error("Error loading stores:", error);
    }
  };

  const loadSalesReps = async () => {
    try {
      const result = await getSalesReps();
      if (result.success && result.data.length > 0) {
        setCurrentSalesRep(result.data[0]); // Use first sales rep as current user
      }
    } catch (error) {
      console.error("Error loading sales reps:", error);
    }
  };

  const addItem = () => {
    setItems([...items, { productName: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    const updatedItems = [...items];
    if (field === "quantity" || field === "price") {
      updatedItems[index][field] = Number(value);
    } else {
      updatedItems[index][field] = value as string;
    }
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const handleSubmitOrder = async () => {
    // Validation
    if (!currentSalesRep) {
      alert("Data sales representative tidak ditemukan.");
      return;
    }

    if (useExistingStore && !selectedStore) {
      alert("Pilih toko terlebih dahulu.");
      return;
    }

    if (!useExistingStore && !storeName) {
      alert("Masukkan nama toko.");
      return;
    }

    if (!customerName) {
      alert("Masukkan nama customer.");
      return;
    }

    if (
      items.some(
        (item) => !item.productName || item.quantity <= 0 || item.price <= 0
      )
    ) {
      alert("Lengkapi semua item produk dengan benar.");
      return;
    }

    try {
      setIsSaving(true);

      startTransition(async () => {
        try {
          const result = await createOrder({
            salesRepId: currentSalesRep.id,
            storeId: useExistingStore ? selectedStore : undefined,
            storeName: useExistingStore ? undefined : storeName,
            storeAddress: useExistingStore ? undefined : storeAddress,
            customerName,
            customerEmail: customerEmail || undefined,
            customerPhone: customerPhone || undefined,
            items,
            notes: notes || undefined,
            requiresConfirmation,
          });

          if (result.success) {
            alert(result.message);

            // Reset form
            setSelectedStore("");
            setStoreName("");
            setStoreAddress("");
            setCustomerName("");
            setCustomerEmail("");
            setCustomerPhone("");
            setNotes("");
            setRequiresConfirmation(false);
            setItems([{ productName: "", quantity: 1, price: 0 }]);
          } else {
            alert(
              "Gagal menyimpan order: " + (result.error || "Unknown error")
            );
          }
        } catch (error) {
          console.error("Error saving order:", error);
          alert("Gagal menyimpan order. Coba lagi nanti.");
        } finally {
          setIsSaving(false);
        }
      });
    } catch (error) {
      console.error("Error in handleSubmitOrder:", error);
      setIsSaving(false);
    }
  };

  if (!currentSalesRep) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Buat Order Baru
            </h1>
            <p className="mt-2 text-gray-600">
              Form pembuatan order untuk sales lapangan - {currentSalesRep.name}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-500">ID Sales</p>
              <p className="font-semibold text-gray-900">
                {currentSalesRep.employeeId}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <div className="max-w-3xl">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Detail Order
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Isi detail order dan customer untuk diproses
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Store Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Toko *
              </label>

              {/* Toggle between existing and new store */}
              <div className="mb-4">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="storeType"
                      checked={useExistingStore}
                      onChange={() => setUseExistingStore(true)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Pilih dari daftar toko
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="storeType"
                      checked={!useExistingStore}
                      onChange={() => setUseExistingStore(false)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Toko baru</span>
                  </label>
                </div>
              </div>

              {useExistingStore ? (
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="">Pilih toko</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name} - {store.address}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Nama Toko *
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Masukkan nama toko"
                      className="block w-full px-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Alamat Toko
                    </label>
                    <input
                      type="text"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      placeholder="Masukkan alamat toko (opsional)"
                      className="block w-full px-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Informasi Customer
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Customer *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Masukkan nama customer"
                    className="block w-full px-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Customer
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@customer.com"
                    className="block w-full px-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telepon Customer
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="block w-full px-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">
                  Item Order
                </h4>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) =>
                          updateItem(index, "productName", e.target.value)
                        }
                        placeholder="Nama produk"
                        className="block w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      />
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                        placeholder="Qty"
                        min="1"
                        className="block w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(index, "price", e.target.value)
                        }
                        placeholder="Harga"
                        min="0"
                        step="0.01"
                        className="block w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      />
                    </div>
                    <div className="w-32 text-sm font-medium text-gray-900">
                      Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    Rp {calculateTotal().toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Order
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Catatan tambahan untuk order ini..."
              />
            </div>

            {/* Confirmation Requirement */}
            <div className="border-t pt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={requiresConfirmation}
                  onChange={(e) => setRequiresConfirmation(e.target.checked)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Order ini memerlukan konfirmasi admin sebelum diproses
                </span>
              </label>
              {requiresConfirmation && (
                <p className="mt-2 text-xs text-orange-600">
                  💡 Order akan berstatus &quot;Menunggu Konfirmasi&quot; hingga
                  admin menyetujui
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={isSaving || calculateTotal() === 0}
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isSaving ? "Menyimpan..." : "Buat Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
