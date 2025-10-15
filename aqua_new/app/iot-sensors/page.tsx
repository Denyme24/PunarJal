'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Wifi,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Play,
  Pause,
  RefreshCw,
} from 'lucide-react';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

interface SensorData {
  id: string;
  name: string;
  currentValue: number;
  unit: string;
  status: 'Good' | 'Optimal' | 'Warning' | 'Critical';
  trend: 'up' | 'down' | 'stable';
  range: string;
  lastReadings: number[];
  statusIcon: 'stable' | 'up' | 'down';
}

interface LocationData {
  name: string;
  displayName: string;
  status: 'active' | 'maintenance' | 'offline';
  lastUpdate: string;
}

const IoTSensors = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useI18n();
  const [selectedLocation, setSelectedLocation] = useState<string>('Hebbal');
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isProcessingSimulation, setIsProcessingSimulation] = useState(false);

  const locations: LocationData[] = [
    {
      name: 'Hebbal',
      displayName: 'Hebbal Lake',
      status: 'active',
      lastUpdate: '2 min ago',
    },
    {
      name: 'Ulsoor',
      displayName: 'Ulsoor Lake',
      status: 'active',
      lastUpdate: '3 min ago',
    },
    {
      name: 'Bellandur',
      displayName: 'Bellandur Lake',
      status: 'maintenance',
      lastUpdate: '1 hour ago',
    },
    {
      name: 'Varthur',
      displayName: 'Varthur Lake',
      status: 'active',
      lastUpdate: '1 min ago',
    },
    {
      name: 'Agara',
      displayName: 'Agara Lake',
      status: 'offline',
      lastUpdate: '2 hours ago',
    },
  ];

  // Realistic sensor data with proper ranges and realistic values
  const generateSensorData = (location: string): SensorData[] => [
    {
      id: 'turbidity',
      name: 'Turbidity Sensor',
      currentValue: 45.9,
      unit: 'NTU',
      status: 'Good',
      trend: 'stable',
      range: '0 - 100 NTU',
      lastReadings: [42.1, 44.3, 46.2, 45.8, 45.9],
      statusIcon: 'stable',
    },
    {
      id: 'ph',
      name: 'pH Sensor',
      currentValue: 6.5,
      unit: '',
      status: 'Optimal',
      trend: 'stable',
      range: '6.5 - 8.5',
      lastReadings: [6.7, 6.8, 6.5, 6.4, 6.5],
      statusIcon: 'stable',
    },
    {
      id: 'cod',
      name: 'COD Analyzer',
      currentValue: 142.1,
      unit: 'mg/L',
      status: 'Good',
      trend: 'up',
      range: '0 - 500 mg/L',
      lastReadings: [138.5, 140.2, 141.8, 142.0, 142.1],
      statusIcon: 'up',
    },
    {
      id: 'tds',
      name: 'TDS Meter',
      currentValue: 457.6,
      unit: 'mg/L',
      status: 'Good',
      trend: 'up',
      range: '0 - 2000 mg/L',
      lastReadings: [445.2, 450.1, 455.3, 456.8, 457.6],
      statusIcon: 'up',
    },
    {
      id: 'nitrogen',
      name: 'Nitrogen Sensor',
      currentValue: 13.8,
      unit: 'mg/L',
      status: 'Optimal',
      trend: 'down',
      range: '0 - 100 mg/L',
      lastReadings: [15.2, 14.8, 14.3, 14.0, 13.8],
      statusIcon: 'down',
    },
    {
      id: 'phosphorus',
      name: 'Phosphorus Analyzer',
      currentValue: 5.4,
      unit: 'mg/L',
      status: 'Optimal',
      trend: 'down',
      range: '0 - 50 mg/L',
      lastReadings: [6.1, 5.9, 5.7, 5.5, 5.4],
      statusIcon: 'down',
    },
  ];

  const [sensorData, setSensorData] = useState<SensorData[]>(
    generateSensorData(selectedLocation)
  );

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setSensorData(prevData =>
        prevData.map(sensor => {
          // Generate realistic small variations
          const variation = (Math.random() - 0.5) * 2; // ±1 unit variation
          const newValue = Math.max(0, sensor.currentValue + variation);

          // Update last readings (shift array and add new value)
          const newReadings = [...sensor.lastReadings.slice(1), newValue];

          // Determine trend based on recent readings
          const recentTrend = newReadings[4] - newReadings[0];
          let newTrend: 'up' | 'down' | 'stable' = 'stable';
          let newStatusIcon: 'stable' | 'up' | 'down' = 'stable';

          if (Math.abs(recentTrend) > 1) {
            newTrend = recentTrend > 0 ? 'up' : 'down';
            newStatusIcon = recentTrend > 0 ? 'up' : 'down';
          }

          // Update status based on value ranges
          let newStatus = sensor.status;
          if (sensor.id === 'turbidity') {
            newStatus =
              newValue > 80 ? 'Warning' : newValue > 60 ? 'Good' : 'Optimal';
          } else if (sensor.id === 'ph') {
            newStatus =
              newValue < 6.0 || newValue > 8.0 ? 'Warning' : 'Optimal';
          } else if (sensor.id === 'cod') {
            newStatus =
              newValue > 300 ? 'Warning' : newValue > 200 ? 'Good' : 'Optimal';
          } else if (sensor.id === 'tds') {
            newStatus =
              newValue > 1000 ? 'Warning' : newValue > 600 ? 'Good' : 'Optimal';
          } else if (sensor.id === 'nitrogen') {
            newStatus =
              newValue > 50 ? 'Warning' : newValue > 25 ? 'Good' : 'Optimal';
          } else if (sensor.id === 'phosphorus') {
            newStatus =
              newValue > 20 ? 'Warning' : newValue > 10 ? 'Good' : 'Optimal';
          }

          return {
            ...sensor,
            currentValue: Math.round(newValue * 10) / 10,
            trend: newTrend,
            statusIcon: newStatusIcon,
            status: newStatus,
            lastReadings: newReadings,
          };
        })
      );
      setLastUpdate(new Date());
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isLive, selectedLocation]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Optimal':
        return 'bg-green-500';
      case 'Good':
        return 'bg-green-500';
      case 'Warning':
        return 'bg-yellow-500';
      case 'Critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-blue-500" />;
    }
  };

  const MiniChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <div className="flex items-end gap-1 h-8">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className="w-2 bg-blue-500 rounded-sm"
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
  };

  const selectedLocationData = locations.find(
    loc => loc.name === selectedLocation
  );

  const handleStartSimulation = async () => {
    setIsProcessingSimulation(true);

    try {
      // Prepare sensor data for processing
      const currentSensorData = {
        turbidity:
          sensorData.find(s => s.id === 'turbidity')?.currentValue || 0,
        pH: sensorData.find(s => s.id === 'ph')?.currentValue || 0,
        cod: sensorData.find(s => s.id === 'cod')?.currentValue || 0,
        tds: sensorData.find(s => s.id === 'tds')?.currentValue || 0,
        nitrogen: sensorData.find(s => s.id === 'nitrogen')?.currentValue || 0,
        phosphorus:
          sensorData.find(s => s.id === 'phosphorus')?.currentValue || 0,
        sourceName: selectedLocationData?.displayName || 'Unknown',
        location: selectedLocation,
        timestamp: new Date().toISOString(),
      };

      // Call Gemini API to process the data
      const response = await fetch('/api/ai-agos/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Process this sensor data for wastewater treatment simulation: ${JSON.stringify(currentSensorData)}. Provide treatment recommendations and efficiency analysis.`,
          context: 'simulation_processing',
        }),
      });

      const aiResult = await response.json();

      // Store the processed data in localStorage for the dashboard
      const simulationData = {
        parameters: currentSensorData,
        aiAnalysis: aiResult.message || 'Simulation processed successfully',
        timestamp: new Date().toISOString(),
        source: 'real_time_dashboard',
        location: selectedLocation,
      };

      localStorage.setItem(
        'processedSimulationData',
        JSON.stringify(simulationData)
      );

      // Redirect to operator dashboard with the processed data
      const params = new URLSearchParams({
        turbidity: currentSensorData.turbidity.toString(),
        pH: currentSensorData.pH.toString(),
        cod: currentSensorData.cod.toString(),
        tds: currentSensorData.tds.toString(),
        nitrogen: currentSensorData.nitrogen.toString(),
        phosphorus: currentSensorData.phosphorus.toString(),
        sourceName: currentSensorData.sourceName,
        source: 'real_time_dashboard',
        processed: 'true',
      });

      router.push(`/treatment-dashboard?${params.toString()}`);
    } catch (error) {
      console.error('Error processing simulation:', error);
      alert('Failed to process simulation. Please try again.');
    } finally {
      setIsProcessingSimulation(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
        <Header />

        <div className="container mx-auto px-6 pt-32 pb-20">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-blue-500" />
                <h1 className="text-4xl font-bold text-white">
                  {t('iot.title', 'Sensor Data')} -{' '}
                  {selectedLocationData?.displayName}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">
                  {t('common.live', 'Live')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Location Selector */}
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations.map(location => (
                  <option key={location.name} value={location.name}>
                    {location.displayName} ({location.status})
                  </option>
                ))}
              </select>

              {/* Live Toggle */}
              <Button
                onClick={() => setIsLive(!isLive)}
                variant={isLive ? 'default' : 'outline'}
                className={`flex items-center gap-2 ${
                  isLive
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'border-slate-600 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {isLive ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isLive
                  ? t('common.live', 'Live')
                  : t('common.paused', 'Paused')}
              </Button>

              {/* Refresh Button */}
              <Button
                onClick={() =>
                  setSensorData(generateSensorData(selectedLocation))
                }
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Last Update Info */}
          <div className="mb-6">
            <p className="text-sm text-slate-400">
              {t('iot.lastUpdated', 'Last updated:')}{' '}
              {lastUpdate.toLocaleTimeString()} •{' '}
              {t('iot.nextUpdate', 'Next update in')} {isLive ? '3s' : '--'}
            </p>
          </div>

          {/* Sensor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sensorData.map((sensor, index) => (
              <motion.div
                key={sensor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">
                          {t(`sensor.${sensor.id}.name`, sensor.name)}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(sensor.trend)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(sensor.status)}`}
                        >
                          {t(
                            `sensor.status.${sensor.status.toLowerCase()}`,
                            sensor.status
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Current Reading */}
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-white mb-1">
                        {sensor.currentValue} {sensor.unit}
                      </div>
                      <div className="text-sm text-slate-400">
                        {t('sensor.range', 'Range:')} {sensor.range}
                      </div>
                    </div>

                    {/* Trend Chart */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">
                          {t('sensor.last5', 'Last 5 readings trend')}
                        </span>
                        <div className="flex items-center gap-1">
                          <Wifi className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-500">
                            {t('sensor.connected', 'Connected')}
                          </span>
                        </div>
                      </div>
                      <MiniChart data={sensor.lastReadings} />
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {t('sensor.statusLabel', 'Status:')}{' '}
                        {sensor.statusIcon === 'up'
                          ? t('sensor.rising', 'Rising')
                          : sensor.statusIcon === 'down'
                            ? t('sensor.falling', 'Falling')
                            : t('sensor.stable', 'Stable')}
                      </span>
                      <span>
                        {t('sensor.updated', 'Updated:')}{' '}
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Button
              onClick={handleStartSimulation}
              disabled={isProcessingSimulation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingSimulation ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {t('common.processing', 'Processing...')}
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  {t('simulation.start', 'Start Simulation')}
                </>
              )}
            </Button>
            <Button
              onClick={() => router.push('/simulation')}
              variant="outline"
              className="border-slate-600 text-white bg-slate-800/50 hover:bg-slate-700 hover:text-white px-6 py-3"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {t('simulation.manual', 'Manual Simulation')}
            </Button>
            <Button
              onClick={() => router.push('/analytics')}
              variant="outline"
              className="border-slate-600 text-white bg-slate-800/50 hover:bg-slate-700 hover:text-white px-6 py-3"
            >
              {t('analytics.view', 'View Analytics')}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default IoTSensors;
