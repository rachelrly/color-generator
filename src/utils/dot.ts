export function dot(ctx: any, color: string, deets = { x: 50, y: 100, r: 20 }) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(deets.x, deets.y, deets.r, 0, 2 * Math.PI)
  ctx.fill()
}
