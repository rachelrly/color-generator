import type { SquareProps } from '../types'

export function getSquareDimensions(
  outer: number,
  step: number
): SquareProps[] {
  let squares: SquareProps[] = []
  let current: number = step
  while (current < outer) {
    current += step
    const offset = (outer - current) / 2
    squares = [
      {
        x: offset,
        y: offset,
        width: current,
        height: current
      },
      ...squares
    ]
  }
  return squares
}
