'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import {
  simulateTreatment,
  WaterQualityParameters,
  TreatmentSimulationResult,
} from '@/lib/treatmentLogic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Activity,
  Settings,
  FileText,
  MessageSquare,
  Bell,
  TrendingDown,
  Play,
  Pause,
  Wifi,
  Minus,
} from 'lucide-react';

interface RealTimeSensor {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastReadings: number[];
  threshold: { min: number; max: number };
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface MaintenanceLog {
  id: string;
  title: string;
  description: string;
  equipment: string;
  type: 'routine' | 'repair' | 'inspection' | 'replacement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  assignedTo: string;
  scheduledDate: Date;
  completedDate?: Date;
  notes: string;
  photos: string[];
  partsUsed: string[];
  downtime: number; // in hours
}

function TreatmentDashboardContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [simulationResult, setSimulationResult] =
    useState<TreatmentSimulationResult | null>(null);
  const [parameters, setParameters] = useState<WaterQualityParameters | null>(
    null
  );
  const [isLive, setIsLive] = useState(true);

  // Real-time sensor data simulation
  const [sensorData, setSensorData] = useState<RealTimeSensor[]>([
    {
      id: 'flow',
      name: 'Influent Flow Rate',
      value: 2.4,
      unit: 'MLD',
      status: 'good',
      trend: 'stable',
      lastReadings: [2.38, 2.39, 2.4, 2.41, 2.4],
      threshold: { min: 1.5, max: 3.0 },
    },
    {
      id: 'efficiency',
      name: 'BOD Removal Efficiency',
      value: 94.2,
      unit: '%',
      status: 'optimal',
      trend: 'stable',
      lastReadings: [94.1, 94.2, 94.2, 94.1, 94.2],
      threshold: { min: 85, max: 100 },
    },
    {
      id: 'turbidity',
      name: 'Effluent Turbidity',
      value: 1.8,
      unit: 'NTU',
      status: 'optimal',
      trend: 'stable',
      lastReadings: [1.79, 1.8, 1.81, 1.8, 1.8],
      threshold: { min: 0, max: 5 },
    },
    {
      id: 'ph',
      name: 'Final pH',
      value: 7.4,
      unit: '',
      status: 'optimal',
      trend: 'stable',
      lastReadings: [7.39, 7.4, 7.41, 7.4, 7.4],
      threshold: { min: 6.5, max: 8.5 },
    },
  ]);

  // Alerts and recommendations
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'Primary Clarifier Overflow',
      message:
        'Clarifier #2 overflow detected. Immediate bypass activation required to prevent environmental discharge.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      resolved: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Dissolved Oxygen Low',
      message:
        'DO levels in aeration tank #3 below 2.0 mg/L. Check blower operation and diffuser maintenance.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      resolved: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Sludge Return Pump Vibration',
      message:
        'Excessive vibration detected on SRP-04. Schedule maintenance within 24 hours to prevent failure.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      resolved: false,
    },
    {
      id: '4',
      type: 'info',
      title: 'Weekly Calibration Due',
      message:
        'pH sensors in secondary treatment require calibration. Scheduled for tomorrow 8:00 AM.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      resolved: false,
    },
    {
      id: '5',
      type: 'critical',
      title: 'Power Supply Failure',
      message:
        'UPS backup activated for control room. Generator startup initiated. Monitor system stability.',
      timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      resolved: false,
    },
  ]);

  // Maintenance logs
  const [maintenanceLogs] = useState<MaintenanceLog[]>([
    {
      id: '1',
      title: 'Primary Clarifier Maintenance',
      description: 'Routine cleaning and inspection of primary clarifier #2',
      equipment: 'Primary Clarifier #2',
      type: 'routine',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'John Smith',
      scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      notes:
        'Completed successfully. No issues found. Scum removal system working properly.',
      photos: ['maintenance_001.jpg'],
      partsUsed: ['Scraper Blade', 'Seal Kit'],
      downtime: 2.5,
    },
    {
      id: '2',
      title: 'Blower Motor Replacement',
      description: 'Replace failed blower motor in aeration tank #3',
      equipment: 'Blower Motor - Aeration Tank #3',
      type: 'repair',
      priority: 'urgent',
      status: 'in_progress',
      assignedTo: 'Sarah Johnson',
      scheduledDate: new Date(Date.now() + 1 * 60 * 60 * 1000),
      notes:
        'Motor failure detected during routine inspection. Replacement scheduled.',
      photos: [],
      partsUsed: ['Blower Motor 5HP', 'Mounting Brackets'],
      downtime: 0,
    },
    {
      id: '3',
      title: 'Filter Media Inspection',
      description: 'Quarterly inspection of sand filter media',
      equipment: 'Sand Filter #1',
      type: 'inspection',
      priority: 'low',
      status: 'scheduled',
      assignedTo: 'Mike Wilson',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes:
        'Regular quarterly inspection. Check for media loss and contamination.',
      photos: [],
      partsUsed: [],
      downtime: 0,
    },
  ]);

  // Treatment parameters
  const [treatmentParams, setTreatmentParams] = useState({
    aerationRate: 2.8,
    sludgeReturn: 35,
    chemicalDosage: 8.5,
    filtrationSpeed: 92,
  });

  // Simulate real-time updates - Very realistic, slow changes
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setSensorData(prevData =>
        prevData.map(sensor => {
          // Extremely small, realistic variations - industrial sensors are very stable
          const variation = (Math.random() - 0.5) * 0.02; // Very small changes
          const newValue = Math.max(0, sensor.value + variation);
          const newReadings = [...sensor.lastReadings.slice(1), newValue];

          const recentTrend = newReadings[4] - newReadings[0];
          let newTrend: 'up' | 'down' | 'stable' = 'stable';

          // Only detect trends for significant changes
          if (Math.abs(recentTrend) > 0.02) {
            newTrend = recentTrend > 0 ? 'up' : 'down';
          }

          // Update status based on thresholds - very conservative
          let newStatus = sensor.status;
          if (
            newValue < sensor.threshold.min ||
            newValue > sensor.threshold.max
          ) {
            newStatus = 'critical';
          } else if (
            newValue > sensor.threshold.max * 0.95 ||
            newValue < sensor.threshold.min * 1.05
          ) {
            newStatus = 'warning';
          } else if (newValue > sensor.threshold.max * 0.85) {
            newStatus = 'good';
          } else {
            newStatus = 'optimal';
          }

          return {
            ...sensor,
            value: Math.round(newValue * 100) / 100,
            trend: newTrend,
            status: newStatus,
            lastReadings: newReadings,
          };
        })
      );
    }, 30000); // Update every 30 seconds - very realistic for industrial sensors

    return () => clearInterval(interval);
  }, [isLive]);

  // Load simulation data from URL params
  useEffect(() => {
    const turbidity = parseFloat(searchParams.get('turbidity') || '0');
    const pH = parseFloat(searchParams.get('pH') || '0');
    const cod = parseFloat(searchParams.get('cod') || '0');
    const tds = parseFloat(searchParams.get('tds') || '0');
    const nitrogen = parseFloat(searchParams.get('nitrogen') || '0');
    const phosphorus = parseFloat(searchParams.get('phosphorus') || '0');
    if (turbidity || pH || cod || tds || nitrogen || phosphorus) {
      const params: WaterQualityParameters = {
        turbidity,
        pH,
        cod,
        tds,
        nitrogen,
        phosphorus,
      };

      setParameters(params);
      const result = simulateTreatment(params);
      setSimulationResult(result);
    }
  }, [searchParams]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-green-500 bg-green-500/20';
      case 'good':
        return 'text-green-500 bg-green-500/20';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/20';
      case 'critical':
        return 'text-red-500 bg-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
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

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'scheduled':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-500';
      case 'high':
        return 'bg-orange-500/20 text-orange-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'low':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
      <Header />

      <div className="container mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Plant Operator Dashboard
            </h1>
            <p className="text-slate-400">
              Real-time monitoring and control for {user?.organizationName}
            </p>
          </div>
          <div className="flex items-center gap-4">
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
              {isLive ? 'Live' : 'Paused'}
            </Button>
            <Button
              onClick={() => window.open('/reports', '_blank')}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Real-time Sensors */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {sensorData.map((sensor, index) => (
                <motion.div
                  key={sensor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">
                          {sensor.name}
                        </span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(sensor.trend)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sensor.status)}`}
                          >
                            {sensor.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {sensor.value} {sensor.unit}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Wifi className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-slate-500">Live</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Detailed Sensor Charts */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Real-time Sensor Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sensorData.slice(0, 2).map(sensor => (
                    <div key={sensor.id}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          {sensor.name}
                        </h3>
                        <span className="text-sm text-slate-400">
                          Last 24h{' '}
                          {sensor.trend === 'up'
                            ? '+0.3%'
                            : sensor.trend === 'down'
                              ? '-0.2%'
                              : '±0.1%'}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        {sensor.value} {sensor.unit}
                      </div>
                      <MiniChart data={sensor.lastReadings} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Treatment Stages */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Treatment Stages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h4 className="text-white font-medium">
                        Primary Treatment
                      </h4>
                      <p className="text-sm text-slate-400">
                        Sedimentation: 98% complete
                      </p>
                      <p className="text-sm text-slate-400">
                        Grit Removal: Active
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    Normal
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h4 className="text-white font-medium">
                        Secondary Treatment
                      </h4>
                      <p className="text-sm text-slate-400">
                        Aeration: {treatmentParams.aerationRate} mg/L O₂
                      </p>
                      <p className="text-sm text-slate-400">
                        Sludge Return: {treatmentParams.sludgeReturn} m³/h
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    Normal
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <h4 className="text-white font-medium">
                        Tertiary Treatment
                      </h4>
                      <p className="text-sm text-slate-400">
                        Filtration: Clogged filter detected
                      </p>
                      <p className="text-sm text-slate-400">
                        Disinfection: UV lamp at 80%
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                    Warning
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Treatment Parameter Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  Treatment Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      DO Level (mg/L)
                    </label>
                    <Input
                      type="number"
                      value={treatmentParams.aerationRate}
                      onChange={e =>
                        setTreatmentParams(prev => ({
                          ...prev,
                          aerationRate: parseFloat(e.target.value),
                        }))
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      RAS Rate (%)
                    </label>
                    <Input
                      type="number"
                      value={treatmentParams.sludgeReturn}
                      onChange={e =>
                        setTreatmentParams(prev => ({
                          ...prev,
                          sludgeReturn: parseFloat(e.target.value),
                        }))
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      Polymer Dose (mg/L)
                    </label>
                    <Input
                      type="number"
                      value={treatmentParams.chemicalDosage}
                      onChange={e =>
                        setTreatmentParams(prev => ({
                          ...prev,
                          chemicalDosage: parseFloat(e.target.value),
                        }))
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      Filter Backwash (%)
                    </label>
                    <Input
                      type="number"
                      value={treatmentParams.filtrationSpeed}
                      onChange={e =>
                        setTreatmentParams(prev => ({
                          ...prev,
                          filtrationSpeed: parseFloat(e.target.value),
                        }))
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Logging */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  Maintenance Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceLogs.slice(0, 3).map(log => (
                    <div
                      key={log.id}
                      className="p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-white font-medium">
                            {log.title}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {log.equipment}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getMaintenanceStatusColor(log.status)}
                          >
                            {log.status}
                          </Badge>
                          <Badge className={getPriorityColor(log.priority)}>
                            {log.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">
                        {log.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Assigned: {log.assignedTo}</span>
                        <span>
                          Scheduled: {log.scheduledDate.toLocaleDateString()}
                        </span>
                      </div>
                      {log.downtime > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-yellow-500">
                            Downtime: {log.downtime}h
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() =>
                    alert(
                      'Maintenance log functionality would open a modal here'
                    )
                  }
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Add Maintenance Log
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Alerts, AI Assistant, Maintenance */}
          <div className="space-y-6">
            {/* Alerts Feed */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-500" />
                  Alert Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.type === 'critical'
                        ? 'bg-red-500/10 border-red-500/30'
                        : alert.type === 'warning'
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`p-1 rounded ${
                          alert.type === 'critical'
                            ? 'bg-red-500'
                            : alert.type === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                        }`}
                      >
                        <AlertTriangle className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white text-sm font-medium">
                          {alert.title}
                        </h4>
                        <p className="text-slate-400 text-xs">
                          {alert.message}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => window.open('/reports', '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
                <Button
                  onClick={() => window.open('/ai-agos', '_blank')}
                  variant="outline"
                  className="w-full border-slate-600 text-white bg-slate-800/50 hover:bg-slate-700"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Full AI Assistant
                </Button>
                <Button
                  onClick={() => window.open('/simulation', '_blank')}
                  variant="outline"
                  className="w-full border-slate-600 text-white bg-slate-800/50 hover:bg-slate-700"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Run Simulation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Simulation Results (if available) */}
        {simulationResult && parameters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Treatment Simulation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-2">
                      Input Parameters
                    </h4>
                    <div className="space-y-1 text-sm text-slate-400">
                      <p>Turbidity: {parameters.turbidity} NTU</p>
                      <p>pH: {parameters.pH}</p>
                      <p>COD: {parameters.cod} mg/L</p>
                      <p>TDS: {parameters.tds} mg/L</p>
                      <p>Nitrogen: {parameters.nitrogen} mg/L</p>
                      <p>Phosphorus: {parameters.phosphorus} mg/L</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">
                      Treatment Stages
                    </h4>
                    <div className="space-y-2">
                      {[
                        simulationResult.primaryTreatment,
                        simulationResult.secondaryTreatment,
                        simulationResult.tertiaryTreatment,
                      ].map((stage, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-slate-400">
                            {stage.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">
                      Output Quality
                    </h4>
                    <div className="space-y-1 text-sm text-slate-400">
                      <p>Efficiency: {simulationResult.estimatedEfficiency}%</p>
                      <p>
                        Treatment Time:{' '}
                        {simulationResult.estimatedTreatmentTime} hours
                      </p>
                      <p>
                        Stages Required: {simulationResult.totalStagesRequired}
                      </p>
                      <p>Status: {simulationResult.overallStatus}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TreatmentDashboard() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-white">Loading...</div>
          </div>
        }
      >
        <TreatmentDashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
