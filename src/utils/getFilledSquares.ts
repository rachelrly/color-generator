import type {
  ColorProps,
  ControlOptions,
  SequenceProps,
  SquareProps
} from '../types'
import { getPropertyIncrement } from './getColorIncrement'

// export function getFilledSquares(
//   squares: SquareDimensionProps[],
//   color: ColorProps,
//   options: ControlOptions
// ): SquareProps[] {
//   const filled = []
//   function fillSquare(
//     square: SquareDimensionProps,
//     color: ColorProps
//   ): SquareProps {
//     return { ...square, color: getPropertyIncrement(color, options.property) }
//   }
//   squares.forEach((sq: SquareDimensionProps, i) => {
//     if (filled.length) {
//       filled.push(fillSquare(sq, filled[filled.length - 1].color))
//     } else {
//       filled.push(fillSquare(sq, color))
//     }
//   })
//   return filled
// }

export function getFilledSequence(
  sequence: SequenceProps[],
  color: ColorProps,
  options: ControlOptions
): SquareProps[] {
  console.log('RUNNING GET FILLED SEQUENCE!!!!!')
  const filled = []
  function fillSequence(seq: SequenceProps, color: ColorProps): SequenceProps {
    return { ...seq, color: getPropertyIncrement(color, options.property) }
  }
  sequence.forEach((sq: SequenceProps) => {
    if (filled.length) {
      filled.push(fillSequence(sq, filled[filled.length - 1].color))
    } else {
      filled.push(fillSequence(sq, color))
    }
  })
  return filled
}
