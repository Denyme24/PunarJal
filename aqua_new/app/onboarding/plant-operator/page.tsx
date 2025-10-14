"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function PlantOperatorOnboardingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 p-6">
      <div className="w-full max-w-xl rounded-2xl border border-gray-800 bg-gray-900/60 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome{user ? `, ${user.organizationName}` : ""}</h1>
        <p className="text-gray-300 mb-6">Plant Operator Onboarding</p>

        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-8">
          <li>Connect and view on-site sensor data</li>
          <li>Adjust treatment parameters safely</li>
          <li>Log maintenance activities and incidents</li>
        </ul>

        <div className="flex gap-3">
          <Link href="/simulation">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-8 py-3">
              Start Simulation
            </Button>
          </Link>
          <Link href="/treatment-dashboard">
            <Button variant="secondary" className="bg-gray-800 text-white border border-gray-700 hover:bg-gray-700">
              Open Treatment Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


