import type {
  ColorProps,
  ControlOptions,
  SquareDimensionProps,
  SquareProps
} from '../types'
import { getPropertyIncrement } from './getColorIncrement'

export function getFilledSquares(
  squares: SquareDimensionProps[],
  color: ColorProps,
  options: ControlOptions
): SquareProps[] {
  const filled = []
  function fillSquare(
    square: SquareDimensionProps,
    color: ColorProps
  ): SquareProps {
    return { ...square, color: getPropertyIncrement(color, options.property) }
  }
  squares.forEach((sq: SquareDimensionProps, i) => {
    if (filled.length) {
      filled.push(fillSquare(sq, filled[filled.length - 1].color))
    } else {
      filled.push(fillSquare(sq, color))
    }
  })
  return filled
}
