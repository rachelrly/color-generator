import { Hsla, HslColorType } from './Hsla'

export interface ColorPropType {
  color: HslColorType
  variant1: HslColorType // Light for HSL, but could be different for RGB
  variant2: HslColorType // Dark for HSL, but could be different for RGB
  text?: '#000' // Recommended text color (#000 or #fff)
}

export type ColorSetType = ColorPropType[]

export type SetType = 'complementary' | 'triadic' | 'analogous'

export type ColorStringType = string //TODO: Validate this

export type ColorType = Hsla
