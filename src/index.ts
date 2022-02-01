import { setColors } from './colors'

export function main() {
  const div: HTMLElement | null = document.getElementById('sq_wrapper')
  if (div) {
    setColors() // initial color
    div.addEventListener('click', setColors)
  } else setTimeout(main, 500)
}

main()
