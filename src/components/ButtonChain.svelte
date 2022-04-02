<script lang="ts">
  import Button from './Button.svelte'
  import type {
    ButtonChainOptionsType,
    DisplayType,
    ColorPropKey
  } from '../types'
  export let chainOptions: ButtonChainOptionsType<DisplayType | ColorPropKey>
</script>

<div class="w-full flex justify-between">
  {#each chainOptions.options as opt}
    <Button
      text={opt}
      selected={chainOptions.selected === opt}
      onClick={() => chainOptions.handleSelectOption(opt)}
    />
  {/each}
</div>
