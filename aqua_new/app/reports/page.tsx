'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  PieChart,
} from 'lucide-react';

interface ReportData {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  date: string;
  title: string;
  status: 'completed' | 'generating' | 'pending';
  metrics: {
    efficiency: number;
    totalSimulations: number;
    averageTreatmentTime: number;
    alertsCount: number;
    maintenanceLogs: number;
  };
  simulationResults: any[];
  alerts: any[];
  maintenanceLogs: any[];
}

const ReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample report data
  useEffect(() => {
    const sampleReports: ReportData[] = [
      {
        id: '1',
        type: 'daily',
        date: new Date().toISOString().split('T')[0],
        title: 'Daily Performance Report',
        status: 'completed',
        metrics: {
          efficiency: 92,
          totalSimulations: 15,
          averageTreatmentTime: 8.5,
          alertsCount: 3,
          maintenanceLogs: 2,
        },
        simulationResults: [],
        alerts: [],
        maintenanceLogs: [],
      },
      {
        id: '2',
        type: 'weekly',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        title: 'Weekly Performance Report',
        status: 'completed',
        metrics: {
          efficiency: 89,
          totalSimulations: 98,
          averageTreatmentTime: 9.2,
          alertsCount: 12,
          maintenanceLogs: 8,
        },
        simulationResults: [],
        alerts: [],
        maintenanceLogs: [],
      },
    ];
    setReports(sampleReports);
  }, []);

  const generateReport = async (type: 'daily' | 'weekly' | 'monthly') => {
    setIsGenerating(true);

    // Check if there's processed simulation data
    const processedData = localStorage.getItem('processedSimulationData');
    let simulationData = null;

    if (processedData) {
      try {
        simulationData = JSON.parse(processedData);
      } catch (error) {
        console.error('Error parsing simulation data:', error);
      }
    }

    // Simulate report generation
    setTimeout(() => {
      const newReport: ReportData = {
        id: Date.now().toString(),
        type,
        date: new Date().toISOString().split('T')[0],
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Performance Report`,
        status: 'completed',
        metrics: {
          efficiency: simulationData
            ? Math.round(85 + Math.random() * 15)
            : Math.round(80 + Math.random() * 20),
          totalSimulations: simulationData
            ? Math.round(5 + Math.random() * 10)
            : Math.round(10 + Math.random() * 50),
          averageTreatmentTime: Math.round((8 + Math.random() * 4) * 10) / 10,
          alertsCount: Math.round(Math.random() * 10),
          maintenanceLogs: Math.round(Math.random() * 5),
        },
        simulationResults: simulationData ? [simulationData] : [],
        alerts: [],
        maintenanceLogs: [],
      };

      setReports(prev => [newReport, ...prev]);
      setSelectedReport(newReport);
      setIsGenerating(false);
    }, 2000);
  };

  const downloadReport = (report: ReportData) => {
    const reportData = {
      ...report,
      generatedBy: user?.organizationName,
      generatedAt: new Date().toISOString(),
      organization: user?.organizationName,
      userRole: user?.role,
      includesSimulationData: report.simulationResults.length > 0,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.type}-report-${report.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'generating':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'pending':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return <Calendar className="h-4 w-4" />;
      case 'weekly':
        return <BarChart3 className="h-4 w-4" />;
      case 'monthly':
        return <PieChart className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
        <Header />

        <div className="container mx-auto px-6 pt-32 pb-20">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Plant Performance Reports
              </h1>
              <p className="text-slate-400">
                Generate and manage comprehensive plant performance reports
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => generateReport('daily')}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Daily Report'}
              </Button>
              <Button
                onClick={() => generateReport('weekly')}
                disabled={isGenerating}
                variant="outline"
                className="border-slate-600 text-white bg-slate-800/50 hover:bg-slate-700 hover:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Weekly Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reports List */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Generated Reports
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    View and download your plant performance reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-slate-700/50 ${
                          selectedReport?.id === report.id
                            ? 'bg-slate-700/50 border-blue-500/50'
                            : 'bg-slate-700/30 border-slate-600'
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                              {getTypeIcon(report.type)}
                            </div>
                            <div>
                              <h3 className="text-white font-medium">
                                {report.title}
                              </h3>
                              <p className="text-slate-400 text-sm">
                                {report.date}
                              </p>
                              {report.simulationResults.length > 0 && (
                                <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-xs mt-1">
                                  Includes Simulation Data
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                            <Button
                              onClick={e => {
                                e.stopPropagation();
                                downloadReport(report);
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Details */}
            <div className="space-y-6">
              {selectedReport ? (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Report Details</CardTitle>
                    <CardDescription className="text-slate-400">
                      {selectedReport.title} - {selectedReport.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-slate-400">
                            Efficiency
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {selectedReport.metrics.efficiency}%
                        </div>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-slate-400">
                            Simulations
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {selectedReport.metrics.totalSimulations}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-slate-400">
                            Avg Time
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {selectedReport.metrics.averageTreatmentTime}h
                        </div>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-slate-400">Alerts</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {selectedReport.metrics.alertsCount}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                      <h4 className="text-white font-medium mb-3">
                        Report Summary
                      </h4>
                      <div className="space-y-2 text-sm text-slate-400">
                        <div className="flex justify-between">
                          <span>Report Type:</span>
                          <span className="text-white">
                            {selectedReport.type}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge
                            className={getStatusColor(selectedReport.status)}
                          >
                            {selectedReport.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Generated:</span>
                          <span className="text-white">
                            {selectedReport.date}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Organization:</span>
                          <span className="text-white">
                            {user?.organizationName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Simulation Data:</span>
                          <Badge
                            className={
                              selectedReport.simulationResults.length > 0
                                ? 'bg-green-500/20 text-green-500 border-green-500/30'
                                : 'bg-gray-500/20 text-gray-500 border-gray-500/30'
                            }
                          >
                            {selectedReport.simulationResults.length > 0
                              ? 'Included'
                              : 'None'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => downloadReport(selectedReport)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">
                      No Report Selected
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Select a report from the list to view details and download
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => generateReport('daily')}
                    disabled={isGenerating}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Generate Daily Report
                  </Button>
                  <Button
                    onClick={() => generateReport('weekly')}
                    disabled={isGenerating}
                    variant="outline"
                    className="w-full border-slate-600 text-white bg-slate-800/50 hover:bg-slate-700 hover:text-white"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Weekly Report
                  </Button>
                  <Button
                    onClick={() =>
                      window.open('/treatment-dashboard', '_blank')
                    }
                    variant="outline"
                    className="w-full border-slate-600 text-white bg-slate-800/50 hover:bg-slate-700 hover:text-white"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ReportsPage;
