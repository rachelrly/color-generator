<script lang="ts">
  // import Input from './Input.svelte'
  import Button from './Button.svelte'
  import ButtonChain from './ButtonChain.svelte'
  import type { ColorPropKey } from '../types'
  // export let handleSetValue: (val: number) => void
  export let handleSelectOption: (opt: ColorPropKey) => void
  export let handleRandomColor: () => void
  export let error: string = ''
  export let selected: ColorPropKey
</script>

<div class="flex-1 flex flex-col items-center justify-center p-2 ">
  <h3 class="text-xl">Change the settings</h3>
  <div class="h-8">
    <span>{error}</span>
  </div>
  <Button text="new color" onClick={handleRandomColor} />
  <ButtonChain {handleSelectOption} selectedOption={selected} />
  <!-- <Input label="width" setValue={handleSetValue} />
  <Input label="step" setValue={handleSetValue} /> -->
</div>
