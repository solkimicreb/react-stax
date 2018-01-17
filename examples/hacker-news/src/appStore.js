import { store, storage } from 'react-easy-stack'

export default store({
  loading: false,
  dark: storage.dark,
  toggleTheme () {
    this.dark = !this.dark
  }
})
