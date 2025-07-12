"use client";

import { useState, useRef, useEffect } from "react";
import {
  Camera,
  CheckCircle,
  Navigation,
  Users,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { getCurrentPosition } from "@/lib/utils";

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
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

export default function SalesFieldPage() {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [visitPurpose, setVisitPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [stores, setStores] = useState<Store[]>([]);
  const [currentSalesRep, setCurrentSalesRep] = useState<SalesRep | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data on component mount
  useEffect(() => {
    loadStores();
    loadSalesReps();
  }, []);

  const loadStores = async () => {
    try {
      const response = await fetch("/api/stores");
      const result = await response.json();
      if (result.success) {
        setStores(result.data);
      }
    } catch (error) {
      console.error("Error loading stores:", error);
    }
  };

  const loadSalesReps = async () => {
    try {
      const response = await fetch("/api/sales-reps");
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setCurrentSalesRep(result.data[0]); // Use first sales rep as current user
      }
    } catch (error) {
      console.error("Error loading sales reps:", error);
    }
  };

  const handleGetLocation = async () => {
    try {
      setIsCheckingIn(true);
      const position = await getCurrentPosition();
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    } catch (error) {
      console.error("Error getting location:", error);
      alert(
        "Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan."
      );
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string);
            if (newPhotos.length === files.length) {
              setPhotos((prev) => [...prev, ...newPhotos]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleCheckIn = async () => {
    if (!currentLocation) {
      alert("Lokasi belum didapatkan. Klik tombol GPS terlebih dahulu.");
      return;
    }

    if (!selectedStore) {
      alert("Pilih toko yang dikunjungi terlebih dahulu.");
      return;
    }

    if (!visitPurpose) {
      alert("Pilih tujuan kunjungan terlebih dahulu.");
      return;
    }

    if (!currentSalesRep) {
      alert("Data sales representative tidak ditemukan.");
      return;
    }

    try {
      setIsSaving(true);

      // Save to database via API
      const response = await fetch("/api/field-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salesRepId: currentSalesRep.id,
          storeId: selectedStore,
          visitPurpose,
          notes,
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          photos,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          result.message ||
            "Check-in berhasil! Data kunjungan telah disimpan ke database."
        );

        // Reset form
        setCurrentLocation(null);
        setPhotos([]);
        setSelectedStore("");
        setVisitPurpose("");
        setNotes("");
      } else {
        alert("Gagal menyimpan data: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving check-in:", error);
      alert("Gagal menyimpan data. Coba lagi nanti.");
    } finally {
      setIsSaving(false);
    }
  };

  const openInMaps = () => {
    if (!currentLocation) {
      alert("Lokasi belum didapatkan. Ambil lokasi GPS terlebih dahulu.");
      return;
    }

    const { lat, lng } = currentLocation;
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  const getSelectedStore = () => {
    return stores.find((store) => store.id === selectedStore);
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
              Check-in Kunjungan
            </h1>
            <p className="mt-2 text-gray-600">
              Form check-in untuk sales lapangan - {currentSalesRep.name}
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

      {/* Check-in Form */}
      <div className="max-w-2xl">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Check-in Kunjungan Baru
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Catat bukti kunjungan lapangan dengan lokasi GPS dan foto
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Store Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Toko *
              </label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="">Pilih toko yang dikunjungi</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} - {store.address}
                  </option>
                ))}
              </select>

              {/* Store location info */}
              {selectedStore &&
                getSelectedStore()?.latitude &&
                getSelectedStore()?.longitude && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-blue-700">
                        <p className="font-medium">
                          {getSelectedStore()?.name}
                        </p>
                        <p>
                          Lat: {getSelectedStore()?.latitude?.toFixed(6)}, Lng:{" "}
                          {getSelectedStore()?.longitude?.toFixed(6)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const store = getSelectedStore();
                          if (store?.latitude && store?.longitude) {
                            const url = `https://www.google.com/maps?q=${store.latitude},${store.longitude}`;
                            window.open(url, "_blank");
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <MapPin className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
            </div>

            {/* Visit Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tujuan Kunjungan *
              </label>
              <select
                value={visitPurpose}
                onChange={(e) => setVisitPurpose(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="">Pilih tujuan kunjungan</option>
                <option value="sales">Sales Visit</option>
                <option value="followup">Follow-up Visit</option>
                <option value="newcustomer">New Customer Visit</option>
                <option value="collection">Collection Visit</option>
                <option value="survey">Survey Visit</option>
                <option value="delivery">Delivery Visit</option>
                <option value="maintenance">Maintenance Visit</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi GPS *
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isCheckingIn}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {isCheckingIn ? "Mendapatkan Lokasi..." : "Ambil Lokasi GPS"}
                </button>
                {currentLocation && (
                  <>
                    <span className="text-sm text-green-600 font-medium">
                      📍 Lokasi berhasil didapat
                    </span>
                    <button
                      type="button"
                      onClick={openInMaps}
                      className="inline-flex items-center px-3 py-1 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Buka di Maps
                    </button>
                  </>
                )}
              </div>
              {currentLocation && (
                <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
                  <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
                </div>
              )}
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Kunjungan
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Tambah Foto
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />

                {photos.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {photos.length} foto telah dipilih
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo}
                            alt={`Foto ${index + 1}`}
                            className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPhotos((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Kunjungan
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tuliskan catatan mengenai kunjungan ini..."
              />
            </div>

            {/* Check-in Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={
                  !currentLocation ||
                  !selectedStore ||
                  !visitPurpose ||
                  isSaving
                }
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {isSaving ? "Menyimpan..." : "Check-in Kunjungan"}
              </button>
              {(!currentLocation || !selectedStore || !visitPurpose) &&
                !isSaving && (
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    * Lengkapi semua field yang wajib diisi
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
