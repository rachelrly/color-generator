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
    getSquareDimensions,
    KEY_LIMITS
  } from './utils'
  import type {
    ColorPropKey,
    ColorProps,
    ControlOptions,
    DisplayType
  } from './types'

  const row = new Array(10).fill({})
  export let error: string = ''
  export let base: ColorProps = getRandomColor()
  export let options: ControlOptions = {
    square: { width: 300, step: 10 },
    display: 'square',
    property: 'hue'
  }
  $: minmax = KEY_LIMITS[options.property].range
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

  function handleSelectDisplayType(display: DisplayType) {
    if (display !== options.display) {
      options = { ...options, display }
    }
  }

  function handleSetColorValue(value: number) {
    base = { ...base, [options.property]: value }
  }

  function handleRandomColor() {
    base = getRandomColor()
  }
</script>

<main class="flex flex-col items-center h-full h-min-screen">
  <Title />
  <div
    class="w-full p-2 flex flex-col-reverse items-center md:p-4 md:h-full lg:h-full lg:p-6 lg:pt-14 lg:flex-row lg:justify-evenly"
  >
    <Sequence {sequence} {current} {handleSelectColor} />
    <Controls
      display={options.display}
      selected={options.property}
      {error}
      {minmax}
      {handleSetColorValue}
      {handleRandomColor}
      {handleSelectColorKey}
      {handleSelectDisplayType}
    />
  </div>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
