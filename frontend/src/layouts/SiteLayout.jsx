import FloatingCTA from "../components/FloatingCTA";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function SiteLayout({ children }) {
  return (
    <div className="min-h-screen overflow-hidden bg-brand-ivory text-brand-forest">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}

export default SiteLayout;
