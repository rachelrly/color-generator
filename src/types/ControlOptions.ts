import type { ColorPropKey } from './Color'
import type { DisplayType } from './Display'

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
  display: DisplayType
}

export interface ButtonChainOptionsType<T> {
  selected: T
  options: T[]
  handleSelectOption: (opt: T) => void
}

export type ButtonChainSupportedType = DisplayType | ColorPropKey
