// For the SVG Square block
import { ColorStringType, ColorType } from './Color'

export interface SquareColorType {
  outerSquare: ColorStringType
  middleSquare: ColorStringType
  innerSquare: ColorStringType
}

export interface SvgSquareType {
  x: string
  y?: string
  width: string
  height?: string
  fill?: string
  id: string
  color?: ColorStringType | ColorType
}
