import type { ColorPropKey, ColorRange } from '../types'
import { getValueWithinLimit } from './getValueWithinLimit'
import { KEY_LIMITS } from './constants'

export function getRandomDecimal(): number {
  const MIN = 0.2
  return Math.random() * (1 - MIN) + MIN
}

export function getRandomInt([min, max]: ColorRange): number {
  return Math.random() * (max - min) + min
}

export function getRandomColorWithKey(key: ColorPropKey): number {
  return getValueWithinLimit(
    getRandomInt(KEY_LIMITS[key].range),
    KEY_LIMITS[key]
  )
}
