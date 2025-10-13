import { motion } from "framer-motion";
import { Droplet } from "lucide-react";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">SmartWater</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              HOME
            </a>
            <a href="#simulation" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              SIMULATION
            </a>
            <a href="#dashboard" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              DASHBOARD
            </a>
            <a href="#reuse" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              REUSE OPTIONS
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              CONTACT
            </a>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
