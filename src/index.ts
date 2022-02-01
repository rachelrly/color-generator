import { setColors } from './colors'

export function main() {
  setColors()
  const div: HTMLElement | null = document.getElementById('sq_wrapper')
  if (div) {
    div.addEventListener('click', setColors)
  }
}

main()
