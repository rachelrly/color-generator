<script lang="ts">
  import Controls from './Controls.svelte'
  import Square from './Square.svelte'
  import { getSquareDimensions } from '../utils'
  import type { SquareDimensionProps, SquareProps } from '../types'

  let width = 300
  let step = 50
  $: squares = getSquareDimensions(width, step).map(
    (sq: SquareDimensionProps): SquareProps => ({ ...sq, fill: 'red' })
  )
  function handleSetValue(val: number) {
    console.log('RUNNING HANDLE SET VAL TOP LEVEL')
    width = val
  }
</script>

<div class="flex-1 w-full h-full p-2 items-center justify-center bg-blue-100">
  <h2>Width is {width}, step is {step}</h2>
  <Controls {handleSetValue} />
  <Square {squares} />
</div>
