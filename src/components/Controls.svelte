<script lang="ts">
  import Button from './Button.svelte'
  import ButtonChain from './ButtonChain.svelte'
  import Input from './Input.svelte'
  import type { ColorPropKey, DisplayType, ColorRange } from '../types'

  export let error: string = ''
  export let selected: ColorPropKey
  export let display: DisplayType
  export let minmax: ColorRange
  export let handleSetColorValue: (value: number) => void
  export let handleSelectColorKey: (opt: ColorPropKey) => void
  export let handleRandomColor: () => void
  export let handleSelectDisplayType: (opt: DisplayType) => void
</script>

<div
  class="flex flex-col h-full w-full border-box max-w-sm sm:mb-10 md:mb-10 lg:border-l-2:pl-4:self-start"
>
  <h3 class="text-xl mb-2">Change the options</h3>
  <div class="h-6">
    <span class="text-red-600 text-center text-xs md:text-sm">{error}</span>
  </div>
  <div class="w-full flex justify-between pb-2">
    <Button text="new color" onClick={handleRandomColor} />
    <ButtonChain
      chainOptions={{
        selected: display,
        options: ['square', 'row'],
        handleSelectOption: handleSelectDisplayType
      }}
    />
  </div>
  <ButtonChain
    chainOptions={{
      selected,
      options: ['hue', 'saturation', 'lightness'],
      handleSelectOption: handleSelectColorKey
    }}
  />
  <Input label="color-input" {minmax} {handleSetColorValue} />
</div>
