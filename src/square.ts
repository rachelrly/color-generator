import { svgSquare } from './utils/svgSquare'
import { setColors } from './colors'

export function generateSquare() {
  const square = svgSquare() // generate svg code

  setColors()
}
