export function incrementValue(
  initial: number,
  increment: number,
  max: number
) {
  const sum = initial + increment
  const minus = (max * -1 + sum) * -1
  if (sum <= max && sum >= 0) return sum
  else if (minus <= max) return minus
  else return max
}

export function randomInt(max = 1) {
  return Math.floor(Math.random() * max)
}

export function randomDecimal(): number {
  return parseFloat(Math.random().toFixed(2))
}
