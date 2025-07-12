"use client";

import { useEffect, useState } from "react";
import { MapPin, Camera, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface FieldVisit {
  id: string;
  salesRep: {
    name: string;
    employeeId: string;
  };
  store: {
    name: string;
    address: string;
  };
  visitPurpose: string;
  checkInTime: string;
  latitude: number;
  longitude: number;
  photos: string[];
  notes: string | null;
}

export default function FieldVisitsPage() {
  const [visits, setVisits] = useState<FieldVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    try {
      const response = await fetch("/api/field-visits");
      const result = await response.json();
      if (result.success) {
        setVisits(result.data);
      }
    } catch (error) {
      console.error("Error loading visits:", error);
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (lat: number, lng: number) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p>Loading field visits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Field Visits History
        </h1>
        <p className="mt-2 text-gray-600">
          Riwayat kunjungan lapangan yang tersimpan di database
        </p>
      </div>

      {/* Visits List */}
      {visits.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Belum ada kunjungan
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Mulai dengan melakukan check-in pertama Anda.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {visits.map((visit) => (
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
                            {visit.store.name}
                          </p>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-500">
                            {formatDateTime(new Date(visit.checkInTime))}
                          </p>
                          <p className="text-xs text-gray-400">
                            {visit.store.address}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900 font-medium">
                        {visit.visitPurpose}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        {visit.salesRep.name} ({visit.salesRep.employeeId})
                      </div>
                    </div>
                  </div>

                  {/* Visit Details */}
                  <div className="mt-4 ml-14">
                    <div className="border-t border-gray-100 pt-3">
                      {/* Location */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Lokasi GPS
                            </p>
                            <p className="mt-1 text-sm text-gray-700">
                              Lat: {visit.latitude.toFixed(6)}, Lng:{" "}
                              {visit.longitude.toFixed(6)}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              openInMaps(visit.latitude, visit.longitude)
                            }
                            className="inline-flex items-center px-2 py-1 border border-blue-300 shadow-sm text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            Buka di Maps
                          </button>
                        </div>
                      </div>

                      {/* Notes */}
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

                      {/* Photos */}
                      {visit.photos.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Foto Kunjungan ({visit.photos.length})
                          </p>
                          <div className="flex space-x-2">
                            {visit.photos.slice(0, 3).map((photo, index) => (
                              <div
                                key={index}
                                className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center"
                              >
                                {photo.startsWith("data:image") ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img
                                    src={photo}
                                    alt={`Foto ${index + 1}`}
                                    className="h-16 w-16 object-cover rounded-lg"
                                  />
                                ) : (
                                  <Camera className="h-6 w-6 text-gray-400" />
                                )}
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
      )}
    </div>
  );
}
