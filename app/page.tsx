import HeroSection from '@/components/HeroSection'
import MetodoSection from '@/components/MetodoSection'
import FeaturedProperties from '@/components/FeaturedProperties'
import { TrustStrip } from '@/components/home/TrustStrip'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { DualCTA } from '@/components/home/DualCTA'
import { HomeContactCTA } from '@/components/home/HomeContactCTA'
import { TasacionCTA } from '@/components/home/TasacionCTA'
import { DevelopmentsCarousel } from '@/components/DevelopmentsCarousel'
import { getDevelopments } from '@/lib/tokko/queries'

export default async function HomePage() {
  const developments = await getDevelopments().catch(() => [])

  return (
    <main>
      <HeroSection />
      <DevelopmentsCarousel developments={developments} />
      <TasacionCTA />
      <TrustStrip />
      <MetodoSection />
      <FeaturedProperties />
      <TestimonialsSection />
      <DualCTA />
      <HomeContactCTA />
    </main>
  )
}

