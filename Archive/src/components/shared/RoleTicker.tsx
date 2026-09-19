import { useEffect, useState } from 'react'

interface RoleTickerProps {
  roles: readonly string[]
  className?: string
  itemClassName?: string
  intervalMs?: number
}

const transitionMs = 700

export function RoleTicker({
  roles,
  className = '',
  itemClassName = '',
  intervalMs = 2200,
}: RoleTickerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (roles.length === 0) {
      setActiveIndex(0)
      setIsAnimating(false)
      return
    }

    setActiveIndex((current) => current % roles.length)
    setIsAnimating(false)
  }, [roles])

  useEffect(() => {
    if (roles.length <= 1) {
      return
    }

    let transitionTimer: number | undefined
    const dwellTimer = window.setTimeout(() => {
      setIsAnimating(true)

      transitionTimer = window.setTimeout(() => {
        setIsAnimating(false)
        setActiveIndex((current) => (current + 1) % roles.length)
      }, transitionMs)
    }, intervalMs)

    return () => {
      window.clearTimeout(dwellTimer)

      if (transitionTimer !== undefined) {
        window.clearTimeout(transitionTimer)
      }
    }
  }, [activeIndex, intervalMs, roles.length])

  if (roles.length === 0) {
    return null
  }

  const baseContainerClasses = 'content-stretch flex items-center justify-center p-[10px] relative overflow-hidden w-full'
  const containerClasses = [baseContainerClasses, className].filter(Boolean).join(' ')

  const baseItemClasses = 'text-center text-white whitespace-nowrap shrink-0'
  const itemClasses = [baseItemClasses, itemClassName].filter(Boolean).join(' ')

  const sizingRole = roles.reduce((widestRole, role) =>
    role.length > widestRole.length ? role : widestRole,
  )

  const nextIndex = (activeIndex + 1) % roles.length
  const transformClass = isAnimating ? 'transition-transform duration-700 ease-out' : ''

  return (
    <div className={containerClasses} data-name="RoleTicker">
      <p aria-hidden className={['invisible', itemClasses].join(' ')}>
        {sizingRole}
      </p>
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 flex items-center justify-center will-change-transform ${transformClass}`}
          style={{ transform: isAnimating ? 'translateY(-100%)' : 'translateY(0%)' }}
        >
          <p className={itemClasses}>
            {roles[activeIndex]}
          </p>
        </div>
        {roles.length > 1 && (
          <div
            className={`absolute inset-0 flex items-center justify-center will-change-transform ${transformClass}`}
            style={{ transform: isAnimating ? 'translateY(0%)' : 'translateY(100%)' }}
          >
            <p className={itemClasses}>{roles[nextIndex]}</p>
          </div>
        )}
      </div>
    </div>
  )
}

