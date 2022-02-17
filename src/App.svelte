<script lang="ts">
  import Title from './components/Title.svelte'
  import Controls from './components/Controls.svelte'
  import Display from './components/Display.svelte'
  import {
    getSquareDimensions,
    getRandomColor,
    getFilledSquares,
    getData,
    updateData
  } from './utils'
  import type { ColorPropKey, ColorProps, ControlOptions } from './types'
  import { afterUpdate, onMount } from 'svelte'

  export let base: ColorProps = getRandomColor()
  export let options: ControlOptions = {
    width: 300,
    step: 50,
    property: 'hue'
  }

  $: squares = getSquareDimensions(options.width, options.step)
  $: filledSquares = getFilledSquares(squares, base, options)
  $: current = filledSquares[0].color // Selected color at top of screen

  onMount(() => {
    const data = getData()
    if (data?.base && data?.options) {
      base = data.base
      options = data.options
    }
  })

  afterUpdate(() => {
    updateData({ base, options })
  })

  function handleSelectColor(color: ColorProps) {
    current = color
  }

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
    <Display squares={filledSquares} {current} {handleSelectColor} />
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
