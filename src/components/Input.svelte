<script lang="ts">
  export let label: string
  export let setValue: (val: number) => void
  function handleSetValue(e: any) {
    if (e.target.value) {
      console.log('RUNNING e.target.value', Number(e.target.value))
      setValue(Number(e.target.value))
    }
  }
</script>

<fieldset>
  <label>{label}</label>
  <input on:blur={handleSetValue} type="text" inputmode="numeric" />
</fieldset>
