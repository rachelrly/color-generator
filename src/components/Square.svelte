<script lang="ts">
  import type { SquareProps } from '../types'
  export let squares: SquareProps[]
</script>

<div class="flex justify-center my-2">
  <svg
    class="block"
    width={squares[0]?.width ?? '100%'}
    height={squares[0]?.width ?? '100%'}
    xmlns="http://www.w3.org/2000/svg"
  >
    {#each squares as { x, y, height, width, fill }}
      <rect {x} {y} {height} {width} {fill} stroke="black" />
    {/each}
  </svg>
</div>
