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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Droplets,
  Zap,
  Leaf,
  BarChart3,
  PieChart,
  Download,
  FileText,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

type AnalyticsData = {
  simulationHistory: Array<{
    date: string;
    waterSaved: number;
    energySaved: number;
    efficiency: number;
  }>;
  treatmentEfficiency: {
    primary: { removal: number; avgTime: number; energyUsed: number };
    secondary: { removal: number; avgTime: number; energyUsed: number };
    tertiary: { removal: number; avgTime: number; energyUsed: number };
  };
  reuseBreakdown: Array<{
    type: string;
    percentage: number;
    volume: number;
  }>;
  sustainabilityMetrics: {
    totalWaterRecycled: number;
    freshwaterSaved: number;
    co2Emissions: number;
    energyEfficiency: number;
    costSavings: number;
    treesEquivalent: number;
    waterFootprintReduction?: number;
  };
  environmentalImpact: {
    freshwaterConservation: string;
    co2EmissionsAvoided: string;
    treesPlanted: string;
    waterFootprintReduction: string;
  };
  economicBenefits: {
    totalCostSavings: string;
    waterBillReduction: string;
    energyCostSavings: string;
    paybackPeriod: string;
  };
};

const Analytics = () => {
  const { token } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get last simulation context from localStorage
        const contextRaw = localStorage.getItem("lastSimulationContext");
        if (!contextRaw) {
          setError(
            "No simulation data found. Please run a simulation first from the Simulation page."
          );
          setLoading(false);
          return;
        }

        const context = JSON.parse(contextRaw);

        // Call AI generation API with authorization header
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch("/api/analytics/generate", {
          method: "POST",
          headers,
          body: JSON.stringify(context),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result?.error || "Failed to generate analytics");
        }

        setAnalyticsData(result.data);
      } catch (e: any) {
        setError(e?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  const exportAsPdf = () => {
    window.print();
  };

  const exportAsCsv = () => {
    if (!analyticsData) return;

    const rows = analyticsData.simulationHistory;
    const header = Object.keys(rows[0] || {}).join(",");
    const lines = rows.map((r) => Object.values(r).join(","));
    const csv = [header, ...lines].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    if (!analyticsData) return;

    const report = {
      generatedAt: new Date().toISOString(),
      ...analyticsData,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `treatment-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
          <Header />
          <div className="container mx-auto px-6 pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
            <p className="text-white text-xl">
              Generating AI-powered analytics...
            </p>
            <p className="text-white/60 text-sm mt-2">
              This may take a few moments
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
          <Header />
          <div className="container mx-auto px-6 pt-32 pb-20">
            <Card className="bg-red-500/10 border-red-500/30 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-white">
                  Error Loading Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">{error}</p>
                <Button
                  onClick={() => (window.location.href = "/simulation")}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  Go to Simulation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!analyticsData) return null;

  const { sustainabilityMetrics } = analyticsData;

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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Analytics &{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Reports
              </span>
            </h1>
            <p className="text-xl text-white/70">
              AI-generated insights based on your simulation
            </p>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              {
                label: "Water Recycled",
                value: `${(
                  sustainabilityMetrics.totalWaterRecycled / 1000
                ).toFixed(0)}kL`,
                icon: Droplets,
                color: "cyan",
              },
              {
                label: "Freshwater Saved",
                value: `${(
                  sustainabilityMetrics.freshwaterSaved / 1000
                ).toFixed(0)}kL`,
                icon: Droplets,
                color: "blue",
              },
              {
                label: "CO₂ Reduced",
                value: `${sustainabilityMetrics.co2Emissions}T`,
                icon: Leaf,
                color: "green",
              },
              {
                label: "Energy Efficiency",
                value: `${sustainabilityMetrics.energyEfficiency}%`,
                icon: Zap,
                color: "amber",
              },
              {
                label: "Cost Savings",
                value: `$${(sustainabilityMetrics.costSavings / 1000).toFixed(
                  0
                )}k`,
                icon: TrendingUp,
                color: "purple",
              },
              {
                label: "Trees Equivalent",
                value: sustainabilityMetrics.treesEquivalent,
                icon: Leaf,
                color: "emerald",
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
                      <metric.icon
                        className={`h-5 w-5 text-${metric.color}-400`}
                      />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {metric.value}
                    </div>
                    <div className="text-xs text-white/60">{metric.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Detailed Analytics Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Tabs defaultValue="history" className="space-y-6">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-cyan-500/20"
                >
                  Simulation History
                </TabsTrigger>
                <TabsTrigger
                  value="efficiency"
                  className="data-[state=active]:bg-cyan-500/20"
                >
                  Treatment Efficiency
                </TabsTrigger>
                <TabsTrigger
                  value="reuse"
                  className="data-[state=active]:bg-cyan-500/20"
                >
                  Reuse Breakdown
                </TabsTrigger>
                <TabsTrigger
                  value="sustainability"
                  className="data-[state=active]:bg-cyan-500/20"
                >
                  Sustainability
                </TabsTrigger>
              </TabsList>

              {/* Simulation History Tab */}
              <TabsContent value="history">
                <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl flex items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-cyan-400" />
                      Recent Simulation History
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Performance data from recent simulations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.simulationHistory.map((sim, index) => (
                        <div
                          key={sim.date}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="text-white font-semibold mb-1">
                              {sim.date}
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <span className="text-cyan-400">
                                <Droplets className="inline h-4 w-4 mr-1" />
                                {sim.waterSaved}L saved
                              </span>
                              <span className="text-amber-400">
                                <Zap className="inline h-4 w-4 mr-1" />
                                {sim.energySaved}kWh
                              </span>
                              <span className="text-green-400">
                                {sim.efficiency}% efficiency
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-white">
                              {sim.efficiency}%
                            </div>
                            <div className="text-xs text-white/60">Overall</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Treatment Efficiency Tab */}
              <TabsContent value="efficiency">
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(analyticsData.treatmentEfficiency).map(
                    ([stage, data]) => (
                      <Card
                        key={stage}
                        className="bg-white/5 backdrop-blur-lg border-white/10"
                      >
                        <CardHeader>
                          <CardTitle className="text-white text-xl capitalize">
                            {stage} Treatment
                          </CardTitle>
                          <CardDescription className="text-white/60">
                            Stage performance metrics
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white/70 text-sm">
                                Contaminant Removal
                              </span>
                              <span className="text-cyan-400 font-bold">
                                {data.removal}%
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                                style={{ width: `${data.removal}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70 text-sm">
                              Avg. Processing Time
                            </span>
                            <span className="text-white font-semibold">
                              {data.avgTime} min
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70 text-sm">
                              Energy Consumption
                            </span>
                            <span className="text-amber-400 font-semibold">
                              {data.energyUsed} kWh
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </TabsContent>

              {/* Reuse Breakdown Tab */}
              <TabsContent value="reuse">
                <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl flex items-center gap-2">
                      <PieChart className="h-6 w-6 text-cyan-400" />
                      Water Reuse Distribution
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      How treated water is being reused across different
                      applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.reuseBreakdown.map((item, index) => (
                        <div key={item.type} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">
                              {item.type}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-cyan-400 font-semibold">
                                {item.volume}kL/year
                              </span>
                              <span className="text-white/60">
                                {item.percentage}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${
                                index === 0
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : index === 1
                                  ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                  : index === 2
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                  : index === 3
                                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                  : "bg-gradient-to-r from-teal-500 to-cyan-500"
                              }`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sustainability Tab */}
              <TabsContent value="sustainability">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white text-2xl">
                        Environmental Impact
                      </CardTitle>
                      <CardDescription className="text-white">
                        Positive environmental contributions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-600 shadow-lg">
                          <span className="text-white font-semibold text-base">
                            Freshwater Conservation
                          </span>
                          <span className="text-green-400 font-bold text-xl">
                            {
                              analyticsData.environmentalImpact
                                .freshwaterConservation
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-600 shadow-lg">
                          <span className="text-white font-semibold text-base">
                            CO₂ Emissions Avoided
                          </span>
                          <span className="text-green-400 font-bold text-xl">
                            {
                              analyticsData.environmentalImpact
                                .co2EmissionsAvoided
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-600 shadow-lg">
                          <span className="text-white font-semibold text-base">
                            Equivalent Trees Planted
                          </span>
                          <span className="text-green-400 font-bold text-xl">
                            {analyticsData.environmentalImpact.treesPlanted}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-600 shadow-lg">
                          <span className="text-white font-semibold text-base">
                            Reduction in Water Footprint
                          </span>
                          <span className="text-green-400 font-bold text-xl">
                            {
                              analyticsData.environmentalImpact
                                .waterFootprintReduction
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white text-2xl">
                        Economic Benefits
                      </CardTitle>
                      <CardDescription className="text-white">
                        Financial savings and ROI
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-600 shadow-lg">
                          <span className="text-white font-semibold text-base">
                            Total Cost Savings
                          </span>
                          <span className="text-cyan-400 font-bold text-xl">
                            {analyticsData.economicBenefits.totalCostSavings}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-600 shadow-lg">
                          <span className="text-white font-semibold text-base">
                            Water Bill Reduction
                          </span>
                          <span className="text-cyan-400 font-bold text-xl">
                            {analyticsData.economicBenefits.waterBillReduction}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-600 shadow-lg">
                          <span className="text-white font-semibold text-base">
                            Energy Cost Savings
                          </span>
                          <span className="text-cyan-400 font-bold text-xl">
                            {analyticsData.economicBenefits.energyCostSavings}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-600 shadow-lg">
                          <span className="text-white font-semibold text-base">
                            Payback Period
                          </span>
                          <span className="text-cyan-400 font-bold text-xl">
                            {analyticsData.economicBenefits.paybackPeriod}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Export Options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-white/60 mb-4">
              Export detailed reports for stakeholder presentations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={exportAsPdf}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button
                onClick={exportAsCsv}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              <Button
                onClick={generateReport}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Analytics;
