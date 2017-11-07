import { easyStore } from 'react-easy-stack'
import { fetchUser } from '../api'

const store = {
  id: '',
  async init ({ id }) {
    this.id = id || this.id
    await this.fetchUser()
  },
  async fetchUser () {
    const user = await fetchUser(this.id)
    Object.assign(this, user)
  }
}

export default easyStore(store, { id: 'url' })
