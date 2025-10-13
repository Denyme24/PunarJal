"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Droplets,
  Sprout,
  Factory,
  Coffee,
  Wind,
  Toilet,
} from "lucide-react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

interface WaterQuality {
  turbidity: number;
  pH: number;
  cod: number;
  tds: number;
  nitrogen: number;
  phosphorus: number;
}

interface ReuseOption {
  id: string;
  name: string;
  icon: any;
  suitable: boolean;
  confidence: number;
  requirements: string[];
  benefits: string[];
  warnings?: string[];
}

const Reuse = () => {
  // Simulated treated water quality
  const treatedWater: WaterQuality = {
    turbidity: 2.5,
    pH: 7.2,
    cod: 15,
    tds: 350,
    nitrogen: 3.5,
    phosphorus: 0.8,
  };

  const reuseOptions: ReuseOption[] = [
    {
      id: "irrigation",
      name: "Agricultural Irrigation",
      icon: Sprout,
      suitable: true,
      confidence: 95,
      requirements: [
        "Turbidity < 5 NTU ✓",
        "pH 6.5-8.5 ✓",
        "COD < 100 mg/L ✓",
        "Nitrogen acceptable ✓",
      ],
      benefits: [
        "Reduces freshwater consumption",
        "Provides nutrients to crops",
        "Cost-effective solution",
        "Environmentally sustainable",
      ],
    },
    {
      id: "industrial",
      name: "Industrial Process Water",
      icon: Factory,
      suitable: true,
      confidence: 88,
      requirements: [
        "TDS < 500 mg/L ✓",
        "pH controlled ✓",
        "Low organic content ✓",
      ],
      benefits: [
        "Suitable for cooling systems",
        "Can be used in manufacturing",
        "Reduces industrial water costs",
        "Meets process water standards",
      ],
    },
    {
      id: "landscape",
      name: "Landscape Irrigation",
      icon: Sprout,
      suitable: true,
      confidence: 98,
      requirements: [
        "Turbidity < 5 NTU ✓",
        "Basic disinfection ✓",
        "Visual clarity ✓",
      ],
      benefits: [
        "Perfect for parks and gardens",
        "Maintains green spaces",
        "No health risks",
        "High water savings",
      ],
    },
    {
      id: "toilet",
      name: "Toilet Flushing",
      icon: Toilet,
      suitable: true,
      confidence: 92,
      requirements: [
        "Basic treatment completed ✓",
        "Odor controlled ✓",
        "Color acceptable ✓",
      ],
      benefits: [
        "Significant water savings",
        "Easy implementation",
        "No human contact",
        "Reduces sewage load",
      ],
    },
    {
      id: "cooling",
      name: "Cooling Tower Systems",
      icon: Wind,
      suitable: true,
      confidence: 85,
      requirements: [
        "TDS controlled ✓",
        "pH balanced ✓",
        "Low scaling potential ✓",
      ],
      benefits: [
        "Industrial cooling applications",
        "Energy efficiency maintained",
        "Reduces cooling water demand",
      ],
      warnings: [
        "Monitor for scaling regularly",
        "May need additional treatment for specific systems",
      ],
    },
    {
      id: "potable",
      name: "Potable Water (Drinking)",
      icon: Coffee,
      suitable: false,
      confidence: 45,
      requirements: [
        "Turbidity < 1 NTU ✗",
        "Advanced disinfection needed ✗",
        "Complete nutrient removal ✗",
        "Multiple quality checks required ✗",
      ],
      benefits: ["Highest value water reuse", "Complete water cycle closure"],
      warnings: [
        "Requires additional tertiary treatment",
        "Needs UV disinfection or chlorination",
        "Regulatory approval required",
        "Not recommended with current treatment level",
      ],
    },
  ];

  const waterSavings = {
    daily: 1200,
    monthly: 36000,
    yearly: 432000,
    co2Reduced: 2.5,
    energySaved: 1800,
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Reuse{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Recommendations
              </span>
            </h1>
            <p className="text-xl text-white/70">
              Smart recommendations based on treated water quality
            </p>
          </motion.div>

          {/* Treated Water Quality Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Treated Water Quality
                </CardTitle>
                <CardDescription className="text-white/60">
                  Final water parameters after treatment process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(treatedWater).map(([key, value]) => (
                    <div
                      key={key}
                      className="text-center p-4 bg-white/5 rounded-lg"
                    >
                      <div className="text-xs text-white/60 uppercase mb-2">
                        {key}
                      </div>
                      <div className="text-2xl font-bold text-cyan-400">
                        {value}
                      </div>
                      <div className="text-xs text-white/50 mt-1">
                        {key === "turbidity" && "NTU"}
                        {key === "pH" && ""}
                        {(key === "cod" ||
                          key === "tds" ||
                          key === "nitrogen" ||
                          key === "phosphorus") &&
                          "mg/L"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reuse Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {reuseOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card
                  className={`bg-white/5 backdrop-blur-lg border-white/10 h-full ${
                    option.suitable
                      ? "ring-2 ring-green-500/30"
                      : "ring-2 ring-red-500/30"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-3 rounded-lg ${
                            option.suitable ? "bg-green-500/20" : "bg-red-500/20"
                          }`}
                        >
                          <option.icon
                            className={`h-6 w-6 ${
                              option.suitable ? "text-green-400" : "text-red-400"
                            }`}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl">
                            {option.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {option.suitable ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Suitable
                              </Badge>
                            ) : (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                <XCircle className="h-3 w-3 mr-1" />
                                Not Suitable
                              </Badge>
                            )}
                            <span className="text-sm text-white/60">
                              {option.confidence}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                        Requirements
                      </h4>
                      <ul className="space-y-1">
                        {option.requirements.map((req, i) => (
                          <li
                            key={i}
                            className="text-sm text-white/70 flex items-start gap-2"
                          >
                            <span className="text-cyan-400">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-400" />
                        Benefits
                      </h4>
                      <ul className="space-y-1">
                        {option.benefits.map((benefit, i) => (
                          <li
                            key={i}
                            className="text-sm text-white/70 flex items-start gap-2"
                          >
                            <span className="text-blue-400">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {option.warnings && option.warnings.length > 0 && (
                      <div className="pt-3 border-t border-white/10">
                        <h4 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Warnings
                        </h4>
                        <ul className="space-y-1">
                          {option.warnings.map((warning, i) => (
                            <li
                              key={i}
                              className="text-sm text-amber-400/80 flex items-start gap-2"
                            >
                              <span>•</span>
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Impact Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Card className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 backdrop-blur-lg border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Environmental Impact
                </CardTitle>
                <CardDescription className="text-white/70">
                  Estimated savings from water reuse implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      {waterSavings.daily.toLocaleString()}L
                    </div>
                    <div className="text-sm text-white/60">Daily Water Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">
                      {waterSavings.monthly.toLocaleString()}L
                    </div>
                    <div className="text-sm text-white/60">Monthly Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">
                      {(waterSavings.yearly / 1000).toFixed(0)}kL
                    </div>
                    <div className="text-sm text-white/60">Yearly Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      {waterSavings.co2Reduced}T
                    </div>
                    <div className="text-sm text-white/60">CO₂ Reduced</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-1">
                      {waterSavings.energySaved.toLocaleString()}kWh
                    </div>
                    <div className="text-sm text-white/60">Energy Saved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Button
              onClick={() => (window.location.href = "/analytics")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg"
            >
              View Detailed Analytics
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/simulation")}
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              Run New Simulation
            </Button>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Reuse;
