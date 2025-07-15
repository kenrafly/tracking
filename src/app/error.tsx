"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div className="mt-4 text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Terjadi Kesalahan
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Maaf, terjadi kesalahan saat memproses permintaan Anda.
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-left">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {error.message}
              </pre>
            </div>
          )}
          <button
            onClick={reset}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
