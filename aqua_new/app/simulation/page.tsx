'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/contexts/I18nContext';

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
  const { t } = useI18n();
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

  const handleStartSimulation = async () => {
    // Build parameter specs for AI based on provided tables
    const primarySpecs = [
      {
        name: 'Turbidity',
        unit: 'NTU',
        good: '0 - 5',
        outbreak: '> 50',
        value: parameters.turbidity,
      },
      {
        name: 'Flow Rate',
        unit: 'L/min',
        good: 'As per plant capacity',
        outbreak: 'Sudden drop/increase beyond ±20%',
        value: 'not provided',
      },
      {
        name: 'Pressure',
        unit: 'kPa',
        good: '100 - 300 (operational)',
        outbreak: '< 80 or > 350',
        value: 'not provided',
      },
      {
        name: 'Sludge Level',
        unit: 'cm',
        good: '20 - 60',
        outbreak: '> 80',
        value: 'not provided',
      },
    ];

    const secondarySpecs = [
      {
        name: 'Dissolved Oxygen',
        unit: 'mg/L',
        good: '4 - 8',
        outbreak: '< 2 or > 12',
        value: 'not provided',
      },
      {
        name: 'pH',
        unit: 'pH Units',
        good: '6.5 - 8.5',
        outbreak: '< 5.5 or > 9',
        value: parameters.pH,
      },
      {
        name: 'ORP',
        unit: 'mV',
        good: '200 - 450',
        outbreak: '< 100 or > 600',
        value: 'not provided',
      },
      {
        name: 'Temperature',
        unit: '°C',
        good: '20 - 35',
        outbreak: '< 10 or > 45',
        value: 'not provided',
      },
      {
        name: 'Ammonia-Nitrate',
        unit: 'mg/L',
        good: '0 - 1',
        outbreak: '> 5',
        value: 'not provided',
      },
    ];

    const tertiarySpecs = [
      {
        name: 'Conductivity',
        unit: 'µS/cm',
        good: '0 - 500',
        outbreak: '> 2000',
        value: 'not provided',
      },
      {
        name: 'Total Dissolved Solids (TDS)',
        unit: 'mg/L',
        good: '0 - 500',
        outbreak: '> 2000',
        value: parameters.tds,
      },
      {
        name: 'UV Intensity',
        unit: 'mW/cm²',
        good: '25 - 40',
        outbreak: '< 15',
        value: 'not provided',
      },
      {
        name: 'Chlorine Residual',
        unit: 'mg/L',
        good: '0.2 - 1.0',
        outbreak: '> 4',
        value: 'not provided',
      },
      {
        name: 'Phosphate-Nitrite',
        unit: 'mg/L',
        good: '0 - 0.1',
        outbreak: '> 1',
        value: 'not provided',
      },
    ];

    // Compose AI prompt
    const aiMessage = `You are a wastewater treatment expert. Given these input values and reuse type, analyze whether primary, secondary, and tertiary processes are sufficient. Use the provided sensor parameter tables to reason about risks and recommendations.\n\nInput values:\n- Turbidity: ${parameters.turbidity} NTU\n- pH: ${parameters.pH}\n- COD: ${parameters.cod} mg/L\n- TDS: ${parameters.tds} mg/L\n- Nitrogen: ${parameters.nitrogen} mg/L\n- Phosphorus: ${parameters.phosphorus} mg/L\n- Reuse Type: ${parameters.reuseType || 'not specified'}\n\nPrimary Treatment Sensors (with good vs outbreak ranges):\n${JSON.stringify(primarySpecs, null, 2)}\n\nSecondary Treatment Sensors:\n${JSON.stringify(secondarySpecs, null, 2)}\n\nTertiary Treatment Sensors:\n${JSON.stringify(tertiarySpecs, null, 2)}\n\nReturn a concise analysis with: 1) risks detected per stage, 2) which parameters are out of range, 3) recommended adjustments and control actions, 4) expected treatment efficiency and time estimate.`;

    try {
      const response = await fetch('/api/ai-agos/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: aiMessage,
          context: 'simulation_processing',
        }),
      });
      const aiResult = await response.json();

      // Store for dashboard consumption
      const simulationData = {
        parameters,
        aiAnalysis: aiResult.message || 'Simulation processed successfully',
        timestamp: new Date().toISOString(),
        source: 'simulation_page',
      };
      try {
        localStorage.setItem(
          'processedSimulationData',
          JSON.stringify(simulationData)
        );
      } catch {}
    } catch (e) {
      console.error('Gemini call failed', e);
    }

    // Navigate to treatment dashboard with parameters
    const params = new URLSearchParams(parameters as any).toString();
    window.location.href = `/treatment-dashboard?${params}`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
        <Header />

        <div className="container mx-auto px-6 pt-32 pb-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {t('simulation.inputs', 'Simulation Inputs')}
            </h1>
            <p className="text-lg text-white/70">
              {t('simulation.subtitle', 'Use map values or enter manually')}
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
              <span className="text-gray-300">
                {t('param.turbidity', 'Turbidity (NTU)')}
              </span>
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
              <span className="text-gray-300">{t('param.ph', 'pH')}</span>
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
              <span className="text-gray-300">
                {t('param.cod', 'COD (mg/L)')}
              </span>
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
              <span className="text-gray-300">
                {t('param.tds', 'TDS (mg/L)')}
              </span>
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
              <span className="text-gray-300">
                {t('param.nitrogen', 'Nitrogen (mg/L)')}
              </span>
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
              <span className="text-gray-300">
                {t('param.phosphorus', 'Phosphorus (mg/L)')}
              </span>
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

          {/* Reuse Type Selector */}
          <div className="mb-6">
            <div className="bg-teal-100/10 rounded-lg p-4 flex justify-between items-center hover:bg-teal-100/20 transition-colors">
              <span className="text-gray-300">
                {t('param.reuseType', 'Reuse Type')}
              </span>
              <div className="w-72">
                <Select
                  value={parameters.reuseType}
                  onValueChange={value =>
                    setParameters({ ...parameters, reuseType: value })
                  }
                >
                  <SelectTrigger className="bg-transparent border-white/10 text-white">
                    <SelectValue
                      placeholder={t(
                        'param.reusePlaceholder',
                        'Select reuse application'
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 text-white border-white/10">
                    <SelectItem value="Agricultural Irrigation">
                      {t('reuse.agri', 'Agricultural Irrigation')}
                    </SelectItem>
                    <SelectItem value="Industrial Process Water">
                      {t('reuse.industrial', 'Industrial Process Water')}
                    </SelectItem>
                    <SelectItem value="Landscape Irrigation">
                      {t('reuse.landscape', 'Landscape Irrigation')}
                    </SelectItem>
                    <SelectItem value="Toilet Flushing">
                      {t('reuse.toilet', 'Toilet Flushing')}
                    </SelectItem>
                    <SelectItem value="Cooling Tower Systems">
                      {t('reuse.cooling', 'Cooling Tower Systems')}
                    </SelectItem>
                    <SelectItem value="Potable Water">
                      {t('reuse.potable', 'Potable Water')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              {t('common.reset', 'Reset')}
            </Button>
            <Button
              onClick={handleStartSimulation}
              disabled={!parameters.reuseType}
              className="px-6 py-3 bg-teal-600 text-white hover:bg-teal-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('simulation.run', 'Run Simulation')}
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
