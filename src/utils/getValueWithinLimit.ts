import type { ColorRangeProps } from '../types'

export function getValueWithinLimit(
  value: number,
  props: ColorRangeProps
): number {
  const { range, loop } = props
  const [max, min] = range
  if (value <= max && value >= min) {
    return value
  } else if (value <= min) {
    // what is the logic here
    console.log('BELOW MIN', { value, min })
    return loop ? Math.abs(min + value) : min
  } else {
    return loop ? Math.abs(max - value) : max
  }
}
