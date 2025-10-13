"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Wifi,
  WifiOff,
  TrendingUp,
  TrendingDown,
  MapPin,
  Droplets,
} from "lucide-react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "online" | "offline";
  threshold: { min: number; max: number };
  trend: "up" | "down" | "stable";
  history: number[];
  location: string;
}

interface LocationData {
  name: string;
  lakeName: string;
  sensorCount: number;
  status: "active" | "maintenance" | "offline";
}

const IoTSensors = () => {
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [allSensors, setAllSensors] = useState<SensorData[]>([
    // Location 1 - Hebbal Lake
    {
      id: "turbidity-hebbal",
      name: "Turbidity Sensor",
      value: 45.2,
      unit: "NTU",
      status: "online",
      threshold: { min: 0, max: 100 },
      trend: "down",
      history: [50, 48, 47, 46, 45.2],
      location: "Hebbal",
    },
    {
      id: "ph-hebbal",
      name: "pH Sensor",
      value: 7.3,
      unit: "",
      status: "online",
      threshold: { min: 6.5, max: 8.5 },
      trend: "stable",
      history: [7.2, 7.3, 7.2, 7.3, 7.3],
      location: "Hebbal",
    },
    {
      id: "cod-hebbal",
      name: "COD Analyzer",
      value: 142,
      unit: "mg/L",
      status: "online",
      threshold: { min: 0, max: 500 },
      trend: "down",
      history: [180, 165, 155, 148, 142],
      location: "Hebbal",
    },
    {
      id: "tds-hebbal",
      name: "TDS Meter",
      value: 456,
      unit: "mg/L",
      status: "online",
      threshold: { min: 0, max: 1000 },
      trend: "stable",
      history: [450, 455, 458, 454, 456],
      location: "Hebbal",
    },
    // Location 2 - Bellandur Lake
    {
      id: "turbidity-bellandur",
      name: "Turbidity Sensor",
      value: 68.5,
      unit: "NTU",
      status: "online",
      threshold: { min: 0, max: 100 },
      trend: "up",
      history: [62, 64, 66, 67, 68.5],
      location: "Bellandur",
    },
    {
      id: "ph-bellandur",
      name: "pH Sensor",
      value: 8.1,
      unit: "",
      status: "online",
      threshold: { min: 6.5, max: 8.5 },
      trend: "up",
      history: [7.8, 7.9, 8.0, 8.0, 8.1],
      location: "Bellandur",
    },
    {
      id: "ammonia-bellandur",
      name: "Ammonia Sensor",
      value: 12.4,
      unit: "mg/L",
      status: "online",
      threshold: { min: 0, max: 50 },
      trend: "up",
      history: [10, 10.5, 11, 11.8, 12.4],
      location: "Bellandur",
    },
    {
      id: "nitrate-bellandur",
      name: "Nitrate Sensor",
      value: 5.8,
      unit: "mg/L",
      status: "online",
      threshold: { min: 0, max: 20 },
      trend: "up",
      history: [5.2, 5.4, 5.5, 5.6, 5.8],
      location: "Bellandur",
    },
    // Location 3 - Ulsoor Lake
    {
      id: "turbidity-ulsoor",
      name: "Turbidity Sensor",
      value: 32.1,
      unit: "NTU",
      status: "online",
      threshold: { min: 0, max: 100 },
      trend: "stable",
      history: [32, 32.5, 31.8, 32.2, 32.1],
      location: "Ulsoor",
    },
    {
      id: "ph-ulsoor",
      name: "pH Sensor",
      value: 6.9,
      unit: "",
      status: "online",
      threshold: { min: 6.5, max: 8.5 },
      trend: "stable",
      history: [6.9, 7.0, 6.8, 6.9, 6.9],
      location: "Ulsoor",
    },
    {
      id: "phosphorus-ulsoor",
      name: "Phosphorus Analyzer",
      value: 0.8,
      unit: "mg/L",
      status: "online",
      threshold: { min: 0, max: 10 },
      trend: "down",
      history: [1.2, 1.0, 0.9, 0.8, 0.8],
      location: "Ulsoor",
    },
    {
      id: "flow-ulsoor",
      name: "Flow Meter",
      value: 890,
      unit: "L/min",
      status: "online",
      threshold: { min: 800, max: 1500 },
      trend: "stable",
      history: [885, 888, 892, 889, 890],
      location: "Ulsoor",
    },
  ]);

  // Get nearby locations based on user's location
  const getNearbyLocations = (userLocation: string): LocationData[] => {
    const locationMap: { [key: string]: LocationData[] } = {
      "Hebbal": [
        { name: "Hebbal", lakeName: "Hebbal Lake", sensorCount: 4, status: "active" },
        { name: "Bellandur", lakeName: "Bellandur Lake", sensorCount: 4, status: "active" },
        { name: "Ulsoor", lakeName: "Ulsoor Lake", sensorCount: 4, status: "active" },
      ],
      "Bellandur": [
        { name: "Bellandur", lakeName: "Bellandur Lake", sensorCount: 4, status: "active" },
        { name: "Hebbal", lakeName: "Hebbal Lake", sensorCount: 4, status: "active" },
        { name: "Ulsoor", lakeName: "Ulsoor Lake", sensorCount: 4, status: "active" },
      ],
      "Ulsoor": [
        { name: "Ulsoor", lakeName: "Ulsoor Lake", sensorCount: 4, status: "active" },
        { name: "Hebbal", lakeName: "Hebbal Lake", sensorCount: 4, status: "active" },
        { name: "Bellandur", lakeName: "Bellandur Lake", sensorCount: 4, status: "active" },
      ],
      // Default for other locations
      "default": [
        { name: "Hebbal", lakeName: "Hebbal Lake", sensorCount: 4, status: "active" },
        { name: "Bellandur", lakeName: "Bellandur Lake", sensorCount: 4, status: "active" },
        { name: "Ulsoor", lakeName: "Ulsoor Lake", sensorCount: 4, status: "active" },
      ],
    };

    return locationMap[userLocation] || locationMap["default"];
  };

  const nearbyLocations = getNearbyLocations(user?.location || "");
  const [sensors, setSensors] = useState<SensorData[]>([]);

  // Filter sensors based on selected location
  useEffect(() => {
    if (selectedLocation) {
      setSensors(allSensors.filter(sensor => sensor.location === selectedLocation));
    } else {
      setSensors(allSensors);
    }
  }, [selectedLocation, allSensors]);

  // Simulate live sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAllSensors((prevSensors) =>
        prevSensors.map((sensor) => {
          const variation = (Math.random() - 0.5) * 5;
          const newValue = Math.max(
            sensor.threshold.min,
            Math.min(sensor.threshold.max, sensor.value + variation)
          );

          const newHistory = [...sensor.history.slice(1), newValue];
          const lastValue = sensor.history[sensor.history.length - 1];

          let trend: "up" | "down" | "stable" = "stable";
          if (newValue > lastValue + 1) trend = "up";
          else if (newValue < lastValue - 1) trend = "down";

          return {
            ...sensor,
            value: parseFloat(newValue.toFixed(1)),
            history: newHistory,
            trend,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSensorStatus = (sensor: SensorData) => {
    const { value, threshold } = sensor;
    const percentage =
      ((value - threshold.min) / (threshold.max - threshold.min)) * 100;

    if (percentage < 20) return { color: "green", status: "Optimal" };
    if (percentage < 50) return { color: "blue", status: "Good" };
    if (percentage < 80) return { color: "yellow", status: "Warning" };
    return { color: "red", status: "Critical" };
  };

  const MiniChart = ({ history }: { history: number[] }) => {
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;

    return (
      <div className="flex items-end gap-1 h-12">
        {history.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t"
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
        <Header />

        <div className="container mx-auto px-6 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  IoT{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Sensor Network
                  </span>
                </h1>
                <p className="text-xl text-white/70">
                  Real-time monitoring from distributed sensor array
                </p>
                {user && (
                  <div className="flex items-center gap-2 mt-4">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                    <span className="text-cyan-400 font-medium">
                      Monitoring from: {user.location}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm font-medium">
                    All Systems Online
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Location Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Droplets className="h-6 w-6 text-cyan-400" />
              Nearby Lake Monitoring Stations
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {nearbyLocations.map((location, index) => (
                <motion.div
                  key={location.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className={`bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group ${
                      selectedLocation === location.name ? 'ring-2 ring-cyan-400 bg-cyan-500/10' : ''
                    }`}
                    onClick={() => setSelectedLocation(location.name)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-5 w-5 text-cyan-400" />
                          <MapPin className="h-4 w-4 text-white/60" />
                        </div>
                        <Badge 
                          className={`${
                            location.status === 'active' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                              : location.status === 'maintenance'
                              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}
                        >
                          {location.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-lg">
                        {location.lakeName}
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        {location.name} • {location.sensorCount} sensors
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Sensors:</span>
                          <span className="text-cyan-400 font-medium">{location.sensorCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Status:</span>
                          <span className={`font-medium ${
                            location.status === 'active' ? 'text-green-400' : 
                            location.status === 'maintenance' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="text-xs text-white/60">
                          Click to view sensor data
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full w-fit">
                  <Droplets className="h-4 w-4 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-medium">
                    Showing sensors for: {nearbyLocations.find(l => l.name === selectedLocation)?.lakeName}
                  </span>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="ml-2 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    View All
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* System Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: selectedLocation ? `Active Sensors (${selectedLocation})` : "Active Sensors",
                value: sensors.filter((s) => s.status === "online").length,
                icon: Activity,
              },
              { 
                label: selectedLocation ? `Readings (${selectedLocation})` : "Total Readings", 
                value: selectedLocation ? `${(sensors.length * 2.5).toFixed(1)}k` : "24.8k", 
                icon: TrendingUp 
              },
              { label: "Uptime", value: "99.9%", icon: Wifi },
              { label: "Last Update", value: "2s ago", icon: Activity },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="h-5 w-5 text-cyan-400" />
                      <span className="text-xs text-white/60">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Sensor Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              {selectedLocation 
                ? `Sensor Data - ${nearbyLocations.find(l => l.name === selectedLocation)?.lakeName}`
                : 'All Sensor Data'
              }
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sensors.map((sensor, index) => {
                const status = getSensorStatus(sensor);
                return (
                  <motion.div
                    key={sensor.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 group">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
                            {sensor.status === "online" ? (
                              <Wifi className="h-4 w-4 text-green-400" />
                            ) : (
                              <WifiOff className="h-4 w-4 text-red-400" />
                            )}
                          </div>
                          <Badge
                            className={`bg-${status.color}-500/20 text-${status.color}-400 border-${status.color}-500/30`}
                          >
                            {status.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-white text-lg">
                          {sensor.name}
                        </CardTitle>
                        <CardDescription className="text-white/60 flex items-center gap-2">
                          {sensor.trend === "up" && (
                            <TrendingUp className="h-3 w-3 text-red-400" />
                          )}
                          {sensor.trend === "down" && (
                            <TrendingDown className="h-3 w-3 text-green-400" />
                          )}
                          {sensor.trend === "stable" && (
                            <span className="text-blue-400">—</span>
                          )}
                          <span className="capitalize">{sensor.trend}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-4xl font-bold text-white mb-1">
                              {sensor.value}
                              <span className="text-lg text-white/60 ml-2">
                                {sensor.unit}
                              </span>
                            </div>
                            <div className="text-xs text-white/50">
                              Range: {sensor.threshold.min} - {sensor.threshold.max}{" "}
                              {sensor.unit}
                            </div>
                          </div>

                          <MiniChart history={sensor.history} />

                          <div className="pt-3 border-t border-white/10">
                            <div className="text-xs text-white/60">
                              Last 5 readings trend
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Integration Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Smart Decision Engine Integration
                </CardTitle>
                <CardDescription className="text-white/70">
                  Sensor data is automatically processed by our intelligent
                  treatment system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-cyan-400 font-semibold">
                      Automatic Stage Activation
                    </div>
                    <p className="text-white/70 text-sm">
                      Treatment stages activate based on real-time sensor
                      thresholds
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-cyan-400 font-semibold">
                      Predictive Alerts
                    </div>
                    <p className="text-white/70 text-sm">
                      AI predicts issues before they occur based on sensor trends
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-cyan-400 font-semibold">
                      Energy Optimization
                    </div>
                    <p className="text-white/70 text-sm">
                      Unnecessary stages skipped automatically to save energy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default IoTSensors;