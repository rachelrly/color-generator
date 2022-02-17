import type { SquareDimensionProps } from '../types'

export function getSquareDimensions(
  outer: number = 300,
  step: number = 50
): SquareDimensionProps[] {
  let squares: SquareDimensionProps[] = []
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
