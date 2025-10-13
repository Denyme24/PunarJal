import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// Removed other sections for a clean slate

const Index = () => {
  return (
    <div className="relative">
      <Header />
      <main>
        <HeroSection />
      </main>
    </div>
  );
};

export default Index;
