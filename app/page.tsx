import HeroSection from '@/components/HeroSection'
import CredibilityBar from '@/components/StatsBar'
import MetodoSection from '@/components/MetodoSection'
import FeaturedProperties from '@/components/FeaturedProperties'
import TestimonialsSection from '@/components/TestimonialsSection'
import CTASection from '@/components/CTASection'
import DevelopmentsSlider from '@/components/DevelopmentsSlider'
import { getDevelopments } from '@/lib/tokko/queries'

export default async function HomePage() {
  const developments = await getDevelopments().catch(() => [])

  return (
    <main>
      <HeroSection />
      <CredibilityBar />
      <MetodoSection />
      <FeaturedProperties />
      <DevelopmentsSlider developments={developments} />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}

