import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import CredibilityBar from '@/components/StatsBar'
import MetodoSection from '@/components/MetodoSection'
import FeaturedProperties from '@/components/FeaturedProperties'
import TestimonialsSection from '@/components/TestimonialsSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import MobileSticky from '@/components/MobileSticky'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CredibilityBar />
        <MetodoSection />
        <FeaturedProperties />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <MobileSticky />
    </>
  )
}

