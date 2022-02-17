import type { ColorPropsOptions, ColorProps } from '../types'
import { getRandomDecimal, getRandomInt } from './getRandom'

export function getRandomColor(options?: ColorPropsOptions): ColorProps {
  const randomColor = {
    hue: getRandomInt({ max: 255 }),
    lightness: getRandomInt({ min: 20, max: 80 }),
    saturation: getRandomInt({ min: 20, max: 100 }),
    alpha: 1
  }
  return { ...randomColor, ...options }
}
