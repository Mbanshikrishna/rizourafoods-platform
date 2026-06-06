import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import CookingSection from "../components/CookingSection";
import ExportSection from "../components/ExportSection";
import HeroSection from "../components/HeroSection";
import ProductSection from "../components/ProductSection";
import QualitySection from "../components/QualitySection";
import RecipesSection from "../components/RecipesSection";
import SiteLayout from "../layouts/SiteLayout";

function HomePage() {
  return (
    <SiteLayout>
      <HeroSection />
      <AboutSection />
      <ProductSection />
      <QualitySection />
      <CookingSection />
      <RecipesSection />
      <ExportSection />
      <ContactSection />
    </SiteLayout>
  );
}

export default HomePage;
