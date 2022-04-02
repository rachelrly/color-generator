<script lang="ts">
  import Button from './Button.svelte'
  import ButtonChain from './ButtonChain.svelte'
  import Input from './Input.svelte'
  import type { ColorPropKey, DisplayType } from '../types'

  export let handleSelectColorKey: (opt: ColorPropKey) => void
  export let handleRandomColor: () => void
  export let handleSelectDisplayType: (opt: DisplayType) => void
  export let handleSetColorProp: (input: string, prop: ColorPropKey) => void
  export let error: string = ''
  export let selected: ColorPropKey
  export let display: DisplayType
  function handleSetValue(input: string) {
    handleSetColorProp(input, selected)
  }
</script>

<div
  class="flex flex-col h-full w-full border-box max-w-sm sm:mb-10 md:mb-10 lg:border-l-2:pl-4:self-start"
>
  <h3 class="text-xl mb-2">Change the options</h3>
  <div class="h-6">
    <span class="text-red-600 text-sm text-center sm:text-xs">{error}</span>
  </div>
  <div class="w-full flex justify-between">
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
  <Input label="color-input" {handleSetValue} />
</div>
