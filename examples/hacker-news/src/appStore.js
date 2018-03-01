import { store, storage } from 'react-easy-stack'

const appStore = store({
  loading: false,
  dark: storage.dark,
  toggleTheme () {
    appStore.dark = !appStore.dark
  }
})

export default appStore
