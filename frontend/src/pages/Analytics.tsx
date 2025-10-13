import { motion } from "framer-motion";
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
} from "lucide-react";
import Header from "@/components/Header";

const Analytics = () => {
  const simulationHistory = [
    { date: "2025-10-13", waterSaved: 1200, energySaved: 180, efficiency: 94 },
    { date: "2025-10-12", waterSaved: 1150, energySaved: 175, efficiency: 92 },
    { date: "2025-10-11", waterSaved: 1300, energySaved: 195, efficiency: 95 },
    { date: "2025-10-10", waterSaved: 1100, energySaved: 165, efficiency: 90 },
    { date: "2025-10-09", waterSaved: 1250, energySaved: 185, efficiency: 93 },
  ];

  const treatmentEfficiency = {
    primary: { removal: 65, avgTime: 45, energyUsed: 25 },
    secondary: { removal: 85, avgTime: 120, energyUsed: 55 },
    tertiary: { removal: 95, avgTime: 90, energyUsed: 70 },
  };

  const reuseBreakdown = [
    { type: "Agricultural Irrigation", percentage: 35, volume: 420 },
    { type: "Industrial Process", percentage: 28, volume: 336 },
    { type: "Landscape Irrigation", percentage: 20, volume: 240 },
    { type: "Toilet Flushing", percentage: 12, volume: 144 },
    { type: "Cooling Systems", percentage: 5, volume: 60 },
  ];

  const sustainabilityMetrics = {
    totalWaterRecycled: 432000,
    freshwaterSaved: 389000,
    co2Emissions: 2.5,
    energyEfficiency: 88,
    costSavings: 125000,
    treesEquivalent: 115,
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
            Analytics &{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Reports
            </span>
          </h1>
          <p className="text-xl text-white/70">
            Comprehensive sustainability and performance insights
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
              value: `${(sustainabilityMetrics.freshwaterSaved / 1000).toFixed(
                0
              )}kL`,
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
                    Performance data from the last 5 simulations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {simulationHistory.map((sim, index) => (
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
                {Object.entries(treatmentEfficiency).map(([stage, data]) => (
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
                ))}
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
                    {reuseBreakdown.map((item, index) => (
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
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">
                      Environmental Impact
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Positive environmental contributions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">
                          Freshwater Conservation
                        </span>
                        <span className="text-green-400 font-bold">
                          389,000L
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">
                          CO₂ Emissions Avoided
                        </span>
                        <span className="text-green-400 font-bold">
                          2.5 Tonnes
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">
                          Equivalent Trees Planted
                        </span>
                        <span className="text-green-400 font-bold">
                          115 Trees
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">
                          Reduction in Water Footprint
                        </span>
                        <span className="text-green-400 font-bold">47%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">
                      Economic Benefits
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Financial savings and ROI
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">
                          Total Cost Savings
                        </span>
                        <span className="text-cyan-400 font-bold">
                          $125,000
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">
                          Water Bill Reduction
                        </span>
                        <span className="text-cyan-400 font-bold">$89,000</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">
                          Energy Cost Savings
                        </span>
                        <span className="text-cyan-400 font-bold">$36,000</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">Payback Period</span>
                        <span className="text-cyan-400 font-bold">
                          2.3 Years
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
            <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors">
              Export as PDF
            </button>
            <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors">
              Export as CSV
            </button>
            <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors">
              Generate Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
