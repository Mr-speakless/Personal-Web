import { useState } from 'react'

interface HoverRollTextProps {
  text: string
  className?: string
}

export function HoverRollText({ text, className = '' }: HoverRollTextProps) {
  const [isHovered, setIsHovered] = useState(false)

  // When hovered, it transitions to translateY(-100%) for active, and 0% for next.
  // The transition duration is handled via CSS (e.g. duration-300).
  const transformClass = 'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]'

  return (
    <div
      className={`relative inline-flex overflow-hidden align-bottom ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible placeholder dictates correct natural width/height */}
      <span className="invisible">{text}</span>

      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 flex items-center justify-center will-change-transform ${transformClass}`}
          style={{ transform: isHovered ? 'translateY(-100%)' : 'translateY(0%)' }}
        >
          <span>{text}</span>
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center will-change-transform ${transformClass}`}
          style={{ transform: isHovered ? 'translateY(0%)' : 'translateY(100%)' }}
        >
          <span>{text}</span>
        </div>
      </div>
    </div>
  )
}
