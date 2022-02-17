<script lang="ts">
  import Input from './Input.svelte'
  export let handleSetValue: (val: number) => void
  export let maxWidth: number
  export let error: string = ''
  // do form validation here
  // validate numeric fields against max width
  // hue
  // saturation
  // lightness
</script>

<form class="w-full flex flex-col items-center p-2">
  <h3 class="text-xl">Change the settings</h3>
  <div class="h-8">
    <span>{error}</span>
  </div>
  <Input label="width" setValue={handleSetValue} />
  <Input label="step" setValue={handleSetValue} />
</form>
