import { motion } from "framer-motion";
import { Droplet, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import cleanWaterBg from "@/assets/clean-water-bg.jpg";

const FooterSection = () => {
  return (
    <section id="contact" className="relative min-h-screen flex flex-col">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={cleanWaterBg}
          alt="Clean treated water"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-20">
        <div className="container mx-auto px-6">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 mb-8">
              <Droplet className="h-16 w-16 text-accent" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform Your <span className="font-serif italic">Water</span>?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
              Join the future of sustainable water treatment and reuse
            </p>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              GET STARTED
            </Button>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-20"
          >
            {[
              {
                icon: Mail,
                label: "Email",
                value: "info@smartwater.tech",
              },
              {
                icon: Phone,
                label: "Phone",
                value: "+1 (555) 123-4567",
              },
              {
                icon: MapPin,
                label: "Location",
                value: "Innovation District, Tech City",
              },
            ].map((contact, index) => (
              <motion.div
                key={contact.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
              >
                <contact.icon className="h-8 w-8 text-accent mx-auto mb-3" />
                <div className="text-sm text-white/70 mb-1">{contact.label}</div>
                <div className="text-white font-medium">{contact.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="relative z-10 border-t border-white/20 bg-primary/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="text-white/80">
              <div className="font-semibold text-white mb-1">Smart</div>
              <div className="text-sm">Intelligent Treatment Solutions</div>
            </div>
            <div className="text-white/80">
              <div className="font-semibold text-white mb-1">Sustainable</div>
              <div className="text-sm">Eco-Friendly Water Reuse</div>
            </div>
            <div className="text-white/80">
              <div className="font-semibold text-white mb-1">Reusable</div>
              <div className="text-sm">Maximum Resource Recovery</div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/20 text-center text-white/60 text-sm">
            © 2025 SmartWater Project. Transforming Industrial Water Use.
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
