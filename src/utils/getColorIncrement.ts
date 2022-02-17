import type { ColorProps, ColorPropKey } from '../types'

export function getPropertyIncrement(
  color: ColorProps,
  property: ColorPropKey,
  increment: number = 10
) {
  return { ...color, [property]: color[property] + increment }
}
