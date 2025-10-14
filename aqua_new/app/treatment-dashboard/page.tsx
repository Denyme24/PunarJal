"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  simulateTreatment,
  WaterQualityParameters,
  TreatmentSimulationResult,
} from "@/lib/treatmentLogic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Droplets,
  Clock,
  TrendingUp,
  Beaker,
  Filter,
  Sparkles,
} from "lucide-react";

export default function TreatmentDashboard() {
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const [simulationResult, setSimulationResult] =
    useState<TreatmentSimulationResult | null>(null);
  const [parameters, setParameters] = useState<WaterQualityParameters | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Function to save simulation log to database
  const saveSimulationLog = async (
    params: WaterQualityParameters,
    result: TreatmentSimulationResult,
    source: "simulation_page" | "iot_sensors" | "map_view",
    sourceName?: string
  ) => {
    if (!token) {
      console.warn("No token available, skipping log save");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("/api/simulation-logs/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          source,
          sourceName,
          inputParameters: params,
          simulationResult: result,
          sessionId: `session_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to save simulation log:", data.error);
      } else {
        console.log("Simulation log saved successfully:", data.logId);
      }
    } catch (error) {
      console.error("Error saving simulation log:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Get parameters from URL
    const turbidity = parseFloat(searchParams.get("turbidity") || "0");
    const pH = parseFloat(searchParams.get("pH") || "7");
    const cod = parseFloat(searchParams.get("cod") || "0");
    const tds = parseFloat(searchParams.get("tds") || "0");
    const nitrogen = parseFloat(searchParams.get("nitrogen") || "0");
    const phosphorus = parseFloat(searchParams.get("phosphorus") || "0");
    const reuseType = searchParams.get("reuseType") || undefined;
    const sourceName = searchParams.get("sourceName") || undefined;

    const params: WaterQualityParameters = {
      turbidity,
      pH,
      cod,
      nitrogen,
      phosphorus,
      tds,
    };

    setParameters(params);

    // Run simulation
    const result = simulateTreatment(params);
    setSimulationResult(result);

    // Persist latest simulation context for Analytics page AI generation
    try {
      const payload = { parameters: params, simulationResult: result };
      localStorage.setItem("lastSimulationContext", JSON.stringify(payload));
    } catch {}

    // Determine the source of the simulation
    // If sourceName is present, it's either from map or IoT sensors
    let source: "simulation_page" | "iot_sensors" | "map_view" =
      "simulation_page";
    if (sourceName) {
      // Check if it contains "Lake" - likely from map or IoT
      if (sourceName.includes("Lake")) {
        // Check if there's sensor data patterns to differentiate
        // For now, we'll use map_view as default when sourceName is present
        source = "map_view";
      }
    }

    // Save simulation log to database
    saveSimulationLog(params, result, source, sourceName);
  }, [searchParams, token]);

  if (!simulationResult || !parameters) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 flex items-center justify-center">
          <div className="text-white text-xl">Loading simulation...</div>
        </div>
      </ProtectedRoute>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "text-green-500";
      case "needs-treatment":
        return "text-yellow-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "safe":
        return <Badge className="bg-green-500">Safe</Badge>;
      case "needs-treatment":
        return <Badge className="bg-yellow-500">Needs Treatment</Badge>;
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getTreatmentIcon = (stageName: string) => {
    switch (stageName) {
      case "Primary Treatment":
        return <Filter className="h-6 w-6" />;
      case "Secondary Treatment":
        return <Beaker className="h-6 w-6" />;
      case "Tertiary Treatment":
        return <Sparkles className="h-6 w-6" />;
      default:
        return <Droplets className="h-6 w-6" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
        <Header />

        <div className="container mx-auto px-6 pt-32 pb-20">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Treatment{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Simulation
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-6">
              AI-powered analysis determining optimal treatment stages
            </p>
            {getStatusBadge(simulationResult.overallStatus)}
          </motion.div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    Treatment Stages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white mb-2">
                    {simulationResult.totalStagesRequired}
                    <span className="text-xl text-white/60">/3</span>
                  </div>
                  <p className="text-white/60 text-sm">Stages required</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    Treatment Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white mb-2">
                    {simulationResult.estimatedTreatmentTime}
                    <span className="text-xl text-white/60">hrs</span>
                  </div>
                  <p className="text-white/60 text-sm">Estimated duration</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white mb-2">
                    {simulationResult.estimatedEfficiency}
                    <span className="text-xl text-white/60">%</span>
                  </div>
                  <Progress
                    value={simulationResult.estimatedEfficiency}
                    className="h-2"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Treatment Stages */}
          <div className="space-y-6">
            {[
              simulationResult.primaryTreatment,
              simulationResult.secondaryTreatment,
              simulationResult.tertiaryTreatment,
            ].map((stage, index) => (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Card
                  className={`${
                    stage.required
                      ? "bg-red-500/10 border-red-500/30"
                      : "bg-green-500/10 border-green-500/30"
                  } backdrop-blur-lg`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-3">
                        <div
                          className={`p-3 rounded-lg ${
                            stage.required ? "bg-red-500/20" : "bg-green-500/20"
                          }`}
                        >
                          {getTreatmentIcon(stage.name)}
                        </div>
                        {stage.name}
                      </CardTitle>
                      {stage.required ? (
                        <XCircle className="h-8 w-8 text-red-400" />
                      ) : (
                        <CheckCircle2 className="h-8 w-8 text-green-400" />
                      )}
                    </div>
                    <CardDescription className="text-white/70 text-base mt-2">
                      {stage.required
                        ? "⚠️ Treatment Required"
                        : "✓ Within Safe Limits"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Reasons */}
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-2">
                        Analysis:
                      </h4>
                      <ul className="space-y-1">
                        {stage.reason.map((reason, idx) => (
                          <li
                            key={idx}
                            className="text-white/80 text-sm flex items-start gap-2"
                          >
                            <span className="text-cyan-400 mt-1">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Parameters */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {stage.parameters.map((param, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg ${
                            param.exceedsThreshold
                              ? "bg-red-500/10 border border-red-500/30"
                              : "bg-green-500/10 border border-green-500/30"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/80 text-sm font-medium">
                              {param.name}
                            </span>
                            {param.exceedsThreshold ? (
                              <AlertTriangle className="h-4 w-4 text-red-400" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                            )}
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">
                              {param.value.toFixed(1)}
                            </span>
                            <span className="text-white/60 text-sm">
                              {param.unit}
                            </span>
                          </div>
                          <div className="text-white/60 text-xs mt-1">
                            Threshold: {param.threshold} {param.unit}
                          </div>
                          {param.exceedsThreshold && (
                            <div className="mt-2 text-xs text-red-400 font-medium">
                              Exceeds limit by{" "}
                              {(
                                (param.value / param.threshold - 1) *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Action Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12"
          >
            <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-2xl">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <span className="text-3xl">💡</span>
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {simulationResult.totalStagesRequired === 0 ? (
                    <div className="bg-emerald-900/40 border border-emerald-400/40 rounded-lg p-4">
                      <p className="text-lg text-white font-medium">
                        ✅ Water quality is within acceptable limits. No
                        treatment required at this time.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xl font-bold text-white">
                        Initiate {simulationResult.totalStagesRequired}{" "}
                        treatment stage
                        {simulationResult.totalStagesRequired > 1 ? "s" : ""}:
                      </p>
                      <ul className="space-y-3">
                        {simulationResult.primaryTreatment.required && (
                          <li className="flex items-start gap-3 bg-slate-800/70 p-4 rounded-lg border border-slate-700">
                            <span className="text-cyan-400 text-xl font-bold mt-0.5">
                              →
                            </span>
                            <span className="text-white text-base">
                              Start with{" "}
                              <strong className="text-cyan-300">
                                primary treatment
                              </strong>{" "}
                              for physical removal of suspended solids
                            </span>
                          </li>
                        )}
                        {simulationResult.secondaryTreatment.required && (
                          <li className="flex items-start gap-3 bg-slate-800/70 p-4 rounded-lg border border-slate-700">
                            <span className="text-cyan-400 text-xl font-bold mt-0.5">
                              →
                            </span>
                            <span className="text-white text-base">
                              Proceed to{" "}
                              <strong className="text-cyan-300">
                                secondary treatment
                              </strong>{" "}
                              for biological removal of organic matter
                            </span>
                          </li>
                        )}
                        {simulationResult.tertiaryTreatment.required && (
                          <li className="flex items-start gap-3 bg-slate-800/70 p-4 rounded-lg border border-slate-700">
                            <span className="text-cyan-400 text-xl font-bold mt-0.5">
                              →
                            </span>
                            <span className="text-white text-base">
                              Complete with{" "}
                              <strong className="text-cyan-300">
                                tertiary treatment
                              </strong>{" "}
                              for nutrient removal and pH adjustment
                            </span>
                          </li>
                        )}
                      </ul>
                      <div className="mt-6 p-4 bg-slate-800/70 border border-slate-700 rounded-lg">
                        <p className="text-white text-base leading-relaxed">
                          <strong className="text-cyan-300">📋 Note:</strong>{" "}
                          Treatment stages should be executed sequentially for
                          optimal results. Total estimated time:{" "}
                          <span className="font-bold text-cyan-300">
                            {simulationResult.estimatedTreatmentTime} hours
                          </span>{" "}
                          with{" "}
                          <span className="font-bold text-cyan-300">
                            {simulationResult.estimatedEfficiency}% efficiency
                          </span>
                          .
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
