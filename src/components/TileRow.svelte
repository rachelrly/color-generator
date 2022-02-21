<script lang="ts">
  import ColorTitle from './ColorTitle.svelte'
  import type { SequenceItem } from '../types'
  export let sequence: SequenceItem[]
</script>

<div class="flex flex-col items-center justify-center w-80">
  {#each sequence as tile}
    {#if tile.color.lightness < 100 && tile.color.saturation <= 100}
      <ColorTitle color={tile.color} swatchSize="lg" />
    {/if}
  {/each}
</div>
