export function getRandomDecimal(): number {
  const MIN = 0.2
  return Math.random() * (1 - MIN) + MIN
}

export type LimitType = readonly [number, number]

export function getRandomInt([min, max]: LimitType): number {
  return Math.random() * (max - min) + min
}
