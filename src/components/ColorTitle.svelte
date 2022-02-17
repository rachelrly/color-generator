<script lang="ts">
  import type { ColorProps } from '../types'
  import { getColorString } from '../utils'
  export let color: ColorProps
</script>

<div class="flex flex-row items-center justify-between w-full max-w-screen-sm">
  <h3 class="text-gray-400 text-center">
    Current color is {getColorString(color)}
  </h3>
  <div>
    <svg
      class="mx-2 flex-1 block"
      width={50}
      height={50}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height={50} width={50} fill={getColorString(color)} />
    </svg>
  </div>
</div>
