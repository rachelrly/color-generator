import type { SvgDimension } from './Svg'

export interface SquareProps {
  // TODO: these are always equal and should come form the same place
  x: number
  y: number
  height: SvgDimension
  width: SvgDimension
}
