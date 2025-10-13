"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Analytics - Copy from frontend/src/pages/
        </h1>
      </div>
    </ProtectedRoute>
  );
}
