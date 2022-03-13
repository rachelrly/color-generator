export interface ColorProps {
  hue: number // 0-255
  saturation: number // 0-100%
  lightness: number // 0-100%
  alpha: number // 0-1
}

export interface ColorPropsOptions
  extends Omit<ColorProps, 'hue' | 'saturation' | 'lightness' | 'alpha'> {
  hue?: number
  saturation?: number
  lightness?: number
  alpha?: number
}

export type ColorPropKey = keyof ColorProps

export type ColorRange = [number, number | undefined]

export interface ColorRangeProps {
  range: ColorRange
  loop: boolean
}

export interface KeyLimits
  extends Omit<ColorProps, 'hue' | 'saturation' | 'lightness' | 'alpha'> {
  hue: ColorRangeProps
  saturation: ColorRangeProps
  lightness: ColorRangeProps
  alpha: ColorRangeProps
}
