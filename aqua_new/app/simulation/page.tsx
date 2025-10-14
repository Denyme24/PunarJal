'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WaterParameters {
  turbidity: number;
  pH: number;
  cod: number;
  tds: number;
  nitrogen: number;
  phosphorus: number;
  reuseType: string;
}

type NumericParameters = Exclude<keyof WaterParameters, 'reuseType'>;

const SimulationContent = () => {
  const searchParams = useSearchParams();
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [parameters, setParameters] = useState<WaterParameters>({
    turbidity: 50,
    pH: 7.0,
    cod: 300,
    tds: 500,
    nitrogen: 20,
    phosphorus: 5,
    reuseType: '',
  });

  // Load parameters from URL if coming from map
  useEffect(() => {
    const turbidity = searchParams.get('turbidity');
    const pH = searchParams.get('pH');
    const cod = searchParams.get('cod');
    const tds = searchParams.get('tds');
    const nitrogen = searchParams.get('nitrogen');
    const phosphorus = searchParams.get('phosphorus');
    const name = searchParams.get('sourceName');

    if (turbidity || pH || cod || tds) {
      setParameters({
        turbidity: turbidity ? parseFloat(turbidity) : 50,
        pH: pH ? parseFloat(pH) : 7.0,
        cod: cod ? parseFloat(cod) : 300,
        tds: tds ? parseFloat(tds) : 500,
        nitrogen: nitrogen ? parseFloat(nitrogen) : 20,
        phosphorus: phosphorus ? parseFloat(phosphorus) : 5,
        reuseType: '',
      });

      if (name) {
        setSourceName(name);
      }
    }
  }, [searchParams]);

  const handleStartSimulation = () => {
    // Navigate to treatment dashboard with parameters
    const params = new URLSearchParams(parameters as any).toString();
    window.location.href = `/treatment-dashboard?${params}`;
  };

  const [validationStatus, setValidationStatus] = useState(
    'All parameters valid'
  );

  // Validate parameters
  useEffect(() => {
    const isValid =
      parameters.turbidity >= 0 &&
      parameters.turbidity <= 1000 &&
      parameters.pH >= 0 &&
      parameters.pH <= 14 &&
      parameters.cod >= 0 &&
      parameters.cod <= 1000 &&
      parameters.tds >= 0 &&
      parameters.tds <= 2000 &&
      parameters.nitrogen >= 0 &&
      parameters.nitrogen <= 100 &&
      parameters.phosphorus >= 0 &&
      parameters.phosphorus <= 50;

    setValidationStatus(
      isValid ? 'All parameters valid' : 'Some parameters need adjustment'
    );
  }, [parameters]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
        <Header />

        <div className="container mx-auto px-6 pt-32 pb-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Simulation Inputs
            </h1>
            <p className="text-lg text-white/70">
              Use map values or enter manually
            </p>

            {/* Show alert if data is loaded from map */}
            {sourceName && (
              <div className="mt-4">
                <Alert className="bg-cyan-500/10 border-cyan-500/30">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <AlertDescription className="text-white ml-2">
                    Parameters loaded from{' '}
                    <span className="font-semibold text-cyan-400">
                      {sourceName}
                    </span>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Input Fields Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Row 1 */}
            <div className="bg-teal-100/10 rounded-lg p-4 flex justify-between items-center hover:bg-teal-100/20 transition-colors">
              <span className="text-gray-300">Turbidity (NTU)</span>
              <Input
                type="number"
                value={parameters.turbidity}
                onChange={e =>
                  setParameters({
                    ...parameters,
                    turbidity: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-20 bg-transparent border-none text-white font-bold text-right p-0 h-auto"
                min="0"
                max="1000"
              />
            </div>
            <div className="bg-teal-100/10 rounded-lg p-4 flex justify-between items-center hover:bg-teal-100/20 transition-colors">
              <span className="text-gray-300">pH</span>
              <Input
                type="number"
                value={parameters.pH}
                onChange={e =>
                  setParameters({
                    ...parameters,
                    pH: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-20 bg-transparent border-none text-white font-bold text-right p-0 h-auto"
                min="0"
                max="14"
                step="0.1"
              />
            </div>
            <div className="bg-teal-100/10 rounded-lg p-4 flex justify-between items-center hover:bg-teal-100/20 transition-colors">
              <span className="text-gray-300">COD (mg/L)</span>
              <Input
                type="number"
                value={parameters.cod}
                onChange={e =>
                  setParameters({
                    ...parameters,
                    cod: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-20 bg-transparent border-none text-white font-bold text-right p-0 h-auto"
                min="0"
                max="1000"
              />
            </div>

            {/* Row 2 */}
            <div className="bg-teal-100/10 rounded-lg p-4 flex justify-between items-center hover:bg-teal-100/20 transition-colors">
              <span className="text-gray-300">TDS (mg/L)</span>
              <Input
                type="number"
                value={parameters.tds}
                onChange={e =>
                  setParameters({
                    ...parameters,
                    tds: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-20 bg-transparent border-none text-white font-bold text-right p-0 h-auto"
                min="0"
                max="2000"
              />
            </div>
            <div className="bg-teal-100/10 rounded-lg p-4 flex justify-between items-center hover:bg-teal-100/20 transition-colors">
              <span className="text-gray-300">Nitrogen (mg/L)</span>
              <Input
                type="number"
                value={parameters.nitrogen}
                onChange={e =>
                  setParameters({
                    ...parameters,
                    nitrogen: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-20 bg-transparent border-none text-white font-bold text-right p-0 h-auto"
                min="0"
                max="100"
              />
            </div>
            <div className="bg-teal-100/10 rounded-lg p-4 flex justify-between items-center hover:bg-teal-100/20 transition-colors">
              <span className="text-gray-300">Phosphorus (mg/L)</span>
              <Input
                type="number"
                value={parameters.phosphorus}
                onChange={e =>
                  setParameters({
                    ...parameters,
                    phosphorus: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-20 bg-transparent border-none text-white font-bold text-right p-0 h-auto"
                min="0"
                max="50"
                step="0.5"
              />
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-teal-100/10 rounded-lg p-4 flex justify-between items-center">
              <span className="text-gray-300">Reuse Type</span>
              <Select
                value={parameters.reuseType}
                onValueChange={value =>
                  setParameters({ ...parameters, reuseType: value })
                }
              >
                <SelectTrigger className="w-32 bg-transparent border-none text-white font-bold p-0 h-auto">
                  <SelectValue placeholder="Irrigation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="irrigation">Irrigation</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="potable">Potable</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="cooling">Cooling</SelectItem>
                  <SelectItem value="toilet">Toilet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-teal-100/10 rounded-lg p-4 flex justify-between items-center">
              <span className="text-gray-300">Validation</span>
              <span className="text-gray-400">{validationStatus}</span>
            </div>
            <div className="bg-teal-100/10 rounded-lg p-4 flex justify-between items-center">
              <span className="text-gray-300">Helpful Tip</span>
              <span className="text-gray-400">
                <span className="font-bold">Hover labels</span> for guidelines
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-start gap-4">
            <Button
              onClick={() =>
                setParameters({
                  turbidity: 50,
                  pH: 7.0,
                  cod: 300,
                  tds: 500,
                  nitrogen: 20,
                  phosphorus: 5,
                  reuseType: '',
                })
              }
              className="px-6 py-3 bg-blue-100 text-gray-700 hover:bg-blue-200 rounded-lg font-medium"
            >
              Reset
            </Button>
            <Button
              onClick={handleStartSimulation}
              disabled={!parameters.reuseType}
              className="px-6 py-3 bg-teal-600 text-white hover:bg-teal-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Run Simulation
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const Simulation = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SimulationContent />
    </Suspense>
  );
};

export default Simulation;
