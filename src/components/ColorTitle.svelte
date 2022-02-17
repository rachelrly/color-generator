<script lang="ts">
  import ColorSwatch from './ColorSwatch.svelte'
  import type { ColorProps, SwatchSize } from '../types'
  import { getColorString } from '../utils'
  export let color: ColorProps
  export let caption: string = ''
  export let swatchSize: SwatchSize
</script>

<div
  class="flex flex-row items-center justify-between {caption &&
    'w-full'} max-w-screen-sm"
>
  <h3 class="text-gray-400 text-center">
    {caption ?? ''}{getColorString(color)}
  </h3>
  <ColorSwatch {color} size={swatchSize} />
</div>
