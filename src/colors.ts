import { SquareColorType } from './types'
import { Hsla, HslColorType } from './types'
import { randomDecimal } from './utils'

export function generateColors(
  prop: keyof HslColorType = 'l',
  increment = 30
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

// break this logic down to set color for square

export function setColors(): void {
  const squares: SVGSVGElement | null = document.querySelector('svg')

  console.log('THESE ARE MY SQUARES', squares)
  if (squares) {
    const colors = generateColors()
    for (const [key, value] of Object.entries(colors)) {
      const square = squares.getElementById(key)
      if (square) square.setAttribute('fill', value)
    }
  }
}
