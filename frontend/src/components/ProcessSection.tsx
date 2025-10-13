import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const processSteps = [
  {
    title: "Primary Treatment",
    description: "Solid removal for cleaner water",
    highlight: "Solid",
  },
  {
    title: "Secondary Treatment",
    description: "Organic matter removal using biological processes",
    highlight: "Organic",
  },
  {
    title: "Tertiary Treatment",
    description: "Nutrient & contaminant removal",
    highlight: "Nutrient",
  },
  {
    title: "Smart Decision Engine",
    description: "Automates treatment based on intended reuse",
    highlight: "Smart",
  },
];

const ProcessSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={containerRef}
      id="simulation"
      className="relative min-h-screen py-32 gradient-water"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            The Treatment <span className="font-serif italic">Journey</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Four intelligent stages transforming contaminated water into a reusable resource
          </p>
        </motion.div>

        <div className="space-y-32">
          {processSteps.map((step, index) => {
            const stepProgress = useTransform(
              scrollYProgress,
              [index * 0.2, (index + 1) * 0.2],
              [0, 1]
            );
            const opacity = useTransform(stepProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
            const y = useTransform(stepProgress, [0, 0.5, 1], [50, 0, -50]);

            return (
              <motion.div
                key={step.title}
                style={{ opacity, y }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center">
                  <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                    <span className="text-sm font-semibold text-white/60">
                      STEP {index + 1}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-xl md:text-2xl text-white/90">
                    {step.description.split(step.highlight)[0]}
                    <span className="text-accent font-semibold">{step.highlight}</span>
                    {step.description.split(step.highlight)[1]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
