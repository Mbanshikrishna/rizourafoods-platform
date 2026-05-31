import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import ExportSection from "../components/ExportSection";
import HeroSection from "../components/HeroSection";
import ProductSection from "../components/ProductSection";
import SiteLayout from "../layouts/SiteLayout";

function HomePage() {
  return (
    <SiteLayout>
      <HeroSection />
      <AboutSection />
      <ProductSection />
      <ExportSection />
      <ContactSection />
    </SiteLayout>
  );
}

export default HomePage;
