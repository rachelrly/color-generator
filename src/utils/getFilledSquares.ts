import type {
  ColorProps,
  ControlOptions,
  SquareProps,
  SequenceItem,
  DisplayProps
} from '../types'
import { getPropertyIncrement } from './getColorIncrement'

export function getFilledSequence(
  display: DisplayProps[],
  base: ColorProps,
  options: ControlOptions
): SequenceItem[] {
  const filled = []
  function fillDisplayItem(
    display: DisplayProps,
    color: ColorProps
  ): SequenceItem {
    return { display, color: getPropertyIncrement(color, options.property) }
  }

  display.forEach((item: DisplayProps) => {
    if (filled.length) {
      filled.push(fillDisplayItem(item, filled[filled.length - 1].color))
    } else {
      filled.push(fillDisplayItem(item, base))
    }
  })
  return filled
}
