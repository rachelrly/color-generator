import { setColors } from './colors'

export function main() {
  console.log('LOADED MY INDEX SCRIPT AND RAN MAIN')
  const div: HTMLElement | null = document.getElementById('sq_wrapper')
  console.log('THIS IS MY DIV THAT IS NOT GETTING AN EVENT LISTENER', div)
  if (div) {
    console.log('ADDED EVENT LISTNENER')
    div.addEventListener('click', setColors)
  } else setTimeout(main, 10000)
}

main()
