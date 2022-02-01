import { SquareColorType } from './types'
import { Hsla } from './types/Hsla'

export function generateColors(): SquareColorType {
  return {
    outerSquare: new Hsla().stringify(),
    middleSquare: new Hsla().stringify(),
    innerSquare: new Hsla().stringify()
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
