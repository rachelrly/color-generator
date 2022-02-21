<script lang="ts">
  // import Input from './Input.svelte'
  import Button from './Button.svelte'
  import ButtonChain from './ButtonChain.svelte'
  import type { ColorPropKey } from '../types'

  // export let handleSetValue: (val: number) => void
  export let handleSelectColorKey: (opt: ColorPropKey) => void
  export let handleRandomColor: () => void
  export let handleToggleDisplayType: () => void
  export let handleSetColorProp: (input: string, prop: ColorPropKey) => void
  export let error: string = ''
  export let selected: ColorPropKey

  function handleSetHue(input: string) {
    handleSetColorProp(input, 'hue')
  }
  function handleSetSaturation(input: string) {
    handleSetColorProp(input, 'saturation')
  }
  function handleSetLightness(input: string) {
    handleSetColorProp(input, 'lightness')
  }
</script>

<div class="flex flex-col mb-6 items-center md:mb-10">
  <div class="h-8">
    <span>{error}</span>
  </div>
  <h3 class="text-xl mb-2">Change the settings</h3>
  <div>
    <Button text="new color" onClick={handleRandomColor} />
    <Button text="display" onClick={handleToggleDisplayType} />
  </div>
  <ButtonChain
    handleSelectOption={handleSelectColorKey}
    selectedOption={selected}
  />
</div>
