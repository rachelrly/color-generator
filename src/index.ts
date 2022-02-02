import { setColors } from './colors'
import { makeStackedSquare } from './square'
import { Hsla, SvgSquareType } from './types'

function createStack(num = 400): SvgSquareType[] {
  const arr = new Array(4)
  return arr.fill(undefined).map((_, index) => {
    const invertedIndex = arr.length - index
    const col = new Hsla()
    return {
      x: `${(num - (num / arr.length) * invertedIndex) / 2}`,
      width: `${(num / arr.length) * invertedIndex}`,
      fill: col.stringify(),
      id: `outerSquare${invertedIndex}`
    }
  })
}

export function main() {
  const div: HTMLElement | null = document.getElementById('sq_wrapper')
  if (div) {
    div.addEventListener('click', setColors)
    const stack = createStack()
    makeStackedSquare(stack)
  } else setTimeout(main, 500)
}

main()
