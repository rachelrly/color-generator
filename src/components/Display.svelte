<script lang="ts">
  import Square from './Square.svelte'
  import ColorTitle from './ColorTitle.svelte'
  import TileRow from './TileRow.svelte'
  import type { ColorProps, SquareProps } from '../types'
  export let isRow: boolean = false
  export let current: ColorProps
  export let sequence: ColorProps[]
  export let squares: SquareProps[]
  export let handleSelectColor: (color: ColorProps) => void
</script>

<div class="flex flex-col w-full items-center justify-center flex-1">
  {#if isRow}
    <TileRow {sequence} />
  {:else}
    <ColorTitle
      color={current}
      swatchSize="md"
      caption="The selected color is "
    />
    <Square {squares} {handleSelectColor} />
  {/if}
</div>
