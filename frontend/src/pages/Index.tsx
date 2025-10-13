import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

const Index = () => {
  return (
    <div className="relative">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
      </main>
    </div>
  );
};

export default Index;
