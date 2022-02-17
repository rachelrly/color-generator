<script lang="ts">
  import ColorGenerator from './components/ColorGenerator.svelte'
  import Title from './components/Title.svelte'
</script>

<main class="flex flex-col items-center h-screen">
  <Title />
  <ColorGenerator />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
