<script lang="ts">
  import Button from './Button.svelte'
  import type {
    ButtonChainOptionsType,
    ButtonChainSupportedType
  } from '../types'
  export let chainOptions: ButtonChainOptionsType<ButtonChainSupportedType>
  const { options, selected, handleSelectOption } = chainOptions
</script>

<div class="w-full flex justify-between">
  {#each options as opt}
    <Button
      text={opt}
      selected={selected === opt}
      onClick={() => handleSelectOption(opt)}
    />
  {/each}
</div>
