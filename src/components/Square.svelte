<script lang="ts">
  import type { SquareProps, SvgDimension } from '../types'
  export let squares: SquareProps[]
  export let outer: SvgDimension = '100%'
  console.log('THESE ARE MY SQUARES', squares)
</script>

<div class="p-2 w-full h-auto lg:w-1/2 lg:h-1/2">
  <svg width={outer} height={outer} xmlns="http://www.w3.org/2000/svg">
    {#each squares as { x, y, height, width, fill }}
      <rect {x} {y} {height} {width} {fill} stroke="black" />
    {/each}
  </svg>
</div>
