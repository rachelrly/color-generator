import App from './App.svelte'
import { getRandomColor } from './utils'

const app = new App({
  target: document.body,
  props: {
    base: getRandomColor()
  }
})

export default app
