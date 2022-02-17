import type { ColorProps } from '../types'

export function getPropertyIncrement(
  color: ColorProps,
  property: keyof ColorProps = 'hue',
  increment: number = 10
) {
  // Only incrementing hue right now for testing purposes
  color[property] = color[property] + increment
  return color
}
