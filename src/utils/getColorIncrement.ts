import type { ColorProps, ColorPropKey } from '../types'
import { KEY_LIMITS } from './constants'

export function getPropertyIncrement(
  color: ColorProps,
  key: ColorPropKey,
  increment: number = 10
) {
  const newValue = color[key] + increment
  const max = KEY_LIMITS[key].range[1]
  return {
    ...color,
    [key]: newValue <= max ? newValue : max
  }
}
