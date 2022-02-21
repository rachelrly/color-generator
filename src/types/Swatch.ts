export const SwatchSizes = {
  sm: 20,
  md: 40,
  lg: 80
} as const

export type SwatchSize = keyof typeof SwatchSizes
