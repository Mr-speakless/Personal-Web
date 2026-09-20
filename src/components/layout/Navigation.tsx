import { media } from '../../content/media'

type Props = {
  /** Fixed navigation shown on Work once the intro scrolls away; the logo slides in from the left. */
  floating?: boolean
  /** Only the two pill links, used inside the Work intro cell (Figma 35:3839). */
  compact?: boolean
}

/**
 * JG / Navigation (Figma 13:18): 54px row, links column grows, identity/email columns fixed.
 * The 2D logo fills the row height (h-full + 8px padding) so it scales with the navigation.
 */
export function Navigation({ floating = false, compact = false }: Props) {
  const logo = <img src={media.about.imgGroup22} alt="" />
  return (
    <nav className={`navigation ${compact ? 'navigation--compact' : 'frame'} ${floating ? 'navigation--floating' : ''}`} aria-label="Main navigation">
      <div className="navigation__links">
        {!compact && (floating
          ? <a className="navigation__logo" href="/" aria-label="Shuoyue Wu, Work">{logo}</a>
          : <span className="navigation__logo" aria-hidden="true">{logo}</span>)}
        <a className="pill-link" href="/">Work</a>
        <a className="pill-link" href="/about/">About</a>
      </div>
      {!compact && <>
        <span className="navigation__name frame">Shuoyue (Lucas) Wu</span>
        <a className="navigation__email frame" href="mailto:wu11023416@gmail.com">wu11023416@gmail.com</a>
      </>}
    </nav>
  )
}
