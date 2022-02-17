<script lang="ts">
  import type { ColorProps, SquareProps } from '../types'
  import { getColorString } from '../utils'
  export let squares: SquareProps[]
  export let handleSelectColor: (color: ColorProps) => void
</script>

<div class="flex justify-center my-2">
  {#if squares.length > 0}
    <svg
      class="block"
      width={squares[0]?.width ?? '100%'}
      height={squares[0]?.width ?? '100%'}
      xmlns="http://www.w3.org/2000/svg"
    >
      {#each squares as { x, y, height, width, color }}
        <rect
          {x}
          {y}
          {height}
          {width}
          fill={color ? getColorString(color) : null}
          on:click|self={() => handleSelectColor(color)}
        />
      {/each}
    </svg>
  {:else}
    <div class="h-full">
      <h1 class="text-red-800 text-3xl">
        THIS SHOULD NOT BE HAPPENING! YOU SHOULD NEVER SEE THIS SCREEN!!!!
      </h1>
    </div>
  {/if}
</div>
