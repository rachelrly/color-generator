import type { ColorProps } from '../types'
import { getRandomInt } from './getRandom'
import { KEY_LIMITS } from './constants'

export function getRandomColor(): ColorProps {
  return {
    hue: getRandomInt(KEY_LIMITS.hue.range),
    lightness: getRandomInt(KEY_LIMITS.lightness.range),
    saturation: getRandomInt(KEY_LIMITS.saturation.range),
    alpha: 1
  }
}
