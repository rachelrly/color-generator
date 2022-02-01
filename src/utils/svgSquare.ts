import { TriSquareType } from '../types'

const defaultSquare: TriSquareType = [
  {
    side: 400,
    offset: 0
  },
  {
    side: 250,
    offset: 75
  },
  {
    side: 100,
    offset: 150
  }
]

export function svgSquare(sides = defaultSquare): string {
  // get ratio of numbers here
  // pass in only one set if side and offset, and calculate down from there
  return `
    <svg width="${sides[0].side}" height="${sides[0].side}" class="square">
    <rect
      id="outerSquare"
      x="0"
      y="0"
      width="${sides[0].side}"
      height="${sides[0].side}"
    />
    <rect
      id="middleSquare"
      x="${sides[1].offset}"
      y="${sides[1].offset}"
      width="${sides[1].side}"
      height="${sides[1].side}"
    />
    <rect
      id="innerSquare"
      x="${sides[2].offset}"
      y="${sides[2].offset}"
      width="${sides[2].side}"
      height="${sides[2].side}"
    />
  </svg>`
}
