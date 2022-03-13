import type { KeyLimits } from '../types'

export const KEY_LIMITS: KeyLimits = {
  hue: { range: [255, 0], loop: true },
  saturation: { range: [100, 40], loop: false },
  lightness: { range: [90, 30], loop: false },
  alpha: { range: [0, 1], loop: true }
}
