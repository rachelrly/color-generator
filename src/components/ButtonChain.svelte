<script lang="ts">
  import Button from './Button.svelte'
  import type { ColorPropKey } from '../types'
  export let selectedOption: ColorPropKey
  export let handleSelectOption: (opt: ColorPropKey) => void
  const options: ColorPropKey[] = ['hue', 'saturation', 'lightness']
</script>

<div>
  {#each options as opt}
    <Button
      text={opt}
      selected={selectedOption === opt}
      onClick={() => handleSelectOption(opt)}
    />
  {/each}
</div>
