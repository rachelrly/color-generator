import { SquareColorType } from './types'

export function generateColors(): SquareColorType {
  // Generate color here
  return {
    outerSquare: 'red',
    middleSquare: 'yellow',
    innerSquare: 'green'
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

setColors()
