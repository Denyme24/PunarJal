import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import IoTSection from "@/components/IoTSection";
import DashboardSection from "@/components/DashboardSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="relative">
      <Header />
      <main>
        <HeroSection />
        <ProcessSection />
        <IoTSection />
        <DashboardSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Index;
