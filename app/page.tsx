import HeroSection from '@/components/HeroSection'
import CredibilityBar from '@/components/StatsBar'
import MetodoSection from '@/components/MetodoSection'
import FeaturedProperties from '@/components/FeaturedProperties'
import TestimonialsSection from '@/components/TestimonialsSection'
import CTASection from '@/components/CTASection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CredibilityBar />
      <MetodoSection />
      <FeaturedProperties />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}

