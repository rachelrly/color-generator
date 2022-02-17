import type { ColorProps } from '../types'

export function getColorString({
  hue,
  saturation,
  lightness,
  alpha = 1
}: ColorProps): string {
  return `hsla(${display(hue)}, ${display(saturation)}%, ${display(
    lightness
  )}%, ${display(alpha, false)})`
}

function display(decimal: number, round = true): number {
  const digits = round ? 0 : 2
  return parseFloat(decimal.toFixed(digits))
}
