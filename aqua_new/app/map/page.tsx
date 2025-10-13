"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import WaterSourceCard from "@/components/WaterSourceCard";
import {
  WaterSource,
  getWaterSourcesByLocation,
  locationCoordinates,
} from "@/lib/waterSourcesData";
import { MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamically import map component to avoid SSR issues
const WaterSourcesMap = dynamic(() => import("@/components/WaterSourcesMap"), {
  ssr: false,
});

export default function MapPage() {
  const { user } = useAuth();
  const [waterSources, setWaterSources] = useState<WaterSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<WaterSource | null>(
    null
  );
  // Default to Bangalore coordinates
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    12.9716, 77.5946,
  ]);
  const [filter, setFilter] = useState<"all" | "safe" | "attention">("all");

  useEffect(() => {
    if (user?.location) {
      // Get water sources based on user's location
      const sources = getWaterSourcesByLocation(user.location);
      setWaterSources(sources);

      // Set map center to user's specific location (e.g., Whitefield, Koramangala)
      // Fall back to general Bangalore if specific neighborhood not found
      const center =
        locationCoordinates[user.location] || locationCoordinates["Bangalore"];
      if (center) {
        setMapCenter(center);
      }
    }
  }, [user]);

  const handleMarkerClick = (source: WaterSource) => {
    setSelectedSource(source);
  };

  const handleCloseCard = () => {
    setSelectedSource(null);
  };

  const filteredSources =
    filter === "all"
      ? waterSources
      : waterSources.filter((source) => source.quality === filter);

  const stats = {
    total: waterSources.length,
    safe: waterSources.filter((s) => s.quality === "safe").length,
    attention: waterSources.filter((s) => s.quality === "attention").length,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
        <Header />

        <div className="container mx-auto px-6 pt-32 pb-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Explore Water{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Bodies
              </span>
            </h1>
            <p className="text-xl text-white/70 mb-6">
              Click pins to view details and start a simulation
            </p>

            {/* Legend & Stats */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Filter Buttons */}
              <div className="flex gap-2 items-center bg-white/5 backdrop-blur-lg rounded-lg p-2 border border-white/10">
                <Button
                  variant={filter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={
                    filter === "all"
                      ? "bg-cyan-500 hover:bg-cyan-600"
                      : "text-white hover:bg-white/10"
                  }
                >
                  All ({stats.total})
                </Button>
                <Button
                  variant={filter === "safe" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("safe")}
                  className={
                    filter === "safe"
                      ? "bg-green-500 hover:bg-green-600"
                      : "text-white hover:bg-white/10"
                  }
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Safe ({stats.safe})
                </Button>
                <Button
                  variant={filter === "attention" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("attention")}
                  className={
                    filter === "attention"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "text-white hover:bg-white/10"
                  }
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Attention ({stats.attention})
                </Button>
              </div>

              {/* Legend */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white/5 backdrop-blur-lg rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex-shrink-0 rounded-full bg-green-500"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Green pins indicate suitable quality
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex-shrink-0 rounded-full bg-amber-500"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Amber pins indicate thresholds near limits
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map and Card Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Map - Always Full Width on Mobile, Responsive on Desktop */}
            <div className="w-full h-[calc(100vh-400px)] min-h-[600px] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <WaterSourcesMap
                waterSources={filteredSources}
                center={mapCenter}
                onMarkerClick={handleMarkerClick}
                selectedSource={selectedSource}
              />
            </div>

            {/* Detail Card - Slides Over Map on Mobile, Side Panel on Desktop */}
            <AnimatePresence mode="wait">
              {selectedSource && (
                <>
                  {/* Backdrop for Mobile */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={handleCloseCard}
                  />

                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, x: "100%" }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed lg:absolute top-0 right-0 h-full lg:h-[calc(100vh-400px)] lg:min-h-[600px] w-full sm:w-[400px] lg:w-[380px] z-50 lg:z-10"
                  >
                    <div className="h-full overflow-y-auto">
                      <WaterSourceCard
                        source={selectedSource}
                        onClose={handleCloseCard}
                      />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Location Info */}
          {user?.location && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-center"
            >
              <p className="text-white/60 text-sm">
                Showing water sources near{" "}
                <span className="font-semibold text-cyan-400">
                  {user.location}
                </span>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
