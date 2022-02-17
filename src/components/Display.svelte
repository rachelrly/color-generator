<script lang="ts">
  import Square from './Square.svelte'
  import ColorTitle from './ColorTitle.svelte'
  import type { ColorProps, SquareProps } from '../types'
  export let current: ColorProps
  export let squares: SquareProps[]
  export let handleSelectColor: (color: ColorProps) => void
</script>

<div class="flex flex-col w-full items-center justify-center flex-1">
  <ColorTitle
    color={current}
    swatchSize="md"
    caption="The selected color is "
  />
  <Square {squares} {handleSelectColor} />
</div>
