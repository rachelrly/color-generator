import type { KeyLimits } from '../types'

export const KEY_LIMITS: KeyLimits = {
  hue: { range: [0, 360], loop: true },
  saturation: { range: [0, 100], loop: false },
  lightness: { range: [0, 100], loop: false },
  alpha: { range: [0, 1], loop: true }
}
