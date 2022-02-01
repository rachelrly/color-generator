import { Hsla } from './Hsla'
import { Rgb } from './Rgb'

export interface HslColorType {
  h: number
  s: number
  l: number
  a?: number
}
type ColorValueType = HslColorType // Add other color types here

export interface ColorPropType {
  color: ColorValueType
  variant1: ColorValueType // Light for HSL, but could be different for RGB
  variant2: ColorValueType // Dark for HSL, but could be different for RGB
  text?: '#000' // Recommended text color (#000 or #fff)
}

export type ColorSetType = ColorPropType[]

export type SetType = 'complementary' | 'triadic' | 'analogous'

export type ColorStringType = string //TODO: Validate this

export type ColorType = Hsla | Rgb

// get(color: ColorStringType): ColorPropType {
//   // Validates string as specified color string
//   // Turns color into color format
//   // Calls getColorVariants and _getTextColor
// }

// getRandom(): ColorPropType {
//   // Gets random color
//   // Calls getColorVariants and _getTextColor
// }

// getColorVariants(color: ColorValueType): ColorPropType {
//   // gets similar variants
// }

// _getTextColor(color: ColorValueType): string {
//   // TODO: Base this on value of color
//   return '#000'
// }

// getColorSet(type: SetType, color?: ColorStringType): ColorSetType {
//   // If no color, generate random color
//   // Otherwise convert into color object
// }
// }
