import { contact } from '../../content/contact'
import { getUICopy } from '../../content/ui'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { useLanguage } from '../../i18n/language'
import { withBase } from '../../lib/basePath'
import { LiquidGlassShader } from '../shared/LiquidGlassShader'

interface ContactCardProps {
  onClose: () => void
}

function CopyableText({
  text,
  copyTooltip,
  copiedText,
}: {
  text: string
  copyTooltip: string
  copiedText: string
}) {
  const { copiedValue, copy } = useCopyToClipboard()
  const isCopied = copiedValue === text

  return (
    <button
      onClick={() => { void copy(text) }}
      className="group relative flex items-center justify-center text-[24px] [font-family:var(--font-sans-en)] leading-[24px] text-white transition-opacity hover:opacity-80"
      title={copyTooltip}
    >
      <span>{text}</span>
      {isCopied && (
        <span className="absolute -top-6 text-sm text-white/50">{copiedText}</span>
      )}
    </button>
  )
}

export function ContactCard({ onClose }: ContactCardProps) {
  const { language } = useLanguage()
  const uiCopy = getUICopy(language)

  return (
    <div
      className="relative flex w-[min(92vw,342px)] flex-col items-center gap-4 overflow-hidden rounded-[24px] border border-white/10 px-3 py-6 shadow-2xl md:w-[min(92vw,500px)] md:gap-6 md:p-8"
      style={{
        // 降低本身的背景颜色，让底层的 WebGL Shader 材质透出来，保留模糊效果模糊底下真实的 DOM
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(10%)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
      }}
      role="dialog"
      aria-modal="true"
      aria-label={uiCopy.contact.dialogAriaLabel}
    >
      <LiquidGlassShader />
      <button
        type="button"
        className="absolute right-3 top-[11px] transition-opacity hover:opacity-80 md:right-4 md:top-4"
        onClick={onClose}
        aria-label={uiCopy.contact.closeButtonAriaLabel}
      >
        <img
          src={withBase('/assets/icons/close_btn.svg')}
          alt={uiCopy.contact.closeIconAlt}
          className="h-[28px] w-[28px] md:h-[32px] md:w-[32px]"
        />
      </button>

      <p className="mt-2 hidden w-full text-center text-[24px] [font-family:var(--font-sans-en)] leading-[24px] text-white md:block">
        {uiCopy.contact.cardTitle}
      </p>

      <div className="flex w-full flex-col items-center gap-4 md:hidden">
        <div className="flex items-center justify-center gap-6">
          <a
            href={contact.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-shrink-0 items-center justify-center transition-opacity hover:opacity-80"
          >
            <img
              src={withBase('/assets/icons/linkedin.svg')}
              alt="LinkedIn"
              className="h-[24px] w-[24px] object-contain"
            />
          </a>

          <div className="h-[24px] w-[1px] flex-shrink-0 bg-white opacity-50"></div>

          <a
            href={contact.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-shrink-0 items-center justify-center transition-opacity hover:opacity-80"
          >
            <img
              src={withBase('/assets/icons/instagram.svg')}
              alt="Instagram"
              className="h-[24px] w-[24px] object-contain"
            />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <img
            src={withBase('/assets/icons/wechat.svg')}
            alt={uiCopy.contact.wechatIconAlt}
            className="h-[24px] w-[24px] flex-shrink-0 object-contain"
          />
          <CopyableText
            text={contact.wechatId}
            copyTooltip={uiCopy.contact.copyTooltip}
            copiedText={uiCopy.contact.copiedText}
          />
        </div>

        <div className="flex w-full justify-center">
          <CopyableText
            text={contact.email}
            copyTooltip={uiCopy.contact.copyTooltip}
            copiedText={uiCopy.contact.copiedText}
          />
        </div>
      </div>

      <div className="hidden w-full items-center justify-center gap-6 md:flex">
        <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="flex flex-shrink-0 items-center justify-center transition-opacity hover:opacity-80">
          <img
            src={withBase('/assets/icons/linkedin.svg')}
            alt="LinkedIn"
            className="h-[36px] w-[36px] object-contain"
          />
        </a>

        {/* CSS Divider to replace broken SVG */}
        <div className="h-[24px] w-[1px] bg-white opacity-50 flex-shrink-0"></div>

        <a href={contact.instagramUrl} target="_blank" rel="noreferrer" className="flex flex-shrink-0 items-center justify-center transition-opacity hover:opacity-80">
          <img
            src={withBase('/assets/icons/instagram.svg')}
            alt="Instagram"
            className="h-[36px] w-[36px] object-contain"
          />
        </a>

        {/* CSS Divider */}
        <div className="h-[24px] w-[1px] bg-white opacity-50 flex-shrink-0"></div>

        <div className="flex items-center gap-3">
          <img
            src={withBase('/assets/icons/wechat.svg')}
            alt={uiCopy.contact.wechatIconAlt}
            className="h-[36px] w-[36px] flex-shrink-0 object-contain"
          />
          <CopyableText
            text={contact.wechatId}
            copyTooltip={uiCopy.contact.copyTooltip}
            copiedText={uiCopy.contact.copiedText}
          />
        </div>
      </div>

      <div className="hidden w-full justify-center md:flex">
        <CopyableText
          text={contact.email}
          copyTooltip={uiCopy.contact.copyTooltip}
          copiedText={uiCopy.contact.copiedText}
        />
      </div>
    </div>
  )
}
