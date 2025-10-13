"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Droplets,
  Beaker,
  Waves,
  TrendingDown,
  Sparkles,
  MapPin,
} from "lucide-react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WaterParameters {
  turbidity: number;
  pH: number;
  cod: number;
  tds: number;
  nitrogen: number;
  phosphorus: number;
  reuseType: string;
}

type NumericParameters = Exclude<keyof WaterParameters, "reuseType">;

const Simulation = () => {
  const searchParams = useSearchParams();
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [parameters, setParameters] = useState<WaterParameters>({
    turbidity: 50,
    pH: 7.0,
    cod: 300,
    tds: 500,
    nitrogen: 20,
    phosphorus: 5,
    reuseType: "",
  });

  // Load parameters from URL if coming from map
  useEffect(() => {
    const turbidity = searchParams.get("turbidity");
    const pH = searchParams.get("pH");
    const cod = searchParams.get("cod");
    const tds = searchParams.get("tds");
    const nitrogen = searchParams.get("nitrogen");
    const phosphorus = searchParams.get("phosphorus");
    const name = searchParams.get("sourceName");

    if (turbidity || pH || cod || tds) {
      setParameters({
        turbidity: turbidity ? parseFloat(turbidity) : 50,
        pH: pH ? parseFloat(pH) : 7.0,
        cod: cod ? parseFloat(cod) : 300,
        tds: tds ? parseFloat(tds) : 500,
        nitrogen: nitrogen ? parseFloat(nitrogen) : 20,
        phosphorus: phosphorus ? parseFloat(phosphorus) : 5,
        reuseType: "",
      });

      if (name) {
        setSourceName(name);
      }
    }
  }, [searchParams]);

  const handleSliderChange = (field: NumericParameters, value: number[]) => {
    setParameters({ ...parameters, [field]: value[0] });
  };

  const handleStartSimulation = () => {
    // Navigate to dashboard with parameters
    const params = new URLSearchParams(parameters as any).toString();
    window.location.href = `/dashboard?${params}`;
  };

  const parameterCards = [
    {
      icon: Waves,
      label: "Turbidity (NTU)",
      field: "turbidity" as NumericParameters,
      min: 0,
      max: 1000,
      step: 10,
      description: "Measure of water cloudiness",
      color: "cyan",
    },
    {
      icon: Beaker,
      label: "pH Level",
      field: "pH" as NumericParameters,
      min: 0,
      max: 14,
      step: 0.1,
      description: "Acidity/alkalinity measure",
      color: "blue",
    },
    {
      icon: TrendingDown,
      label: "COD (mg/L)",
      field: "cod" as NumericParameters,
      min: 0,
      max: 1000,
      step: 10,
      description: "Chemical Oxygen Demand",
      color: "purple",
    },
    {
      icon: Droplets,
      label: "TDS (mg/L)",
      field: "tds" as NumericParameters,
      min: 0,
      max: 2000,
      step: 50,
      description: "Total Dissolved Solids",
      color: "teal",
    },
    {
      icon: Sparkles,
      label: "Nitrogen (mg/L)",
      field: "nitrogen" as NumericParameters,
      min: 0,
      max: 100,
      step: 1,
      description: "Nitrogen content",
      color: "green",
    },
    {
      icon: Sparkles,
      label: "Phosphorus (mg/L)",
      field: "phosphorus" as NumericParameters,
      min: 0,
      max: 50,
      step: 0.5,
      description: "Phosphorus content",
      color: "amber",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
        <Header />

        <div className="container mx-auto px-6 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Water Quality{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Simulation
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Enter wastewater parameters to simulate the intelligent treatment
              process
            </p>

            {/* Show alert if data is loaded from map */}
            {sourceName && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 max-w-2xl mx-auto"
              >
                <Alert className="bg-cyan-500/10 border-cyan-500/30">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <AlertDescription className="text-white ml-2">
                    Parameters loaded from{" "}
                    <span className="font-semibold text-cyan-400">
                      {sourceName}
                    </span>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {parameterCards.map((param, index) => (
              <motion.div
                key={param.field}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`p-2 rounded-lg bg-${param.color}-500/20`}
                      >
                        <param.icon
                          className={`h-5 w-5 text-${param.color}-400`}
                        />
                      </div>
                      <CardTitle className="text-white text-lg">
                        {param.label}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-white/60">
                      {param.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-white">
                          {parameters[param.field]}
                        </span>
                        <Input
                          type="number"
                          value={parameters[param.field]}
                          onChange={(e) =>
                            setParameters({
                              ...parameters,
                              [param.field]: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-24 bg-white/10 border-white/20 text-white"
                          step={param.step}
                          min={param.min}
                          max={param.max}
                        />
                      </div>
                      <Slider
                        value={[parameters[param.field]]}
                        onValueChange={(value) =>
                          handleSliderChange(param.field, value)
                        }
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        className="cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-white/50">
                        <span>{param.min}</span>
                        <span>{param.max}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Intended Water Reuse
                </CardTitle>
                <CardDescription className="text-white/60">
                  Select the purpose for which you want to reuse the treated
                  water
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="reuse-type" className="text-white">
                      Reuse Type
                    </Label>
                    <Select
                      value={parameters.reuseType}
                      onValueChange={(value) =>
                        setParameters({ ...parameters, reuseType: value })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select reuse option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="irrigation">
                          Agricultural Irrigation
                        </SelectItem>
                        <SelectItem value="industrial">
                          Industrial Process Use
                        </SelectItem>
                        <SelectItem value="potable">
                          Potable Water (Drinking)
                        </SelectItem>
                        <SelectItem value="landscape">
                          Landscape Irrigation
                        </SelectItem>
                        <SelectItem value="cooling">Cooling Systems</SelectItem>
                        <SelectItem value="toilet">Toilet Flushing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={handleStartSimulation}
                      disabled={!parameters.reuseType}
                      className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold text-lg shadow-xl shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Start Treatment Simulation
                    </Button>
                  </div>
                </div>

                {parameters.reuseType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg"
                  >
                    <p className="text-white/80 text-sm">
                      <strong className="text-cyan-400">Selected:</strong>{" "}
                      {parameters.reuseType === "irrigation" &&
                        "Agricultural irrigation requires moderate treatment levels"}
                      {parameters.reuseType === "industrial" &&
                        "Industrial use requires removal of specific contaminants"}
                      {parameters.reuseType === "potable" &&
                        "Drinking water requires the highest treatment standards"}
                      {parameters.reuseType === "landscape" &&
                        "Landscape irrigation requires basic treatment"}
                      {parameters.reuseType === "cooling" &&
                        "Cooling systems require low TDS and controlled pH"}
                      {parameters.reuseType === "toilet" &&
                        "Toilet flushing requires basic disinfection"}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-white/60 text-sm">
              The system will automatically determine the optimal treatment
              stages based on your inputs
            </p>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Simulation;
