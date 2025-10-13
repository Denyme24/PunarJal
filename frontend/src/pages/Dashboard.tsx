import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  Droplets,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Activity,
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

interface TreatmentStage {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: "pending" | "active" | "completed" | "skipped";
  progress: number;
  parameters: {
    turbidity?: { before: number; after: number; unit: string };
    cod?: { before: number; after: number; unit: string };
    tds?: { before: number; after: number; unit: string };
    nitrogen?: { before: number; after: number; unit: string };
    phosphorus?: { before: number; after: number; unit: string };
  };
}

const Dashboard = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stages, setStages] = useState<TreatmentStage[]>([
    {
      id: "primary",
      name: "Primary Treatment",
      description:
        "Physical separation of large solids and suspended particles",
      icon: Filter,
      status: "active",
      progress: 0,
      parameters: {
        turbidity: { before: 500, after: 50, unit: "NTU" },
        tds: { before: 800, after: 600, unit: "mg/L" },
      },
    },
    {
      id: "secondary",
      name: "Secondary Treatment",
      description: "Biological degradation of organic matter",
      icon: Droplets,
      status: "pending",
      progress: 0,
      parameters: {
        cod: { before: 300, after: 50, unit: "mg/L" },
        turbidity: { before: 50, after: 20, unit: "NTU" },
      },
    },
    {
      id: "tertiary",
      name: "Tertiary Treatment",
      description: "Advanced nutrient removal and disinfection",
      icon: Sparkles,
      status: "pending",
      progress: 0,
      parameters: {
        nitrogen: { before: 20, after: 5, unit: "mg/L" },
        phosphorus: { before: 5, after: 0.5, unit: "mg/L" },
        turbidity: { before: 20, after: 2, unit: "NTU" },
      },
    },
  ]);

  const [realTimeData, setRealTimeData] = useState({
    turbidity: 500,
    pH: 7.2,
    cod: 300,
    flowRate: 1200,
  });

  // Simulate treatment progress
  useEffect(() => {
    const interval = setInterval(() => {
      setStages((prev) =>
        prev.map((stage, index) => {
          if (index === currentStageIndex && stage.status === "active") {
            const newProgress = Math.min(stage.progress + 2, 100);

            if (newProgress === 100) {
              // Move to next stage
              setTimeout(() => {
                setCurrentStageIndex((i) => Math.min(i + 1, stages.length - 1));
              }, 1000);

              return { ...stage, progress: newProgress, status: "completed" };
            }

            return { ...stage, progress: newProgress };
          } else if (index > currentStageIndex) {
            return { ...stage, status: "pending" };
          } else if (index === currentStageIndex && stage.status !== "active") {
            return { ...stage, status: "active" };
          }
          return stage;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [currentStageIndex]);

  // Simulate real-time sensor data
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        turbidity: Math.max(2, prev.turbidity - Math.random() * 10),
        pH: 7.0 + Math.random() * 0.4 - 0.2,
        cod: Math.max(5, prev.cod - Math.random() * 5),
        flowRate: 1200 + Math.random() * 100 - 50,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "skipped":
        return "bg-gray-500";
      default:
        return "bg-gray-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "skipped":
        return <Badge className="bg-gray-500">Skipped</Badge>;
      default:
        return <Badge className="bg-gray-600">Pending</Badge>;
    }
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Treatment{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-xl text-white/70">
            Real-time monitoring of wastewater treatment process
          </p>
        </motion.div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Turbidity",
              value: realTimeData.turbidity.toFixed(1),
              unit: "NTU",
              icon: Activity,
            },
            {
              label: "pH Level",
              value: realTimeData.pH.toFixed(2),
              unit: "",
              icon: Droplets,
            },
            {
              label: "COD",
              value: realTimeData.cod.toFixed(0),
              unit: "mg/L",
              icon: Filter,
            },
            {
              label: "Flow Rate",
              value: realTimeData.flowRate.toFixed(0),
              unit: "L/min",
              icon: Droplets,
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className="h-5 w-5 text-cyan-400" />
                    <span className="text-xs text-white/60">
                      {metric.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {metric.value}{" "}
                    <span className="text-sm text-white/60">{metric.unit}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Treatment Stages */}
        <div className="space-y-6 mb-8">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card
                className={`bg-white/5 backdrop-blur-lg border-white/10 ${
                  stage.status === "active"
                    ? "ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/20"
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg ${getStatusColor(
                          stage.status
                        )} bg-opacity-20`}
                      >
                        <stage.icon className={`h-6 w-6 text-white`} />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">
                          {stage.name}
                        </CardTitle>
                        <p className="text-white/60 text-sm mt-1">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(stage.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 text-sm">Progress</span>
                        <span className="text-white font-semibold">
                          {stage.progress}%
                        </span>
                      </div>
                      <Progress value={stage.progress} className="h-2" />
                    </div>

                    {stage.status !== "pending" && (
                      <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                        {Object.entries(stage.parameters).map(
                          ([key, value]) => (
                            <div key={key} className="space-y-1">
                              <span className="text-xs text-white/60 uppercase">
                                {key}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-white/50 line-through">
                                  {value.before}
                                </span>
                                <span className="text-white">→</span>
                                <span className="text-cyan-400 font-semibold">
                                  {value.after}
                                </span>
                                <span className="text-xs text-white/60">
                                  {value.unit}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => (window.location.href = "/reuse")}
            disabled={stages[stages.length - 1].status !== "completed"}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg"
          >
            View Reuse Recommendations
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/simulation")}
            className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
          >
            Start New Simulation
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
