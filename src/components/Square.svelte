<script lang="ts">
  import type { ColorProps, SequenceItem, SquareSequenceItem } from '../types'
  import { getColorString } from '../utils'
  export let sequence: SequenceItem[]
  // We already know this will be a display square, but the ts compiler doesn't
  //    because it is validated in a nested prop
  $: squares = sequence as SquareSequenceItem[]
  export let handleSelectColor: (color: ColorProps) => void
</script>

<div class="flex justify-center my-4">
  <svg
    class="block"
    width={squares[0].display.width ?? '100%'}
    height={squares[0].display.width ?? '100%'}
    xmlns="http://www.w3.org/2000/svg"
  >
    {#each squares as { display, color }}
      {#if color.lightness < 100}
        <rect
          x={display.x}
          y={display.y}
          height={display.height}
          width={display.width}
          fill={color ? getColorString(color) : null}
          on:click|self={() => handleSelectColor(color)}
        />
      {/if}
    {/each}
  </svg>
</div>
