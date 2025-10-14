"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function EnvironmentalOfficerOnboardingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 p-6">
      <div className="w-full max-w-xl rounded-2xl border border-gray-800 bg-gray-900/60 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome{user ? `, ${user.organizationName}` : ""}</h1>
        <p className="text-gray-300 mb-6">Environmental Officer Onboarding</p>

        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-8">
          <li>Review multi-plant analytics and performance</li>
          <li>Ensure compliance and audit readiness</li>
          <li>Analyze trends for optimization</li>
        </ul>

        <div className="flex gap-3">
          <Link href="/analytics">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-8 py-3">
              Start Analytics Dashboard
            </Button>
          </Link>
          <Link href="/map">
            <Button variant="secondary" className="bg-gray-800 text-white border border-gray-700 hover:bg-gray-700">
              View Plants on Map
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


