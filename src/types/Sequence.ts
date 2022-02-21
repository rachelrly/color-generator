import type { ColorProps } from './Color'
import type { SquareProps } from './Square'

export interface KeyValue<T> {
  string: T
}

export type DisplayProps = SquareProps | { type: 'row' } // TODO: Make real row optinos

export interface SequenceItem {
  id?: string
  color: ColorProps
  display: DisplayProps
}

export interface SquareSequenceItem extends Omit<SequenceItem, 'display'> {
  display: SquareProps
}

export interface SequenceItemOptional
  extends Omit<SequenceItem, 'color' | 'display'> {
  color?: ColorProps
  display?: DisplayProps
}
