<script lang="ts">
  import ColorTitle from './ColorTitle.svelte'
  import type { SequenceItem } from '../types'
  export let sequence: SequenceItem[]
</script>

<div class="flex flex-col items-center justify-center h-full">
  {#each sequence as tile}
    <ColorTitle color={tile.color} swatchSize="lg" />
  {/each}
</div>
