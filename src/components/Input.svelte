<script lang="ts">
  import type { ColorRange } from '../types'
  import { afterUpdate } from 'svelte'

  export let label: string
  export let minmax: ColorRange
  export let handleSetColorValue: (value: number) => void
  let value: string

  afterUpdate(() => {
    handleSetColorValue(Number(value))
  })
</script>

<fieldset class="w-full flex flex-row justify-between items-center mb-2">
  <label class="w-12 hidden" for={label}>{label}</label>
  <input
    name={label}
    class="flex-1 p-1 ml-1 mt-1"
    bind:value
    type="range"
    min={minmax[0]}
    max={minmax[1]}
  />
</fieldset>
