import { easyStore } from 'react-easy-stack'

const store = {
  dark: false,
  toggleTheme () {
    this.dark = !this.dark
  }
}

export default easyStore(store, { dark: 'storage' })
