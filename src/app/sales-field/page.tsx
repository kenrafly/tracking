"use client";

import { useState, useRef, useMemo } from "react";
import {
  MapPin,
  Camera,
  CheckCircle,
  Navigation,
  Target,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Users,
  Star,
} from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  mockFieldVisits,
  mockSalesReps,
  getSalesRepById,
  getStoreById,
  mockOrders,
} from "@/lib/mockData";
import {
  formatDateTime,
  getCurrentPosition,
  formatCurrency,
} from "@/lib/utils";

export default function SalesFieldPage() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "visits" | "checkin" | "targets"
  >("dashboard");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current sales rep (simulating logged-in user)
  const currentSalesRep = mockSalesReps[0];

  // Enhanced visits with sales rep and store data
  const enhancedVisits = mockFieldVisits
    .filter((visit) => visit.salesRepId === currentSalesRep.id)
    .map((visit) => ({
      ...visit,
      salesRep: getSalesRepById(visit.salesRepId),
      store: getStoreById(visit.storeId),
    }));

  // Calculate sales metrics
  const salesMetrics = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Visits this month
    const visitsThisMonth = enhancedVisits.filter((visit) => {
      const visitDate = new Date(visit.visitDate);
      return (
        visitDate.getMonth() === currentMonth &&
        visitDate.getFullYear() === currentYear
      );
    }).length;

    // Orders from this sales rep (simulated)
    const salesOrders = mockOrders.filter((order) => {
      // Simulate that some orders came from this sales rep's visits
      return enhancedVisits.some((visit) => visit.storeId === order.storeId);
    });

    const salesRevenue = salesOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Monthly targets
    const monthlyVisitTarget = 20;
    const monthlyRevenueTarget = currentSalesRep.target / 12;

    const visitAchievementPercent =
      (visitsThisMonth / monthlyVisitTarget) * 100;
    const revenueAchievementPercent =
      (salesRevenue / monthlyRevenueTarget) * 100;

    return {
      totalVisits: enhancedVisits.length,
      visitsThisMonth,
      monthlyVisitTarget,
      visitAchievementPercent: Math.min(visitAchievementPercent, 100),
      salesRevenue,
      monthlyRevenueTarget,
      revenueAchievementPercent: Math.min(revenueAchievementPercent, 100),
      avgVisitsPerDay: visitsThisMonth / today.getDate(),
      completedVisits: enhancedVisits.filter((v) => v.checkOutTime).length,
    };
  }, [enhancedVisits, currentSalesRep.target]);

  // Weekly performance data
  const weeklyPerformanceData = [
    { week: "W1", visits: 5, target: 5, revenue: 250000 },
    { week: "W2", visits: 7, target: 5, revenue: 420000 },
    { week: "W3", visits: 4, target: 5, revenue: 180000 },
    { week: "W4", visits: 6, target: 5, revenue: 310000 },
  ];

  // Daily activity data for current month
  const dailyActivityData = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const visitsForDay = Math.floor(Math.random() * 3);
    return {
      day: `${day}`,
      visits: visitsForDay,
      revenue: visitsForDay * 85000 + Math.random() * 50000,
    };
  });

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

    alert("Check-in berhasil! Data kunjungan telah disimpan.");

    // Reset form
    setCurrentLocation(null);
    setPhotos([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Sales Field Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Dashboard khusus untuk sales lapangan - {currentSalesRep.name}
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

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "dashboard", label: "Dashboard", icon: TrendingUp },
            { id: "visits", label: "Riwayat Kunjungan", icon: MapPin },
            { id: "checkin", label: "Check-in", icon: CheckCircle },
            { id: "targets", label: "Target & Pencapaian", icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as "dashboard" | "visits" | "checkin" | "targets"
                  )
                }
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Kunjungan Bulan Ini
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {salesMetrics.visitsThisMonth}
                  </p>
                  <p className="text-xs text-gray-400">
                    Target: {salesMetrics.monthlyVisitTarget}
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
                  <p className="text-sm font-medium text-gray-500">
                    Revenue Bulan Ini
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(salesMetrics.salesRevenue)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Target: {formatCurrency(salesMetrics.monthlyRevenueTarget)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Kunjungan Selesai
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {salesMetrics.completedVisits}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(
                      (salesMetrics.completedVisits /
                        salesMetrics.totalVisits) *
                      100
                    ).toFixed(1)}
                    % completion rate
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Rata-rata/Hari
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {salesMetrics.avgVisitsPerDay.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-400">kunjungan per hari</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performa Mingguan
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#3B82F6" name="Kunjungan" />
                  <Bar dataKey="target" fill="#E5E7EB" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Activity Trend */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trend Aktivitas Harian
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyActivityData.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#3B82F6"
                    name="Kunjungan"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pencapaian Terbaru
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Top Performer
                </p>
                <p className="text-xs text-gray-500">Minggu ini</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Target Achiever
                </p>
                <p className="text-xs text-gray-500">3 bulan berturut</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <MapPin className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Field Expert
                </p>
                <p className="text-xs text-gray-500">50+ kunjungan</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Quality Visit
                </p>
                <p className="text-xs text-gray-500">95% completion</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Target & Achievement Tab */}
      {activeTab === "targets" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visit Target Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Target Kunjungan Bulanan
              </h3>
              <div className="flex items-center justify-center mb-4">
                <div className="w-32 h-32">
                  <CircularProgressbar
                    value={salesMetrics.visitAchievementPercent}
                    text={`${salesMetrics.visitAchievementPercent.toFixed(1)}%`}
                    styles={buildStyles({
                      textSize: "16px",
                      pathColor:
                        salesMetrics.visitAchievementPercent >= 100
                          ? "#10B981"
                          : "#3B82F6",
                      textColor: "#1F2937",
                      trailColor: "#E5E7EB",
                    })}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {salesMetrics.visitsThisMonth} /{" "}
                  {salesMetrics.monthlyVisitTarget}
                </p>
                <p className="text-sm text-gray-600">Kunjungan tercapai</p>
                <div className="mt-3 flex justify-between text-xs text-gray-500">
                  <span>Sisa hari: {30 - new Date().getDate()}</span>
                  <span>
                    Perlu:{" "}
                    {Math.max(
                      0,
                      salesMetrics.monthlyVisitTarget -
                        salesMetrics.visitsThisMonth
                    )}{" "}
                    kunjungan
                  </span>
                </div>
              </div>
            </div>

            {/* Revenue Target Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Target Revenue Bulanan
              </h3>
              <div className="flex items-center justify-center mb-4">
                <div className="w-32 h-32">
                  <CircularProgressbar
                    value={salesMetrics.revenueAchievementPercent}
                    text={`${salesMetrics.revenueAchievementPercent.toFixed(
                      1
                    )}%`}
                    styles={buildStyles({
                      textSize: "16px",
                      pathColor:
                        salesMetrics.revenueAchievementPercent >= 100
                          ? "#10B981"
                          : "#059669",
                      textColor: "#1F2937",
                      trailColor: "#E5E7EB",
                    })}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(salesMetrics.salesRevenue)}
                </p>
                <p className="text-sm text-gray-600">
                  dari {formatCurrency(salesMetrics.monthlyRevenueTarget)}
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <p>
                    Sisa target:{" "}
                    {formatCurrency(
                      Math.max(
                        0,
                        salesMetrics.monthlyRevenueTarget -
                          salesMetrics.salesRevenue
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Target Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Breakdown Target Tahunan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(currentSalesRep.target)}
                </div>
                <p className="text-sm text-gray-600">Target Tahunan</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(currentSalesRep.achieved)}
                </div>
                <p className="text-sm text-gray-600">Tercapai YTD</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {(
                    (currentSalesRep.achieved / currentSalesRep.target) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <p className="text-sm text-gray-600">Persentase Tercapai</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Progress Tahunan</span>
                <span>
                  {(
                    (currentSalesRep.achieved / currentSalesRep.target) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{
                    width: `${Math.min(
                      (currentSalesRep.achieved / currentSalesRep.target) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Territory Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performa per Wilayah
            </h3>
            <div className="space-y-4">
              {currentSalesRep.territory.map((territory) => {
                const territoryPerformance = 60 + Math.random() * 40; // Simulated data
                return (
                  <div
                    key={territory}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{territory}</p>
                      <p className="text-sm text-gray-500">
                        {Math.floor(salesMetrics.visitsThisMonth / 2)} kunjungan
                        bulan ini
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${territoryPerformance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {territoryPerformance.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Visits Tab - Existing functionality */}
      {activeTab === "visits" && (
        <div className="space-y-6">
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

      {/* Check-in Tab - Existing functionality */}
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
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo}
                            alt={`Foto ${index + 1}`}
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
