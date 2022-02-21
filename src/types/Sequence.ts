import type { ColorProps } from './Color'
import type { SquareProps } from './Square'

export interface KeyValue<T> {
  string: T
}

// The empty object represents row display,
// which only uses data from the color prop atm
export type DisplayProps = SquareProps | {}

export interface SequenceItem {
  id?: string
  color: ColorProps
  display: DisplayProps
}

export interface SquareSequenceItem extends Omit<SequenceItem, 'display'> {
  display: SquareProps
}
