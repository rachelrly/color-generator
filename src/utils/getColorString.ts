import type { ColorProps } from '../types'

export function getColorString({
  hue,
  saturation,
  lightness,
  alpha = 1
}: ColorProps): string {
  return `hsla(${display(hue)}, ${display(saturation)}%, ${display(
    lightness
  )}%, 1)`
}

function display(decimal: number): number {
  return Number(decimal)
}
