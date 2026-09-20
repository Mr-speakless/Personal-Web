import { useEffect, useRef } from 'react'
import { motion } from '../../config/motion'

/**
 * Hero background marks (Figma 35:3846): an evenly distributed grid that grows and brightens
 * around the pointer. Drawn on a canvas so the pointer effect stays cheap.
 */
export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const context = canvas?.getContext('2d')
    if (!canvas || !host || !context) return
    let width = 0
    let height = 0
    let raf = 0
    let visible = true
    const pointer = { x: -1e4, y: -1e4 }
    const { spacingPx, sizePx, pointerRadiusPx, extraScale, baseAlpha, extraAlpha, idleColor, litColor } = motion.dots
    const draw = () => {
      raf = 0
      if (!visible || !width || !height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)
      // Whole number of marks that fits the spacing, spread edge to edge like Figma's justify-between.
      const columns = Math.max(2, Math.round((width - sizePx) / spacingPx) + 1)
      const rows = Math.max(2, Math.round((height - sizePx) / spacingPx) + 1)
      const stepX = (width - sizePx) / (columns - 1)
      const stepY = (height - sizePx) / (rows - 1)
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const cx = column * stepX + sizePx / 2
          const cy = row * stepY + sizePx / 2
          const strength = Math.max(0, 1 - Math.hypot(cx - pointer.x, cy - pointer.y) / pointerRadiusPx)
          const size = sizePx * (1 + extraScale * strength)
          const mix = (i: number) => Math.round(idleColor[i] + (litColor[i] - idleColor[i]) * strength)
          context.fillStyle = `rgba(${mix(0)},${mix(1)},${mix(2)},${baseAlpha + extraAlpha * strength})`
          context.fillRect(cx - size / 2, cy - size / 2, size, size)
        }
      }
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw) }
    const resize = new ResizeObserver(() => {
      const rect = host.getBoundingClientRect()
      width = rect.width
      height = rect.height
      schedule()
    })
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule() })
    const move = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      schedule()
    }
    const leave = () => { pointer.x = -1e4; pointer.y = -1e4; schedule() }
    resize.observe(host)
    observer.observe(host)
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    return () => { resize.disconnect(); observer.disconnect(); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf) }
  }, [])
  return <canvas className="dot-field" ref={canvasRef} aria-hidden="true" />
}
