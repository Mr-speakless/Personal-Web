/**
 * Bordered boxes ("frames") and their corner registration marks (Figma JG / Border Corners).
 * Every framed box draws its stroke plus a mark centred on each corner of the stroke's midline;
 * adjacent frames overlap their strokes by one stroke width, so a shared corner shows one mark.
 */
export const frame = {
  // Pixels. Stroke width of every box border.
  strokePx: 1,
  // Pixels. Side length of the square corner marks.
  cornerPx: 4,
} as const
