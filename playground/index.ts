import App from './App.svelte'
import { mount, unmount } from 'svelte'

let app = mount(App, {
  target: document.body,
})

export default app

if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose(() => {
    unmount(app)
  })
}
