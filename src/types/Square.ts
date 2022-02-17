import type { SvgDimension } from './Svg'
import type { ColorProps } from './Color'

export interface SquareProps {
  x: number
  y: number
  height: SvgDimension
  width: SvgDimension
  color: ColorProps
  index?: number
}

export type SquareDimensionProps = Omit<SquareProps, 'fill' | 'index'>
