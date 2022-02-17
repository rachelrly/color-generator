export function getRandomDecimal(): number {
  const MIN = 0.2
  return Math.random() * (1 - MIN) + MIN
}

export function getRandomInt({ min = 0, max = 255 }): number {
  return Math.random() * (max - min) + min
}
