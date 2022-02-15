export function main() {
  const div: HTMLElement | null = document.getElementById('sq_wrapper')
  if (div) {
  } else setTimeout(main, 500)
}

main()
