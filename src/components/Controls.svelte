<script lang="ts">
  import Input from './Input.svelte'

  export let handleSetValue: (val: number) => void
</script>

<form>
  <h3>Change the settings</h3>
  <Input label="width" setValue={handleSetValue} />
  <Input label="step" setValue={handleSetValue} />
</form>
