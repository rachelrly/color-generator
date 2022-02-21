import type { DisplayProps } from '../types'

export function isDisplayType(item: DisplayProps, key: string = 'x') {
  return Boolean(key in item)
}
