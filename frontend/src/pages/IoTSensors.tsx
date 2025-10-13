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
} from "lucide-react";
import Header from "@/components/Header";

interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "online" | "offline";
  threshold: { min: number; max: number };
  trend: "up" | "down" | "stable";
  history: number[];
}

const IoTSensors = () => {
  const [sensors, setSensors] = useState<SensorData[]>([
    {
      id: "turbidity",
      name: "Turbidity Sensor",
      value: 45.2,
      unit: "NTU",
      status: "online",
      threshold: { min: 0, max: 100 },
      trend: "down",
      history: [50, 48, 47, 46, 45.2],
    },
    {
      id: "ph",
      name: "pH Sensor",
      value: 7.3,
      unit: "",
      status: "online",
      threshold: { min: 6.5, max: 8.5 },
      trend: "stable",
      history: [7.2, 7.3, 7.2, 7.3, 7.3],
    },
    {
      id: "cod",
      name: "COD Analyzer",
      value: 142,
      unit: "mg/L",
      status: "online",
      threshold: { min: 0, max: 500 },
      trend: "down",
      history: [180, 165, 155, 148, 142],
    },
    {
      id: "tds",
      name: "TDS Meter",
      value: 456,
      unit: "mg/L",
      status: "online",
      threshold: { min: 0, max: 1000 },
      trend: "stable",
      history: [450, 455, 458, 454, 456],
    },
    {
      id: "ammonia",
      name: "Ammonia Sensor",
      value: 8.7,
      unit: "mg/L",
      status: "online",
      threshold: { min: 0, max: 50 },
      trend: "down",
      history: [12, 11, 10, 9.5, 8.7],
    },
    {
      id: "nitrate",
      name: "Nitrate Sensor",
      value: 3.2,
      unit: "mg/L",
      status: "online",
      threshold: { min: 0, max: 20 },
      trend: "stable",
      history: [3.5, 3.3, 3.2, 3.1, 3.2],
    },
    {
      id: "phosphorus",
      name: "Phosphorus Analyzer",
      value: 1.8,
      unit: "mg/L",
      status: "online",
      threshold: { min: 0, max: 10 },
      trend: "down",
      history: [2.5, 2.2, 2.0, 1.9, 1.8],
    },
    {
      id: "flow",
      name: "Flow Meter",
      value: 1245,
      unit: "L/min",
      status: "online",
      threshold: { min: 800, max: 1500 },
      trend: "stable",
      history: [1240, 1245, 1248, 1242, 1245],
    },
  ]);

  // Simulate live sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prevSensors) =>
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

        {/* System Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Active Sensors",
              value: sensors.filter((s) => s.status === "online").length,
              icon: Activity,
            },
            { label: "Total Readings", value: "24.8k", icon: TrendingUp },
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
  );
};

export default IoTSensors;
