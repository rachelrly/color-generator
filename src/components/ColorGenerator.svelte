<script lang="ts">
  import Controls from './Controls.svelte'
  import Square from './Square.svelte'
  import ColorTitle from './ColorTitle.svelte'
  import {
    getSquareDimensions,
    getRandomColor,
    getPropertyIncrement
  } from '../utils'
  import type {
    ColorPropKey,
    SquareDimensionProps,
    SquareProps
  } from '../types'

  let color = getRandomColor()
  let current = color
  let option: ColorPropKey = 'hue'
  let outerWidth: number
  let width = 300
  let step = 50

  $: squares = getSquareDimensions(width, step)
  $: filledSquares = squares.map(
    (sq: SquareDimensionProps): SquareProps => ({
      ...sq,
      color: getPropertyIncrement(color, option)
    })
  )

  function handleSelectColor(i: number) {
    current = filledSquares[i].color
  }

  function handleSetValue(val: number) {
    width = val
  }

  function handleSelectOption(opt: ColorPropKey) {
    option = opt
  }

  function handleRandomColor() {
    color = getRandomColor()
  }
</script>

<svelte:window bind:outerWidth />
<div
  class="w-full h-full p-2 flex flex-col items-center justify-evenly md:p-4 lg:p-6"
>
  <div
    class="max-w-screen-md w-full h-full flex flex-col items-center md:mt-2 lg:mt-6"
  >
    <ColorTitle color={current} />
    <Square squares={filledSquares} {handleSelectColor} />
    <Controls
      {handleRandomColor}
      {handleSetValue}
      {handleSelectOption}
      selected={option}
      maxWidth={outerWidth - step}
    />
  </div>
</div>
