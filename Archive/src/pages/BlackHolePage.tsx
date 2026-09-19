import { useState } from 'react'

import { SiteShell } from '../components/layout/SiteShell'
import { TopNav } from '../components/layout/TopNav'
import { BlackHoleSection } from '../components/sections/landing/BlackHoleSection'
import { ContactSection } from '../components/sections/landing/ContactSection'
import { navigate } from '../app/router'

export default function BlackHolePage() {
  const [isContactOpen, setIsContactOpen] = useState(false)

  return (
    <SiteShell>
      <div className="absolute top-0 left-0 right-0 z-20">
        <TopNav
          onOpenContact={() => setIsContactOpen(true)}
          onNavigateAbout={() => navigate('/about')}
          onNavigateBlackhole={() => navigate('/blackhole')}
        />
      </div>
      <BlackHoleSection />
      <ContactSection isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </SiteShell>
  )
}
