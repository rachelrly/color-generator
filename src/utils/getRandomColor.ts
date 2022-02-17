import type { ColorPropsOptions, ColorProps } from '../types'
import { getRandomDecimal, getRandomInt } from './num'

export function getRandomColor(options?: ColorPropsOptions): ColorProps {
  if (!options || options === {}) {
    return {
      hue: getRandomInt({ max: 255 }),
      lightness: getRandomInt({ max: 100 }),
      saturation: getRandomInt({ max: 100 }),
      alpha: getRandomDecimal()
    }
  } else {
    // handle option generation
    // 1. Get color from hue range (or other prop, etc)
    return {
      hue: 200,
      saturation: 100,
      lightness: 50,
      alpha: 1
    }
  }
}
