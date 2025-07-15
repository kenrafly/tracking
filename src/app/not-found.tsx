import { Metadata } from "next";
import { FileX } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Halaman Tidak Ditemukan",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full">
          <FileX className="w-6 h-6 text-gray-600" />
        </div>
        <div className="mt-4 text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Halaman Tidak Ditemukan
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Halaman yang Anda cari tidak dapat ditemukan.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
