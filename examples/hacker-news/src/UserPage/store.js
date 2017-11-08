import { easyStore } from 'react-easy-stack'
import { fetchUser, events } from '../api'

const store = {
  id: '',
  async init ({ id }) {
    this.id = id || this.id
    await this.fetchUser()
  },
  async fetchUser () {
    this.user = await fetchUser(this.id)
  }
}

export default easyStore(store, { id: 'url' })
