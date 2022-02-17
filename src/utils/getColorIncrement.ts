import type { ColorProps, ColorPropKey } from '../types'

export function getPropertyIncrement(
  color: ColorProps,
  property: ColorPropKey,
  increment: number = 10
) {
  // Only incrementing hue right now for testing purposes
  const newColor = { ...color, [property]: color[property] + increment }
  color[property] = color[property] + increment
  return newColor
}
