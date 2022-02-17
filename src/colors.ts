// import { SvgSquareType } from './types'
// import { Hsla } from './types'

// export function setColors(stack: SvgSquareType[]): void {
//   const squares: SVGSVGElement | null = document.querySelector('svg')
//   let color = new Hsla()

//   if (squares && stack.length) {
//     stack.forEach((square: SvgSquareType) => {
//       // increment color in class
//       color.increment('l', 10) // HARDCODED FOR TESTING
//       const squareElem = squares.getElementById(square.id)
//       if (squareElem) squareElem.setAttribute('fill', color.stringify())
//     })
//   }
// }
