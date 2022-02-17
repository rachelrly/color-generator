<script lang="ts">
  import Controls from './Controls.svelte'
  import Square from './Square.svelte'
  import ColorTitle from './ColorTitle.svelte'
  import { getSquareDimensions, getRandomColor } from '../utils'
  import type { SquareDimensionProps, SquareProps } from '../types'

  let color = getRandomColor()
  console.log('THIS IS MY COLOR', color)
  let outerWidth: number
  let width = 300
  let step = 50
  $: squares = getSquareDimensions(width, step)
  $: filledSquares = squares.map(
    (sq: SquareDimensionProps): SquareProps => ({ ...sq, fill: 'red' })
  )
  function handleSetValue(val: number) {
    width = val
  }
</script>

<svelte:window bind:outerWidth />
<div class="flex-1 w-full h-full p-2 items-center justify-center">
  <ColorTitle {color} />
  <Square squares={filledSquares} />
  <Controls {handleSetValue} maxWidth={outerWidth - step} />
</div>
