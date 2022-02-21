<script lang="ts">
  export let label: string
  export let handleSetValue: (val: string) => void
  let value: string
  function setValue() {
    handleSetValue(value)
  }
  function setValueOnEnter(e: any) {
    if (e.key === 'Enter') {
      setValue()
      value = ''
    }
  }
</script>

<fieldset class="w-full flex flex-row justify-between items-center mb-2">
  <label class="w-12 hidden" for={label}>{label}</label>
  <input
    name={label}
    class="flex-1 p-1 ml-1 mt-1"
    on:blur={setValue}
    on:keydown={setValueOnEnter}
    bind:value
    type="text"
    inputmode="numeric"
    maxlength="3"
  />
</fieldset>
