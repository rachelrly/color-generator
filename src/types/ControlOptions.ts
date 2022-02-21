import type { ColorPropKey } from './Color'

export interface SquareOptions {
  width: number
  step: number
}

export interface RowOptions {
  length: number
}

export interface ControlOptions {
  property: ColorPropKey
  square?: SquareOptions
  row?: RowOptions
}
