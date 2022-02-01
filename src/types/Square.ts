// For the SVG Square block
import { ColorStringType } from './Color'

export interface SquareColorType {
  outerSquare: ColorStringType
  middleSquare: ColorStringType
  innerSquare: ColorStringType
}

export interface SquareType {
  side: number // since height and width are the same
  offset?: number // since x and y offset are the same
}

export type TriSquareType = [SquareType, SquareType, SquareType]
