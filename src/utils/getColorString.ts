import type { ColorProps } from '../types'

export function getColorString({
  hue,
  saturation,
  lightness,
  alpha = 1
}: ColorProps): string {
  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
}
