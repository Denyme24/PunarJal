'use client';

import { WaterSource } from '@/lib/waterSourcesData';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { MapPin, Droplets, Activity, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaterSourceCardProps {
  source: WaterSource | null;
  onClose: () => void;
}

export default function WaterSourceCard({
  source,
  onClose,
}: WaterSourceCardProps) {
  const router = useRouter();
  const [displayMetrics, setDisplayMetrics] = useState(source?.metrics);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [secondsUntilUpdate, setSecondsUntilUpdate] = useState(45);

  // Simulate realistic sensor readings with slow, subtle changes every 45 seconds
  useEffect(() => {
    if (!source) return;

    // Initialize with current source metrics
    setDisplayMetrics(source.metrics);

    const interval = setInterval(() => {
      setDisplayMetrics(prev => {
        if (!prev) return source.metrics;

        // Very subtle variations (±0.3 to ±1%) to simulate realistic sensor drift
        // Real water quality sensors don't change rapidly
        return {
          turbidity: parseFloat(
            (prev.turbidity + (Math.random() - 0.5) * 1).toFixed(1)
          ),
          pH: parseFloat((prev.pH + (Math.random() - 0.5) * 0.05).toFixed(2)),
          cod: Math.round(prev.cod + (Math.random() - 0.5) * 3),
          tds: Math.round(prev.tds + (Math.random() - 0.5) * 5),
          nitrogen: parseFloat(
            (prev.nitrogen + (Math.random() - 0.5) * 0.3).toFixed(1)
          ),
          phosphorus: parseFloat(
            (prev.phosphorus + (Math.random() - 0.5) * 0.1).toFixed(2)
          ),
        };
      });
      setLastUpdate(new Date());
      setSecondsUntilUpdate(45);
    }, 45000); // Update every 45 seconds - realistic for water quality monitoring

    // Countdown timer
    const countdown = setInterval(() => {
      setSecondsUntilUpdate(prev => (prev > 0 ? prev - 1 : 45));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, [source]);

  if (!source) return null;

  const handleInitiateSimulation = () => {
    // Navigate to simulation page with pre-filled parameters
    const params = new URLSearchParams({
      turbidity: displayMetrics?.turbidity.toString() || '0',
      pH: displayMetrics?.pH.toString() || '7',
      cod: displayMetrics?.cod.toString() || '0',
      tds: displayMetrics?.tds.toString() || '0',
      nitrogen: displayMetrics?.nitrogen.toString() || '0',
      phosphorus: displayMetrics?.phosphorus.toString() || '0',
      sourceName: source.name,
    });
    router.push(`/simulation?${params.toString()}`);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'safe':
        return 'text-green-600';
      case 'attention':
        return 'text-amber-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getQualityBgColor = (quality: string) => {
    switch (quality) {
      case 'safe':
        return 'bg-green-50 border-green-200';
      case 'attention':
        return 'bg-amber-50 border-amber-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'safe':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'attention':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const metrics = [
    {
      icon: Droplets,
      label: 'Turbidity',
      value: displayMetrics?.turbidity,
      unit: 'NTU',
      gradient: 'from-cyan-50 to-blue-50',
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-100',
    },
    {
      icon: Activity,
      label: 'pH Level',
      value: displayMetrics?.pH,
      unit: '',
      gradient: 'from-blue-50 to-indigo-50',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      icon: Droplets,
      label: 'COD',
      value: displayMetrics?.cod,
      unit: 'mg/L',
      gradient: 'from-purple-50 to-pink-50',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
    {
      icon: Droplets,
      label: 'TDS',
      value: displayMetrics?.tds,
      unit: 'mg/L',
      gradient: 'from-teal-50 to-emerald-50',
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-100',
    },
    {
      icon: Activity,
      label: 'Nitrogen',
      value: displayMetrics?.nitrogen,
      unit: 'mg/L',
      gradient: 'from-green-50 to-lime-50',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      icon: Droplets,
      label: 'Phosphorus',
      value: displayMetrics?.phosphorus,
      unit: 'mg/L',
      gradient: 'from-amber-50 to-orange-50',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
    },
  ];

  return (
    <div className="h-full bg-white lg:rounded-xl shadow-2xl flex flex-col max-h-screen lg:max-h-full">
      {/* Content */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`p-2 rounded-lg ${getQualityBgColor(
                    source.quality
                  )}`}
                >
                  <MapPin
                    className={`h-5 w-5 ${getQualityColor(source.quality)}`}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {source.name}
                  </h2>
                  <p className="text-sm text-gray-500">{source.location}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 -mr-2 -mt-2 rounded-lg hover:bg-gray-100"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getQualityBadge(
                source.quality
              )}`}
            >
              {source.quality === 'safe' && '✓ Safe Quality'}
              {source.quality === 'attention' && '⚠ Needs Attention'}
              {source.quality === 'critical' && '⚠ Critical'}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Live Data</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid - Scrollable */}
        <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto bg-gray-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <AnimatePresence mode="wait">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`bg-gradient-to-br ${metric.gradient} rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`${metric.iconBg} p-2 rounded-lg`}>
                        <metric.icon
                          className={`h-4 w-4 ${metric.iconColor}`}
                        />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">
                        {metric.label}
                      </p>
                    </div>
                    <div className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <motion.p
                      key={metric.value}
                      initial={{ scale: 1.05, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 2,
                        ease: 'easeOut',
                      }}
                      className="text-3xl font-bold text-gray-900"
                    >
                      {metric.value}
                    </motion.p>
                    <p className="text-sm text-gray-500 font-medium">
                      {metric.unit}
                    </p>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
                    <motion.div
                      key={`bar-${metric.value}`}
                      className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-[length:200%_100%]"
                      initial={{ x: '-100%' }}
                      animate={{
                        x: '0%',
                        backgroundPosition: ['0% 0%', '100% 0%'],
                      }}
                      transition={{
                        x: { duration: 1.5, ease: 'easeInOut' },
                        backgroundPosition: {
                          duration: 3,
                          ease: 'linear',
                          repeat: Infinity,
                          repeatType: 'reverse',
                        },
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Last Updated with Countdown */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </div>
              <p className="text-xs text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-gray-400" />
              <p className="text-xs text-gray-400">
                Next update in {secondsUntilUpdate}s
              </p>
              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-500"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{
                    duration: 45,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 sm:p-6 border-t border-gray-200 flex-shrink-0 bg-white">
          <Button
            onClick={handleInitiateSimulation}
            className="w-full h-12 sm:h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            <span className="flex items-center gap-2">
              Initiate Simulation
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
