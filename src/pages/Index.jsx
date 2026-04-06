import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import HeroSection from "../components/home/HeroSection";
import CategoryPortal from "../components/home/CategoryPortal";
import FeaturedProducts from "../components/home/FeaturedProducts";
import ScrollStorySection from "../components/home/ScrollStorySection";
import FitQuizCTA from "../components/home/FitQuizCTA";
import BundleSection from "../components/home/BundleSection";
import LimitedEdition from "../components/home/LimitedEdition";
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Header />

      <main>
        <HeroSection />
        <CategoryPortal />
        <FeaturedProducts />
        <LimitedEdition />
        <ScrollStorySection />
        <FitQuizCTA />
        <BundleSection />
      </main>

      <Footer />
    </div>;
};
var stdin_default = Index;
export {
  stdin_default as default
};
