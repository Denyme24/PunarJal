"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function IoTSensorsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          IoT Sensors - Copy from frontend/src/pages/
        </h1>
      </div>
    </ProtectedRoute>
  );
}
