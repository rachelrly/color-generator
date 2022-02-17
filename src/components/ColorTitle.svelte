<script lang="ts">
  import type { ColorProps } from '../types'
  import { getColorString } from '../utils'
  export let color: ColorProps
</script>

<div>
  <h3 class="text-gray-400 text-center">
    Current color is {getColorString(color)}
  </h3>
</div>
