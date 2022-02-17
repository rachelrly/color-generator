<script lang="ts">
  export let label: string
  export let setValue: (val: number) => void
  function handleSetValue(e: any) {
    if (e.target.value) {
      setValue(Number(e.target.value))
    }
  }
</script>

<fieldset class="w-full flex flex-row justify-between items-center mb-2">
  <label class="w-12" for={label}>{label}</label>
  <input
    name={label}
    class="flex-1 p-1"
    on:blur={handleSetValue}
    type="text"
    inputmode="numeric"
  />
</fieldset>
