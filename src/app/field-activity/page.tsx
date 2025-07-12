"use client";

import { useState, useRef } from "react";
import { MapPin, Camera, CheckCircle, Navigation } from "lucide-react";
import { mockFieldVisits, getSalesRepById, getStoreById } from "@/lib/mockData";
import { formatDateTime, getCurrentPosition } from "@/lib/utils";
import Image from "next/image";

export default function FieldActivityPage() {
  const [activeTab, setActiveTab] = useState<"visits" | "checkin">("visits");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced visits with sales rep and store data
  const enhancedVisits = mockFieldVisits.map((visit) => ({
    ...visit,
    salesRep: getSalesRepById(visit.salesRepId),
    store: getStoreById(visit.storeId),
  }));

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

  const handleCheckIn = () => {
    if (!currentLocation) {
      alert("Lokasi belum didapatkan. Klik tombol GPS terlebih dahulu.");
      return;
    }

    // Here you would typically save the check-in data
    alert("Check-in berhasil! Data kunjungan telah disimpan.");

    // Reset form
    setCurrentLocation(null);
    setPhotos([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Aktivitas Sales Lapangan
        </h1>
        <p className="mt-2 text-gray-600">
          Kelola kunjungan dan check-in lapangan
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("visits")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "visits"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Riwayat Kunjungan
          </button>
          <button
            onClick={() => setActiveTab("checkin")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "checkin"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Check-in Kunjungan
          </button>
        </nav>
      </div>

      {activeTab === "visits" && (
        <div className="space-y-6">
          {/* Visits List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {enhancedVisits.map((visit) => (
                <li key={visit.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {visit.store?.name}
                            </p>
                            {visit.checkOutTime && (
                              <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-600">
                              Sales: {visit.salesRep?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDateTime(visit.checkInTime)}
                              {visit.checkOutTime && (
                                <> - {formatDateTime(visit.checkOutTime)}</>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {visit.visitPurpose}
                        </p>
                        <p className="text-xs text-gray-400">
                          {visit.photos.length} foto
                        </p>
                      </div>
                    </div>

                    {/* Visit Details */}
                    <div className="mt-4 ml-14">
                      <div className="border-t border-gray-100 pt-3">
                        {visit.notes && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Catatan Kunjungan
                            </p>
                            <p className="mt-1 text-sm text-gray-700">
                              {visit.notes}
                            </p>
                          </div>
                        )}

                        {visit.result && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Hasil Kunjungan
                            </p>
                            <p className="mt-1 text-sm text-gray-700">
                              {visit.result}
                            </p>
                          </div>
                        )}

                        {visit.photos.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                              Foto Kunjungan
                            </p>
                            <div className="flex space-x-2">
                              {visit.photos.slice(0, 3).map((photo, index) => (
                                <div
                                  key={index}
                                  className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center"
                                >
                                  <Camera className="h-6 w-6 text-gray-400" />
                                </div>
                              ))}
                              {visit.photos.length > 3 && (
                                <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">
                                    +{visit.photos.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "checkin" && (
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
                  Pilih Toko
                </label>
                <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md">
                  <option value="">Pilih toko yang dikunjungi</option>
                  <option value="1">Toko Maju Jaya</option>
                  <option value="2">Warung Berkah</option>
                  <option value="3">Mini Market Sejahtera</option>
                </select>
              </div>

              {/* Visit Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tujuan Kunjungan
                </label>
                <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md">
                  <option value="">Pilih tujuan kunjungan</option>
                  <option value="sales">Sales Visit</option>
                  <option value="followup">Follow-up Visit</option>
                  <option value="newcustomer">New Customer Visit</option>
                  <option value="collection">Collection Visit</option>
                  <option value="survey">Survey Visit</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi GPS
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isCheckingIn}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {isCheckingIn
                      ? "Mendapatkan Lokasi..."
                      : "Ambil Lokasi GPS"}
                  </button>
                  {currentLocation && (
                    <span className="text-sm text-green-600 font-medium">
                      📍 Lokasi berhasil didapat
                    </span>
                  )}
                </div>
                {currentLocation && (
                  <div className="mt-2 text-xs text-gray-500">
                    Lat: {currentLocation.lat.toFixed(6)}, Lng:{" "}
                    {currentLocation.lng.toFixed(6)}
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
                    <div className="grid grid-cols-3 gap-3">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={photo}
                            alt={`Foto ${index + 1}`}
                            width={96}
                            height={96}
                            className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      ))}
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
                  disabled={!currentLocation}
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Check-in Kunjungan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
