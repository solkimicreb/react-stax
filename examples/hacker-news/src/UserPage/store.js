import { easyStore, params } from 'react-easy-stack'
import { fetchUser } from '../api'

const store = {
  id: params.id,
  async init ({ id }) {
    this.id = id || this.id
    this.user = await fetchUser(this.id)
  }
}

export default easyStore(store, { id: 'url' })
