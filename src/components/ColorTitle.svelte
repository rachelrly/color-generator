<script lang="ts">
  import type { ColorProps } from '../types'
  import { getColorString } from '../utils'
  export let color: ColorProps
  let colorString = getColorString(color)
</script>

<div class="flex flex-row items-center">
  <h3 class="text-gray-400 text-center">
    Current color is {colorString}
  </h3>
  <svg class="mx-2" width={50} height={50} xmlns="http://www.w3.org/2000/svg">
    <rect height={50} width={50} fill={colorString} />
  </svg>
</div>
