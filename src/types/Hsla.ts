import { randomInt, incrementValue, randomDecimal } from '../utils'

export interface HslColorType {
  // How can this be derived from the class??
  h: number // 0-255
  s: number // 0-100%
  l: number // 0-100%
  a?: number // 0-1
}

export class Hsla {
  h: number // 0-255
  s: number // 0-100%
  l: number // 0-100%
  a?: number // 0-1
  generateRandom?: () => void

  constructor(h = 114, s = 80, l = randomInt(50), a = randomDecimal()) {
    this.h = h
    this.s = s
    this.l = l
    this.a = a
    this.generateRandom = () => {
      ;(this.h = randomInt(h)),
        (this.s = randomInt(s)),
        (this.l = randomInt(l)),
        (this.a = parseFloat(Math.random().toFixed()))
    }
  }

  public stringify() {
    if (Boolean(this.a))
      return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)`
  }

  public increment(prop: 'h' | 's' | 'l' | 'a', increment: number, max = 1) {
    if (prop === 'h') {
      if (max === 1) max = 255
      this.h = incrementValue(this.h, increment, max)
    } else if (prop === 'a') {
      this.a = Math.random()
      // if (this.a) this.a = incrementValue(this.a, increment, 1)
      // else this.a = Math.random()
    } else {
      // assumed to be 's' or 'l' percentage
      if (max === 1) max = 100
      this[prop] = incrementValue(this[prop], increment, max)
    }
  }
}
