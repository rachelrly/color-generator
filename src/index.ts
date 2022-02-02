import { setColors } from './colors'
import { makeStackedSquare, createStack } from './square'

export function main() {
  const div: HTMLElement | null = document.getElementById('sq_wrapper')
  if (div) {
    const stack = createStack()
    makeStackedSquare(stack)
    setColors(stack)
    div.addEventListener('click', () => setColors(stack))
  } else setTimeout(main, 500)
}

main()
