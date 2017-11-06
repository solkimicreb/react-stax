import { easyStore } from 'react-easy-stack'
import { fetchUser } from '../api'

const store = {
  id: '',
  async init ({ id = this.id }) {
    this.id = id
    await this.fetchUser()
  },
  async fetchUser () {
    const user = await fetchUser(this.id)
    Object.assign(this, user)
  }
}

const params = {
  id: ['url']
}

export default easyStore(store, params)
