import gsap from 'gsap'
import { useEffect, useRef } from 'react'

import { getLandingPageContent } from '../../../content/landing'
import { getUICopy } from '../../../content/ui'
import { useLanguage } from '../../../i18n/language'
import { withBase } from '../../../lib/basePath'
import { sectionIds } from '../../../lib/routes'
import { SectionContainer } from '../../layout/SectionContainer'

export function LandingHeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { language } = useLanguage()
  const landingPageContent = getLandingPageContent(language)
  const uiCopy = getUICopy(language)

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      )
    }
  }, [])

  return (
    <SectionContainer className="flex min-h-[80vh] w-full flex-col items-center justify-center pb-20">
      <section
        ref={sectionRef}
        id={sectionIds.hero}
        className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16 opacity-0"
      >
        <img
          src={withBase('/assets/icons/navigation/square-logo.svg')}
          alt={uiCopy.nav.logoAlt}
          className="h-[120px] w-[120px] shrink-0 md:h-[200px] md:w-[200px]"
        />
        <h1 className=" max-w-[619px] whitespace-pre-line font-serif-en text-center text-sm-headline leading-sm-headline text-neutral-10 md:text-left md:text-headline md:leading-headline">
          {landingPageContent.hero.headline}
          <br />
          {landingPageContent.hero.summary}
        </h1>
      </section>
    </SectionContainer>
  )
}
