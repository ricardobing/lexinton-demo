import HeroSection from '@/components/HeroSection'
import CredibilityBar from '@/components/StatsBar'
import MetodoSection from '@/components/MetodoSection'
import FeaturedProperties from '@/components/FeaturedProperties'
import { TrustStrip } from '@/components/home/TrustStrip'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { DualCTA } from '@/components/home/DualCTA'
import { DevelopmentsCarousel } from '@/components/DevelopmentsCarousel'
import { getDevelopments } from '@/lib/tokko/queries'

export default async function HomePage() {
  const developments = await getDevelopments().catch(() => [])

  return (
    <main>
      <HeroSection />
      <DevelopmentsCarousel developments={developments} />
      <CredibilityBar />
      <TrustStrip />
      <MetodoSection />
      <FeaturedProperties />
      <TestimonialsSection />
      <DualCTA />
    </main>
  )
}

