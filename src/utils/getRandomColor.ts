import type { ColorProps } from '../types'
import { getRandomDecimal, getRandomInt } from './getRandom'
import { KEY_LIMITS } from './constants'

export function getRandomColor(): ColorProps {
  return {
    hue: getRandomInt(KEY_LIMITS.hue),
    lightness: getRandomInt(KEY_LIMITS.lightness),
    saturation: getRandomInt(KEY_LIMITS.saturation),
    alpha: 1
  }
}
