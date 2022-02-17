<script lang="ts">
  import { getSquareDimensions } from './utils'
  import Square from './components/Square.svelte'
  import type { SquareDimensionProps, SquareProps } from './types'
  const squares = getSquareDimensions(300, 50).map(
    (sq: SquareDimensionProps): SquareProps => ({ ...sq, fill: 'red' })
  )
</script>

<main class="flex flex-col items-center h-screen">
  <h1>Hello Svelte/Tailwind/TypeScript boilerplate!</h1>
  <Square {squares} />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
