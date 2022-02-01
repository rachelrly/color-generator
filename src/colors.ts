import { SquareColorType } from './types'
import { Hsla } from './types/Hsla'

export function generateColors(): SquareColorType {
  let color = new Hsla()
  const outerSquare = color.stringify()
  color.increment('h', 50)
  const middleSquare = color.stringify()
  color.increment('h', 50)
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
