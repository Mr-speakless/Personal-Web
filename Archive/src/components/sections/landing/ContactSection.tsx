import { ContactCard } from '../../contact/ContactCard'

interface ContactSectionProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactSection({ isOpen, onClose }: ContactSectionProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div onClick={(event) => event.stopPropagation()} role="presentation">
        <ContactCard onClose={onClose} />
      </div>
    </div>
  )
}
