<script lang="ts">
  import ColorSwatch from './ColorSwatch.svelte'
  import type { ColorProps, SwatchSize } from '../types'
  import { getColorString } from '../utils'
  export let color: ColorProps
  export let caption: string = ''
  export let swatchSize: SwatchSize
</script>

<div
  class="flex {swatchSize === 'sm'
    ? 'flex-row'
    : 'flex-row-reverse'} items-center w-full {caption
    ? 'w-full justify-center'
    : 'justify-between'} max-w-screen-sm"
>
  <h3 class="text-gray-400 text-center {!caption && 'self-start'}">
    {caption ?? ''}{getColorString(color)}
  </h3>
  <ColorSwatch {color} size={swatchSize} />
</div>
