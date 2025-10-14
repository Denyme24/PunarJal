'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Loader2,
} from 'lucide-react';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

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

// Map icon names to components
const iconMap: { [key: string]: any } = {
  Sprout: Sprout,
  Factory: Factory,
  Coffee: Coffee,
  Wind: Wind,
  Toilet: Toilet,
};

interface ReuseData {
  reuseOptions: ReuseOption[];
  waterSavings: {
    daily: number;
    monthly: number;
    yearly: number;
    co2Reduced: number;
    energySaved: number;
  };
}

const Reuse = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reuseData, setReuseData] = useState<ReuseData | null>(null);
  const [treatedWater, setTreatedWater] = useState<WaterQuality>({
    turbidity: 2.5,
    pH: 7.2,
    cod: 15,
    tds: 350,
    nitrogen: 3.5,
    phosphorus: 0.8,
  });

  useEffect(() => {
    const fetchReuseOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load treated water quality from latest simulation
        let waterQuality = treatedWater;
        try {
          const contextRaw = localStorage.getItem('lastSimulationContext');
          if (contextRaw) {
            const context = JSON.parse(contextRaw);
            const params = context.parameters;

            // Estimate treated water quality based on treatment efficiency
            const efficiency =
              (context.simulationResult?.estimatedEfficiency || 80) / 100;

            waterQuality = {
              turbidity: Math.max(
                1,
                params.turbidity * (1 - efficiency * 0.98)
              ),
              pH: Math.max(6.5, Math.min(8.5, params.pH)),
              cod: Math.max(10, params.cod * (1 - efficiency * 0.95)),
              tds: Math.max(200, params.tds * (1 - efficiency * 0.5)),
              nitrogen: Math.max(1, params.nitrogen * (1 - efficiency * 0.9)),
              phosphorus: Math.max(
                0.5,
                params.phosphorus * (1 - efficiency * 0.9)
              ),
            };

            setTreatedWater(waterQuality);
          }
        } catch (err) {
          console.error('Error loading simulation data:', err);
        }

        // Call AI generation API with authorization header
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/reuse/generate', {
          method: 'POST',
          headers,
          body: JSON.stringify({ treatedWaterQuality: waterQuality }),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result?.error || 'Failed to generate reuse options');
        }

        setReuseData(result.data);
      } catch (err: any) {
        console.error('Error fetching reuse options:', err);
        setError(err.message || 'Failed to load reuse recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchReuseOptions();
  }, [token]);

  // Fallback data if API fails
  const fallbackReuseOptions: ReuseOption[] = [
    {
      id: 'irrigation',
      name: 'Agricultural Irrigation',
      icon: Sprout,
      suitable: true,
      confidence: 95,
      requirements: [
        'Turbidity < 5 NTU ✓',
        'pH 6.5-8.5 ✓',
        'COD < 100 mg/L ✓',
        'Nitrogen acceptable ✓',
      ],
      benefits: [
        'Reduces freshwater consumption',
        'Provides nutrients to crops',
        'Cost-effective solution',
        'Environmentally sustainable',
      ],
    },
    {
      id: 'industrial',
      name: 'Industrial Process Water',
      icon: Factory,
      suitable: true,
      confidence: 88,
      requirements: [
        'TDS < 500 mg/L ✓',
        'pH controlled ✓',
        'Low organic content ✓',
      ],
      benefits: [
        'Suitable for cooling systems',
        'Can be used in manufacturing',
        'Reduces industrial water costs',
        'Meets process water standards',
      ],
    },
    {
      id: 'landscape',
      name: 'Landscape Irrigation',
      icon: Sprout,
      suitable: true,
      confidence: 98,
      requirements: [
        'Turbidity < 5 NTU ✓',
        'Basic disinfection ✓',
        'Visual clarity ✓',
      ],
      benefits: [
        'Perfect for parks and gardens',
        'Maintains green spaces',
        'No health risks',
        'High water savings',
      ],
    },
    {
      id: 'toilet',
      name: 'Toilet Flushing',
      icon: Toilet,
      suitable: true,
      confidence: 92,
      requirements: [
        'Basic treatment completed ✓',
        'Odor controlled ✓',
        'Color acceptable ✓',
      ],
      benefits: [
        'Significant water savings',
        'Easy implementation',
        'No human contact',
        'Reduces sewage load',
      ],
    },
    {
      id: 'cooling',
      name: 'Cooling Tower Systems',
      icon: Wind,
      suitable: true,
      confidence: 85,
      requirements: [
        'TDS controlled ✓',
        'pH balanced ✓',
        'Low scaling potential ✓',
      ],
      benefits: [
        'Industrial cooling applications',
        'Energy efficiency maintained',
        'Reduces cooling water demand',
      ],
      warnings: [
        'Monitor for scaling regularly',
        'May need additional treatment for specific systems',
      ],
    },
    {
      id: 'potable',
      name: 'Potable Water (Drinking)',
      icon: Coffee,
      suitable: false,
      confidence: 45,
      requirements: [
        'Turbidity < 1 NTU ✗',
        'Advanced disinfection needed ✗',
        'Complete nutrient removal ✗',
        'Multiple quality checks required ✗',
      ],
      benefits: ['Highest value water reuse', 'Complete water cycle closure'],
      warnings: [
        'Requires additional tertiary treatment',
        'Needs UV disinfection or chlorination',
        'Regulatory approval required',
        'Not recommended with current treatment level',
      ],
    },
  ];

  const fallbackWaterSavings = {
    daily: 1200,
    monthly: 36000,
    yearly: 432000,
    co2Reduced: 2.5,
    energySaved: 1800,
  };

  // Use fetched data or fallback
  const reuseOptions = reuseData?.reuseOptions || fallbackReuseOptions;
  const waterSavings = reuseData?.waterSavings || fallbackWaterSavings;

  // Map icon names to actual icon components
  const mappedReuseOptions = reuseOptions.map(option => ({
    ...option,
    icon: iconMap[option.icon] || Droplets,
  }));

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
          <Header />
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-white text-xl">
                Generating personalized reuse recommendations...
              </p>
              <p className="text-white/60 text-sm mt-2">
                Analyzing your water quality data
              </p>
            </div>
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
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="text-center max-w-md">
              <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
              <p className="text-white text-xl mb-2">
                Unable to load recommendations
              </p>
              <p className="text-white/60 text-sm mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
              Reuse{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Recommendations
              </span>
            </h1>
            <p className="text-xl text-white/70">
              AI-powered recommendations based on your water quality and
              historical data
            </p>
            {localStorage.getItem('lastSimulationContext') && (
              <p className="text-sm text-cyan-400 mt-2">
                ✓ Using data from your latest simulation
              </p>
            )}
          </motion.div>

          {/* Reuse Options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {mappedReuseOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Card
                    className={`bg-white/5 backdrop-blur-lg border-white/10 h-full ${
                      option.suitable
                        ? 'ring-2 ring-green-500/30'
                        : 'ring-2 ring-red-500/30'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 rounded-lg ${
                              option.suitable
                                ? 'bg-green-500/20'
                                : 'bg-red-500/20'
                            }`}
                          >
                            <option.icon
                              className={`h-6 w-6 ${
                                option.suitable
                                  ? 'text-green-400'
                                  : 'text-red-400'
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
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Reuse;
