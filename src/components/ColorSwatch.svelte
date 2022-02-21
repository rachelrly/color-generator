<script lang="ts">
  import { getColorString } from '../utils'
  import { type ColorProps, type SwatchSize, SwatchSizes } from '../types'
  export let color: ColorProps
  export let size: SwatchSize
</script>

<div>
  <svg
    class="mx-2 flex-1 block"
    width={SwatchSizes[size]}
    height={SwatchSizes[size]}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      height={SwatchSizes[size]}
      width={SwatchSizes[size]}
      fill={getColorString(color)}
    />
  </svg>
</div>
