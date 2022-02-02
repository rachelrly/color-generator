import { SVGN } from './utils'
import { setColors } from './colors'
import { SvgSquareType, Hsla } from './types'

export function makeStackedSquare(squares: SvgSquareType[]) {
  // Makes stacked square in dom
  squares.forEach((square: SvgSquareType) => makeSquare(square))
  setColors()
}

export function makeSquare({ x, y, width, height, fill, id }: SvgSquareType) {
  const square = document.createElementNS(SVGN, 'rect')
  const svg = document.getElementById('svg_wrapper')
  if (square) {
    square.setAttribute('x', x)
    square.setAttribute('y', y || x)
    square.setAttribute('width', width)
    square.setAttribute('height', height || width)
    square.setAttribute('fill', fill || 'pink')
    if (id) square.setAttribute('id', id)
    svg?.appendChild(square)
  }
}

export function createStack(num = 400): SvgSquareType[] {
  const arr = new Array(4)
  return arr.fill(undefined).map((_, index) => {
    const invertedIndex = arr.length - index
    const col = new Hsla()
    const fill = col.stringify()
    const id = `${fill}${invertedIndex}`
    const width = (num / arr.length) * invertedIndex
    return {
      x: `${num - width / 2}`,
      width: width.toString(),
      fill,
      id
    }
  })
}
