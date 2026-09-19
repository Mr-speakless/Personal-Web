import { useLanguage } from '../../i18n/language'
import { useBlackHolePortalStore } from './store/useBlackHolePortalStore.ts'

const hintText = {
  en: 'Click the blackhole or orbit planet to enter the project.',
  zh: '点击黑洞或轨道星球以进入项目。',
} as const

export function PortalOverlayUI() {
  const portalState = useBlackHolePortalStore((s) => s.portalState)
  const { language } = useLanguage()

  // Hide hint during portal animation
  if (portalState === 'portalPause' || portalState === 'entering' || portalState === 'navigating') {
    return null
  }

  return (
    <p className="pointer-events-none absolute bottom-[19%] left-0 right-0 text-center text-body leading-body text-neutral-60">
      {hintText[language]}
    </p>
  )
}
