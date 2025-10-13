"use client";

import { motion } from "framer-motion";
import { WaterSource } from "@/lib/waterSourcesData";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MapPin, Droplets } from "lucide-react";

interface WaterSourceCardProps {
  source: WaterSource | null;
  onClose: () => void;
}

export default function WaterSourceCard({
  source,
  onClose,
}: WaterSourceCardProps) {
  const router = useRouter();

  if (!source) return null;

  const handleInitiateSimulation = () => {
    // Navigate to simulation page with pre-filled parameters
    const params = new URLSearchParams({
      turbidity: source.metrics.turbidity.toString(),
      pH: source.metrics.pH.toString(),
      cod: source.metrics.cod.toString(),
      tds: source.metrics.tds.toString(),
      nitrogen: source.metrics.nitrogen.toString(),
      phosphorus: source.metrics.phosphorus.toString(),
      sourceName: source.name,
    });
    router.push(`/simulation?${params.toString()}`);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "safe":
        return "text-green-500";
      case "attention":
        return "text-amber-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getQualityBgColor = (quality: string) => {
    switch (quality) {
      case "safe":
        return "bg-green-500/10";
      case "attention":
        return "bg-amber-500/10";
      case "critical":
        return "text-red-500/10";
      default:
        return "bg-gray-500/10";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3 }}
      className="h-full bg-white rounded-xl shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin className={`h-5 w-5 ${getQualityColor(source.quality)}`} />
            <h2 className="text-2xl font-bold text-gray-900">{source.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-500">Real-time snapshot</p>
      </div>

      {/* Metrics Grid */}
      <div className="flex-1 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Turbidity */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-4 w-4 text-cyan-600" />
              <p className="text-sm font-medium text-gray-600">Turbidity</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {source.metrics.turbidity}
            </p>
            <p className="text-xs text-gray-500 mt-1">NTU</p>
          </div>

          {/* pH */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-4 rounded-full bg-blue-600" />
              <p className="text-sm font-medium text-gray-600">pH</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {source.metrics.pH}
            </p>
            <p className="text-xs text-gray-500 mt-1">Level</p>
          </div>

          {/* COD */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-4 rounded bg-purple-600" />
              <p className="text-sm font-medium text-gray-600">COD</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {source.metrics.cod}
            </p>
            <p className="text-xs text-gray-500 mt-1">mg/L</p>
          </div>

          {/* TDS */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-4 rounded-full bg-teal-600" />
              <p className="text-sm font-medium text-gray-600">TDS</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {source.metrics.tds}
            </p>
            <p className="text-xs text-gray-500 mt-1">mg/L</p>
          </div>

          {/* Nitrogen */}
          <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-4 rounded bg-green-600" />
              <p className="text-sm font-medium text-gray-600">Nitrogen</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {source.metrics.nitrogen}
            </p>
            <p className="text-xs text-gray-500 mt-1">mg/L</p>
          </div>

          {/* Phosphorus */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-4 rounded-full bg-amber-600" />
              <p className="text-sm font-medium text-gray-600">Phosphorus</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {source.metrics.phosphorus}
            </p>
            <p className="text-xs text-gray-500 mt-1">mg/L</p>
          </div>
        </div>

        {/* Quality Status */}
        <div className={`${getQualityBgColor(source.quality)} rounded-lg p-4`}>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Water Quality Status
          </p>
          <p
            className={`text-lg font-bold capitalize ${getQualityColor(
              source.quality
            )}`}
          >
            {source.quality === "safe" && "✓ Safe Quality"}
            {source.quality === "attention" && "⚠ Needs Attention"}
            {source.quality === "critical" && "⚠ Critical"}
          </p>
        </div>

        {/* Last Updated */}
        <p className="text-xs text-gray-400 text-center">
          Last updated: {new Date(source.lastUpdated).toLocaleString()}
        </p>
      </div>

      {/* Action Button */}
      <div className="p-6 border-t border-gray-200">
        <Button
          onClick={handleInitiateSimulation}
          className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-lg shadow-lg"
        >
          Initiate Simulation
        </Button>
      </div>
    </motion.div>
  );
}
