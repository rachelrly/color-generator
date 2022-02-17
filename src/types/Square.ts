import type { SvgDimension } from './Svg'

export interface SquareProps {
  x: number
  y: number
  height: SvgDimension
  width: SvgDimension
  fill: string
  index?: number
}

export type SquareDimensionProps = Omit<SquareProps, 'fill' | 'index'>
