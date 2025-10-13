import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Activity, Droplets, TrendingUp, CheckCircle2 } from "lucide-react";

const DashboardSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const dashboardY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -50]);
  const dashboardOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);

  return (
    <section
      ref={containerRef}
      id="dashboard"
      className="relative min-h-screen py-32 gradient-clean"
    >
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Real-Time <span className="font-serif italic">Dashboard</span>
          </h2>
          <p className="text-xl text-primary/80 max-w-3xl mx-auto">
            Monitor treatment progress and water quality in real-time
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          style={{ y: dashboardY, opacity: dashboardOpacity }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Treatment Control Panel</h3>
                  <p className="text-white/80">Live System Status</p>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">System Active</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="p-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Input Parameters Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-muted rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Input Quality</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contamination</span>
                    <span className="font-medium text-destructive">High</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Turbidity</span>
                    <span className="font-medium">245 NTU</span>
                  </div>
                </div>
              </motion.div>

              {/* Active Treatment Stage */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-accent/10 rounded-xl p-6 border-2 border-accent"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Droplets className="h-5 w-5 text-accent" />
                  </div>
                  <h4 className="font-semibold text-foreground">Active Stage</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-accent">Secondary</div>
                  <div className="text-sm text-muted-foreground">Biological Treatment</div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-accent">
                    <div className="w-full h-1.5 bg-accent/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "65%" }}
                        transition={{ delay: 0.5, duration: 1.5 }}
                        viewport={{ once: true }}
                        className="h-full bg-accent rounded-full"
                      />
                    </div>
                    <span className="font-medium">65%</span>
                  </div>
                </div>
              </motion.div>

              {/* Predicted Quality */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-muted rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Output Quality</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Purity Level</span>
                    <span className="font-medium text-secondary">92%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">COD Removal</span>
                    <span className="font-medium text-secondary">85%</span>
                  </div>
                </div>
              </motion.div>

              {/* Recommended Reuse */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-green-50 rounded-xl p-6 border border-green-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-foreground">Reuse Type</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-700">Industrial</div>
                  <div className="text-sm text-green-600">Cooling & Process Water</div>
                </div>
              </motion.div>
            </div>

            {/* Treatment Flow Visualization */}
            <div className="px-8 pb-8">
              <div className="bg-gradient-to-r from-muted to-background rounded-xl p-6">
                <h4 className="font-semibold mb-6 text-center text-foreground">Treatment Flow</h4>
                <div className="flex items-center justify-between relative">
                  {["Input", "Primary", "Secondary", "Tertiary", "Output"].map((stage, index) => (
                    <motion.div
                      key={stage}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex flex-col items-center gap-2 relative z-10"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                          index === 2
                            ? "bg-accent text-white"
                            : "bg-white border-2 border-border text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{stage}</span>
                    </motion.div>
                  ))}
                  <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-0" />
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "50%" }}
                    transition={{ delay: 0.5, duration: 2 }}
                    viewport={{ once: true }}
                    className="absolute top-6 left-0 h-0.5 bg-accent -z-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardSection;
