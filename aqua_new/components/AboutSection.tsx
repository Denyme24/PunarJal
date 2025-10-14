"use client";

import { motion } from "framer-motion";
import { Droplet, Cpu, BarChart3, Leaf, Shield, Zap } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Cpu,
      title: "AI-Powered Intelligence",
      description:
        "Advanced machine learning algorithms optimize treatment processes in real-time",
    },
    {
      icon: BarChart3,
      title: "Data-Driven Insights",
      description:
        "Comprehensive analytics provide actionable insights for water management",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "Multi-stage filtration ensures water meets the highest safety standards",
    },
    {
      icon: Leaf,
      title: "Environmental Impact",
      description:
        "Sustainable processes reduce carbon footprint and promote circular economy",
    },
    {
      icon: Zap,
      title: "Automated Operations",
      description:
        "Smart automation reduces manual intervention and operational costs",
    },
    {
      icon: Droplet,
      title: "Water Conservation",
      description:
        "Maximizes water reuse potential, reducing dependency on freshwater sources",
    },
  ];

  const stats = [
    { value: "95%", label: "Water Recovery Rate" },
    { value: "60%", label: "Energy Savings" },
    { value: "24/7", label: "Monitoring" },
    { value: "99.9%", label: "System Uptime" },
  ];

  return (
    <section
      id="about"
      className="relative py-32"
      style={{ backgroundColor: "#1a2332" }}
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About{" "}
            <span className="font-serif italic text-cyan-400">PunarJal</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Revolutionizing wastewater treatment through intelligent technology
            and sustainable practices
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left: Mission Statement */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                Our Mission
              </h3>
              <p className="text-lg text-white/80 leading-relaxed">
                At PunarJal, we believe that every drop of water has value. Our
                mission is to transform wastewater treatment from a costly
                necessity into a sustainable resource recovery system that
                benefits both industry and environment.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Through cutting-edge IoT sensors, AI-driven analytics, and
                automated treatment processes, we're making water reuse not just
                possible, but profitable and environmentally responsible.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50"
                >
                  <div className="text-3xl font-bold text-accent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-700/30 rounded-3xl p-8 border border-gray-600/50">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6">
                  <Droplet className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white">
                  Smart Water Future
                </h4>
                <p className="text-white/70">
                  Join us in creating a world where wastewater becomes a
                  valuable resource, not a waste product.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Why Choose PunarJal?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h4>
                </div>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-3xl p-12 border border-gray-600/50"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Water Management?
          </h3>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover how PunarJal can revolutionize your wastewater treatment
            and unlock the potential of water reuse for your organization.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/simulation"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Simulation
              <svg
                className="w-5 h-5"
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
            </motion.a>
            <motion.a
              href="/iot-sensors"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-700/50 backdrop-blur-md border border-gray-600/50 text-white rounded-lg font-semibold text-lg hover:bg-gray-600/60 hover:border-gray-500/60 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              View IoT Sensors
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
