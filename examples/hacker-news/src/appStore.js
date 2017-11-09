import { easyStore, storage } from 'react-easy-stack'

const store = {
  loading: false,
  dark: storage.dark,
  toggleTheme () {
    this.dark = !this.dark
  }
}

export default easyStore(store, { dark: 'storage' })
