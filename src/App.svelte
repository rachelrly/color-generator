<script lang="ts">
  import Title from './components/Title.svelte'
  import Controls from './components/Controls.svelte'
  import Display from './components/Display.svelte'
  import {
    getSquareDimensions,
    getRandomColor,
    getFilledSequence,
    getData,
    updateData,
    isDisplayType
  } from './utils'
  import type {
    ColorPropKey,
    ColorProps,
    ControlOptions,
    SquareProps
  } from './types'

  import { afterUpdate, onMount } from 'svelte'

  export let base: ColorProps = getRandomColor()
  export let options: ControlOptions = {
    square: { width: 300, step: 50 },
    row: { length: 10 },
    property: 'hue'
  }

  $: list = getSquareDimensions(options?.square.width, options?.square.step)
  $: isDisplayType(list[0], 'x')
  $: sequence = getFilledSequence(list, base, options)
  $: current = sequence[0].color // Selected color at top of screen

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
    <Display {sequence} {current} {handleSelectColor} />
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
