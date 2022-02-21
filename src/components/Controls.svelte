<script lang="ts">
  import Button from './Button.svelte'
  import ButtonChain from './ButtonChain.svelte'
  import Input from './Input.svelte'
  import type { ColorPropKey } from '../types'

  export let handleSelectColorKey: (opt: ColorPropKey) => void
  export let handleRandomColor: () => void
  export let handleToggleDisplayType: () => void
  export let handleSetColorProp: (input: string, prop: ColorPropKey) => void
  export let error: string = ''
  export let selected: ColorPropKey
  function handleSetValue(input: string) {
    handleSetColorProp(input, selected)
  }
</script>

<div class="flex flex-col mb-6 self-start  md:mb-10">
  <div class="h-6">
    <span class="text-red-600 text-sm text-center">{error}</span>
  </div>
  <h3 class="text-xl mb-2">Change the options</h3>
  <div>
    <Button text="new color" onClick={handleRandomColor} />
    <Button text="display" onClick={handleToggleDisplayType} />
  </div>
  <ButtonChain
    handleSelectOption={handleSelectColorKey}
    selectedOption={selected}
  />
  <Input label="color-input" {handleSetValue} />
</div>
