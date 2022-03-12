import type { ColorPropKey } from '../types'

export function getValueWithinLimit(value: number, key: ColorPropKey): number {
  if (key === 'hue') {
    return getValueFromMinMax(value, { max: 255 }, true)
  } else if (key === 'saturation') {
    return getValueFromMinMax(value, { max: 100, min: 50 }, false)
  } else if (key === 'lightness') {
    return getValueFromMinMax(value, { max: 100, min: 30 }, false)
  } else {
    return 1
  }
}

interface Range {
  max: number
  min?: number
}

function getValueFromMinMax(
  value: number,
  range: Range,
  loop: boolean
): number {
  const { max, min = 0 } = range
  console.log('THIS IS MY VALUE', value, range)
  if (value <= max && value >= min) {
    return value
  } else if (value <= min) {
    console.log('BELOW MIN', { value, min })
    return loop ? Math.abs(min + value) : min
  } else {
    return loop ? Math.abs(max - value) : max
  }
}

function getLoopingValue(difference: number): number {
  // get abs of difference
  // abs of max - value??

  return difference
}
