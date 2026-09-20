import type { Block, MediaItem, RichText } from '../../content/projects'

function Text({ text }: { text: RichText }) {
  if (typeof text === 'string') return <p>{text}</p>
  return <p>{text.before}<a href={text.href} target="_blank" rel="noreferrer">{text.label}</a>{text.after}</p>
}

/** Cropped image box: the Figma frame ratio drives the box, the image covers it. */
export function Media({ item, alt, style }: { item: MediaItem; alt: string; style?: React.CSSProperties }) {
  const box = <span className="media-box" style={{ aspectRatio: `${item.ratio}`, borderRadius: item.radius, background: item.bg, ...style }}>
    <img src={item.src} alt={item.alt ?? alt} loading="lazy" style={item.fit ? { objectFit: item.fit } : undefined} />
  </span>
  return item.href ? <a className="media-link" href={item.href} target="_blank" rel="noreferrer" style={style}>{box}</a> : box
}

/** Renders a detail page's Figma-ordered content blocks (see `Block` in content/projects.ts). */
export function ProjectBlocks({ blocks, projectTitle }: { blocks: Block[]; projectTitle: string }) {
  return <>{blocks.map((block, index) => {
    const key = `${block.kind}-${index}`
    switch (block.kind) {
      case 'heading':
        return <div className="story-heading" key={key}><h2>{block.text}</h2></div>
      case 'paragraphs':
        return <div className="story-paragraphs" key={key}><div>{block.text.map((text, i) => <Text text={text} key={i} />)}</div></div>
      case 'note':
        return <div className="story-note" key={key}><p>{block.text}</p></div>
      case 'video':
        return <div className="story-media story-video" key={key}>
          <iframe src={`https://www.youtube-nocookie.com/embed/${block.id}`} title={block.title} loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>
      case 'embed':
        return <div className="story-media story-video" key={key} style={{ aspectRatio: `${block.ratio}` }}>
          <iframe src={block.src} title={block.title} loading="lazy" allowFullScreen />
        </div>
      case 'media':
        return <div className="story-media story-row" key={key} style={{ paddingTop: block.topGap }}>
          {block.items.map((item, i) => <Media item={item} alt={`${projectTitle} visual ${index + 1}.${i + 1}`} key={i} />)}
        </div>
      case 'columns':
        return <div className={`story-media story-columns ${block.justify === 'center' ? 'story-columns--center' : ''}`} key={key} style={{ gap: block.gap ?? 28 }}>
          {block.columns.map((column, c) => <div className="story-column" key={c} style={{ gap: block.rowGap ?? 28, flex: block.widths ? `0 1 ${block.widths[c] * 100}%` : '1 1 0' }}>
            {column.map((item, i) => <Media item={item} alt={`${projectTitle} visual ${index + 1}.${c + 1}.${i + 1}`} key={i} />)}
          </div>)}
        </div>
    }
  })}</>
}
