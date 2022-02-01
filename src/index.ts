import { setColors } from './colors'
import { makeStackedSquare } from './square'

const stack = [
  { x: '0', width: '400', fill: '#F5F5F5', id: 'outerSquare' },
  { x: '75', width: '250', fill: '#E0E0E0', id: 'middleSquare' },
  { x: '150', width: '100', fill: '#9E9E9E', id: 'innerSquare' }
]

export function main() {
  const div: HTMLElement | null = document.getElementById('sq_wrapper')
  if (div) {
    div.addEventListener('click', setColors)
    makeStackedSquare(stack)
  } else setTimeout(main, 500)
}

main()
