import { setColors } from './colors'

console.log('LOADED MY INDEX SCRIPT')

export function main() {
  setColors()
  const div: HTMLElement | null = document.getElementById('sq_wrapper')
  if (div) {
    div.addEventListener('click', setColors)
  }
}

main()
