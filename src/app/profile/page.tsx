"use client";

import {
  User,
  Target,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail,
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
} from "recharts";
import { mockSalesReps, mockFieldVisits } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

export default function ProfilePage() {
  // For demo purposes, we'll use the first sales rep
  const currentUser = mockSalesReps[0];
  const userVisits = mockFieldVisits.filter(
    (visit) => visit.salesRepId === currentUser.id
  );

  // Calculate achievements
  const targetPercentage = (currentUser.achieved / currentUser.target) * 100;

  // Monthly target breakdown
  const monthlyTargetData = [
    { month: "Jan", target: 1200000, achieved: 1100000 },
    { month: "Feb", target: 1200000, achieved: 1350000 },
    { month: "Mar", target: 1200000, achieved: 980000 },
    { month: "Apr", target: 1200000, achieved: 1450000 },
    { month: "May", target: 1200000, achieved: 1250000 },
    { month: "Jun", target: 1200000, achieved: 1400000 },
    { month: "Jul", target: 1200000, achieved: 965000 },
  ];

  // Performance metrics
  const performanceMetrics = [
    {
      label: "Total Kunjungan",
      value: userVisits.length,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Kunjungan Bulan Ini",
      value: userVisits.filter((visit) => {
        const visitDate = new Date(visit.visitDate);
        const now = new Date();
        return (
          visitDate.getMonth() === now.getMonth() &&
          visitDate.getFullYear() === now.getFullYear()
        );
      }).length,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Pencapaian Target",
      value: `${targetPercentage.toFixed(1)}%`,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Revenue Bulan Ini",
      value: formatCurrency(965000),
      icon: TrendingUp,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Profil & Dashboard Pencapaian
        </h1>
        <p className="mt-2 text-gray-600">
          Pantau performa dan pencapaian target personal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {currentUser.name}
                </h2>
                <p className="text-gray-600">{currentUser.employeeId}</p>
                <p className="text-sm text-gray-500">Sales Representative</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {currentUser.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {currentUser.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {currentUser.territory.join(", ")}
              </div>
            </div>
          </div>

          {/* Target Achievement */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pencapaian Target
            </h3>
            <div className="flex items-center justify-center">
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={targetPercentage}
                  text={`${targetPercentage.toFixed(1)}%`}
                  styles={buildStyles({
                    textSize: "16px",
                    pathColor: targetPercentage >= 100 ? "#10B981" : "#3B82F6",
                    textColor: "#1F2937",
                    trailColor: "#E5E7EB",
                  })}
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {formatCurrency(currentUser.achieved)} dari{" "}
                {formatCurrency(currentUser.target)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Target Tahunan</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistik Cepat
            </h3>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-lg ${metric.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {metric.value}
                      </p>
                      <p className="text-xs text-gray-500">{metric.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Charts and Performance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Target vs Achievement */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Target vs Pencapaian Bulanan
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTargetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === "target" ? "Target" : "Pencapaian",
                  ]}
                />
                <Bar dataKey="target" fill="#E5E7EB" name="target" />
                <Bar dataKey="achieved" fill="#3B82F6" name="achieved" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Aktivitas Terbaru
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {userVisits.slice(0, 5).map((visit) => (
                  <div key={visit.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Kunjungan ke {visit.store?.name || "Toko"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(visit.visitDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      {visit.result && (
                        <p className="text-xs text-gray-600 mt-1">
                          {visit.result}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements & Badges */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pencapaian & Badge
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">
                  Top Performer
                </p>
                <p className="text-xs text-gray-500">Q2 2024</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">
                  Target Achiever
                </p>
                <p className="text-xs text-gray-500">5 bulan berturut</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">
                  Field Expert
                </p>
                <p className="text-xs text-gray-500">100+ kunjungan</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">
                  Growth Leader
                </p>
                <p className="text-xs text-gray-500">+25% YoY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
