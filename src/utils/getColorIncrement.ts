import type { ColorProps, ColorPropKey } from '../types'
import { getValueWithinLimit } from './getValueWithinLimit'

export function getPropertyIncrement(
  color: ColorProps,
  property: ColorPropKey,
  increment: number = 10
) {
  return {
    ...color,
    [property]: getValueWithinLimit(color[property] + increment, property)
  }
}
