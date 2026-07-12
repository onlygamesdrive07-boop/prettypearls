import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturedCollection from "@/components/FeaturedCollection";
import WhyHandmade from "@/components/WhyHandmade";
import Reviews from "@/components/Reviews";
import InstagramGallery from "@/components/InstagramGallery";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

// The Featured Collection section reads live product data from Supabase —
// force this route to render per-request so new or newly-featured products
// appear immediately, with no stale build-time cache.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturedCollection />
      <WhyHandmade />
      <Reviews />
      <InstagramGallery />
      <ContactSection />
      <Footer />
    </main>
  );
}
