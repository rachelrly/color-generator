// For the SVG Square block
import { ColorStringType } from './Color'

export interface SquareColorType {
  outerSquare: ColorStringType
  middleSquare: ColorStringType
  innerSquare: ColorStringType
}

export const svgSquareOptions = {
  x: '0',
  y: '0',
  width: '${sides[0].side}',
  height: '${sides[0].side}',
  fill: '#F5F5F5'
} as const

export type SvgSquareOptionsType = typeof svgSquareOptions

export interface SquareType {
  side: number // since height and width are the same
  offset?: number // since x and y offset are the same
}

export type TriSquareType = [SquareType, SquareType, SquareType]
