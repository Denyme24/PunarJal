import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Filter,
  Droplets,
  Sparkles,
  Brain,
  Cpu,
  BarChart,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";

const About = () => {
  const treatmentStages = [
    {
      id: "primary",
      name: "Primary Treatment",
      icon: Filter,
      description: "Physical separation and solid removal",
      processes: [
        "Screening of large debris",
        "Sedimentation of suspended solids",
        "Oil and grease removal",
        "Grit chamber for heavy particles",
      ],
      removal: "Removes 50-65% of suspended solids",
      color: "cyan",
    },
    {
      id: "secondary",
      name: "Secondary Treatment",
      icon: Droplets,
      description: "Biological degradation of organic matter",
      processes: [
        "Activated sludge process",
        "Aerobic bacterial breakdown",
        "Biological oxygen demand (BOD) reduction",
        "Chemical oxygen demand (COD) reduction",
      ],
      removal: "Removes 85-95% of organic matter",
      color: "blue",
    },
    {
      id: "tertiary",
      name: "Tertiary Treatment",
      icon: Sparkles,
      description: "Advanced contaminant and nutrient removal",
      processes: [
        "Nutrient removal (nitrogen, phosphorus)",
        "Advanced filtration",
        "Disinfection (UV, chlorination)",
        "Final polishing for reuse standards",
      ],
      removal: "Achieves 95-99% overall purity",
      color: "purple",
    },
  ];

  const smartFeatures = [
    {
      icon: Brain,
      title: "Intelligent Decision Engine",
      description:
        "Automatically determines optimal treatment stages based on water quality parameters and intended reuse purpose",
      benefits: [
        "Eliminates unnecessary treatment stages",
        "Reduces energy consumption",
        "Optimizes chemical usage",
        "Ensures compliance with reuse standards",
      ],
    },
    {
      icon: Cpu,
      title: "IoT Sensor Integration",
      description:
        "Real-time monitoring through distributed sensor network for continuous water quality assessment",
      benefits: [
        "Live parameter tracking",
        "Predictive maintenance alerts",
        "Automatic process adjustments",
        "Historical data analytics",
      ],
    },
    {
      icon: BarChart,
      title: "Smart Reuse Recommendations",
      description:
        "AI-powered analysis recommends suitable water reuse applications based on treated water quality",
      benefits: [
        "Maximizes water recovery",
        "Ensures safe reuse practices",
        "Provides confidence scores",
        "Identifies improvement opportunities",
      ],
    },
  ];

  const impactAreas = [
    {
      title: "Water Conservation",
      description:
        "Reduces freshwater extraction and preserves natural water sources for future generations",
      impact: "Up to 70% reduction in freshwater consumption",
    },
    {
      title: "Resource Recovery",
      description:
        "Extracts valuable nutrients and materials from wastewater for beneficial reuse",
      impact: "Recovery of nitrogen, phosphorus, and energy",
    },
    {
      title: "Circular Economy",
      description:
        "Promotes sustainable practices through Recycle, Reduce, and Reuse principles",
      impact: "Closes the water loop in industrial processes",
    },
    {
      title: "Environmental Protection",
      description:
        "Minimizes pollution and protects ecosystems from contaminated discharge",
      impact: "Prevents water body eutrophication and degradation",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950">
      <Header />

      <div className="container mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            About{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AquaRenew
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            A Smart Process System for sustainable wastewater treatment and
            intelligent water reuse
          </p>
        </motion.div>

        {/* Problem Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white text-3xl">
                The Challenge
              </CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Addressing global water scarcity through smart technology
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-white/80 text-lg">
              <p>
                Fresh water is an increasingly valuable resource. Most
                industrial processes rely on fresh water, which often results in
                a wastewater stream. The growing need for fresh water creates
                significant challenges including waste and pollution
                minimization, water scarcity, compliance with legislation, and
                economic circularity of water.
              </p>
              <p className="text-cyan-400 font-semibold">
                Sustainable water reuse is key to the survival of life and
                environmental preservation.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Treatment Stages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Three-Stage Treatment Process
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {treatmentStages.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Card
                  className={`bg-white/5 backdrop-blur-lg border-white/10 hover:border-${stage.color}-500/30 transition-all h-full`}
                >
                  <CardHeader>
                    <div
                      className={`p-4 rounded-lg bg-${stage.color}-500/20 w-fit mb-4`}
                    >
                      <stage.icon
                        className={`h-8 w-8 text-${stage.color}-400`}
                      />
                    </div>
                    <CardTitle className="text-white text-2xl">
                      {stage.name}
                    </CardTitle>
                    <CardDescription className="text-white/60 text-base">
                      {stage.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        Key Processes:
                      </h4>
                      <ul className="space-y-2">
                        {stage.processes.map((process, i) => (
                          <li
                            key={i}
                            className="text-white/70 text-sm flex items-start gap-2"
                          >
                            <CheckCircle2
                              className={`h-4 w-4 text-${stage.color}-400 flex-shrink-0 mt-0.5`}
                            />
                            {process}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div
                      className={`p-3 bg-${stage.color}-500/10 border border-${stage.color}-500/20 rounded-lg`}
                    >
                      <p
                        className={`text-${stage.color}-400 font-semibold text-sm`}
                      >
                        {stage.removal}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Smart Automation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Smart Automation Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {smartFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 h-full">
                  <CardHeader>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-fit mb-4">
                      <feature.icon className="h-8 w-8 text-cyan-400" />
                    </div>
                    <CardTitle className="text-white text-xl">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li
                          key={i}
                          className="text-white/70 text-sm flex items-start gap-2"
                        >
                          <span className="text-cyan-400">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Areas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Environmental & Economic Impact
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {impactAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">
                      {area.title}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-400 font-semibold">
                        {area.impact}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack (Optional for SIH) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white text-3xl text-center">
                How It Works
              </CardTitle>
              <CardDescription className="text-white/70 text-center text-lg">
                The complete workflow from input to recommendation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  {
                    step: "1",
                    title: "Input Parameters",
                    desc: "Enter water quality data",
                  },
                  {
                    step: "2",
                    title: "Smart Analysis",
                    desc: "AI determines treatment stages",
                  },
                  {
                    step: "3",
                    title: "Real-time Processing",
                    desc: "Monitor treatment progress",
                  },
                  {
                    step: "4",
                    title: "Quality Assessment",
                    desc: "Verify treated water quality",
                  },
                  {
                    step: "5",
                    title: "Reuse Recommendation",
                    desc: "Get optimal reuse options",
                  },
                ].map((item, index) => (
                  <div key={item.step} className="text-center">
                    <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {item.step}
                    </div>
                    <h4 className="text-white font-semibold mb-2">
                      {item.title}
                    </h4>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                    {index < 4 && (
                      <div className="hidden md:block mt-4 text-cyan-400 text-2xl">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-12 text-center"
        >
          <p className="text-white/70 mb-6 text-lg">
            Ready to transform wastewater into valuable resources?
          </p>
          <a
            href="/simulation"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
          >
            Start Your First Simulation
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
