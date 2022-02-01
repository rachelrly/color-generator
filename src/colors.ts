import { SquareColorType } from './types'
import { Hsla, HslColorType } from './types'

export function generateColors(
  prop: keyof HslColorType = 'l',
  increment = 10
): SquareColorType {
  let color = new Hsla()
  const outerSquare = color.stringify()
  color.increment(prop, increment)
  const middleSquare = color.stringify()
  color.increment(prop, increment)
  const innerSquare = color.stringify()
  return {
    outerSquare,
    middleSquare,
    innerSquare
  }
}

export function setColors(): void {
  const squares: SVGSVGElement | null = document.querySelector('svg')
  if (squares) {
    const colors = generateColors()
    for (const [key, value] of Object.entries(colors)) {
      const square = squares.getElementById(key)
      square.setAttribute('fill', value)
    }
  }
}
