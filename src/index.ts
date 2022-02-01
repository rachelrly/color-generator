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
  console.log('THESE ARE MY SQUARES', squares)
  if (squares) {
    const colors = generateColors()
    console.log('AND THERE ARE SQUARES', colors)
    for (const [key, value] of Object.entries(colors)) {
      squares.getElementById(key).setAttribute('fill', value)
    }
  }
}

setColors()
