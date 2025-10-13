import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import sensorDevice from "@/assets/sensor-device.png";
import smartDroplet from "@/assets/smart-droplet.png";

const IoTSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Sensor animation - moves from right to left based on scroll
  const sensorX = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const sensorOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const sensorScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  return (
    <section
      ref={containerRef}
      id="iot"
      className="relative min-h-screen py-32 bg-gradient-to-b from-primary to-secondary overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            IoT-Powered <span className="font-serif italic">Intelligence</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Real-time sensor data drives automated treatment decisions
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          {/* Left: Simulated Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-8">
              Simulated Sensor Inputs
            </h3>
            <div className="space-y-4">
              {[
                { label: "pH Level", value: "7.2", unit: "pH" },
                { label: "Turbidity", value: "15.3", unit: "NTU" },
                { label: "COD", value: "245", unit: "mg/L" },
                { label: "TDS", value: "580", unit: "ppm" },
              ].map((param, index) => (
                <motion.div
                  key={param.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-lg">{param.label}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-accent">{param.value}</span>
                      <span className="text-white/60 text-sm">{param.unit}</span>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.random() * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 1 }}
                      viewport={{ once: true }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Automated Logic */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-8">
              Automated Treatment Logic
            </h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <img src={smartDroplet} alt="Smart droplet" className="w-16 h-16 animate-float" />
                <div>
                  <h4 className="text-xl font-bold text-white">Smart Decision Engine</h4>
                  <p className="text-white/70">AI-driven treatment selection</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                  <span className="text-white/90">Analyzing water quality parameters...</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                  <span className="text-white/90">Selecting optimal treatment stages...</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                  <span className="text-white/90">Recommending reuse applications...</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated Sensor Device */}
        <div className="relative h-96 flex items-center justify-center">
          <motion.div
            style={{
              x: sensorX,
              opacity: sensorOpacity,
              scale: sensorScale,
            }}
            className="relative"
          >
            <img
              src={sensorDevice}
              alt="IoT Sensor Device"
              className="w-64 md:w-96 h-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Ethos Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-32"
        >
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Efficient, Intelligent, <span className="font-serif italic">Sustainable</span>
          </h3>
          <p className="text-xl text-white/80">Water Reuse for a Better Tomorrow</p>
        </motion.div>
      </div>
    </section>
  );
};

export default IoTSection;
