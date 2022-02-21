<script lang="ts">
  import ColorTitle from './ColorTitle.svelte'
  import type { SequenceProps } from '../types'
  export let sequence: SequenceProps[]
  console.log('THIS IS MY SEQUENCE')
</script>

<div class="flex flex-col items-center justify-center">
  {#each sequence as tile}
    <ColorTitle color={tile ?? tile} swatchSize="lg" />
  {/each}
</div>
