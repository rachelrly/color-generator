import { setColors } from './colors'
import { makeStackedSquare, createStack } from './square'

export function main() {
  const div: HTMLElement | null = document.getElementById('sq_wrapper')
  if (div) {
    div.addEventListener('click', setColors)
    const stack = createStack()
    makeStackedSquare(stack)
  } else setTimeout(main, 500)
}

main()
