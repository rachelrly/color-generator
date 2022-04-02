<script lang="ts">
  import Square from './Square.svelte'
  import ColorTitle from './ColorTitle.svelte'
  import TileRow from './TileRow.svelte'
  import type { ColorProps, SequenceItem } from '../types'

  export let current: ColorProps
  export let sequence: SequenceItem[]
  export let handleSelectColor: (color: ColorProps) => void
</script>

<div class="flex flex-col h-full w-full items-center">
  {#if 'x' in sequence[0].display}
    <ColorTitle
      color={current}
      swatchSize="md"
      caption="The selected color is "
    />
    <Square {sequence} {handleSelectColor} />
  {:else}
    <TileRow {sequence} />
  {/if}
</div>
