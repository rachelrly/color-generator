<script lang="ts">
  import type { SquareProps } from '../types'
  import { getColorString } from '../utils'
  export let squares: SquareProps[]
  export let handleSelectColor: Function
</script>

<div class="flex justify-center my-2">
  <svg
    class="block"
    width={squares[0]?.width ?? '100%'}
    height={squares[0]?.width ?? '100%'}
    xmlns="http://www.w3.org/2000/svg"
  >
    {#each squares as { x, y, height, width, color }, i}
      <rect
        {x}
        {y}
        {height}
        {width}
        fill={getColorString(color)}
        on:click|self={() => handleSelectColor(i)}
      />
    {/each}
  </svg>
</div>
