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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  TrendingDown,
  Droplets,
  Zap,
  Leaf,
  BarChart3,
  PieChart,
  Download,
  FileText,
  Loader2,
  AlertTriangle,
  Eye,
  MessageSquare,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Activity,
} from "lucide-react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
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

// Multi-plant monitoring data structure
type PlantData = {
  id: string;
  name: string;
  location: string;
  operator: string;
  status: "operational" | "maintenance" | "alert";
  lastUpdated: string;
  currentMetrics: {
    turbidity: number;
    pH: number;
    cod: number;
    tds: number;
    nitrogen: number;
    phosphorus: number;
  };
  trends: {
    tds: Array<{ date: string; value: number }>;
    turbidity: Array<{ date: string; value: number }>;
    efficiency: Array<{ date: string; value: number }>;
  };
  alerts: Array<{
    id: string;
    type: "warning" | "critical";
    parameter: string;
    message: string;
    timestamp: string;
    resolved: boolean;
  }>;
  compliance: {
    monthly: boolean;
    quarterly: boolean;
    annual: boolean;
    lastAudit: string;
  };
  feedback: Array<{
    id: string;
    message: string;
    timestamp: string;
    officer: string;
    status: "sent" | "acknowledged" | "resolved";
  }>;
};

type ComplianceReport = {
  id: string;
  month: string;
  year: number;
  plants: Array<{
    name: string;
    compliance: number;
    issues: string[];
    recommendations: string[];
  }>;
  overallCompliance: number;
  generatedBy: string;
  generatedAt: string;
};

const Analytics = () => {
  const { token, user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Environmental Officer dashboard state
  const [plants, setPlants] = useState<PlantData[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);

  // Sample plant data for Environmental Officer dashboard
  const initializePlantData = () => {
    const samplePlants: PlantData[] = [
      {
        id: "plant-001",
        name: "Central Treatment Plant",
        location: "Bangalore Central",
        operator: "John Smith",
        status: "alert",
        lastUpdated: new Date().toISOString(),
        currentMetrics: {
          turbidity: 8.5,
          pH: 7.2,
          cod: 185,
          tds: 850, // High TDS - alert condition
          nitrogen: 18,
          phosphorus: 4.2,
        },
        trends: {
          tds: [
            { date: "2024-01-01", value: 650 },
            { date: "2024-01-02", value: 680 },
            { date: "2024-01-03", value: 720 },
            { date: "2024-01-04", value: 780 },
            { date: "2024-01-05", value: 820 },
            { date: "2024-01-06", value: 850 },
          ],
          turbidity: [
            { date: "2024-01-01", value: 12.5 },
            { date: "2024-01-02", value: 11.8 },
            { date: "2024-01-03", value: 10.2 },
            { date: "2024-01-04", value: 9.5 },
            { date: "2024-01-05", value: 8.8 },
            { date: "2024-01-06", value: 8.5 },
          ],
          efficiency: [
            { date: "2024-01-01", value: 85 },
            { date: "2024-01-02", value: 87 },
            { date: "2024-01-03", value: 89 },
            { date: "2024-01-04", value: 91 },
            { date: "2024-01-05", value: 88 },
            { date: "2024-01-06", value: 86 },
          ],
        },
        alerts: [
          {
            id: "alert-001",
            type: "critical",
            parameter: "TDS",
            message: "TDS levels consistently above 800 mg/L for 3 days",
            timestamp: new Date().toISOString(),
            resolved: false,
          },
        ],
        compliance: {
          monthly: true,
          quarterly: false,
          annual: true,
          lastAudit: "2024-01-01",
        },
        feedback: [],
      },
      {
        id: "plant-002",
        name: "North Treatment Facility",
        location: "Bangalore North",
        operator: "Sarah Johnson",
        status: "operational",
        lastUpdated: new Date().toISOString(),
        currentMetrics: {
          turbidity: 6.2,
          pH: 7.4,
          cod: 150,
          tds: 580,
          nitrogen: 15,
          phosphorus: 3.8,
        },
        trends: {
          tds: [
            { date: "2024-01-01", value: 580 },
            { date: "2024-01-02", value: 575 },
            { date: "2024-01-03", value: 570 },
            { date: "2024-01-04", value: 585 },
            { date: "2024-01-05", value: 580 },
            { date: "2024-01-06", value: 580 },
          ],
          turbidity: [
            { date: "2024-01-01", value: 6.5 },
            { date: "2024-01-02", value: 6.3 },
            { date: "2024-01-03", value: 6.1 },
            { date: "2024-01-04", value: 6.2 },
            { date: "2024-01-05", value: 6.2 },
            { date: "2024-01-06", value: 6.2 },
          ],
          efficiency: [
            { date: "2024-01-01", value: 92 },
            { date: "2024-01-02", value: 93 },
            { date: "2024-01-03", value: 94 },
            { date: "2024-01-04", value: 92 },
            { date: "2024-01-05", value: 93 },
            { date: "2024-01-06", value: 93 },
          ],
        },
        alerts: [],
        compliance: {
          monthly: true,
          quarterly: true,
          annual: true,
          lastAudit: "2024-01-01",
        },
        feedback: [],
      },
      {
        id: "plant-003",
        name: "South Industrial Plant",
        location: "Bangalore South",
        operator: "Mike Chen",
        status: "maintenance",
        lastUpdated: new Date().toISOString(),
        currentMetrics: {
          turbidity: 9.8,
          pH: 6.9,
          cod: 220,
          tds: 720,
          nitrogen: 22,
          phosphorus: 5.5,
        },
        trends: {
          tds: [
            { date: "2024-01-01", value: 720 },
            { date: "2024-01-02", value: 715 },
            { date: "2024-01-03", value: 710 },
            { date: "2024-01-04", value: 720 },
            { date: "2024-01-05", value: 720 },
            { date: "2024-01-06", value: 720 },
          ],
          turbidity: [
            { date: "2024-01-01", value: 10.2 },
            { date: "2024-01-02", value: 9.9 },
            { date: "2024-01-03", value: 9.8 },
            { date: "2024-01-04", value: 9.8 },
            { date: "2024-01-05", value: 9.8 },
            { date: "2024-01-06", value: 9.8 },
          ],
          efficiency: [
            { date: "2024-01-01", value: 88 },
            { date: "2024-01-02", value: 89 },
            { date: "2024-01-03", value: 88 },
            { date: "2024-01-04", value: 87 },
            { date: "2024-01-05", value: 88 },
            { date: "2024-01-06", value: 88 },
          ],
        },
        alerts: [
          {
            id: "alert-002",
            type: "warning",
            parameter: "Turbidity",
            message: "Turbidity approaching threshold limit",
            timestamp: new Date().toISOString(),
            resolved: false,
          },
        ],
        compliance: {
          monthly: true,
          quarterly: true,
          annual: false,
          lastAudit: "2023-12-15",
        },
        feedback: [],
      },
    ];
    
    setPlants(samplePlants);
  };

  useEffect(() => {
    // Initialize plant data for Environmental Officers
    if (user?.role === "Environmental Officer") {
      initializePlantData();
      setLoading(false);
      return;
    }

    // Original analytics logic for other users
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
  }, [token, user]);

  // Environmental Officer functions
  const sendFeedbackToOperator = (plantId: string) => {
    if (!feedbackMessage.trim()) return;
    
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;
    
    const feedback = {
      id: `feedback-${Date.now()}`,
      message: feedbackMessage,
      timestamp: new Date().toISOString(),
      officer: user?.organizationName || "Environmental Officer",
      status: "sent" as const,
    };
    
    // Update plant with new feedback
    setPlants(prev => prev.map(p => 
      p.id === plantId 
        ? { ...p, feedback: [...p.feedback, feedback] }
        : p
    ));
    
    setFeedbackMessage("");
    setShowFeedbackDialog(false);
    alert(`Feedback sent to ${plant.operator} at ${plant.name}`);
  };

  const generateComplianceReport = () => {
    const report: ComplianceReport = {
      id: `report-${Date.now()}`,
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear(),
      plants: plants.map(plant => ({
        name: plant.name,
        compliance: plant.compliance.monthly && plant.compliance.quarterly && plant.compliance.annual ? 100 : 75,
        issues: plant.alerts.map(alert => alert.message),
        recommendations: plant.alerts.length > 0 ? ["Address pending alerts", "Schedule maintenance"] : ["Continue current operations"]
      })),
      overallCompliance: plants.reduce((acc, plant) => {
        const compliance = plant.compliance.monthly && plant.compliance.quarterly && plant.compliance.annual ? 100 : 75;
        return acc + compliance;
      }, 0) / plants.length,
      generatedBy: user?.organizationName || "Environmental Officer",
      generatedAt: new Date().toISOString(),
    };
    
    setComplianceReports(prev => [report, ...prev]);
    
    // Download report
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance-report-${report.month}-${report.year}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert(`Monthly compliance report generated for ${report.month} ${report.year}`);
  };

  // Original analytics functions
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

  // Show Environmental Officer dashboard if user has that role
  if (user?.role === "Environmental Officer") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
          <Header />

          <div className="container mx-auto px-6 pt-32 pb-20">
            {/* Environmental Officer Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Environmental{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Oversight
                </span>
              </h1>
              <p className="text-xl text-white/70">
                Multi-plant monitoring and compliance management
              </p>
            </motion.div>

            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20">
                  Plant Overview
                </TabsTrigger>
                <TabsTrigger value="trends" className="data-[state=active]:bg-cyan-500/20">
                  Trend Analysis
                </TabsTrigger>
                <TabsTrigger value="compliance" className="data-[state=active]:bg-cyan-500/20">
                  Compliance Reports
                </TabsTrigger>
              </TabsList>

              {/* Plant Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Building2 className="h-5 w-5 text-blue-400" />
                        <span className="text-xs text-white/60">Total Plants</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{plants.length}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-xs text-white/60">Operational</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {plants.filter(p => p.status === "operational").length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <span className="text-xs text-white/60">Alerts</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {plants.reduce((acc, plant) => acc + plant.alerts.length, 0)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Activity className="h-5 w-5 text-yellow-400" />
                        <span className="text-xs text-white/60">Maintenance</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {plants.filter(p => p.status === "maintenance").length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Plant Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plants.map((plant, index) => (
                    <motion.div
                      key={plant.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className={`${
                        plant.status === "alert" ? "bg-red-500/10 border-red-500/30" :
                        plant.status === "maintenance" ? "bg-yellow-500/10 border-yellow-500/30" :
                        "bg-green-500/10 border-green-500/30"
                      } backdrop-blur-lg cursor-pointer hover:scale-105 transition-transform`}
                      onClick={() => setSelectedPlant(plant)}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white text-lg">{plant.name}</CardTitle>
                            <Badge className={`${
                              plant.status === "alert" ? "bg-red-500" :
                              plant.status === "maintenance" ? "bg-yellow-500" :
                              "bg-green-500"
                            } text-white`}>
                              {plant.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-white/60">
                            {plant.location} • Operator: {plant.operator}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-white/70 text-sm">TDS</span>
                              <span className={`font-bold ${
                                plant.currentMetrics.tds > 800 ? "text-red-400" : "text-green-400"
                              }`}>
                                {plant.currentMetrics.tds} mg/L
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/70 text-sm">Turbidity</span>
                              <span className={`font-bold ${
                                plant.currentMetrics.turbidity > 10 ? "text-red-400" : "text-green-400"
                              }`}>
                                {plant.currentMetrics.turbidity} NTU
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/70 text-sm">pH</span>
                              <span className="text-white font-bold">
                                {plant.currentMetrics.pH}
                              </span>
                            </div>
                            {plant.alerts.length > 0 && (
                              <Alert className="bg-red-500/20 border-red-500/40">
                                <AlertTriangle className="h-4 w-4 text-red-400" />
                                <AlertDescription className="text-white text-sm">
                                  {plant.alerts[0].message}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Trend Analysis Tab */}
              <TabsContent value="trends" className="space-y-6">
                {selectedPlant && (
                  <div className="space-y-6">
                    <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-cyan-400" />
                          {selectedPlant.name} - Trend Analysis
                        </CardTitle>
                        <CardDescription className="text-white/60">
                          Historical data and performance trends
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="text-white font-semibold mb-3">TDS Trend</h4>
                            <div className="space-y-2">
                              {selectedPlant.trends.tds.map((point, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-white/70 text-sm">{point.date}</span>
                                  <span className={`font-bold ${
                                    point.value > 800 ? "text-red-400" : "text-green-400"
                                  }`}>
                                    {point.value} mg/L
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-3">Turbidity Trend</h4>
                            <div className="space-y-2">
                              {selectedPlant.trends.turbidity.map((point, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-white/70 text-sm">{point.date}</span>
                                  <span className={`font-bold ${
                                    point.value > 10 ? "text-red-400" : "text-green-400"
                                  }`}>
                                    {point.value} NTU
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-3">Efficiency Trend</h4>
                            <div className="space-y-2">
                              {selectedPlant.trends.efficiency.map((point, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-white/70 text-sm">{point.date}</span>
                                  <span className="text-cyan-400 font-bold">
                                    {point.value}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Feedback Section */}
                    <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-cyan-400" />
                          Send Corrective Feedback
                        </CardTitle>
                        <CardDescription className="text-white/60">
                          Communicate with plant operator about performance issues
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                              Send Feedback to {selectedPlant.operator}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Send Feedback</DialogTitle>
                              <DialogDescription className="text-gray-300">
                                Send corrective feedback to {selectedPlant.operator} at {selectedPlant.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Enter your feedback message..."
                                value={feedbackMessage}
                                onChange={(e) => setFeedbackMessage(e.target.value)}
                                className="bg-gray-800 border-gray-600 text-white"
                              />
                              <Button
                                onClick={() => sendFeedbackToOperator(selectedPlant.id)}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                              >
                                Send Feedback
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Previous Feedback */}
                        {selectedPlant.feedback.length > 0 && (
                          <div className="mt-6 space-y-3">
                            <h4 className="text-white font-semibold">Previous Feedback</h4>
                            {selectedPlant.feedback.map((feedback) => (
                              <div key={feedback.id} className="p-3 bg-gray-800/50 rounded-lg">
                                <p className="text-white text-sm">{feedback.message}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                  Sent by {feedback.officer} on {new Date(feedback.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Compliance Reports Tab */}
              <TabsContent value="compliance" className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-cyan-400" />
                      Monthly Compliance Reports
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Generate and download compliance reports for all plants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={generateComplianceReport}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white mb-6"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Generate Monthly Report
                    </Button>

                    {complianceReports.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Generated Reports</h4>
                        {complianceReports.map((report) => (
                          <div key={report.id} className="p-4 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-medium">
                                  {report.month} {report.year} Compliance Report
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Overall Compliance: {report.overallCompliance.toFixed(1)}%
                                </p>
                              </div>
                              <Badge className="bg-green-500 text-white">
                                Generated
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Original analytics view for other users
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
