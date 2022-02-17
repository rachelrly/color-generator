import type { ColorProps } from './Color'

export type SvgDimension = number | '100%'

export interface SquareProps {
  x: number
  y: number
  height: SvgDimension
  width: SvgDimension
  color: ColorProps
  index?: number
}

export type SquareDimensionProps = Omit<SquareProps, 'color' | 'index'>
