import type { ColorProps, ColorPropKey } from '../types'
import { getValueWithinLimit } from './getValueWithinLimit'
import { KEY_LIMITS } from './constants'

export function getPropertyIncrement(
  color: ColorProps,
  key: ColorPropKey,
  increment: number = 10
) {
  return {
    ...color,
    [key]: getValueWithinLimit(color[key] + increment, KEY_LIMITS[key])
  }
}
