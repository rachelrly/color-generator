export function incrementValue(
  initial: number,
  increment: number,
  max: number
) {
  const sum = initial + increment
  if (sum <= max && sum >= 0) return sum
  else return (max * -1 + sum) * -1
}

export function randomInt(max = 1) {
  return Math.floor(Math.random() * max)
}
