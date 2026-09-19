import { useState } from 'react'

import { navigate } from '../app/router'
import { Footer } from '../components/layout/Footer'
import { SiteShell } from '../components/layout/SiteShell'
import { TopNav } from '../components/layout/TopNav'
import { ContactSection } from '../components/sections/landing/ContactSection'
import { LandingHeroSection } from '../components/sections/landing/LandingHeroSection'
import { WorkGallerySection } from '../components/sections/landing/WorkGallerySection'
import { useScrollToSection } from '../hooks/useScrollToSection'
import { sectionIds } from '../lib/routes'

export default function LandingPage() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const scrollToSection = useScrollToSection()

  return (
    <SiteShell>
      <TopNav
        onOpenContact={() => setIsContactOpen(true)}
        onScrollToSection={scrollToSection}
        onNavigateAbout={() => navigate('/about')}
        onNavigateBlackhole={() => navigate('/blackhole')}
      />
      <LandingHeroSection />
      <WorkGallerySection />
      <div id={sectionIds.contact} />
      <Footer />
      <ContactSection isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </SiteShell>
  )
}
