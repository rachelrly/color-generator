import { SetSvgCallbackType } from '../types'
import { SVGN } from './constants'

export function setSvg(callback: SetSvgCallbackType) {
  const container = document.createElementNS(SVGN, 'rect')
  const svg = document.getElementById('svg_wrapper')
  if (container && svg) {
    callback(container)
    svg.appendChild(container)
  }
}
