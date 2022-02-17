<script lang="ts">
  import Title from './components/Title.svelte'
  import Controls from './components/Controls.svelte'
  import Square from './components/Square.svelte'
  import ColorTitle from './components/ColorTitle.svelte'
  import {
    getSquareDimensions,
    getRandomColor,
    getFilledSquares
  } from './utils'
  import type {
    ColorPropKey,
    ColorProps,
    ControlOptions,
    SquareDimensionProps,
    SquareProps
  } from './types'

  let base: ColorProps = getRandomColor()

  export let options: ControlOptions = {
    width: 300,
    step: 50,
    property: 'hue'
  }

  $: squares = getSquareDimensions(options.width, options.step)
  $: filledSquares = getFilledSquares(squares, base, options)
  $: current = filledSquares[0].color // Selected color at top of screen

  function handleSelectColor(color: ColorProps) {
    current = color
  }

  // function handleSetValue(val: number) {
  //   width = val
  // }

  function handleSelectOption(prop: ColorPropKey) {
    options = { ...options, property: prop }
  }

  function handleRandomColor() {
    base = getRandomColor()
  }
</script>

<main class="flex flex-col items-center h-screen">
  <Title />
  <div
    class="w-full h-full p-2 flex flex-col items-center justify-evenly md:p-4 lg:p-6 lg:flex-row"
  >
    <div class="flex flex-col w-full items-center justify-center flex-1">
      {#if current}
        <ColorTitle color={current} />
      {/if}
      <Square squares={filledSquares} {handleSelectColor} />
    </div>
    <Controls
      {handleRandomColor}
      {handleSelectOption}
      selected={options.property}
    />
  </div>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
