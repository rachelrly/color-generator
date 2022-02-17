<script lang="ts">
  import Controls from './Controls.svelte'
  import Square from './Square.svelte'
  import ColorTitle from './ColorTitle.svelte'
  import {
    getSquareDimensions,
    getRandomColor,
    getPropertyIncrement
  } from '../utils'
  import type { ColorProps, SquareDimensionProps, SquareProps } from '../types'

  let color = getRandomColor()
  let current = color
  let outerWidth: number
  let width = 300
  let step = 50
  $: squares = getSquareDimensions(width, step)
  $: filledSquares = squares.map(
    (sq: SquareDimensionProps): SquareProps => ({
      ...sq,
      color: getPropertyIncrement(color)
    })
  )
  function handleSelectColor(color: ColorProps) {
    current = color
  }
  function handleSetValue(val: number) {
    width = val
  }
</script>

<svelte:window bind:outerWidth />
<div class="w-full h-full p-2 items-center justify-center md:p-4 lg:p-6">
  <ColorTitle color={current} />
  <Square squares={filledSquares} />
  <Controls {handleSetValue} maxWidth={outerWidth - step} />
</div>
