import { setSvg } from './utils'
import { SvgSquareType, Hsla } from './types'

export function makeStackedSquare(squares: SvgSquareType[]) {
  // Makes stacked square in dom
  squares.forEach((square: SvgSquareType) => makeSquare(square))
}

export function makeSquare({ x, y, width, height, fill, id }: SvgSquareType) {
  function setSquareAttributes(square: SVGRectElement) {
    square.setAttribute('x', x)
    square.setAttribute('y', y || x)
    square.setAttribute('width', width)
    square.setAttribute('height', height || width)
    square.setAttribute('fill', fill || 'pink')
    square.setAttribute('id', id)
  }
  setSvg(setSquareAttributes)
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
