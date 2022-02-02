import { SVGN } from './utils'
import { setColors } from './colors'
import { SvgSquareType } from './types'

export function makeStackedSquare(squares: SvgSquareType[]) {
  //const square = svgSquare() // generate svg code
  squares.forEach((square: SvgSquareType) => makeSquare(square))
  setColors()
}

export function makeSquare({ x, y, width, height, fill, id }: SvgSquareType) {
  const square = document.createElementNS(SVGN, 'rect')
  square.setAttribute('x', x)
  square.setAttribute('y', y || x)
  square.setAttribute('width', width)
  square.setAttribute('height', height || width)
  square.setAttribute('fill', fill || 'pink')
  if (id) square.setAttribute('id', id)
  document.getElementById('svg_wrapper')?.appendChild(square)
}
