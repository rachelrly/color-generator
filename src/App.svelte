<script lang="ts">
  import Title from './components/Title.svelte'
  import Controls from './components/Controls.svelte'
  import Square from './components/Square.svelte'
  import ColorTitle from './components/ColorTitle.svelte'
  import {
    getSquareDimensions,
    getRandomColor,
    getPropertyIncrement
  } from './utils'
  import type {
    ColorPropKey,
    ColorProps,
    SquareDimensionProps,
    SquareProps
  } from './types'

  export let base: ColorProps
  $: current = base // Selected color at top of screen
  export let option: ColorPropKey = 'hue'
  export let width = 300
  export let step = 50

  $: squares = getSquareDimensions(width, step)
  $: filledSquares = squares.map(
    (sq: SquareDimensionProps): SquareProps => ({
      ...sq,
      color: getPropertyIncrement(base, option)
    })
  )

  function handleSelectColor(color: ColorProps) {
    current = color
  }

  function handleSetValue(val: number) {
    width = val
  }

  function handleSelectOption(opt: ColorPropKey) {
    option = opt
  }

  function handleRandomColor() {
    base = getRandomColor()
  }
</script>

<main class="flex flex-col items-center h-screen">
  <Title />
  <div
    class="w-full h-full p-2 flex flex-col items-center justify-evenly md:p-4 lg:p-6"
  >
    {#if current}
      <ColorTitle color={current} />
    {/if}
    <Square squares={filledSquares} {handleSelectColor} />
    <Controls
      {handleRandomColor}
      {handleSetValue}
      {handleSelectOption}
      selected={option}
    />
  </div>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
