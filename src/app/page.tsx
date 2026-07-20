import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedGearCarousel from "@/components/home/FeaturedGearCarousel";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import TrustSafety from "@/components/home/TrustSafety";
import Testimonials from "@/components/home/Testimonials";
import StatsCounters from "@/components/home/StatsCounters";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import HomeRecommendations from "@/components/ai/HomeRecommendations";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedGearCarousel />
      <CategoriesGrid />
      <TrustSafety />
      <Testimonials />
      <StatsCounters />
      <HomeRecommendations />
      <NewsletterSignup />
    </>
  );
}
