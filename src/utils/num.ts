// export function incrementValue(
//   initial: number,
//   increment: number,
//   max: number
// ) {
//   const sum = initial + increment
//   const minus = (max * -1 + sum) * -1
//   if (sum <= max && sum >= 0) return sum
//   else if (minus <= max) return minus
//   else return max
// }

export function getRandomDecimal(): number {
  const MIN = 0.2
  return Math.random() * (1 - MIN) + MIN
}

export function getRandomInt({ min = 0, max = 255 }): number {
  return Math.random() * (max - min) + min
}
