<script lang="ts">
  export let text: string
  export let selected: boolean = false
  export let onClick: () => void
</script>

<button
  type="button"
  class="text-xs p-1 m-1 w-24 {selected &&
    'bg-gray-800 text-white border-gray-800'} md:text-sm"
  on:click={onClick}>{text}</button
>
