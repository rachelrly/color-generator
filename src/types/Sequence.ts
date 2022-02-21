import type { ColorProps } from './Color'
import type { SquareProps } from './Square'

export interface KeyValue<T> {
  string: T
}

export type SequenceProps = ColorProps | SquareProps
