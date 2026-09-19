import { useEffect, useRef, useState } from 'react'

import { HoverRollText } from '../shared/HoverRollText'
import { getUICopy } from '../../content/ui'
import { useLanguage, type AppLanguage } from '../../i18n/language'
import { withBase, withLanguagePath } from '../../lib/basePath'
import { LiquidGlassShader } from '../shared/LiquidGlassShader'
import { sectionIds } from '../../lib/routes'

interface TopNavProps {
  onOpenContact?: () => void
  onScrollToSection?: (sectionId: string) => void
  onNavigateAbout?: () => void
  onNavigateBlackhole?: () => void
}

export function TopNav({
  onOpenContact,
  onScrollToSection,
  onNavigateAbout,
  onNavigateBlackhole,
}: TopNavProps) {
  const { language, setLanguage } = useLanguage()
  const uiCopy = getUICopy(language)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const handleWorkClick = () => onScrollToSection?.(sectionIds.work)
  const handleContactClick = () => onOpenContact?.()
  const handleLanguageSelect = (nextLanguage: AppLanguage) => {
    setLanguage(nextLanguage)
    setIsLanguageMenuOpen(false)
  }

  const [activeMobileIdx, setActiveMobileIdx] = useState<number | null>(null)

  useEffect(() => {
    const currentPath = window.location.pathname
    if (currentPath.includes('/about')) setActiveMobileIdx(0)
    else if (currentPath.includes('/blackhole')) setActiveMobileIdx(2)
    else setActiveMobileIdx(1) // Default to Work/Home
  }, [])

  const handleMobileNavClick = (
    idx: number,
    action?: () => void,
    url?: string
  ) => {
    setActiveMobileIdx(idx)
    if (action) {
      action()
    } else if (url) {
      window.location.href = url
    }
  }

  const getMobileNavItemClassName = (idx: number) => {
    const isActive = activeMobileIdx === idx
    return `relative z-10 flex h-8 items-center justify-center whitespace-nowrap rounded-[18px] px-2 text-center text-[13px] leading-none transition-colors duration-300 ${
      isActive
        ? 'text-black font-medium cursor-default'
        : 'text-white/70 hover:text-white hover:bg-white/10 active:scale-95'
    } [font-family:var(--font-sans-en)]`
  }
  const navItemClassName =
    'text-[24px] leading-none [font-family:var(--font-sans-en)] md:text-[24px] md:leading-[24px]'
  const homeHref = withLanguagePath('/', language)
  const aboutHref = withLanguagePath('/about', language)
  const blackholeHref = withLanguagePath('/blackhole', language)
  const workHref = `${homeHref}#${sectionIds.work}`
  const contactHref = `${homeHref}#${sectionIds.contact}`

  useEffect(() => {
    if (!isLanguageMenuOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isLanguageMenuOpen])

  return (
    <>
      <header className="w-full px-[30px] pt-[30px] md:px-10 md:pt-6">
        <nav className="mx-auto flex w-full max-w-[1200px] justify-between items-center">
          <a href={homeHref} className="flex items-center gap-2 md:items-end md:gap-3 z-50">
            <img
              src={withBase('/assets/icons/navigation/square-logo.svg')}
              alt={uiCopy.nav.logoAlt}
              className="h-6 w-6"
            />
            <span className="text-[16px] leading-[24px] tracking-wide [font-family:var(--font-sans-en)] md:text-[24px]">
              Shuoyue Wu
            </span>
          </a>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-4 md:gap-6">
            {onNavigateAbout ? (
              <button
                type="button"
                onClick={onNavigateAbout}
                className={`border-0 bg-transparent p-0 ${navItemClassName}`}
              >
                <HoverRollText text={uiCopy.nav.about} />
              </button>
            ) : (
              <a href={aboutHref} className={navItemClassName}>
                <HoverRollText text={uiCopy.nav.about} />
              </a>
            )}

            {onScrollToSection ? (
              <button
                type="button"
                onClick={handleWorkClick}
                className={`border-0 bg-transparent p-0 ${navItemClassName}`}
              >
                <HoverRollText text={uiCopy.nav.work} />
              </button>
            ) : (
              <a href={workHref} className={navItemClassName}>
                <HoverRollText text={uiCopy.nav.work} />
              </a>
            )}

            {onNavigateBlackhole ? (
              <button
                type="button"
                onClick={onNavigateBlackhole}
                className={`border-0 bg-transparent p-0 ${navItemClassName}`}
              >
                <HoverRollText text={uiCopy.nav.blackhole} />
              </button>
            ) : (
              <a href={blackholeHref} className={navItemClassName}>
                <HoverRollText text={uiCopy.nav.blackhole} />
              </a>
            )}

            {onOpenContact ? (
              <button
                type="button"
                onClick={handleContactClick}
                className={`border-0 bg-transparent p-0 ${navItemClassName}`}
              >
                <HoverRollText text={uiCopy.nav.contact} />
              </button>
            ) : (
              <a href={contactHref} className={navItemClassName}>
                <HoverRollText text={uiCopy.nav.contact} />
              </a>
            )}
          </div>

          <div className="relative" ref={languageMenuRef}>
            <button
              type="button"
              onClick={() => setIsLanguageMenuOpen((current) => !current)}
              className="border-0 bg-transparent p-0"
              aria-label={uiCopy.nav.languageSwitchAriaLabel}
              aria-haspopup="menu"
              aria-expanded={isLanguageMenuOpen}
            >
              <img
                src={withBase('/assets/icons/navigation/language.svg')}
                alt={uiCopy.nav.languageIconAlt}
                className="h-5 w-10"
              />
            </button>

            {isLanguageMenuOpen && (
              <div
                role="menu"
                aria-label={uiCopy.nav.languageMenuAriaLabel}
                className="absolute right-0 top-full z-20 mt-2 min-w-[132px] rounded-[12px] border border-white/20 bg-black/85 p-1.5 backdrop-blur-md"
              >
                <button
                  type="button"
                  onClick={() => handleLanguageSelect('zh')}
                  role="menuitemradio"
                  aria-checked={language === 'zh'}
                  className={`w-full rounded-[8px] px-3 py-2 text-left text-[14px] leading-none transition-colors [font-family:var(--font-sans-en)] ${
                    language === 'zh' ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {uiCopy.nav.languageOptionChinese}
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageSelect('en')}
                  role="menuitemradio"
                  aria-checked={language === 'en'}
                  className={`mt-1 w-full rounded-[8px] px-3 py-2 text-left text-[14px] leading-none transition-colors [font-family:var(--font-sans-en)] ${
                    language === 'en' ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {uiCopy.nav.languageOptionEnglish}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>

      {/* Mobile Bottom Navigation (Floating Card) */}
      <nav
        className="fixed bottom-8 left-1/2 z-50 flex w-[calc(100%-48px)] max-w-[380px] -translate-x-1/2 items-center overflow-hidden rounded-[24px] border border-white/10 p-1.5 shadow-2xl md:hidden"
        style={{
          backdropFilter: 'blur(24px) saturate(150%)',
          WebkitBackdropFilter: 'blur(24px) saturate(10%)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        <LiquidGlassShader />
        
        <div className="relative grid w-full grid-cols-4 items-stretch">
          {/* Sliding Pill Indicator */}
          <div 
            className="absolute left-0 top-0 h-full w-1/4 rounded-[18px] bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform duration-500 will-change-transform"
            style={{
              transform: `translateX(${(activeMobileIdx === null ? 1 : activeMobileIdx) * 100}%)`,
              transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)'
            }}
          />

          {onNavigateAbout ? (
            <button
              type="button"
              onClick={() => handleMobileNavClick(0, onNavigateAbout)}
              className={getMobileNavItemClassName(0)}
            >
              {uiCopy.nav.about}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleMobileNavClick(0, undefined, aboutHref)}
              className={getMobileNavItemClassName(0)}
            >
              {uiCopy.nav.about}
            </button>
          )}

          {onScrollToSection ? (
            <button
              type="button"
              onClick={() => handleMobileNavClick(1, handleWorkClick)}
              className={getMobileNavItemClassName(1)}
            >
              {uiCopy.nav.work}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleMobileNavClick(1, undefined, workHref)}
              className={getMobileNavItemClassName(1)}
            >
              {uiCopy.nav.work}
            </button>
          )}

          {onNavigateBlackhole ? (
            <button
              type="button"
              onClick={() => handleMobileNavClick(2, onNavigateBlackhole)}
              className={getMobileNavItemClassName(2)}
            >
              {uiCopy.nav.blackhole}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleMobileNavClick(2, undefined, blackholeHref)}
              className={getMobileNavItemClassName(2)}
            >
              {uiCopy.nav.blackhole}
            </button>
          )}

          {onOpenContact ? (
            <button
              type="button"
              onClick={() => handleMobileNavClick(3, handleContactClick)}
              className={getMobileNavItemClassName(3)}
            >
              {uiCopy.nav.contact}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleMobileNavClick(3, undefined, contactHref)}
              className={getMobileNavItemClassName(3)}
            >
              {uiCopy.nav.contact}
            </button>
          )}
        </div>
      </nav>
    </>
  )
}
