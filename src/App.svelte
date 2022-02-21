<script lang="ts">
  import { afterUpdate, onMount } from 'svelte'
  import Title from './components/Title.svelte'
  import Controls from './components/Controls.svelte'
  import Sequence from './components/Sequence.svelte'
  import {
    getRandomColor,
    getFilledSequence,
    getData,
    updateData,
    getSquareDimensions
  } from './utils'
  import type {
    ColorPropKey,
    ColorProps,
    ControlOptions,
    DisplayType
  } from './types'

  const row = new Array(10).fill({})
  export let base: ColorProps = getRandomColor()
  export let options: ControlOptions = {
    square: { width: 300, step: 50 },
    display: 'square',
    property: 'hue'
  }

  $: list =
    options.display !== 'row'
      ? getSquareDimensions(options?.square.width, options?.square.step)
      : row
  $: sequence = getFilledSequence(list, base, options)
  $: current = sequence[0].color // Selected color at top of screen

  onMount(() => {
    const data = getData()
    if (data?.base && data?.options && data?.list) {
      base = data.base
      options = data.options
      list = data.list
    }
  })

  afterUpdate(() => {
    updateData({ base, options, list })
  })

  function handleSelectColor(color: ColorProps) {
    current = color
  }

  function handleSelectColorKey(property: ColorPropKey) {
    options = { ...options, property }
  }

  function handleToggleDisplayType() {
    const display = options.display === 'square' ? 'row' : 'square'
    options = { ...options, display }
  }

  function handleRandomColor() {
    base = getRandomColor()
  }
</script>

<main class="flex flex-col items-center h-min-screen">
  <Title />
  <div
    class="w-full h-full p-2 flex flex-col-reverse items-center md:p-4 lg:p-6 lg:pt-14 lg:flex-row lg:justify-evenly"
  >
    <Sequence {sequence} {current} {handleSelectColor} />
    <Controls
      {handleRandomColor}
      {handleSelectColorKey}
      {handleToggleDisplayType}
      selected={options.property}
    />
  </div>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
