import { useState } from 'react'

import { Footer } from '../components/layout/Footer'
import { SectionContainer } from '../components/layout/SectionContainer'
import { SiteShell } from '../components/layout/SiteShell'
import { TopNav } from '../components/layout/TopNav'
import { ContactSection } from '../components/sections/landing/ContactSection'
import { RoleTicker } from '../components/shared/RoleTicker'
import { getAboutPageContent } from '../content/about'
import { getUICopy } from '../content/ui'
import { useLanguage } from '../i18n/language'

export default function AboutPage() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const { language } = useLanguage()
  const aboutPageContent = getAboutPageContent(language)
  const uiCopy = getUICopy(language)
  const actionLinkClassName =
    'flex items-center justify-between rounded-[999px] border border-transparent bg-white px-[22px] py-3 text-[16px] leading-[16px] text-black transition-colors [font-family:var(--font-sans-en)] hover:border-white hover:bg-transparent hover:text-white'

  return (
    <SiteShell>
      <TopNav onOpenContact={() => setIsContactOpen(true)} />

      <section className="w-full px-[30px] md:px-0">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="h-[30vh] min-h-11" />
          <p className="whitespace-pre-line text-center font-serif-en text-sm-headline leading-sm-headline md:text-[40px] md:leading-[48px]">
            {aboutPageContent.hero.introHeadline}
          </p>
          <div className="h-[10vh] min-h-12 md:h-[5vh]" />
          <RoleTicker
            roles={aboutPageContent.hero.roles}
            className="mx-auto h-[44px] px-[10px] md:h-[104px] md:px-[10px]"
            itemClassName="font-serif-en text-sm-headline leading-sm-headline md:text-s-headline md:leading-s-headline"
          />
          <div className="h-[30vh] min-h-20" />
        </div>
      </section>

      <SectionContainer className="grid gap-[72px] pb-12 md:grid-cols-[320px_minmax(0,1fr)] md:gap-x-20 md:gap-y-[72px]">
        <section className="md:sticky md:top-20 md:self-start">
          <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl md:rounded-[22px]">
            <img
              src={aboutPageContent.portrait.src}
              alt={aboutPageContent.portrait.alt}
              className="aspect-[2/3] w-full object-cover"
            />
          </div>
        </section>

        <div className="md:max-w-[600px]">
          <div className="space-y-[72px]">
            <section>
              <h2 className="text-[24px] leading-none [font-family:var(--font-sans-en)] md:text-[32px] md:leading-[32px]">
                {aboutPageContent.biography.title}
              </h2>
              <div className="mt-6 space-y-5 text-[16px] leading-normal [font-family:var(--font-sans-en)]">
                {aboutPageContent.biography.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-[24px] leading-none [font-family:var(--font-sans-en)] md:text-[32px] md:leading-[32px]">
                {aboutPageContent.artistStatement.title}
              </h2>
              <div className="mt-6 space-y-5 text-[16px] leading-normal [font-family:var(--font-sans-en)]">
                {aboutPageContent.artistStatement.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-[24px] leading-none [font-family:var(--font-sans-en)] md:text-[32px] md:leading-[32px]">
                {aboutPageContent.skills.title}
              </h2>
              <ul className="mt-6 flex flex-col gap-1">
                {aboutPageContent.skills.categories.map((category) => (
                  <li
                    key={category.id}
                    className="group relative flex flex-col gap-3 overflow-hidden border-b border-white/55 py-4 transition-all duration-500 hover:border-white"
                  >
                    <div className="absolute inset-0 -z-10 translate-y-full bg-white/[0.03] transition-transform duration-500 ease-out group-hover:translate-y-0" />
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-x-[10px]">
                      <p className="w-full shrink-0 text-[14px] uppercase tracking-widest text-white/60 transition-colors duration-300 group-hover:text-white md:w-[180px] md:max-w-[180px] md:pt-1.5 [font-family:var(--font-sans-en)]">
                        {category.name}
                      </p>
                      <div className="flex flex-wrap gap-2 md:flex-1 md:gap-3">
                        {category.items.split('·').map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex cursor-default items-center justify-center rounded-full border border-white/30 px-3 py-1.5 text-[14px] text-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white hover:bg-white hover:text-black"
                          >
                            {item.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-[24px] leading-none [font-family:var(--font-sans-en)] md:text-[32px] md:leading-[32px]">
                {aboutPageContent.experience.title}
              </h2>
              <ul className="mt-6 flex flex-col gap-3">
                {aboutPageContent.experience.items.map((item) => (
                  <li key={item.id} className="flex flex-col gap-2 border-b border-white/55 pb-2">
                    <div className="flex flex-wrap items-start gap-x-[10px] gap-y-1 text-[16px] leading-normal [font-family:var(--font-sans-en)] md:flex-nowrap md:items-center">
                      <p className="w-full md:w-[180px] md:max-w-[180px]">
                        {item.role}
                        {item.roleSubline ? (
                          <>
                            <br />
                            {item.roleSubline}
                          </>
                        ) : null}
                      </p>

                      <div className="w-full md:max-w-[305px] md:flex-1">
                        {item.organizationUrl ? (
                          <>
                            <a
                              href={item.organizationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              {item.organization}
                            </a>
                            {item.organizationSubline ? (
                              <a
                                href={item.organizationUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block underline"
                              >
                                {item.organizationSubline}
                              </a>
                            ) : null}
                          </>
                        ) : (
                          <>
                            <p>{item.organization}</p>
                            {item.organizationSubline ? <p>{item.organizationSubline}</p> : null}
                          </>
                        )}
                      </div>

                      <p className="ml-auto w-full text-right md:w-[100px] md:max-w-[100px] md:text-left">
                        {item.dateRange}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-[24px] leading-none [font-family:var(--font-sans-en)] md:text-[32px] md:leading-[32px]">
                {aboutPageContent.awards.title}
              </h2>
              <ul className="mt-6 space-y-3">
                {aboutPageContent.awards.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b border-white/55 pb-2 text-[16px] leading-normal [font-family:var(--font-sans-en)]"
                  >
                    <p className="max-w-[280px] md:max-w-[460px]">{item.title}</p>
                    <p className="shrink-0">{item.date}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 md:mt-6 md:gap-6">
            <section>
              <a
                href={aboutPageContent.resume.url}
                target="_blank"
                rel="noreferrer"
                className={actionLinkClassName}
              >
                <span className="hidden md:block">{aboutPageContent.resume.label}</span>
                <span className="block md:hidden">{aboutPageContent.resume.shortLabel}</span>
                <svg
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  className="h-[12px] w-[12px] shrink-0 text-current"
                >
                  <path
                    d="M16 4V26M6 16L16 26L26 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sr-only">{uiCopy.about.downloadIconAlt}</span>
              </a>
            </section>
            <section>
              <a
                href={aboutPageContent.portfolio.url}
                target="_blank"
                rel="noreferrer"
                className={actionLinkClassName}
              >
                <span className="hidden md:block">{aboutPageContent.portfolio.label}</span>
                <span className="block md:hidden">{aboutPageContent.portfolio.shortLabel}</span>
                <svg
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  className="h-[12px] w-[12px] shrink-0 text-current"
                >
                  <path
                    d="M16 4V26M6 16L16 26L26 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sr-only">{uiCopy.about.downloadIconAlt}</span>
              </a>
            </section>
          </div>
        </div>
      </SectionContainer>

      <Footer />
      <ContactSection isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </SiteShell>
  )
}
