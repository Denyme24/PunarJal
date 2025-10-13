"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function ReusePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Reuse Page - Copy from frontend/src/pages/
        </h1>
      </div>
    </ProtectedRoute>
  );
}
