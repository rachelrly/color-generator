import App from './App.svelte'
import { getRandomColor } from './utils'

const app = new App({
  target: document.body,
  props: {
    color: getRandomColor()
  }
})

export default app
